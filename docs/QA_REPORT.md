# Laporan QA Tahap 1

Tanggal audit: 2026-11-27

## Ruang lingkup dan batasan (baca dulu)

- **Cara audit: HANYA MEMBACA kode.** `typecheck`, `lint`, dan `build` TIDAK dijalankan (zip tidak berisi `node_modules`, dan lingkungan audit tanpa jaringan). Tidak ada halaman yang dibuka di peramban. Semua temuan runtime bertanda **[perlu verifikasi]**.
- **Prasyarat belum terpenuhi.** Prompt QA meminta audit setelah semua hasil paralel digabung dan build GitHub Actions hijau. Snapshot `Form-Skripsi-basis.zip` adalah kondisi **sampai Bagian 7**: tidak ada `docs/status/`, `src/features/music`, `src/features/auth`, `src/lib/auth`, `src/config/music.ts`, `profile-menu.tsx`, rute `/login`, maupun manajemen seksi (`Section`). Berkas `.github/workflows/pages.yml` juga tidak ada di zip (berkas berawalan titik). Jadi laporan ini hanya mencakup 74 berkas yang ada; hasil tugas Seksi dan Musik/Login/Profil **belum diaudit**.
- Rasio kontras warna dihitung dari token di `globals.css` (rumus WCAG), bukan diukur di peramban.
- Pemeriksaan otomatis yang saya jalankan (skrip sederhana): kesamaan kunci `messages/id.json` vs `en.json`, kunci yang dipakai kode vs yang ada, impor tidak terpakai, penggunaan `any`, API peramban/cookie/header.

## Ringkasan

| Keparahan | Jumlah |
|---|---|
| Tinggi | 0 |
| Sedang | 6 |
| Rendah | 10 |
| Info | 7 |

Hasil positif (terverifikasi dengan membaca/skrip):
- 121 kunci pesan, **id dan en sinkron**, placeholder ICU sama, tidak ada kunci yang dipanggil tapi hilang.
- Tidak ada `any`, tidak ada impor yang tidak terpakai, tidak ada `localStorage`/`window`/`document` langsung.
- Semua page/layout memanggil `setRequestLocale`; semua rute dinamis (`survey/[slug]`, `builder/[id]`, `projects/[id]`) punya `generateStaticParams`. Tidak ada middleware, cookies, headers, atau API route: kompatibel ekspor statis.
- Akses array mematuhi `noUncheckedIndexedAccess` (`q.questions[index]`, `defaultFive[i]` ditangani).
- Tidak ada teks antarmuka hardcode di komponen (kecuali butir R-8 dan I-5).

---

## SEDANG

### S-1. Berpindah bahasa saat mengisi kuesioner menghapus semua jawaban [perlu verifikasi]
- Berkas: `src/components/layout/language-switcher.tsx:16`, `src/features/survey/survey-provider.tsx:21-24`, `src/features/survey/question-flow.tsx:20-22`
- Masalah: `SurveyProvider` memakai `useState` dan berada di bawah layout `[locale]`. Mengganti `locale` lewat `router.replace` kemungkinan me-remount pohon sehingga `consented` kembali `false`; `QuestionFlow` lalu mengalihkan ke halaman awal. Responden kehilangan progres tanpa peringatan.
- Saran: pindahkan state ke `sessionStorage` (dengan `try/catch`) atau sembunyikan pengalih bahasa selama `index > 0`; minimal beri tahu pengguna. Pada Tahap 2 jawaban sebaiknya disimpan per sesi di server.

### S-2. Risiko hydration mismatch pada tanggal (zona waktu tidak diset)
- Berkas: `src/i18n/request.ts:4-8`; dipakai `src/features/projects/project-list.tsx:63`
- Masalah: `next-intl` tidak diberi `timeZone`. Komponen klien memformat tanggal saat build (zona waktu runner Actions, UTC) lalu saat hydrate memakai zona waktu peramban. `createdAt` demo `...T08:00:00Z` bergeser hari bagi pengguna di UTC-9 atau lebih barat; kemungkinan juga muncul peringatan `ENVIRONMENT_FALLBACK` saat build.
- Saran: kembalikan `timeZone` tetap dari `getRequestConfig`. Berkas usulan: `docs/proposed-fixes/request.ts.txt`.

### S-3. Nilai opsi Likert dan pilihan ganda tidak divalidasi (duplikat/kosong)
- Berkas: `src/features/builder/question-editor.tsx:66-73, 82`, `src/features/survey/question-input.tsx:30, 47, 58`
- Masalah: peneliti bisa membuat dua opsi Likert bernilai sama, atau pilihan duplikat/kosong. Akibatnya `key={o.value}` / `key={c}` ganda (peringatan React, centang ikut berpasangan), dan skor ambigu. Baris kosong pada `choices` hanya disaring di pratinjau (`builder-editor.tsx:98`), tidak di data; `<option value="">` bentrok dengan opsi placeholder dropdown.
- Saran: fungsi murni `validateQuestion(question)` di `builder-utils.ts` (nilai unik, label tidak kosong, `choices` tanpa duplikat), tampilkan galat di editor; saring baris kosong saat menyimpan `choices`.

### S-4. Kolom nilai opsi Likert tidak bisa dikosongkan
- Berkas: `src/features/builder/question-editor.tsx:68-69`
- Masalah: `Number("")` bernilai `0`, bukan `NaN`, sehingga menghapus isi kolom langsung mengubahnya jadi `0` dan mengetik "-" atau angka desimal terasa rusak (nilai terkontrol).
- Saran: simpan teks mentah di state lokal dan konversi saat blur, atau tolak string kosong secara eksplisit.

### S-5. Teks galat (`text-destructive`) gagal kontras AA pada tema gelap
- Berkas: `src/app/globals.css:35` (`--destructive: 0 62% 55%`); dipakai `question-flow.tsx:69`, `project-form.tsx:29,35`
- Masalah: hitungan saya: 4,07:1 terhadap background dan 3,77:1 terhadap card (target 4,5:1 untuk teks kecil).
- Saran: naikkan kecerahan token gelap, mis. `0 70% 65%`, lalu cek ulang. (`globals.css` termasuk berkas config; perubahan perlu persetujuan integrator.)

### S-6. Item "Ringkasan" di sidebar kemungkinan tidak pernah tampak aktif [perlu verifikasi]
- Berkas: `src/components/layout/sidebar-nav.tsx:25`
- Masalah: `pathname === href` dengan `href = "/dashboard"`, sementara `next.config.ts` memakai `trailingSlash: true` sehingga `usePathname()` kemungkinan mengembalikan `/dashboard/`. Jika benar, `aria-current` dan gaya aktif tidak muncul. Item lain memakai `startsWith` sehingga aman.
- Saran: normalisasi, mis. `pathname.replace(/\/$/, "") === href`. Verifikasi di peramban dulu.

---

## RENDAH

### R-1. Label kolom "responden" di detail proyek salah
- `src/app/[locale]/dashboard/projects/[id]/page.tsx:41`: label memakai `tp("title")` ("Proyek penelitian") di atas angka "128 responden". Saran: kunci baru `projectDetail.detailRespondents` (id/en).

### R-2. Kuesioner tanpa soal menampilkan halaman kosong
- `src/features/survey/question-flow.tsx:24-25`: `!question` mengembalikan `null`, jadi responden melihat layar kosong; `total = 0` juga membuat lebar progres `NaN%` (baris 51). Saran: tampilkan pesan "kuesioner belum memiliki soal" dan jangan render bilah progres.

### R-3. Soal Likert tanpa `likert` jatuh menjadi input teks
- `src/features/survey/question-input.tsx:25, 77-78`: `type === "likert"` tanpa konfigurasi jatuh ke `default` (input teks). Builder mencegahnya lewat `applyType`, tetapi data dari Supabase kelak bisa tak konsisten. Saran: tampilkan galat jelas atau validasi di repository.

### R-4. Aksesibilitas alur responden
- `question-flow.tsx:50`: `role="progressbar"` tanpa nama (`aria-label`/`aria-labelledby`).
- `question-flow.tsx:56-69`: fokus tidak dipindah ke soal baru saat "Berikutnya"; pengguna pembaca layar/keyboard tidak diberi tahu soal berganti (hanya `aria-live` pada teks progres). Saran: fokuskan `legend`/`fieldset` (tabIndex -1) setelah transisi.
- `question-flow.tsx:69`: pesan galat tidak dikaitkan ke input (`aria-describedby`, `aria-invalid`).
- `[locale]/dashboard/layout.tsx`, `survey/[slug]/layout.tsx`: tidak ada tautan "lewati ke konten".

### R-5. `text-primary` pada `bg-primary/10` sedikit di bawah AA (tema terang)
- `sidebar-nav.tsx:28`, `builder-editor.tsx:112`: hitungan 4,43:1 (target 4,5:1) untuk teks `text-sm` tebal. Saran: gelapkan `--primary` terang sedikit (mis. lightness 37%) atau pakai `text-foreground` pada latar aktif.

### R-6. Pergeseran bahasa mengosongkan hasil yang belum dikirim di Pratinjau/Builder
- Perubahan builder hanya di memori (`builder-editor.tsx:25-32`); berganti bahasa me-remount halaman dan menghapus semuanya. Sudah ditandai demo, tetapi tambahkan peringatan `beforeunload` atau catatan di UI. (Sama akarnya dengan S-1.)

### R-7. Logika skor `scoreLikert` rapuh pada kasus tepi
- `src/lib/scoring.ts:4-8`: (a) `options` kosong menghasilkan `-Infinity + Infinity = NaN`; (b) `value` di luar rentang opsi tidak ditolak; (c) `direction` tidak berpengaruh (benar bila nilai menempel pada opsi, tetapi perlu dinyatakan di komentar); (d) belum ada uji unit. Rumus inti `max + min - value` benar untuk skala berurutan. Berkas usulan: `docs/proposed-fixes/scoring.ts.txt`.

### R-8. Nilai bawaan builder berbahasa Indonesia tertanam di kode
- `src/features/builder/builder-utils.ts:3, 23`: label Likert 5 titik dan "Opsi 1/Opsi 2" hardcode. Peneliti berbahasa Inggris mendapat label Indonesia. Ini konten bawaan, bukan antarmuka, tetapi sebaiknya diteruskan dari pemanggil yang memakai `messages`.

### R-9. `createLikertConfig` memberi nilai tabrakan saat menambah titik pada skala bernilai khusus
- `builder-utils.ts:12`: titik baru bernilai `i + 1` tanpa memeriksa nilai yang sudah dipakai (mis. skala 0-4 diperbesar). Terkait S-3.

### R-10. `brand.logoPath` tidak memperhitungkan `basePath`
- `src/components/layout/brand-mark.tsx:7`: `<img src="/logo.svg">` di GitHub Pages menunjuk ke akar domain, bukan `/<repo>/logo.svg`. Saat ini `logoPath = null` sehingga belum terlihat. Saran: awali dengan `process.env.NEXT_PUBLIC_BASE_PATH`.

---

## INFO

- **I-1. Dokumen tidak konsisten:** `docs/DECISIONS.md` menyebut `.eslintrc.json` sekaligus ESLint di `package.json`; `docs/ARCHITECTURE.md` masih menulis prefix `as-needed` dan cookie `NEXT_LOCALE`, padahal kini `always` tanpa cookie; README menyebut `Form-Skripsi` sedangkan repo `Form-Skripsi-pt2`. Sudah diperbaiki di berkas dokumen yang menyertai laporan ini.
- **I-2. `npm run dev`:** tanpa `src/app/page.tsx`, alamat `/` kemungkinan 404 saat pengembangan (pengalihan hanya lewat `public/index.html`). Gunakan `/id/`. [perlu verifikasi]
- **I-3. Kode belum terpakai (wajar untuk Tahap 1):** `scoreLikert` (belum dipanggil di mana pun), `brand.tagline`, `routes.home`, `routes.login`, kunci `common.demoData`, dependensi `recharts` (belum diimpor).
- **I-4. `Button` tanpa `type="button"` bawaan** (`src/components/ui/button.tsx`, beku). Aman sekarang karena tombol dalam form diberi tipe eksplisit; berisiko bila kelak ada tombol di dalam `<form>`.
- **I-5. Data demo berbahasa Indonesia tampil di antarmuka Inggris** (`fixtures.ts:12-14`, judul proyek, kuesioner). Dapat diterima (data demo/konten peneliti), tetapi pengguna `/en` akan melihat campuran.
- **I-6. `next/font/google` (Inter)** mengunduh font saat build: build lokal tanpa internet gagal. Di GitHub Actions aman.
- **I-7. Tidak ada `not-found` bergaya** untuk URL yang tidak ada (404 bawaan Next, tanpa tema/bahasa).

---

## Hal yang belum dapat dinilai
- Hasil `npm run typecheck`, `npm run lint`, `npm run build` (tidak dijalankan).
- Tampilan sebenarnya (responsif, tema gelap, transisi), perilaku `<dialog>`, `has-[:checked]` pada peramban lama.
- Seluruh fitur Seksi, Musik, Login, Profil (tidak ada di snapshot).

Daftar uji manual: `docs/TESTING_CHECKLIST.md`.
