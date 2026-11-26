# Research Platform (nama sementara)

Platform kuesioner dan analisis statistik untuk peneliti dan mahasiswa. Dwibahasa (Indonesia/Inggris).
**Status: Tahap 1 (frontend saja, data mock, tanpa backend).** Lihat `CURRENT_STATUS.md`.

## Prasyarat
- Node.js 20 atau lebih baru (cek: `node -v`)
- npm 10 atau lebih baru

## Instalasi dan menjalankan
```bash
npm install
npm run dev        # http://localhost:3000
```
Perintah lain: `npm run typecheck`, `npm run lint`, `npm run build`.

## Struktur singkat
```
src/app/[locale]/   halaman (route) per bahasa
src/components/     ui/ (primitif), providers/, layout/
src/features/       modul per fitur (projects, builder, survey, ...)
src/config/         brand.ts (identitas), routes.ts
src/i18n/           routing, request, navigation next-intl
src/lib/            utilitas dan lapisan data (repository)
src/types/          model TypeScript
messages/           id.json, en.json
docs/  ai-context/  dokumentasi untuk pengembang dan AI
```
Mengganti nama produk: ubah `src/config/brand.ts`.
Bahasa: Indonesia default (tanpa prefix), Inggris di `/en/...`.

## Dokumentasi proyek
`CLAUDE.md`, `CURRENT_STATUS.md`, `DEVELOPMENT_LOG.md`, `NEXT_TASKS.md`, `AI_HANDOFF.md`, `docs/`, `ai-context/`.

## Catatan berkas
Konfigurasi ESLint ada di `package.json` (`eslintConfig`). Saat memakai Git di komputer, buat `.gitignore` berisi: `node_modules`, `.next`, `out`, `.env*.local`, `next-env.d.ts`.
Workflow deploy: `.github/workflows/pages.yml` (dibuat manual lewat GitHub, lihat bagian di bawah).

## Deploy ke GitHub Pages (situs statis)
Aplikasi diekspor statis (`output: "export"`). Workflow `.github/workflows/pages.yml` membangun dan men-deploy setiap push ke `main`.
Setel **Settings → Pages → Source = GitHub Actions**. URL: `https://<user>.github.io/Form-Skripsi/` (otomatis menuju `/id/`).
Jika nama repo berbeda, ubah `NEXT_PUBLIC_BASE_PATH` di `pages.yml`. Untuk lokal, tidak perlu mengisi variabel itu.
