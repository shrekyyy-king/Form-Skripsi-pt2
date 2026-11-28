# Laporan QA (Akun-3)

Tanggal audit: 2026-11-27. Yang diaudit: seluruh isi `Form-Skripsi-lengkap-terbaru.zip` (100 berkas).
Aturan peran: kode sumber **tidak diubah**. Perbaikan diusulkan sebagai berkas utuh di `docs/proposed-fixes/` (lihat README di sana).

## 1. Ringkasan

| Keparahan | Jumlah | Contoh |
|---|---|---|
| Tinggi | 2 | jawaban responden hilang saat ganti bahasa (diduga); versi Next.js rentan |
| Sedang | 8 | ekspor CSV bisa memuat rumus berbahaya; teks galat mode gelap sulit dibaca; soal wajib lolos dengan spasi |
| Rendah | 12 | label salah di detail proyek; skala grafik; kebersihan kode |

Kabar baik: tidak ada galat tipe, tidak ada peringatan lint, build ekspor statis berhasil (47 halaman), kunci pesan id/en sinkron (223 kunci), dan rumus Cronbach's alpha cocok dengan hitungan independen. Tiga perbaikan penting sudah punya berkas usulan yang diuji.

## 2. Apa yang benar-benar dijalankan, dan apa yang tidak

Dijalankan di lingkungan Akun-3 (BUKAN di GitHub Actions; log GitHub tidak saya terima, jadi status build hijau di GitHub tidak bisa saya pastikan sendiri):

| Pemeriksaan | Hasil |
|---|---|
| `npm install` (+ `npm audit`) | berhasil; 5 temuan keamanan (lihat Q-02) |
| `npx tsc --noEmit` | tanpa galat |
| `npx next lint` | tanpa peringatan/galat |
| `npx next build` (ekspor statis) | berhasil, 47 halaman. Catatan: `next/font/google` (Inter) diganti stub di salinan uji karena lingkungan ini tidak bisa mengakses Google Fonts. Stub itu tidak ada di berkas serahan |
| Sinkron pesan id/en | 223 kunci di kedua berkas, tanpa selisih; semua kunci `t("...")` literal ada; placeholder `{...}` sama |
| Aturan ekspor statis | 19 page/layout memanggil `setRequestLocale`; rute dinamis punya `generateStaticParams`; tidak ada `cookies()/headers()/middleware`; tidak ada `any`/`@ts-ignore` |
| Logika murni (`docs/qa-scripts/qa-checks.ts`) | 44 pemeriksaan pada kode asli: 36 lolos, 8 gagal (semua gagal = temuan di bawah). Setelah perbaikan usulan: 42 lolos, 2 gagal (temuan yang belum diperbaiki) |
| Cronbach's alpha data demo | 0,9510395707578807 di TypeScript dan di Python (dihitung terpisah); reverse scoring butir s3 juga cocok |
| Kontras warna | dihitung dengan rumus WCAG dari token di `globals.css` |

TIDAK dijalankan (tidak ada browser di lingkungan ini): tampilan visual, perilaku di Chrome/Firefox/Safari/mobile, audio, interaksi keyboard dan pembaca layar, unduh CSV di browser. Semua yang bertanda **(diduga)** adalah hasil membaca kode dan perlu dicek lewat `docs/TESTING_CHECKLIST.md`.

Satu catatan jujur: dalam skrip uji saya, satu ekspektasi awal (urutan hasil `removeSection`) ternyata salah; kodenya benar sesuai dokumentasi `docs/status/seksi.md`. Ekspektasi itu sudah dikoreksi.

## 3. Temuan

Format: **ID, judul**: berkas:baris, penjelasan, saran. "Perbaikan" menunjuk berkas usulan.

### Tinggi

**Q-01 Jawaban hilang bila responden mengganti bahasa di tengah pengisian (diduga).**
`src/components/layout/language-switcher.tsx:16` memakai `router.replace(pathname, { locale })`, dan pengalih ini tampil di header survei (`survey/[slug]/layout.tsx`). Jawaban disimpan di `SurveyProvider` (state React). Pada Next App Router, mengganti nilai segmen dinamis `[locale]` biasanya memasang ulang layout di bawahnya, sehingga state hilang; lalu `question-flow.tsx:31` mengembalikan responden ke halaman pengantar. Akibatnya semua jawaban dan persetujuan hilang. Belum diuji di browser: lihat TESTING_CHECKLIST bagian "Alur responden".
Saran (pilih satu, perlu keputusan): (a) sembunyikan pengalih bahasa di `/questions` dan `/consent`; (b) simpan jawaban di `sessionStorage` (dengan try/catch) dan pulihkan; (c) tampilkan peringatan sebelum pindah. Tidak saya sertakan kodenya karena menyentuh layout survei dan keputusan UX ada pada Anda.

**Q-02 Dependensi dengan kerentanan yang diketahui.**
`package.json:18` `next 15.1.6` ditandai **kritis** oleh `npm audit` (beberapa advisori; sebagian untuk server Next, dev server, dan protokol React flight). Pada Tahap 1 situs hanya berupa berkas statis di GitHub Pages, jadi sebagian besar tidak dapat dieksploitasi di produksi; namun dev server, proses build, dan terutama Tahap 2 (server) terdampak. Juga: `next-intl 3.26.3` (sedang, perbaikan butuh versi mayor 4), `zod 3.24.1` (tinggi, perbaikan butuh zod 4 dan penyesuaian `@hookform/resolvers`), `postcss`/`sharp` (transitif, ikut membaik dengan Next baru).
Perbaikan: **FIX-04** menaikkan `next` dan `eslint-config-next` ke 15.5.29 (rilis minor, bukan mayor). Sudah diuji di lingkungan ini: tipe, lint, dan build 47 halaman tetap hijau; temuan kritis hilang, sisa 4 (sedang/tinggi, lihat di atas). `next-intl` dan `zod` ke v4 adalah migrasi tersendiri: rencanakan saat awal Tahap 2 bersama uji ulang form.

### Sedang

**Q-03 Ekspor CSV bisa memuat "rumus" (CSV/formula injection).**
`src/features/data/dataset.ts:27-33`. Jawaban teks responden yang diawali `=`, `+`, `-`, `@` ditulis apa adanya; bila peneliti membuka CSV di Excel/Sheets, sel itu bisa dieksekusi sebagai rumus. Data demo tidak berbahaya, tetapi ini menjadi nyata begitu ada responden sungguhan. Juga: karakter `\r` tidak ikut di-escape (baris 29).
Perbaikan: **FIX-01** (awalan `'` pada sel teks berbahaya; angka biasa seperti `-3` tidak diubah; `\r` di-escape). Diuji dengan skrip.

**Q-04 Teks galat sulit dibaca di mode gelap.**
`src/app/globals.css:35` (`--destructive` gelap). Kontras teks galat: 4,07:1 di atas background dan 3,77:1 di atas kartu; standar WCAG AA untuk teks kecil: 4,5:1. Mode terang aman (5,8 sampai 6,0).
Perbaikan: **FIX-03** (`0 72% 66%`, kontras 4,7 sampai 5,7 pada background/kartu/muted).

**Q-05 Soal wajib bisa lolos hanya dengan spasi; angka tak hingga diterima.**
`src/features/survey/section-utils.ts:114-115` dan `:120`. Jawaban `"   "` dianggap terisi; nilai seperti `1e999` lolos validasi angka.
Perbaikan: **FIX-02** (`trim()` dan `Number.isFinite`).

**Q-06 Layar kosong bila kuesioner tidak punya soal.**
`src/features/survey/question-flow.tsx:39` (`return null`). Responden melihat halaman kosong tanpa penjelasan, padahal brief meminta keadaan kosong ditangani. Saat ini tidak terjadi pada data demo, tetapi akan terjadi pada kuesioner buatan builder di Tahap 2.
Saran: tampilkan pesan "Kuesioner ini belum memiliki pertanyaan" (butuh kunci pesan baru id/en) dan tombol kembali.

**Q-07 Semua halaman berjudul sama.**
`src/app/[locale]/layout.tsx:13` hanya mengatur `title: brand.name`. Dalam build, semua halaman memakai `<title>Research Platform</title>`. Pengguna pembaca layar dan tab browser tidak bisa membedakan halaman (WCAG 2.4.2).
Saran: `title: { default: brand.name, template: "%s | " + brand.name }` di layout dan `generateMetadata` per halaman memakai terjemahan.

**Q-08 Tombol aksi di daftar soal builder tidak punya konteks untuk pembaca layar.**
`src/features/builder/builder-editor.tsx:87-89` dan `:177`. Setiap baris punya tombol berlabel sama ("Naik", "Turun", "Hapus"). Pembaca layar mengucapkan label yang sama berulang tanpa tahu soal mana. Setelah menghapus soal, fokus juga hilang.
Saran: label berisi nomor soal, mis. `t("moveUpFor", { number })`; setelah hapus, pindahkan fokus ke baris berikutnya atau ke tombol "Tambah".

**Q-09 Batas kolom isian terlalu tipis (kontras 1,25:1 terang, 1,51:1 gelap).**
`src/app/globals.css` (`--border`) dan komponen `src/components/ui/input.tsx` (memakai `border`, bukan `--input`). WCAG 1.4.11 menyarankan 3:1 untuk batas kontrol. Ini konsekuensi gaya "border halus" di brief, jadi **keputusan desain**, bukan salah kode.
Saran: biarkan `--border` halus untuk kartu, tetapi beri kolom isian batas lebih gelap (token `--input` sudah ada tetapi belum dipakai). `components/ui` berstatus beku; perubahan perlu persetujuan Akun-1.

**Q-10 Builder bisa menghasilkan data yang merusak responden dan analisis (menjadi nyata di Tahap 2).**
- Nilai opsi Likert boleh ganda: `question-editor.tsx:68`; di responden `key={o.value}` ganda (`question-input.tsx:30`), pilihan terlihat terpilih ganda, dan reverse scoring (`scoring.ts:7`) memakai max+min nilai.
- Pilihan kosong atau ganda: `question-editor.tsx:82` memecah per baris tanpa membersihkan; `question-input.tsx:47,58,70` memakai `key={c}`. Pratinjau sudah membuang yang kosong (`builder-preview.tsx:29`), tetapi responden asli belum.
Saran: validasi saat menyimpan (nilai unik, pilihan di-trim, tanpa kosong/duplikat) di utilitas murni builder; tambahkan uji.

### Rendah

**Q-11 Label salah di detail proyek.** `src/app/[locale]/dashboard/projects/[id]/page.tsx:41` memakai `tp("title")` ("Proyek penelitian") sebagai label di atas "128 responden". Perbaikan: **FIX-05** (kunci baru `projectDetail.detailRespondents`, fragmen pesan id/en disertakan; diuji, label "Responden" muncul di hasil build).

**Q-12 Halaman 404 default berbahasa Inggris.** Hasil build `out/404.html` tanpa tema, tanpa pilihan bahasa, tanpa tautan kembali. Saran: `src/app/[locale]/not-found.tsx` untuk `notFound()` di dalam rute berbahasa; URL yang tidak cocok sama sekali tetap dilayani `404.html` GitHub Pages (perlu keputusan bila ingin 404 dwibahasa).

**Q-13 Batang grafik di Analisis mulai dari 0, bukan dari nilai terendah skala.** `analysis/page.tsx:37` memakai `mean / max`. Pada skala 1 sampai 5, rata-rata 1,0 tampak 20% dan 3,0 tampak 60%. Saran: `(mean - min) / (max - min)` atau beri sumbu/label skala; jelaskan dalam catatan.

**Q-14 Dua kasus tepi laten pada hitungan.** (a) `analysis/page.tsx:26` dan `dataset.ts:18` memakai `Number(...)`; `Number("")` bernilai 0 sehingga jawaban Likert kosong akan dihitung sebagai 0 (di dataset sudah ditutup FIX-01; di analisis belum). Pada alur sekarang jawaban Likert kosong berarti kunci tidak ada, jadi belum terjadi. (b) `scoring.ts:7`: bila daftar opsi kosong, hasil `NaN`. Builder selalu membuat minimal 2 opsi, jadi belum terjadi. Saran: jaga di kedua tempat.

**Q-15 Unduh CSV (belum diuji di browser).** `export-csv-button.tsx:17-18`: `revokeObjectURL` dipanggil segera setelah `click()` dan tautan tidak ditempel ke dokumen. Beberapa browser (Safari, Firefox lama) bisa membatalkan unduhan. Saran: `document.body.append(a)` lalu `setTimeout(() => URL.revokeObjectURL(url), 0)`.

**Q-16 Likert: label bawaan campuran dan teks bawaan berbahasa Indonesia.** `builder-utils.ts:12`: menaikkan 3 ke 5 titik menghasilkan label "1 | 2 | 3 | Setuju | Sangat setuju". `builder-utils.ts:3,23`: "Opsi 1/2" dan label 5 titik berbahasa Indonesia muncul walau antarmuka berbahasa Inggris (ini konten peneliti, jadi boleh, tetapi sebaiknya diputuskan sadar).

**Q-17 Hapus soal/seksi tanpa konfirmasi atau urungkan.** `builder-editor.tsx:61-77`. Masih wajar untuk mode demo; wajib dipertimbangkan begitu data tersimpan.

**Q-18 Halaman selesai tidak memeriksa jawaban wajib.** `complete-view.tsx:19-22` hanya memeriksa persetujuan. Dengan tombol maju/mundur browser di dalam aplikasi, halaman selesai bisa dicapai tanpa menjawab. Tidak berdampak di Tahap 1 (tanpa penyimpanan); di Tahap 2 validasi harus dilakukan juga di server.

**Q-19 Angka data demo tidak konsisten.** `fixtures.ts:5` menyebut 128 responden untuk proyek p1, sedangkan hanya ada 12 respons demo (`fixtures-responses.ts`); total di Ringkasan 340. Semua berlabel "Data demo", jadi hanya kosmetik.

**Q-20 Aksi cepat dashboard minim.** `dashboard/page.tsx:68` hanya satu tombol; brief menyebut "tombol aksi cepat" (mis. buat proyek, buka builder, lihat data). Tumpang tindih dengan tugas Akun-2 (kepatuhan brief).

**Q-21 Kebersihan.** `recharts` ada di `package.json:24` tetapi tidak dipakai (grafik memakai CSS); `src/components/layout/placeholder-page.tsx` tidak dipakai lagi; kunci pesan `common.demoData`, `common.profileDemo`, `common.comingSoon` tidak terpakai (`common` beku: keputusan Akun-1); `components.json` sisa konfigurasi shadcn CLI yang tidak dipakai; `consent-view.tsx:31` memakai `key={p}` (paragraf identik menghasilkan key ganda). Tidak berbahaya.

**Q-22 Tidak ada `package-lock.json`.** Build di GitHub memakai `npm install` tanpa kunci, sehingga dependensi turunan bisa berubah antar-build. Saran: hasilkan `package-lock.json` di lingkungan yang punya npm dan sertakan; baru setelah itu ubah workflow ke `npm ci`. (Bila workflow memakai `cache: npm`, kunci ini malah wajib ada.)

## 4. Yang sudah baik (ringkas)

- Logika murni (skor, statistik, seksi, validasi, mutasi builder) terpisah dari komponen dan lolos uji kasus tepi, kecuali yang tercantum di atas.
- Akses data konsisten lewat `src/lib/data`; autentikasi lewat antarmuka `AuthClient`; nama produk dan rute dari `brand.ts` dan `routes.ts`.
- Aksesibilitas dasar baik: label pada kolom, `role="alert"` pada galat, fokus dipindah ke soal bermasalah, `aria-expanded`/Escape pada menu dan panel, `useReducedMotion` dipakai pada animasi.
- Tidak ada penyimpanan kredensial; musik tidak autoplay; data demo berlabel.

## 5. Urutan perbaikan yang disarankan

1. Uji Q-01 di browser; putuskan solusi.
2. Terapkan FIX-04 (naik Next) lalu FIX-01, 02, 03, 05; build di GitHub; uji `docs/TESTING_CHECKLIST.md`.
3. Q-06, Q-07, Q-08 (kecil, tanpa dampak arsitektur).
4. Sisanya bersamaan dengan Tahap 2 (Q-10, Q-17, Q-18 menjadi wajib).
