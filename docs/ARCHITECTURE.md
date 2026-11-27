# Arsitektur

- `src/types`: model domain, siap dipetakan ke tabel Supabase.
- `src/lib/data`: antarmuka repository (`repositories.ts`) + implementasi mock (`mock/`). `index.ts` adalah titik tunggal akses; UI hanya memakai antarmuka, sehingga mengganti ke Supabase cukup menambah implementasi dan mengubah ekspor di `index.ts`.
- `src/features/<fitur>`: komponen spesifik fitur (`projects`, `builder`, `survey`). `src/components/ui`: primitif umum. `src/components/layout`: kerangka (sidebar, pengalih bahasa/tema).
- Logika murni (tanpa React) dipisahkan agar mudah diuji: `src/lib/scoring.ts`, `src/features/builder/builder-utils.ts`.
- i18n: next-intl, `localePrefix: "always"` (`/id`, `/en`), bahasa ditentukan lewat URL (tanpa cookie/middleware). Setiap halaman/layout memanggil `setRequestLocale`.
- Tema: next-themes (class), token CSS HSL di `globals.css`, dipetakan di `tailwind.config.ts`.
- Ekspor statis (`output: "export"`, `trailingSlash: true`, `basePath` dari `NEXT_PUBLIC_BASE_PATH`) untuk GitHub Pages. Rute dinamis memakai `generateStaticParams` dari repository.
- Alur data Tahap 1: server component membaca repository mock saat build → props ke komponen klien. Perubahan pengguna (proyek lokal, builder, jawaban survei) hanya di state klien dan hilang saat muat ulang.
- Status survei (`SurveyProvider`) berada di layout `survey/[slug]`, bertahan antar halaman survei selama tidak ada muat ulang atau ganti bahasa (lihat QA S-1).
