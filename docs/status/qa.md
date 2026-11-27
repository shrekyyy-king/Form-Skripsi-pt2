# Catatan Tugas QA dan Dokumentasi

Tanggal: 2026-11-27. Cara kerja: **baca saja**; typecheck/lint/build tidak dijalankan.

## Berkas dibuat/diubah
Baru: `docs/QA_REPORT.md`, `docs/TESTING_CHECKLIST.md`, `docs/proposed-fixes/{README.md,request.ts.txt,scoring.ts.txt}`, `docs/status/qa.md`.
Diubah: `README.md`, `CURRENT_STATUS.md`, `DEVELOPMENT_LOG.md` (hanya menambah entri), `NEXT_TASKS.md`, `AI_HANDOFF.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`.
Kode sumber, `messages/*`, dan config tidak diubah.

## Prasyarat tidak terpenuhi
Snapshot tidak memuat hasil tugas Seksi maupun Musik/Login/Profil, tidak ada `docs/status/*` lain untuk digabung, dan status build hijau tidak bisa diverifikasi dari zip. Dokumen akhir saya sengaja menyatakan cakupan ini. Setelah penggabungan, jalankan ulang audit untuk berkas baru dan perbarui README (daftar fitur), `CURRENT_STATUS.md`, dan checklist rute baru.

## Rekomendasi fase berikutnya
**Fase 1.5 (stabilisasi, sekitar beberapa hari):** gabung hasil paralel, build hijau, perbaiki temuan Sedang, jalankan checklist di Pages. Jangan memulai backend di atas basis yang belum diuji.

**Tahap 2, urutan yang disarankan** (hanya setelah instruksi eksplisit pengguna):
1. Pindah hosting ke Vercel (atau setara) dan buka batasan ekspor statis: rute dinamis tanpa `generateStaticParams`, middleware locale, `localePrefix` boleh `as-needed` lagi.
2. Supabase: skema (project, questionnaire, versi, question, section, response, answer), RLS, implementasi repository baru di `src/lib/data` tanpa mengubah UI. Responden anonim hanya boleh INSERT.
3. Autentikasi peneliti berbasis undangan, lalu ganti profil demo.
4. Builder tersimpan dengan versi kuesioner dan publikasi nyata (jawaban terikat ke versi). Sertakan validasi builder (S-3/S-4) sebelum data tersimpan.
5. Penyimpanan respons + tabel data + ekspor CSV/XLSX. Validasi di server (jangan hanya klien).
6. Analisis: mulai dari statistik deskriptif, reliabilitas (alpha Cronbach) memakai `scoreLikert` yang sudah punya uji unit; baru mesin R sebagai layanan terpisah bila perlu.
7. Integrasi Google Sheets terakhir.
Tambahkan uji unit (Vitest) untuk logika murni dan langkah typecheck/lint di CI sebelum langkah 2.
