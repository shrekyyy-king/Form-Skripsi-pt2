# Arsitektur

- `src/types`: model domain, siap dipetakan ke tabel Supabase.
- `src/lib/data`: antarmuka repository + implementasi mock. UI hanya memakai antarmuka; mengganti ke Supabase cukup menambah implementasi baru.
- `src/features/<fitur>`: komponen spesifik fitur. `src/components/ui`: primitif umum.
- i18n: next-intl, prefix `as-needed`, cookie `NEXT_LOCALE`.
- Tema: next-themes (class), token CSS di `globals.css`.
