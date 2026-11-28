# Keputusan
- Tailwind 3.4 (bukan 4) demi kompatibilitas shadcn/ui yang stabil.
- ESLint 8 + `.eslintrc.json` agar cocok dengan `next lint` di Next 15.
- `noUncheckedIndexedAccess` aktif: akses array harus menangani `undefined`.
- Tahap 1 di-host di GitHub Pages: ekspor statis, tanpa middleware, `localePrefix: "always"` (/id, /en). Bahasa tersimpan lewat URL. Setiap halaman memanggil `setRequestLocale`.
- Rute dinamis (mis. `/survey/[slug]`) perlu `generateStaticParams` selama masih statis; pindah ke Vercel saat backend dibangun.
- Tanpa berkas berawalan titik di paket: ESLint di `package.json`, tanpa `.gitignore`/`.devcontainer`; `.github/workflows/pages.yml` dibuat manual.
- Tanpa `src/app/layout.tsx` dan `src/app/page.tsx`: `[locale]/layout.tsx` adalah root layout. Pengalihan `/` ke `/id/` lewat `public/index.html` (meta refresh).
- (Audit 2026-11-27) Catatan koreksi: konfigurasi ESLint ada di `package.json` (`eslintConfig`), bukan `.eslintrc.json`. Bahasa tersimpan lewat URL (`localePrefix: "always"`), bukan cookie `NEXT_LOCALE`.
