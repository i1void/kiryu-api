const express = require("express");
const router = express.Router();
const fetcher = require("../utils/fetcher");
const { parsePopular } = require("../scrapers/popularScraper");

// GET /api/popular
router.get("/", async (req, res) => {
  try {
    const { data } = await fetcher.get("/wp-admin/admin-ajax.php", {
      params: { action: "advanced_search", the_orderby: "popular" },
    });

    const results = parsePopular(data);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
