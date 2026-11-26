# CLAUDE.md — Aturan kerja proyek

Baca `AI_HANDOFF.md` dan `CURRENT_STATUS.md` lebih dulu.

## Aturan
- Penjelasan dan dokumentasi: bahasa Indonesia. Kode (variabel, fungsi, komponen): bahasa Inggris.
- Stack: Next.js App Router, TypeScript strict, Tailwind 3, shadcn/ui, next-intl, RHF + Zod.
- Tahap 1 = frontend + data mock. DILARANG membuat backend/Supabase/R sebelum diminta.
- Teks antarmuka hanya lewat `messages/*.json`. Isi kuesioner (konten peneliti) tidak diterjemahkan otomatis.
- Nama produk hanya dari `src/config/brand.ts`. Route dari `src/config/routes.ts`.
- Akses data hanya lewat repository di `src/lib/data` (antarmuka + implementasi mock) agar mudah diganti Supabase.
- Logika skor Likert berada di utilitas murni, bukan di komponen visual.
- Data demo harus berlabel jelas "Data demo".
- Jangan klaim sesuatu berfungsi jika belum dijalankan/diuji.
- Setelah tiap tugas: perbarui `CURRENT_STATUS.md`, `DEVELOPMENT_LOG.md`, `NEXT_TASKS.md`.
