const cheerio = require("cheerio");

function parseChapterImages(html) {
  const $ = cheerio.load(html);
  const section = $('section[data-image-data="1"]');
  const images = [];

  section.find("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    if (src.includes(".filerun.thumbnails")) return;
    if (!src.startsWith("http")) return;
    images.push(src);
  });

  const title = $("title").text().trim();
  const canonical = $('link[rel="canonical"]').attr("href") || "";

  return {
    title,
    canonical,
    totalPages: images.length,
    images,
  };
}

module.exports = { parseChapterImages };
