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
      params: { search: q, _embed: true },
    });

    const result = data.map((manga) => ({
      id: manga.id,
      title: manga.title?.rendered || "",
      slug: manga.slug,
      url: manga.link,
      thumbnail: manga._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
      modified: manga.modified,
    }));

    res.json({ query: q, results: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
