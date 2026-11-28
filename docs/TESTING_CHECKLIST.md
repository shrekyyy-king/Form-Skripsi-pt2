# Daftar Uji Manual

Semua butir di bawah BELUM dijalankan oleh siapa pun di browser (hanya build, tipe, lint, dan logika murni yang sudah diuji; lihat `docs/QA_REPORT.md`). Centang `[x]` hanya setelah Anda benar-benar mencobanya, dan catat temuan di tabel akhir.

## Cara umum
Buka situs (GitHub Pages atau `npm run dev` lalu `http://localhost:3000`). Untuk setiap halaman, ulangi 4 kombinasi:
1. Bahasa Indonesia (`/id/...`) dan Inggris (`/en/...`)
2. Mode terang dan gelap (tombol tema)
3. Layar lebar (laptop) dan sempit (HP, atau jendela browser dikecilkan sampai sekitar 375 px; di browser: F12, ikon perangkat)
4. Hanya keyboard: Tab, Shift+Tab, Enter, Spasi, Escape, panah. Fokus harus selalu terlihat dan urutannya masuk akal.

Cek umum tiap halaman: tidak ada teks berbahasa lain dari pilihan bahasa, tidak ada kunci mentah (mis. `builder.title`), tidak ada konten terpotong atau scroll samping, data demo berlabel "Data demo".

## Rute publik
**`/` (akar situs)**
- [ ] Otomatis menuju `/id/`; tautan "Buka aplikasi" berfungsi.

**`/id` dan `/en` (beranda)**
- [ ] Teks, tombol menuju dashboard/survei/login benar; pengalih bahasa dan tema bekerja; pilihan bahasa tetap setelah pindah halaman.

**`/login`**
- [ ] Kirim form kosong: muncul galat email dan kata sandi (tiap bahasa).
- [ ] Email salah format: galat format. Email valid + sandi apa pun: pesan "belum aktif (Tahap 1)", kolom sandi dikosongkan.
- [ ] Tombol tampilkan/sembunyikan sandi; tidak ada tautan pendaftaran; teks "akses lewat undangan" ada.
- [ ] Keyboard: urutan Email, Sandi, tombol mata, Masuk.

**`/survey/demo-servqual` (pengantar)**
- [ ] Judul, deskripsi, peneliti, estimasi waktu, tombol mulai.
- [ ] Tombol musik (ikon not) di header.

**`/consent`**
- [ ] Tombol "Setuju" nonaktif sebelum kotak dicentang. "Tolak" menampilkan pesan dan tombol kembali.

**`/questions` (mode per seksi, bawaan demo)**
- [ ] Layar 1: 4 soal Likert, progres "Seksi 1 dari 2". "Berikutnya" tanpa mengisi: galat di tiap soal + ringkasan, fokus ke soal pertama yang kosong.
- [ ] Layar 2: "Angkatan" wajib; "Semester" diisi huruf ditolak; soal wajib yang diisi hanya spasi (cek Q-05: seharusnya ditolak, saat ini kemungkinan lolos).
- [ ] "Sebelumnya" mempertahankan jawaban. Layar baru mulai dari atas.
- [ ] Mode per soal: ubah `navigationMode` di `fixtures-questionnaire.ts` (opsional) dan cek satu soal per layar.
- [ ] **Q-01:** setelah mengisi beberapa jawaban, tekan pengalih bahasa. Catat: apakah jawaban hilang dan Anda dikembalikan ke pengantar?
- [ ] Refresh di tengah pengisian: kembali ke pengantar (perilaku yang dijelaskan di kode).
- [ ] Pengaturan "kurangi animasi" di sistem operasi: transisi tidak bergerak.

**`/complete`**
- [ ] Ikon, terima kasih, catatan demo, email kontak, tombol "Kembali ke awal" (state dibersihkan).

**Musik (di header survei)**
- [ ] Saat halaman dibuka: TIDAK ada suara. Panel terbuka hanya saat ikon ditekan; Escape dan klik di luar menutupnya.
- [ ] Putar: terdengar nada ambient pelan; Jeda; Bisukan; geser volume; ganti lagu (crossfade). Tutup panel: musik tetap jalan; pindah halaman survei: tetap jalan.
- [ ] Muat ulang: volume terakhir diingat; musik tidak otomatis menyala.
- [ ] Coba di Safari/iPhone bila ada (pembatasan audio paling ketat di sana). Bila gagal: pesan galat tampil dan Putar bisa ditekan lagi.
- [ ] Panel di layar 320 sampai 375 px tidak keluar layar dan tidak menutup tombol soal saat tertutup.

## Rute peneliti
**`/dashboard`**
- [ ] Sapaan, tiga angka ringkasan, proyek terbaru, aktivitas, lencana "Data demo". Sidebar: item aktif benar. Di HP, sidebar/navigasi dapat dipakai.
- [ ] **Menu profil (kanan atas):** klik membuka; Enter/Spasi/panah bawah membuka; panah atas/bawah, Home, End berpindah; Escape menutup dan fokus kembali ke tombol; klik luar menutup; Tab menutup. "Pengaturan" dan "Masuk" berpindah halaman; "Keluar" nonaktif.

**`/dashboard/projects`**
- [ ] Daftar 4 proyek; cari berdasarkan judul; filter status; "tidak ada hasil" tampil bila cocok nol.
- [ ] Dialog "Buat proyek": judul < 3 huruf menolak; deskripsi > 500 huruf menolak; proyek baru muncul di atas dan bertanda lokal (tanpa tautan detail/builder). Escape menutup dialog.

**`/dashboard/projects/new`**
- [ ] Form dan pesan sukses; tombol kembali.

**`/dashboard/projects/p1` (juga p2, p3, p4)**
- [ ] Ringkasan benar; tombol "Buka builder"; "Buka survei" hanya pada proyek terbit. Label di atas jumlah responden: seharusnya "Responden" (Q-11: saat ini "Proyek penelitian").
- [ ] `/dashboard/projects/xyz` (id tidak ada): halaman 404.

**`/dashboard/builder/p1` (juga p2)**
- [ ] Ubah judul/deskripsi; tambah soal tiap 7 tipe; ubah tipe; wajib; Likert: jumlah titik, arah, reverse, label, nilai; pilihan (satu per baris).
- [ ] Seksi: tambah, ganti nama, naik/turun, hapus (soal pindah ke "Tanpa seksi"); pindah soal ke seksi lain; soal baru masuk seksi terpilih.
- [ ] Mode navigasi per soal/seksi; peringatan bila per seksi tanpa seksi.
- [ ] Pratinjau "Per layar" dan "Semua soal" sesuai mode.
- [ ] Pembaca layar atau Tab: tombol Naik/Turun/Hapus (Q-08). Perubahan hanya di memori: refresh = hilang (normal Tahap 1).

**`/dashboard/responses`, `/dashboard/data`**
- [ ] 12 respons demo, kolom Q1..Q8, legenda soal. Halaman Data memakai skor terbalik (s3 berbeda dari Respons).
- [ ] **Ekspor CSV:** file `data-demo.csv` terunduh; buka di Excel/Sheets; karakter Indonesia benar (BOM); kolom dan 12 baris benar. Tombol Excel dan SPSS/R nonaktif.

**`/dashboard/analysis`**
- [ ] Alpha Cronbach tampil sekitar 0,95 (data demo: 0,951); tabel rata-rata/SD per butir; batang. Angka berformat sesuai bahasa (koma desimal di id).

**`/dashboard/integrations`, `/dashboard/settings`**
- [ ] Tiga kartu "belum aktif", tombol nonaktif; pengaturan bahasa dan tema bekerja.

## Lintas halaman
- [ ] Judul tab (Q-07: saat ini semua sama).
- [ ] URL tak dikenal (mis. `/id/tidak-ada`): halaman 404 (Q-12: berbahasa Inggris).
- [ ] Zoom browser 200%: tidak ada konten hilang.
- [ ] Mode gelap: teks galat terbaca (Q-04).

## Catatan hasil
| Tanggal | Rute | Kombinasi (bahasa/tema/layar) | Yang terjadi | Sesuai? |
|---|---|---|---|---|
| | | | | |
