# Arsitektur

## Lapisan
- `src/types`: model domain (Project, Questionnaire, Question, Section, RespondentResponse), siap dipetakan ke tabel Supabase.
- `src/lib/data`: antarmuka repository (`repositories.ts`) + implementasi mock (`mock/`). `index.ts` adalah satu-satunya tempat memilih implementasi; UI hanya memakai antarmuka, sehingga mengganti ke Supabase cukup menambah implementasi baru.
- `src/lib/auth`: antarmuka `AuthClient` + implementasi mock yang selalu menolak. Diganti di `src/lib/auth/index.ts` pada Tahap 2.
- `src/lib/scoring.ts`, `src/lib/stats.ts`: fungsi murni (tanpa React/akses data): reverse scoring, rata-rata, SD, Cronbach's alpha.
- `src/features/<fitur>`: komponen dan utilitas per fitur: `projects`, `builder` (editor, pratinjau, utilitas seksi murni), `survey` (alur responden, `section-utils` murni dipakai juga oleh builder), `data` (dataset + CSV), `music` (mesin Web Audio, hook, panel), `auth` (form login).
- `src/components/ui`: primitif umum (beku). `src/components/layout`: pengalih bahasa/tema, menu profil, sidebar, merek.
- `src/config`: `brand.ts` (nama produk), `routes.ts` (rute), `music.ts` (preset nada).

## Aliran data (Tahap 1)
Halaman server (`src/app/[locale]/...`) memanggil repository -> data demo -> komponen. Keadaan yang diubah pengguna (builder, daftar proyek, jawaban responden) hanya di memori React; hilang saat refresh. Jawaban responden ada di `SurveyProvider` (di layout `survey/[slug]`).

## i18n dan hosting statis
- next-intl dengan `localePrefix: "always"`: URL selalu `/id/...` atau `/en/...`. Bahasa tersimpan lewat URL, bukan cookie (situs statis tidak punya middleware). `/` dialihkan oleh `public/index.html`.
- Ekspor statis (`output: "export"`, `trailingSlash: true`, `basePath` dari `NEXT_PUBLIC_BASE_PATH`). Setiap page/layout async memanggil `setRequestLocale(locale)`; rute dinamis memakai `generateStaticParams`, sehingga proyek buatan runtime tidak punya halaman detail/builder statis.
- Tema: next-themes (kelas `dark`), token warna di `src/app/globals.css`.

## Batas Tahap 1 yang perlu diubah di Tahap 2
Pindah dari GitHub Pages ke hosting yang punya server (mis. Vercel) agar ada API/auth/middleware; builder dan responden membaca/menulis lewat repository yang sama; validasi jawaban juga di server.
