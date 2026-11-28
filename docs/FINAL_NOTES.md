# Catatan Akhir Tahap 1 dan Rekomendasi Fase Berikutnya

Gabungan catatan `docs/status/seksi.md` (manajemen seksi) dan `docs/status/musik-login.md` (musik, login, profil), ditambah hasil audit Akun-3. Berkas asli di `docs/status/` tetap ada sebagai rujukan rinci.

## 1. Keputusan dan perilaku yang perlu diketahui
**Seksi dan navigasi**
- Urutan tampil: seksi menurut urutan `sections`, lalu soal "Tanpa seksi". `sectionId` yang tidak cocok = "Tanpa seksi". Seksi kosong tidak tampil pada responden.
- Mode `perSection` tanpa seksi otomatis menjadi `perQuestion`. Progres, validasi, dan fokus galat mengikuti layar.
- Kuesioner demo `demo-servqual` memakai `navigationMode: "perSection"` agar fitur terlihat; hapus satu baris di `fixtures-questionnaire.ts` untuk kembali ke satu soal per layar.
- Hapus seksi memindahkan soalnya ke "Tanpa seksi" tanpa konfirmasi. Semua perubahan builder hanya di memori.

**Musik, login, profil**
- Musik: nada ambient disintesis (Web Audio), tidak ada berkas audio, tidak pernah autoplay; penolakan browser ditangani dengan pesan; volume disimpan di `localStorage` (`rp.music.volume`). Pemilih lagu = tiga preset placeholder.
- Login: hanya tampilan; `AuthClient` + mock yang selalu menolak; tanpa jaringan dan tanpa menyimpan kredensial; tanpa pendaftaran publik.
- Menu profil: `aria-expanded`, Escape, klik luar, panah/Home/End; "Keluar" nonaktif.

**Data demo**: semua berlabel demo. Respons demo (12) dipakai di Respons/Data/Analisis; angka responden proyek (128, 212) hanya hiasan dan tidak konsisten dengan itu (Q-19).

## 2. Kondisi mutu saat ini (ringkas dari `docs/QA_REPORT.md`)
Tipe, lint, dan build ekspor statis bersih di lingkungan audit; logika statistik cocok dengan hitungan independen. Temuan utama yang sebaiknya ditutup sebelum dipakai responden sungguhan: Q-01 (ganti bahasa menghapus jawaban, diduga), Q-02 (naik versi Next), Q-03 (CSV), Q-04, Q-05. Semua belum diuji di browser.

## 3. Rekomendasi fase berikutnya (berurutan)
**Fase 1.5: Stabilisasi (kecil, tanpa backend)**
1. Terapkan `docs/proposed-fixes` (FIX-01 sampai 05), build hijau di GitHub.
2. Jalankan `docs/TESTING_CHECKLIST.md` penuh; putuskan solusi Q-01; kerjakan Q-06, Q-07, Q-08, Q-12.
3. Hasilkan `package-lock.json` agar build bisa diulang (Q-22).
4. Tambahkan uji otomatis untuk logika murni (skor, statistik, seksi, builder). `docs/qa-scripts/qa-checks.ts` bisa menjadi bahan awal; pertimbangkan Vitest.

**Fase 2: Fondasi backend (hanya atas instruksi eksplisit pemilik proyek)**
1. Putuskan hosting: pindah dari GitHub Pages ke Vercel (atau setara) karena butuh server. Naik `next-intl` dan `zod` ke v4 pada tahap ini, uji ulang semua form.
2. Supabase: skema (proyek, kuesioner, versi kuesioner, soal, seksi, respons, jawaban), aturan akses per baris (RLS). Peneliti hanya melihat data miliknya; responden anonim hanya boleh MENAMBAH respons (idealnya lewat fungsi/API yang memvalidasi, bukan tulis langsung dari browser).
3. Autentikasi peneliti berbasis undangan (tanpa pendaftaran publik): ganti implementasi di `src/lib/auth/index.ts`; sembunyikan "Login" di menu profil saat sudah masuk; aktifkan "Keluar".
4. Implementasi repository Supabase di `src/lib/data` (antarmuka sudah ada); sambungkan builder ke responden; simpan versi kuesioner agar respons lama tetap terkait versi yang dijawab.
5. Validasi jawaban di server (Q-18), rekam persetujuan (waktu, versi teks), batasi laju kiriman, putuskan kebijakan anonimisasi dan penyimpanan data (etika penelitian).

**Fase 3: Analisis dan integrasi**
Ekspor Excel/SPSS, Google Sheets, mesin R (job analisis; hasil dibandingkan dengan `stats.ts`), uji validitas (korelasi butir-total, dll.), grafik yang lebih kaya (Recharts atau setara; saat ini dependensi terpasang tetapi tidak dipakai).

**Selalu**: pertahankan pemisahan UI, fitur, tipe, utilitas, i18n, data, konfigurasi; jangan mengklaim sesuatu berfungsi sebelum diuji.
Rencana rinci Tahap 2 yang disusun Akun-2, bila ada, ada di `docs/PHASE2_PLAN.md`.
