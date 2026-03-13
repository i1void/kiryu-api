const express = require("express");
const router = express.Router();
const fetcher = require("../utils/fetcher");

// GET /api/genres
router.get("/", async (req, res) => {
  try {
    const { data } = await fetcher.get("/wp-json/wp/v2/genre");

    const result = data.map((genre) => ({
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
      count: genre.count,
    }));

    res.json({ results: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
