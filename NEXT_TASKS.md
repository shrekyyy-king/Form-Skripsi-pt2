# Tugas Berikutnya (urut)
1. **Gabungkan hasil tugas paralel** (seksi; musik/login/profil): gabungkan `docs/status/*.messages.*.json` ke `messages/*.json`, jalankan build GitHub Actions sampai hijau. (Belum ada di snapshot audit.)
2. **Ulangi audit singkat** pada kode hasil gabungan (berkas baru: seksi, musik, auth, profil) dan jalankan `typecheck` + `lint` + `build` sungguhan. Audit pertama hanya membaca.
3. **Perbaiki temuan Sedang** dari `docs/QA_REPORT.md`: S-2 (timeZone, usulan siap), S-5 (kontras galat gelap), S-3/S-4 (validasi builder), S-6 (sidebar aktif; verifikasi dulu), S-1 (jangan hilangkan jawaban saat ganti bahasa).
4. **Jalankan `docs/TESTING_CHECKLIST.md`** di GitHub Pages (id/en, terang/gelap, mobile, keyboard); catat hasil.
5. **Temuan Rendah** dalam satu putaran: R-1 (label responden), R-2 (kuesioner kosong), R-4 (aksesibilitas survei), R-7 (scoring + uji unit).
6. **Tahap 2 hanya setelah instruksi eksplisit pengguna.** Rekomendasi urutan ada di `docs/status/qa.md`.
