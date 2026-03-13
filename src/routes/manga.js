const express = require("express");
const router = express.Router();
const fetcher = require("../utils/fetcher");
const { parseChapterImages } = require("../scrapers/chapterScraper");
const { parseChapterList } = require("../scrapers/chapterListScraper");

// GET /api/manga/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await fetcher.get(`/wp-json/wp/v2/manga/${id}`, {
      params: { _embed: true },
    });

    res.json({
      id: data.id,
      title: data.title?.rendered || "",
      slug: data.slug,
      url: data.link,
      thumbnail: data._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
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

    if (typeof data === "string") {
      const chapters = parseChapterList(data);
      return res.json({ mangaId: id, total: chapters.length, chapters });
    }

    res.json({ mangaId: id, total: data.length, chapters: data });
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
