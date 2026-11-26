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
