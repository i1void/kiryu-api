const express = require("express");
const router = express.Router();
const fetcher = require("../utils/fetcher");

// GET /api/search?q=naruto
router.get("/", async (req, res) => {
  const raw = req.query.q;
  if (!raw) return res.status(400).json({ error: "Query parameter 'q' is required" });
  const q = raw.replace(/[-+_]+/g, " ").trim();

  try {
    const { data } = await fetcher.get("/wp-json/wp/v2/manga", {
      params: { search: q },
    });

    const result = data.map((manga) => ({
      id: manga.id,
      title: manga.title?.rendered || "",
      slug: manga.slug,
      url: manga.link,
      thumbnail: manga.thumbnail || manga.featured_image_url || "",
      modified: manga.modified,
    }));

    res.json({ query: q, results: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
