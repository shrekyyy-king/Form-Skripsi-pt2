# Catatan Akun-2: kepatuhan brief dan polish

Status: kode selesai, **belum dijalankan di Next.js** (lingkungan saya tanpa `node_modules` dan jaringan). Yang sudah diperiksa:
- `tsc --strict` + `noUncheckedIndexedAccess` pada semua berkas yang saya ubah atau tambah: tanpa galat, **tetapi dengan stub** untuk react, next-intl, framer-motion, lucide, dan komponen ui. Tipe React/Next asli dan `next lint` belum teruji.
- Fungsi baru `analyzeLikertItems` diuji dengan skrip `tsx`: hasilnya identik dengan logika lama di halaman Analisis pada data demo (alpha 0,951; N=12), ditambah kasus tepi (tanpa respons, respons parsial, jawaban kosong, kuesioner tanpa soal).
- Kunci pesan: semua kunci yang dipakai kode ada setelah fragmen digabung (dicek skrip), dan fragmen id/en setara dan tidak bentrok dengan kunci yang ada.
- Kontras warna dihitung dengan rumus WCAG dari token di `globals.css` (bukan perkiraan).

Zip lama "gabungan-semua" ternyata hanya subset zip "Form-Skripsi-lengkap-terbaru" dan isinya identik; saya memakai yang lengkap.

## Berkas

Baru:
- `docs/BRIEF_CHECKLIST.md`, `docs/PHASE2_PLAN.md`
- `src/features/data/item-analysis.ts`
- `src/app/[locale]/error.tsx`, `src/app/[locale]/not-found.tsx`, `src/app/[locale]/dashboard/loading.tsx`
- `docs/status/akun2.messages.id.json`, `akun2.messages.en.json`, `akun2.public-index.proposed.html`, `akun2.md`

Diubah:
- `src/app/globals.css`
- `src/app/[locale]/dashboard/page.tsx`, `dashboard/layout.tsx`, `dashboard/analysis/page.tsx`, `dashboard/projects/[id]/page.tsx`
- `src/app/[locale]/survey/[slug]/page.tsx`, `survey/[slug]/layout.tsx`
- `src/components/layout/brand-mark.tsx`, `language-switcher.tsx`, `profile-menu.tsx`
- `src/features/projects/project-list.tsx`, `src/features/survey/consent-view.tsx`, `question-flow.tsx`

Tidak disentuh: `messages/*.json`, berkas status akar, `src/components/ui/**`, `routes.ts`, `brand.ts`, `public/`, `README.md`.

## Perubahan dan alasannya

### Celah brief
1. **Aksi cepat di dashboard** (`dashboard/page.tsx`). Brief minta "tombol aksi cepat", tadinya hanya satu. Kini: Proyek baru, Buka builder (proyek terbaru), Lihat respons, Lihat analisis, Lihat semua proyek.
2. **Bug "Proyek terbaru"**. Dashboard menampilkan 3 proyek pertama menurut urutan array (p1, p2, p3), bukan yang terbaru. Kini diurutkan menurut tanggal (p4, p2, p1).
3. **Pesan kosong**: dashboard (proyek dan aktivitas), daftar proyek ("belum ada proyek" kini beda dari "tidak ada yang cocok"), dan alur responden bila kuesioner tidak punya soal (tadinya layar kosong).
4. **Label "Data demo"**: sudah konsisten di dashboard, proyek, respons, data, analisis (kalimat berbeda tetapi sama-sama diawali "Data demo"; sengaja tidak diseragamkan karena nuansanya berbeda: data responden vs hasil penelitian). Celahnya: detail proyek (kini ada lencana `common.demoData`), intro dan persetujuan survei (kini ada catatan `survey.demoNote`; penting karena teks privasi di persetujuan bisa dikira jawabannya benar-benar tersimpan).
5. **Logika skor di halaman**: halaman Analisis merakit matriks dan statistik sendiri, melanggar aturan CLAUDE.md. Dipindah ke `analyzeLikertItems` (fungsi murni). Satu perbedaan sengaja: jawaban kosong `""` kini dianggap hilang (dulu `Number("")` = 0 dihitung sebagai nilai 0). Pada data demo hasilnya tidak berubah.
6. **Pilihan bahasa tersimpan**: pengalih bahasa kini menyimpan pilihan di `localStorage` (`rp.locale`). Agar berdampak, `public/index.html` harus diganti dengan `docs/status/akun2.public-index.proposed.html` (menyalin satu berkas). Saya tidak mengubah `public/` karena di luar wewenang Akun-2; tanpa penyalinan, penyimpanan itu belum berpengaruh apa pun.

### Loading, galat, 404 dan risikonya (ekspor statis)
- `dashboard/loading.tsx`, `[locale]/error.tsx`, `[locale]/not-found.tsx` semuanya **komponen klien** yang memakai `useTranslations`. Alasannya: komponen server yang memanggil terjemahan tanpa `setRequestLocale` memicu pembacaan locale dinamis dan itu gagal pada ekspor statis. Komponen klien mengambil pesan dari penyedia di `[locale]/layout.tsx`, jadi tidak ada risiko itu.
- `loading.tsx` hanya di `dashboard/`, tidak di tingkat locale, supaya alur responden (yang menyimpan jawaban di layout-nya) tidak ikut terganggu. Karena situs statis, nilainya kecil: hanya jaring pengaman saat navigasi klien.
- `error.tsx` menangkap galat render di sisi klien. Tidak menangkap galat di layout `[locale]` itu sendiri (butuh `global-error.tsx`, tidak saya buat).
- **`not-found.tsx` di GitHub Pages tidak akan tampil untuk alamat yang salah.** Pages melayani `404.html` yang dibuat Next dari 404 tingkat akar, bukan `[locale]/not-found.tsx` (yang hanya jalan saat `notFound()` dipanggil dalam rute `[locale]`, dan pada ekspor statis itu tidak terjadi karena semua parameter berasal dari repository). Berkas ini berguna di `next dev` dan di hosting dinamis Tahap 2.
- **404 terlokalisasi untuk Pages sengaja TIDAK saya buat.** Satu-satunya cara adalah `src/app/not-found.tsx` yang memuat `<html>` dan `<body>` sendiri (proyek ini tidak punya `src/app/layout.tsx`). Saya tidak bisa membuktikan itu aman di Next 15.1.6 tanpa menjalankan build, dan satu build gagal berarti satu putaran unggah ulang bagi Anda. Bila ingin dicoba: lakukan di cabang terpisah, dan siap kembalikan bila build gagal.
- Hasil sampingan: `src/app/[locale]/not-found.tsx` dan `error.tsx` memakai namespace baru `states`; tanpa penggabungan fragmen, teksnya akan kosong/galat.

### Polesan visual
- **Kontras (dihitung WCAG)**:
  - Mode gelap, teks galat (`--destructive`): 3,77:1 → 5,24:1 di atas kartu (naik dari 55% ke 65% lightness). Peringatan login (teks di atas `destructive/10`): 3,46 → 4,61. Token ini tidak pernah dipakai sebagai latar solid, jadi aman dinaikkan.
  - Mode terang, teks primer di sidebar aktif (`text-primary` di atas `primary/10`): 4,27 → 4,61 (`--primary` dan `--ring` dari 40% ke 38% lightness). Tombol primer: 4,84 → 5,25. **Ini perubahan warna merek yang terlihat tipis**; bila tidak ingin, kembalikan ke 40% (konsekuensinya sidebar aktif tetap 4,27).
  - Sisa yang diketahui: hover tombol primer di mode terang ±4,26 (sementara), dan border input hanya ±1,3:1 (kurang dari 3:1 yang disarankan WCAG 1.4.11). Border halus adalah keputusan desain brief; saya tidak mengubahnya.
- **Cincin fokus**: aturan dasar `:where(a, button, select, summary):focus-visible` di `globals.css` memberi cincin seragam pada tautan, tombol, dan `<select>` yang sebelumnya tidak punya (≥8 `<select>`, tautan kartu, tombol baris builder). `:where()` berspesifisitas nol, jadi kelas fokus komponen yang sudah ada tetap menang.
- `color-scheme: light/dark`: tanpa ini, daftar `<select>`, scrollbar, dan kontrol bawaan lain tetap terang di mode gelap.
- **Mobile**: header dashboard di layar 360px diperkirakan ±400px lebar (merek + bahasa + tema + tombol Profil) sehingga meluber. Perbaikan: menu profil hanya ikon di bawah `sm` (nama aksesibel tetap lewat `sr-only`, target sentuh 36px), `BrandMark` bisa terpotong (`truncate`), kontainer kiri `min-w-0`. Header survei diberi `gap` dan judul `min-w-0 flex-1`. **Perkiraan lebar adalah hitungan saya, bukan pengukuran**; perlu dilihat di ponsel.
- **Jarak**: dashboard memakai `space-y-8`, halaman lain `space-y-6`; diseragamkan ke `space-y-6`.

## Cara uji (setelah fragmen digabung dan build hijau)
1. `/id/dashboard`: lima tombol aksi cepat; "Proyek terbaru" mulai dari "Ide Penelitian Baru"; coba `/en/dashboard`.
2. `/id/dashboard/projects/p1`: ada lencana "Data demo" di samping status.
3. `/id/survey/demo-servqual` dan `/consent`: catatan "Mode demo" muncul.
4. Layar 360px (atau DevTools mode ponsel): header dashboard tidak meluber, tombol Profil berupa ikon dan tetap bisa dibuka.
5. Tab dengan keyboard di dashboard dan builder: semua tautan, tombol, dan `<select>` punya cincin fokus.
6. Mode gelap: teks galat (kirim form login kosong) terbaca jelas; buka daftar `<select>` (harus gelap).
7. Ganti bahasa lalu tutup tab, buka alamat akar: tetap di `/id/` (normal) sampai `public/index.html` diganti; setelah diganti, harus ke `/en/`.
8. Analisis: angka sama dengan sebelumnya (alpha 0,95; N=12).
9. `/id/dashboard/nama-ngawur`: ini 404 bawaan host, bukan halaman kita (lihat risiko di atas).

## Untuk integrator
- Gabungkan `akun2.messages.{id,en}.json` ke `messages/*.json` (namespace `dashboard`, `projects`, `survey`, `states`; tidak ada kunci lama yang diubah).
- `DEVELOPMENT_LOG.md`/`CURRENT_STATUS.md`/`NEXT_TASKS.md`: saya tidak mengubahnya. Isi yang bisa dicatat: perubahan Akun-2 di atas (belum diuji); `docs/BRIEF_CHECKLIST.md` dan `docs/PHASE2_PLAN.md` sudah ada (butir "Rencanakan Tahap 2" di NEXT_TASKS selesai sebagai rencana, bukan kode).
- Untuk Akun-3: `README.md` menyebut repo `Form-Skripsi`, sedangkan `docs/PARALLEL_WORK.md` versi lama menyebut `Form-Skripsi-pt2`; nama untuk URL Pages perlu diperiksa. Dependensi `recharts` terpasang tetapi tidak dipakai.

## Belum / sengaja tidak dikerjakan
- Komponen `Select`, `Textarea`, `PageHeader` (pengulangan kelas di ±10 tempat): bukan perubahan kecil.
- Memakai token `secondary` (biru lembut) yang belum dipakai di mana pun: akan mengubah tampilan; keputusan desain Anda.
- 404 terlokalisasi untuk Pages dan `global-error.tsx`: risiko build, lihat di atas.
- Nilai awal builder berbahasa Indonesia ("Opsi 1", label Likert) di `builder-utils.ts` masih tertanam di kode.
- Uji di browser/CI, pembaca layar, Safari/iOS untuk musik: semuanya belum.
