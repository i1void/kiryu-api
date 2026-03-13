const express = require("express");
const router = express.Router();
const fetcher = require("../utils/fetcher");

// GET /api/library?page=1
router.get("/", async (req, res) => {
  const page = req.query.page || 1;
  try {
    const { data } = await fetcher.get("/wp-json/wp/v2/manga", {
      params: { "manga-status": 8684, per_page: 20, page, _embed: true },
    });

    const result = data.map((manga) => ({
      id: manga.id,
      title: manga.title?.rendered || "",
      slug: manga.slug,
      url: manga.link,
      thumbnail: manga._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
      modified: manga.modified,
    }));

    res.json({ page: Number(page), results: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
