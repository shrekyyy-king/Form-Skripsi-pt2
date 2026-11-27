# Status Saat Ini
Terakhir diperbarui: 2026-11-26

## Terbukti jalan (build + deploy GitHub Pages, diuji pengguna)
- Fondasi, tema, i18n, dashboard, daftar proyek, alur responden (Bagian 5).

## Baru (Bagian 6, BELUM diuji): builder kuesioner
- `/dashboard/builder/[id]`: judul/deskripsi, daftar soal (tambah, hapus, naik/turun), editor soal, 7 tipe soal, wajib/opsional, Likert konfigurabel (2-10 titik, label, nilai, arah, reverse, deskripsi), mode pratinjau, saklar publikasi.
- Perubahan hanya di memori halaman (mode demo, tidak tersimpan). Tautan "Buka builder" ada di kartu proyek.

## Belum
Manajemen seksi, dialog pembuatan proyek, detail proyek, pemutar musik, /login, dropdown profil, penyimpanan data (butuh backend), builder -> responden (perlu penyimpanan).

## Bagian 7 (BELUM diuji): proyek
- Dialog buat proyek (lokal, tidak tersimpan), `/dashboard/projects/new`, `/dashboard/projects/[id]` (detail). Proyek lokal tidak punya halaman detail/builder (ekspor statis).
- Kerja paralel: lihat docs/PARALLEL_WORK.md (AI-2 seksi, AI-3 musik/login/profil, AI-4 QA).
