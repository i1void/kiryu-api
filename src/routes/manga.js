const express = require("express");
const router = express.Router();
const fetcher = require("../utils/fetcher");
const { parseChapterImages } = require("../scrapers/chapterScraper");

// GET /api/manga/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await fetcher.get(`/wp-json/wp/v2/manga/${id}`);

    res.json({
      id: data.id,
      title: data.title?.rendered || "",
      slug: data.slug,
      url: data.link,
      thumbnail: data.thumbnail || data.featured_image_url || "",
      synopsis: data.content?.rendered || "",
      status: data.status,
      genres: data.genre || [],
      author: data.author || "",
      modified: data.modified,
    });
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// GET /api/manga/:id/chapters
router.get("/:id/chapters", async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await fetcher.get("/wp-admin/admin-ajax.php", {
      params: { manga_id: id, page: 1, action: "chapter_list" },
    });

    // Response bisa berupa array atau HTML, handle keduanya
    if (Array.isArray(data)) {
      return res.json({ mangaId: id, chapters: data });
    }

    res.json({ mangaId: id, raw: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/manga/:id/chapters/:chapterId?slug=solo-max-level-newbie&n=1
// slug & n wajib karena URL chapter butuh keduanya
router.get("/:id/chapters/:chapterId", async (req, res) => {
  const { chapterId } = req.params;
  const { slug, n } = req.query;

  if (!slug || !n) {
    return res.status(400).json({
      error: "Query 'slug' (manga slug) dan 'n' (chapter number) wajib diisi",
      example: "/api/manga/297105/chapters/297105?slug=solo-max-level-newbie&n=00",
    });
  }

  const chapterUrl = `/manga/${slug}/chapter-${n}.${chapterId}/`;

  try {
    const { data } = await fetcher.get(chapterUrl);
    const result = parseChapterImages(data);
    res.json(result);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.message });
  }
});

module.exports = router;
