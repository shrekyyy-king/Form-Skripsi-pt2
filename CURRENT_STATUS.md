# Status Saat Ini
Terakhir diperbarui: 2026-11-26 (BELUM diuji: tanpa akses npm; CI GitHub akan menjadi uji pertama)

## Selesai
- Bagian 1: konfigurasi, tema, i18n, dokumentasi.
- Bagian 2: types, repository + fixture mock (berlabel demo), utilitas skor Likert (`src/lib/scoring.ts`).
- Bagian 3: ui (button, card, badge, input), LanguageSwitcher, ThemeSwitcher, BrandMark.
- Bagian 4: layout dashboard (sidebar, topbar, nav mobile), ringkasan dashboard, daftar proyek (cari + filter), halaman placeholder, landing.
- CI GitHub Actions + Codespaces.

## Belum
Dialog pembuatan proyek, halaman detail proyek, builder, alur responden, musik, /login, dialog/dropdown profil.

## Pembaruan: mode GitHub Pages
- Ekspor statis, middleware dihapus, URL /id dan /en, workflow `pages.yml`. Belum diuji; CI GitHub adalah uji pertama.
- Tautan proyek di dashboard dinonaktifkan sampai halaman detail proyek dibuat.

## Versi final untuk upload ulang
- Paket bersih tanpa dotfile; pengalihan root via public/index.html. Build GitHub Pages belum terbukti: tunggu hasil Actions.
