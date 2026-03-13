const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "../public")));

// Docs
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Spec
app.get("/api/spec", (req, res) => {
  res.json(require("../public/settings.json"));
});

// Routes
app.use("/api/latest", require("./routes/latest"));
app.use("/api/popular", require("./routes/popular"));
app.use("/api/ongoing", require("./routes/library"));
app.use("/api/genres", require("./routes/genres"));
app.use("/api/search", require("./routes/search"));
app.use("/api/manga", require("./routes/manga"));

// Root info
app.get("/", (req, res) => {
  res.json({
    name: "kiryuu-api",
    endpoints: [
      "GET /api/latest?page=1",
      "GET /api/popular",
      "GET /api/ongoing?page=1",
      "GET /api/genres",
      "GET /api/search?q=naruto",
      "GET /api/manga/:id",
      "GET /api/manga/:id/chapters",
      "GET /api/manga/:id/chapters/:chapterId?slug=manga-slug&n=chapter-number",
    ],
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`kiryuu-api running on http://localhost:${PORT}`);
});
