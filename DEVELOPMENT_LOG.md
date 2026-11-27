# Log Pengembangan

## 2026-11-26 — Bagian 1: fondasi
- Membuat struktur folder, konfigurasi, token desain, i18n, tema, dan dokumentasi.
- Belum dijalankan (`npm install`/`typecheck`/`build` belum diuji). Pengguna perlu menjalankannya dan melaporkan galat.

## 2026-11-26 — Bagian 2–4
- Menambah types, repository mock, skor Likert, komponen ui, switcher, layout dashboard, dashboard, daftar proyek, CI, devcontainer.
- Belum dijalankan; perbaiki galat CI bila ada.

## 2026-11-26 — Mode GitHub Pages
- Konversi ke ekspor statis + workflow deploy. Hapus `src/middleware.ts` (manual di repo).

## 2026-11-26 — Bagian 5: alur responden
- Menambah types Question/Questionnaire, repository + fixture kuesioner demo, fitur survey (provider, question-input, question-flow, consent, complete), 5 route survey, pesan id/en.
- Rute dinamis memakai generateStaticParams (ekspor statis).

## 2026-11-26 — Bagian 6: builder kuesioner
- Menambah features/builder (utils murni, question-editor, builder-editor), route builder/[id] (generateStaticParams), pesan id/en, `getByProjectId` di repository.

## 2026-11-26 — Persiapan kerja paralel + Bagian 7 (proyek)
- Namespace baru `projectDetail` dan kunci `projects.local` ditambahkan ke messages/id.json dan en.json.
- Dialog pembuatan proyek (RHF + zod, elemen dialog), `/dashboard/projects/new`, `/dashboard/projects/[id]`, tautan dashboard aktif lagi.
- Dokumen koordinasi: docs/PARALLEL_WORK.md.

## 2026-11-27 — Bagian 8: data dan analisis (Claude-5, chat utama)
- Menambah ResponseRepository + fixture respons demo, stats.ts, features/data, 5 halaman dashboard, pesan id/en. Grafik memakai CSS (Recharts ditunda).

## 2026-11-27 — Penggabungan hasil Claude-2 (seksi) dan Claude-3 (musik, login, profil)
- Menyalin berkas, menggabungkan pesan ke messages/id.json dan en.json (tanpa konflik kunci), menghapus fragmen. Pemeriksaan otomatis: tidak ada impor hilang, semua namespace dan kunci literal ada.
- Belum dijalankan di Next.js oleh integrator; build GitHub adalah uji pertama.
