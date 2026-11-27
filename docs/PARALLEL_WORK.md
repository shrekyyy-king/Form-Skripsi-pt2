# Kerja Dibantu Beberapa Akun Claude

Proyek dikerjakan seperti biasa oleh Claude di chat utama ("integrator"). Sebagian tugas dikerjakan akun Claude lain secara paralel. Hasilnya dikirim kembali ke chat utama untuk digabung, lalu diunggah ke GitHub.

## Proyek singkat
"Research Platform" (nama sementara): kuesioner + analisis statistik dwibahasa (id default, en). Repo: https://github.com/shrekyyy-king/Form-Skripsi-pt2, tampil di GitHub Pages. Tahap 1 = frontend + data mock, tanpa backend. Pengguna tidak punya terminal: kode diserahkan sebagai berkas/zip, build berjalan di GitHub Actions, galat dikirim balik.

## Aturan teknis (sama seperti sebelumnya)
1. Ekspor statis (`output: "export"`): tanpa middleware/API route/cookies/headers. Setiap page/layout async memanggil `setRequestLocale(locale)`; rute dinamis wajib `generateStaticParams`.
2. TypeScript strict (`noUncheckedIndexedAccess`), tanpa `any`. Tailwind dengan token (bg-primary, text-muted-foreground). Komponen ui yang ada: Button, Card, Badge, Input.
3. Teks antarmuka lewat messages (id dan en lengkap). Konten peneliti tidak diterjemahkan.
4. Data hanya lewat `src/lib/data` (repository). Nama kode bahasa Inggris; komentar dan dokumen Indonesia.
5. Jangan membuat berkas berawalan titik. Jangan mengklaim sesuatu teruji bila belum dijalankan.

## Aturan kerja paralel
- Hanya ubah berkas milik tugas Anda (tabel di bawah). Butuh perubahan di berkas lain? Tulis sebagai catatan, jangan ubah.
- JANGAN edit `messages/id.json` dan `messages/en.json`. Tulis kunci baru di `docs/status/<nama>.messages.id.json` dan `<nama>.messages.en.json`: objek dengan nama namespace di level atas (mis. `{"builder": {...}}`), hanya kunci yang Anda tambah. Integrator menggabungkannya.
- JANGAN edit CURRENT_STATUS.md, DEVELOPMENT_LOG.md, NEXT_TASKS.md. Tulis catatan di `docs/status/<nama>.md`.
- Hasil akhir: zip berisi HANYA berkas baru/berubah dengan struktur folder utuh (path dari akar repo), ditambah ringkasan: daftar berkas, cara uji, yang belum selesai.

## Kepemilikan berkas
| Tugas | Berkas |
|---|---|
| Utama (proyek) | `src/features/projects/**`, `dashboard/page.tsx`, `dashboard/projects/**`, `src/lib/data/**`, `src/i18n/**`, config root |
| Seksi | `src/types/index.ts` (hanya menambah), `src/features/builder/**`, `src/features/survey/**`, `fixtures-questionnaire.ts`, `dashboard/builder/**`, rute survey kecuali layout |
| Musik, login, profil | `src/features/music/**`, `src/features/auth/**`, `src/lib/auth/**`, `src/config/music.ts`, `components/layout/profile-menu.tsx`, `dashboard/layout.tsx`, `survey/[slug]/layout.tsx`, `src/app/[locale]/login/**` |
| QA dan dokumen (terakhir) | `README.md`, `docs/**`, berkas status di akar |
| Beku | `src/components/ui/**`, `brand.ts`, `routes.ts`, `common` dan `nav` di messages |
