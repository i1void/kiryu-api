const cheerio = require("cheerio");

/**
 * Parse HTML response dari:
 * https://v1.kiryuu.to/wp-admin/admin-ajax.php?manga_id={id}&page=1&action=chapter_list
 *
 * Tiap chapter ada di div[data-chapter-number]
 */
function parseChapterList(html) {
  const $ = cheerio.load(html);
  const chapters = [];

  $("div[data-chapter-number]").each((_, el) => {
    const item = $(el);
    const number = item.attr("data-chapter-number") || "";
    const link = item.find("a").first();
    const url = link.attr("href") || "";
    const thumbnail = item.find("img").attr("src") || "";
    const date = item.find("time").attr("datetime") || "";
    const title = item.find("span").first().text().trim();

    // Ekstrak chapterId dari URL: /manga/slug/chapter-N.{chapterId}/
    const chapterIdMatch = url.match(/chapter-[\d.]+\.(\d+)\//);
    const chapterId = chapterIdMatch ? chapterIdMatch[1] : "";

    // Ekstrak slug manga dari URL
    const slugMatch = url.match(/\/manga\/([^/]+)\//);
    const slug = slugMatch ? slugMatch[1] : "";

    if (number) {
      chapters.push({
        number,
        chapterId,
        slug,
        title,
        url,
        thumbnail,
        date,
      });
    }
  });

  return chapters;
}

module.exports = { parseChapterList };
