# Research Platform (nama sementara)

Platform kuesioner dan analisis statistik untuk peneliti dan mahasiswa. Dwibahasa (Indonesia/Inggris).

**Status: Tahap 1 (frontend saja, data mock, tanpa backend).** Semua data adalah **data demo**. Rincian terkini: `CURRENT_STATUS.md`. Temuan audit: `docs/QA_REPORT.md`.

## Fitur Tahap 1

Sudah dibangun (diuji pengguna sampai alur responden; sisanya belum diuji, lihat `CURRENT_STATUS.md`):
- Fondasi: Next.js App Router, TypeScript strict, Tailwind 3, tema terang/gelap/sistem, dwibahasa `/id` dan `/en`.
- Dashboard peneliti: ringkasan, daftar proyek (cari, filter status), detail proyek, dialog dan halaman proyek baru (lokal, tidak tersimpan).
- Builder kuesioner (di memori): 7 tipe soal, wajib/opsional, Likert 2-10 titik (label, nilai, arah, reverse), urut ulang, pratinjau, saklar publikasi.
- Alur responden: pengantar, persetujuan, soal satu per satu dengan validasi, halaman selesai.
- Logika skor Likert murni (`src/lib/scoring.ts`), belum dipakai UI.
- Lapisan data berbasis repository (`src/lib/data`) agar mudah diganti Supabase.

Hasil tugas paralel (manajemen seksi; pemutar musik, `/login`, dropdown profil) **tidak termasuk dalam snapshot yang diaudit**; perbarui daftar ini setelah penggabungan.

## Belum ada (Tahap 2)
- Supabase (basis data), autentikasi peneliti berbasis undangan, penyimpanan respons.
- Builder tersimpan + versi kuesioner; publikasi sungguhan.
- Tabel data, ekspor (CSV/XLSX), integrasi Google Sheets.
- Mesin analisis statistik (R) dan halaman analisis.
- Uji otomatis dan CI untuk typecheck/lint.

## Prasyarat
- Node.js 20 atau lebih baru (`node -v`), npm 10 atau lebih baru.
- Koneksi internet saat build (font Inter diunduh oleh `next/font/google`).

## Instalasi dan menjalankan
```bash
npm install
npm run dev        # buka http://localhost:3000/id/
```
Catatan: alamat `/` mengandalkan `public/index.html` untuk menuju `/id/`; saat `npm run dev` gunakan langsung `/id/` atau `/en/`.

Perintah lain: `npm run typecheck`, `npm run lint`, `npm run build` (hasil statis di folder `out/`).

## Deploy ke GitHub Pages
Aplikasi diekspor statis (`output: "export"`). Workflow `.github/workflows/pages.yml` membangun dan men-deploy setiap push ke `main`. Berkas ini dibuat manual lewat GitHub (berkas berawalan titik tidak ada di zip).

1. Settings → Pages → Source = **GitHub Actions**.
2. Setel `NEXT_PUBLIC_BASE_PATH` di `pages.yml` sama dengan nama repo, mis. `/Form-Skripsi-pt2`.
3. URL: `https://<user>.github.io/<nama-repo>/` (otomatis menuju `/id/`).

Lokal tidak perlu mengisi `NEXT_PUBLIC_BASE_PATH`.

Batasan ekspor statis: tanpa middleware, API route, cookies, atau headers; setiap halaman memanggil `setRequestLocale`; rute dinamis wajib `generateStaticParams`. Proyek buatan pengguna (lokal) tidak punya halaman detail/builder. Backend Tahap 2 kemungkinan mengharuskan pindah dari GitHub Pages (mis. Vercel).

## Struktur proyek
```
src/app/[locale]/        halaman per bahasa (beranda, dashboard/*, survey/[slug]/*)
src/components/ui/       primitif (Button, Card, Badge, Input), jangan diubah sembarangan
src/components/layout/   brand-mark, sidebar-nav, pengalih bahasa/tema, placeholder
src/components/providers/ ThemeProvider
src/features/projects/   daftar, form, dialog proyek
src/features/builder/    editor kuesioner + utilitas murni
src/features/survey/     alur responden (provider, soal, persetujuan, selesai)
src/config/              brand.ts (identitas produk), routes.ts
src/i18n/                routing, request, navigation (next-intl)
src/lib/                 scoring.ts, utils.ts, data/ (repository + mock)
src/types/               model TypeScript (siap dipetakan ke tabel)
messages/                id.json, en.json (teks antarmuka)
docs/                    arsitektur, keputusan, QA, daftar uji, catatan status
ai-context/              konteks untuk AI lain
public/index.html        pengalihan / → id/
```

## Konvensi
- Penjelasan dan dokumentasi: bahasa Indonesia; nama kode (variabel, fungsi, komponen): bahasa Inggris.
- Teks antarmuka hanya lewat `messages/*.json` (id dan en lengkap). Konten peneliti tidak diterjemahkan.
- Nama produk dari `src/config/brand.ts`; rute dari `src/config/routes.ts`.
- Data hanya lewat `src/lib/data`. Data demo wajib berlabel "Data demo".
- Konfigurasi ESLint ada di `package.json` (`eslintConfig`). Jika memakai Git lokal, buat `.gitignore` berisi: `node_modules`, `.next`, `out`, `.env*.local`, `next-env.d.ts`.

## Dokumentasi
`CLAUDE.md`, `AI_HANDOFF.md`, `CURRENT_STATUS.md`, `DEVELOPMENT_LOG.md`, `NEXT_TASKS.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/QA_REPORT.md`, `docs/TESTING_CHECKLIST.md`, `docs/PARALLEL_WORK.md`.
