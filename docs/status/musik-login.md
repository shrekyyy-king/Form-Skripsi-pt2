# Catatan: Musik, Login, Profil (musik-login)

## Berkas baru
- `src/config/music.ts`: daftar preset nada (placeholder pemilih lagu), batas volume, kunci localStorage.
- `src/features/music/ambient-engine.ts`: mesin sintesis Web Audio (akor sinus/segitiga, low-pass, "napas" volume lambat). Tanpa berkas audio dan tanpa URL musik.
- `src/features/music/use-ambient-player.ts`: hook status pemutar (putar/jeda, volume, bisu, lagu, galat).
- `src/features/music/music-player.tsx`: tombol ikon di header + panel kendali.
- `src/lib/auth/auth-client.ts`, `mock-auth-client.ts`, `index.ts`: antarmuka `AuthClient` dan implementasi mock yang selalu menolak.
- `src/features/auth/login-schema.ts`, `login-form.tsx`: form email + kata sandi (react-hook-form + zod).
- `src/app/[locale]/login/page.tsx`: halaman /login.
- `src/components/layout/profile-menu.tsx`: menu profil.
- `docs/status/musik-login.messages.id.json` dan `.en.json`: namespace `music`, `login`, `profile`.

## Berkas diubah (hanya penyisipan)
- `src/app/[locale]/survey/[slug]/layout.tsx`: impor dan `<MusicPlayer />` setelah `<ThemeSwitcher />`.
- `src/app/[locale]/dashboard/layout.tsx`: chip "Profil (demo)" diganti `<ProfileMenu />`; impor `User` dan `getTranslations` dihapus karena tidak terpakai lagi.

## Perilaku
- **Musik**: tidak pernah autoplay; AudioContext baru dibuat saat tombol Putar ditekan. Jika browser menolak (`resume()` gagal atau konteks tetap `suspended`), muncul pesan galat dan tombol bisa ditekan lagi. Panel hanya muncul bila dibuka dan melayang di bawah header, jadi tidak menutupi soal. Indikator "sedang diputar" memakai `motion-safe:animate-pulse` (menghormati prefers-reduced-motion). Volume disimpan di localStorage (`rp.music.volume`) dengan try/catch. Ganti lagu = crossfade.
- **Login**: tanpa registrasi publik (teks akses lewat undangan). `LoginForm` menerima prop `client` (default `authClient`), sehingga Tahap 2 cukup mengganti isi `src/lib/auth/index.ts`. Mock menolak tanpa membaca, mengirim, atau menyimpan kredensial; kolom kata sandi dikosongkan setelah penolakan.
- **Menu profil**: `aria-haspopup`, `aria-expanded`, `aria-controls`; Escape dan klik luar menutup; panah atas/bawah, Home, End berpindah item; ArrowDown di tombol membuka menu; Tab menutup dan mengembalikan fokus ke tombol. Item "Keluar" `aria-disabled` (demo).

## Cara uji
1. Gabungkan kedua berkas pesan ke `messages/id.json` dan `messages/en.json` (objek level atas: `music`, `login`, `profile`).
2. `npm run typecheck`, `npm run lint`, `npm run build`.
3. Buka `/id/survey/demo-servqual`: tombol ikon musik di header; buka panel, tekan Putar, coba volume, bisu, ganti lagu, Escape, klik luar.
4. Buka `/id/login`: kirim form kosong (galat validasi), lalu form valid (pesan "belum aktif").
5. Buka `/id/dashboard`: menu profil, uji dengan keyboard.

## Yang sudah diperiksa
Di salinan sementara dengan pesan sudah digabung: `tsc --noEmit` bersih, `next lint` bersih, `next build` (ekspor statis) berhasil dan menghasilkan `/id/login` dan `/en/login`. Pada build itu font Google di-stub karena sandbox tanpa akses internet ke Google Fonts; perubahan stub itu TIDAK ada di zip.

## Belum diuji (butuh browser sungguhan)
- Bunyi audio, fade, crossfade, dan penolakan `play()` di Chrome, Firefox, dan terutama Safari/iOS.
- Interaksi keyboard dan pembaca layar pada menu profil dan panel musik.
- Tampilan panel di layar sangat sempit (diatur `max-w-[calc(100vw-2rem)]`, belum dilihat langsung).
- Apakah musik tetap berjalan saat berpindah halaman survey (layout persisten, seharusnya ya).

## Catatan untuk integrator
- Kunci `common.profileDemo` sekarang tidak dipakai; `common` termasuk berkas beku, jadi dibiarkan. Hapus bila mau.
- Tidak ada dependensi baru. `routes.login` sudah ada di `routes.ts` (tidak diubah).
- Tautan "Login" di menu profil mengarah ke `/login`; bila nanti ada sesi, item itu bisa disembunyikan saat sudah masuk.
