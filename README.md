# Kiryuu API
 
> REST API Unofficial untuk [kiryuu.to](https://v1.kiryuu.to) — situs baca manga bahasa Indonesia.

## Instalasi

```bash
npm install
npm run dev
```

## Endpoint

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/latest?page=1` | Manga yang baru diupdate |
| GET | `/api/popular` | Manga populer |
| GET | `/api/ongoing?page=1` | Manga dengan status ongoing |
| GET | `/api/genres` | Daftar semua genre |
| GET | `/api/search?q=naruto` | Cari manga |
| GET | `/api/manga/:id` | Detail manga |
| GET | `/api/manga/:id/chapters` | Daftar chapter |
| GET | `/api/manga/:id/chapters/:chapterId?slug=&n=` | Gambar halaman chapter |

## Dokumentasi

Buka [kiryu-api.vercel.app/docs](https://kiryu-api.vercel.app/docs) di browser.

## Catatan

- Parameter `q` pada `/api/search` support format: spasi, `-`, `+`, `_`
- Endpoint chapter image membutuhkan query `slug` (slug manga) dan `n` (nomor chapter)

## Tech Stack

- Node.js + Express
- Axios
- Cheerio
- 
