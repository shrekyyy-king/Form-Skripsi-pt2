# Daftar Uji Manual Tahap 1

Belum ada uji otomatis. Centang tiap butir setelah dicoba di GitHub Pages atau `npm run dev`. Catat hasil dan galat konsol di bawah tiap rute.

## Uji umum (ulangi untuk setiap rute di bawah)
Untuk **setiap rute**, uji matriks berikut. Tulis "OK/Gagal + catatan".

| Aspek | Cara uji |
|---|---|
| Bahasa | Buka `/id/...` lalu `/en/...`; pakai pengalih bahasa. Tidak ada teks tertinggal bahasa lain (kecuali konten demo/peneliti). Bahasa Inggris tidak memunculkan kunci mentah seperti `projects.title`. |
| Tema | Terang, gelap, dan "sistem". Cek kontras teks, galat (merah), badge, fokus. |
| Mobile | Lebar 360 px dan 768 px: tanpa gulir horizontal (kecuali navigasi mobile), tombol mudah disentuh, dialog tidak terpotong. |
| Keyboard | Tab melewati semua elemen interaktif berurutan, fokus terlihat jelas, Enter/Spasi mengaktifkan, Esc menutup dialog, tidak ada jebakan fokus. |
| Konsol | Tidak ada galat merah atau peringatan hydration/key di DevTools. |
| Muat ulang | Refresh langsung pada URL (bukan lewat klik): halaman tetap termuat (uji ekspor statis + `basePath`). |

## Rute

### `/` (pengalihan)
- [ ] Di GitHub Pages: `https://<user>.github.io/<repo>/` menuju `/id/`.
- [ ] Lokal (`npm run dev`): catat apakah `/` 404 (lihat I-2); `/id/` harus jalan.

### `/id/` dan `/en/` (beranda)
- [ ] Judul, subjudul, tombol "Buka dashboard" menuju `/dashboard/`.
- [ ] Pengalih bahasa dan tema berfungsi; bahasa tetap sesuai URL.

### `/dashboard/` (ringkasan)
- [ ] Lencana "Data demo, bukan data nyata" tampil.
- [ ] Tiga kartu statistik: total proyek 4, total responden 340, kuesioner aktif 1 (data demo saat ini).
- [ ] Tanggal tampil sesuai bahasa (cek `/en/` format bulan Inggris).
- [ ] Tautan proyek terbaru menuju detail; "Lihat semua proyek" menuju daftar.
- [ ] Item "Ringkasan" di sidebar tampak aktif (cek temuan S-6).
- [ ] Mobile: navigasi horizontal dapat digulir; sidebar kiri tersembunyi.

### `/dashboard/projects/`
- [ ] Empat proyek demo tampil dengan status dan kuesioner yang benar.
- [ ] Pencarian: ketik "layanan" menyisakan 1; ketik teks yang tidak ada memunculkan pesan kosong.
- [ ] Filter status memfilter; kombinasi dengan pencarian bekerja.
- [ ] "Proyek baru" membuka dialog; Esc/Batal menutup; fokus kembali ke tombol.
- [ ] Kirim dialog kosong: galat "Judul minimal 3 karakter" (id dan en). Deskripsi >500 karakter: galat.
- [ ] Buat proyek valid: muncul di urutan teratas, berlabel "Lokal (tidak tersimpan)", **tanpa** tautan detail/builder; refresh menghilangkannya.
- [ ] Setelah galat lalu dialog ditutup dan dibuka lagi, apakah galat lama masih tampak? (catat)
- [ ] Hanya proyek terbit yang punya tautan "Buka kuesioner".

### `/dashboard/projects/new/`
- [ ] Form sama; submit menampilkan kartu "Proyek ... dibuat" dan catatan demo; form dikosongkan.
- [ ] "Kembali ke daftar proyek" berfungsi.

### `/dashboard/projects/{p1..p4}/`
- [ ] Judul, deskripsi, lencana status, jumlah soal (hanya p1 punya kuesioner: 8 soal).
- [ ] Label kolom ke-2 (periksa R-1: seharusnya "Responden", bukan "Proyek penelitian").
- [ ] "Buka builder" selalu ada; "Buka kuesioner" hanya untuk p1 (terbit).
- [ ] URL `/dashboard/projects/xyz/` menghasilkan 404.

### `/dashboard/builder/{p1..p4}/`
- [ ] p1 memuat 8 soal demo; p2-p4 mulai kosong dengan judul proyek.
- [ ] Ubah judul/deskripsi; tambah soal tiap 7 tipe; ubah tipe soal yang sudah ada.
- [ ] Naik/turun (tombol pertama tidak bisa naik, terakhir tidak bisa turun); hapus soal terpilih mengosongkan editor.
- [ ] Likert: ubah titik 2-10, arah, reverse, label/nilai/deskripsi. Uji dua opsi bernilai sama (S-3) dan mengosongkan kolom nilai (S-4).
- [ ] Soal pilihan: satu pilihan per baris; baris kosong/duplikat (S-3).
- [ ] Pratinjau: tampilan sama dengan responden, jawaban dapat diisi, tidak tersimpan.
- [ ] Saklar publikasi hanya mengubah tampilan halaman (catatan demo tampil).
- [ ] Refresh membuang semua perubahan (sesuai desain demo).
- [ ] Keyboard: seluruh tombol ikon punya nama (pembaca layar: "Naikkan", "Turunkan", "Hapus soal").

### `/survey/demo-servqual/` (pengantar)
- [ ] Judul, deskripsi, peneliti, perkiraan waktu; tombol "Mulai".
- [ ] Slug tak dikenal (`/survey/xyz/`) menghasilkan 404.

### `/survey/demo-servqual/consent/`
- [ ] Tombol "Setuju dan lanjutkan" nonaktif sampai kotak dicentang.
- [ ] "Tidak setuju" menampilkan pesan penolakan dan tombol kembali.
- [ ] Buka langsung URL tanpa melewati pengantar: tetap dapat dipakai (catat perilaku).

### `/survey/demo-servqual/questions/`
- [ ] Buka langsung (tanpa persetujuan): dialihkan ke pengantar.
- [ ] 8 soal berurutan: 4 Likert (soal ke-3 reverse), centang, dropdown, angka, jawaban panjang.
- [ ] Soal wajib kosong memunculkan galat dan menahan maju; opsional boleh dilewati.
- [ ] Angka: huruf/`e` ditolak; nilai `0` sah bila wajib.
- [ ] "Sebelumnya" mempertahankan jawaban; bilah progres dan teks "Pertanyaan n dari 8" benar.
- [ ] Gerakan berkurang: aktifkan "Reduce motion" di OS, transisi hilang.
- [ ] **Ganti bahasa di tengah pengisian**: catat apakah jawaban hilang (S-1).
- [ ] Keyboard: panah atas/bawah pada radio, Spasi pada kotak centang, dropdown dengan keyboard; fokus setelah klik "Berikutnya" (R-4).
- [ ] Pembaca layar (bila ada): legend soal dibacakan bersama grup jawaban.

### `/survey/demo-servqual/complete/`
- [ ] Hanya dapat dicapai setelah soal terakhir; tampil ikon, ucapan terima kasih, catatan "tidak disimpan", email peneliti.
- [ ] Buka langsung tanpa persetujuan: dialihkan ke pengantar.
- [ ] "Kembali ke awal" mengosongkan jawaban; mulai lagi dari soal 1 kosong.

### Halaman placeholder: `/dashboard/responses|data|analysis|integrations|settings/`
- [ ] Judul sesuai menu, pesan "akan dibangun pada tahap berikutnya" (id/en).
- [ ] Item sidebar aktif sesuai halaman.

### Rute baru dari tugas paralel (BELUM ada di snapshot yang diaudit)
Tambahkan butir uji setelah penggabungan: manajemen seksi di builder dan navigasi seksi di responden; pemutar musik (tanpa autoplay, kontrol keyboard, tidak memblokir halaman, berhenti saat berpindah rute sesuai desain); `/login` (UI saja, galat form id/en); dropdown profil (buka/tutup dengan keyboard, Esc, fokus).

## Setelah penggabungan
- [ ] `npm run typecheck`, `npm run lint`, `npm run build` hijau secara lokal atau di Actions.
- [ ] Skrip pemeriksaan kunci id/en ulang (kunci baru dari `docs/status/*.messages.*.json`).
- [ ] Seluruh daftar di atas diulang di URL GitHub Pages sungguhan (bukan hanya lokal).
