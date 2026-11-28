# Status Saat Ini
Terakhir diperbarui: 2026-11-27

## Terbukti jalan (build + deploy GitHub Pages, diuji pengguna)
- Fondasi, tema, i18n, dashboard, daftar proyek, alur responden dasar, builder dasar, dialog buat proyek, detail proyek.

## Sudah digabung, BELUM diuji di GitHub (menunggu build)
- Respons, Data (ekspor CSV), Analisis (statistik butir, Cronbach's alpha), Integrasi, Pengaturan. Data demo.
- Manajemen seksi di builder + mode navigasi per soal/per seksi di responden (catatan: docs/status/seksi.md).
- Pemutar musik opsional (Web Audio, tanpa autoplay), halaman /login (UI, mock), menu profil (catatan: docs/status/musik-login.md).

## Audit mutu (Akun-3, 2026-11-27)
- Dijalankan di lingkungan audit (bukan GitHub Actions): tipe, lint, build 47 halaman bersih; logika statistik cocok dengan hitungan independen. Laporan: docs/QA_REPORT.md. Perbaikan usulan (belum diterapkan): docs/proposed-fixes/. Uji manual di browser: docs/TESTING_CHECKLIST.md (belum dijalankan).
- README final dan dokumentasi akhir (docs/FINAL_NOTES.md) selesai.

## Belum
- Semua yang butuh backend (Tahap 2): penyimpanan data, autentikasi nyata, builder tersambung ke responden, Supabase, Google Sheets, mesin R, ekspor Excel/SPSS.

## Pembaruan 2026-11-27 (gabungan Akun-2 dan Akun-3, BELUM diuji di GitHub)
- Akun-2: aksi cepat dashboard, urutan proyek terbaru, pesan kosong, label data demo, `analyzeLikertItems` (item-analysis.ts), loading/error/not-found (namespace `states`), polesan kontras/fokus/mobile, pilihan bahasa tersimpan (public/index.html baru), BRIEF_CHECKLIST.md dan PHASE2_PLAN.md.
- Akun-3: QA_REPORT.md, TESTING_CHECKLIST.md, README final. FIX-01 (CSV aman), FIX-02 (validasi spasi), FIX-03 (kontras galat gelap), FIX-05 (label responden) sudah diterapkan. FIX-04 (naik Next 15.5.29) sengaja DITUNDA: paket terpisah, pasang setelah build hijau.
- Q-01 (jawaban hilang saat ganti bahasa): sementara pengalih bahasa survei hanya tampil di halaman pengantar.
