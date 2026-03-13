const cheerio = require("cheerio");

function parsePopular(html) {
  const $ = cheerio.load(html);
  const results = [];

  $("div > div.flex.rounded-lg.overflow-hidden").each((_, el) => {
    const card = $(el);

    const titleEl = card.find("a.text-base.font-medium");
    const title = titleEl.text().trim();
    const url = titleEl.attr("href") || "";

    const slugMatch = url.match(/\/manga\/([^/]+)\//);
    const slug = slugMatch ? slugMatch[1] : "";

    const thumbnail = card.find("img.wp-post-image").attr("src") || "";
    const latestChapter = card.find("span.text-sm.text-gray-300").first().text().trim();
    const status = card.find("span.bg-accent").first().text().trim();
    const rating = card.find("span.text-yellow-400").text().trim();

    const statsItems = card.find("div.flex.items-center.space-x-2 > div.flex.items-center");
    let views = "";
    let bookmarks = "";
    statsItems.each((i, item) => {
      const text = $(item).find("span").last().text().trim();
      if (i === 1) views = text;
      if (i === 2) bookmarks = text;
    });

    const synopsis = card.find("p.text-sm.text-gray-300.line-clamp-3").text().trim();

    if (title) {
      results.push({ title, slug, url, thumbnail, latestChapter, status, rating, views, bookmarks, synopsis });
    }
  });

  return results;
}

module.exports = { parsePopular };
