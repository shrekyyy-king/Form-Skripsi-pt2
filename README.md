# Research Platform (nama sementara)

Aplikasi web dwibahasa (Indonesia/Inggris) untuk peneliti dan mahasiswa: membuat kuesioner (termasuk skala Likert yang fleksibel), mengumpulkan jawaban responden, melihat data, dan menghitung statistik dasar (rata-rata, simpangan baku, Cronbach's alpha). Dirancang sebagai proyek jangka panjang, bukan untuk satu skripsi saja.

**Status: Tahap 1 selesai di sisi kode (frontend + data demo, tanpa backend).** Tidak ada data nyata yang tersimpan: semua yang Anda isi atau ubah hilang saat halaman dimuat ulang. Detail status: `CURRENT_STATUS.md`. Hasil audit: `docs/QA_REPORT.md`.

## Fitur yang sudah ada (Tahap 1)
- Dua bahasa (Indonesia bawaan, Inggris), mode terang/gelap, tampilan responsif.
- Dashboard peneliti: ringkasan, daftar proyek (cari, filter, buat proyek demo), detail proyek, Respons, Data (ekspor CSV), Analisis, Integrasi (placeholder), Pengaturan.
- Builder kuesioner: 7 tipe soal, wajib/opsional, urutan, seksi, mode navigasi per soal atau per seksi, pratinjau. Likert: jumlah titik bebas, label, nilai, arah, reverse scoring.
- Alur responden: pengantar, persetujuan, soal (progres, validasi), selesai.
- Pemutar musik latar opsional (nada ambient disintesis di browser; tidak pernah autoplay).
- Halaman `/login` (hanya tampilan; selalu menolak) dan menu profil.
- Statistik murni di `src/lib/stats.ts` dan `src/lib/scoring.ts`.

## Belum ada (Tahap 2, hanya atas instruksi eksplisit pemilik proyek)
Penyimpanan data, login sungguhan (undangan, tanpa pendaftaran publik), builder yang tersambung ke halaman responden, Supabase, versi kuesioner, ekspor Excel/SPSS, Google Sheets, mesin R. Catatan dan rekomendasi: `docs/FINAL_NOTES.md`.

## Prasyarat
- Node.js 20 atau lebih baru (`node -v`) dan npm 10 atau lebih baru.
- Akun GitHub. Anda tidak wajib punya terminal: lihat bagian GitHub Pages.

## Menjalankan di komputer (opsional)
```bash
npm install
npm run dev          # buka http://localhost:3000/id
npm run typecheck    # periksa tipe
npm run lint         # periksa gaya kode
npm run build        # hasil statis di folder out/
```
Catatan: `npm run build` mengunduh font Inter dari Google; butuh internet.

## Deploy ke GitHub Pages (tanpa terminal)
Situs diekspor sebagai berkas statis (`output: "export"`) dan dipublikasikan oleh GitHub Actions setiap ada perubahan di cabang `main`.

1. **Repo harus Public** (untuk akun gratis).
2. Unggah isi proyek lewat web GitHub: **seret folder utuh** (bukan isinya). Sebelum "Commit", periksa daftar unggahan: path harus terlihat seperti `src/features/...`, bukan nama berkas lepas di akar seperti `index (4).ts`.
3. Buat berkas workflow lewat web: **Add file → Create new file**, ketik nama `.github/workflows/pages.yml` (mengetik garis miring otomatis membuat folder), tempel isi di bawah, lalu Commit. Berkas berawalan titik sulit diunggah lewat seret-lepas, jadi dibuat manual.
4. **Settings → Pages → Build and deployment → Source = GitHub Actions.**
5. Buka tab **Actions**, tunggu workflow hijau (centang). Alamat situs: `https://<nama-pengguna>.github.io/<nama-repo>/` (contoh: `https://shrekyyy-king.github.io/Form-Skripsi-pt2/`), otomatis menuju `/id/`.
6. Bila merah: buka run yang gagal, klik langkah **Run npm run build**, salin log, kirim ke Claude/Akun-1.

Isi `pages.yml` (contoh standar. **Jika repo Anda sudah punya `pages.yml` yang terbukti hijau, jangan diganti.** Isi di bawah belum dijalankan terhadap repo Anda):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - name: Run npm run build
        run: npm run build
        env:
          # /<nama-repo> otomatis, supaya tautan dan aset benar di sub-folder GitHub Pages
          NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
Catatan: `cache: npm` sengaja tidak dipakai karena repo belum punya `package-lock.json` (lihat Q-22 di QA_REPORT).

## Struktur proyek
```
src/app/[locale]/      halaman per bahasa (id/en): beranda, login, survey/[slug]/..., dashboard/...
src/components/ui/     komponen dasar (Button, Card, Badge, Input), jangan diubah sembarangan
src/components/layout/ pengalih bahasa/tema, menu profil, sidebar, merek
src/features/          modul per fitur: projects, builder, survey, data, music, auth
src/lib/               stats.ts, scoring.ts, data/ (repository + data demo), auth/ (antarmuka login)
src/config/            brand.ts (nama produk), routes.ts (semua rute), music.ts
src/i18n/              pengaturan next-intl
src/types/             model data (siap dipetakan ke tabel database)
messages/              id.json dan en.json (semua teks antarmuka)
public/index.html      pengalih "/" ke "/id/"
docs/                  dokumentasi (lihat di bawah)
```
Mengganti nama produk: ubah `src/config/brand.ts`.

## Aturan penting (ringkas; lengkap di `CLAUDE.md`)
- Teks antarmuka hanya lewat `messages/*.json` (id dan en harus sama kuncinya). Isi kuesioner tidak diterjemahkan otomatis.
- Data hanya lewat `src/lib/data`; logika skor/statistik di utilitas murni, bukan di komponen.
- Situs statis: tanpa middleware/API route/cookies. Setiap halaman memanggil `setRequestLocale(locale)`; rute dinamis butuh `generateStaticParams`.
- Jangan mengklaim sesuatu berfungsi sebelum diuji.

## Dokumentasi
| Berkas | Isi |
|---|---|
| `CURRENT_STATUS.md`, `NEXT_TASKS.md`, `DEVELOPMENT_LOG.md` | status, tugas, riwayat |
| `AI_HANDOFF.md`, `CLAUDE.md`, `docs/LESSONS_LEARNED.md` | panduan untuk AI/kolaborator baru |
| `docs/BRIEF_TAHAP_1.md`, `docs/DECISIONS.md`, `docs/ARCHITECTURE.md` | kebutuhan, keputusan, arsitektur |
| `docs/PARALLEL_WORK.md` | cara kerja beberapa akun Claude |
| `docs/QA_REPORT.md`, `docs/TESTING_CHECKLIST.md`, `docs/proposed-fixes/`, `docs/qa-scripts/` | audit, uji manual, perbaikan usulan, skrip uji logika |
| `docs/FINAL_NOTES.md` | catatan akhir Tahap 1 + rekomendasi fase berikutnya (gabungan `docs/status/*.md`) |
