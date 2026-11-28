# Checklist Kepatuhan terhadap Brief Tahap 1

Disusun oleh Akun-2 dari membaca kode di paket "Form-Skripsi-lengkap-terbaru" (tanggal 2026-11-28), butir demi butir dari `docs/BRIEF_TAHAP_1.md`.

## Cara membaca

- **Status**: Selesai / Sebagian / Belum.
  - *Selesai*: ada di kode dan sesuai butir brief.
  - *Sebagian*: ada tetapi ada celah yang disebut di kolom Catatan.
  - *Belum*: tidak ada.
- Tanda **(A2)** = status ini bergantung pada perubahan Akun-2 yang ada di paket ini (lihat `docs/status/akun2.md`). Perubahan itu BELUM dijalankan di Next.js.
- **Pengujian**: hanya yang tercantum di `CURRENT_STATUS.md` sebagai "Terbukti jalan" (fondasi, tema, i18n, dashboard, daftar proyek, alur responden dasar, builder dasar, dialog buat proyek, detail proyek) pernah dibangun dan diuji pengguna di GitHub Pages. Selebihnya (seksi, musik, login, profil, respons, data, analisis, integrasi, pengaturan, dan semua perubahan Akun-2) **hanya dibaca, belum diuji**. Kolom Status menilai kelengkapan terhadap brief, bukan hasil uji.
- Yang saya tidak bisa pastikan dari kode (tampilan nyata, bunyi audio, pembaca layar) ditandai "perlu uji manual".

Ringkasan (dihitung dari baris tabel di bawah, termasuk 16 baris rute): 102 baris, 87 Selesai, 14 Sebagian, 1 Belum. Angka Selesai sudah memasukkan perubahan Akun-2 yang belum diuji.

## 1. Produk

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Aplikasi web dwibahasa | Selesai | `src/i18n/routing.ts`, `messages/id.json`, `messages/en.json` | |
| Untuk peneliti dan mahasiswa; proyek jangka panjang | Selesai | struktur `src/features/*`, `src/lib/data` | Arsitektur modular; bukan klon Google Forms (ada analisis, reverse scoring, seksi). |
| Banyak proyek dan kuesioner yang dapat dikonfigurasi, tidak di-hardcode untuk satu skripsi | Sebagian | `src/lib/data/mock/fixtures*.ts`, `src/features/builder/*` | Builder dan daftar proyek generik, tetapi semua data masih fixture dan hasil builder tidak disimpan atau sampai ke responden (butuh Tahap 2). Halaman Respons/Data/Analisis memakai kuesioner pertama saja (`src/features/data/load-demo.ts`). |

## 2. Pengguna

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Peneliti: dashboard privat | Sebagian | `src/app/[locale]/dashboard/*`, `src/app/[locale]/login/page.tsx` | Dashboard tidak dilindungi apa pun: situs statis tidak bisa melindungi rute, dan login mock selalu menolak (`src/lib/auth/mock-auth-client.ts`). Wajar untuk Tahap 1; Tahap 2 (lihat `PHASE2_PLAN.md`). |
| Pendaftaran lewat undangan, tanpa registrasi publik | Selesai | `src/app/[locale]/login/page.tsx` (teks `login.inviteOnly`), tidak ada rute register | Pembatasan sungguhan baru di Tahap 2. |
| Responden tanpa akun, lewat URL publik | Selesai | `src/app/[locale]/survey/[slug]/*` | Hanya slug dari `questionnaireRepository.listSlugs()` (`generateStaticParams`). |

## 3. Desain

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Modern Minimalist SaaS | Selesai | `src/app/globals.css`, `tailwind.config.ts`, `src/components/ui/*` | Perlu penilaian visual manual. |
| Putih hangat | Selesai | `--background: 40 25% 98%` | |
| Hijau sage sebagai primer | Selesai | `--primary: 142 16% 38%` **(A2)** | Dari 40% ke 38% lightness demi kontras (lihat catatan Akun-2). |
| Biru lembut sebagai sekunder | Sebagian | `--secondary: 210 40% 92%` | Token ada, tetapi tidak dipakai di komponen mana pun (`bg-secondary` tidak muncul di `src/` di luar definisi). Sengaja tidak saya paksa agar tidak mengubah tampilan. |
| Arang untuk teks | Selesai | `--foreground: 215 18% 16%` | |
| Font Inter | Selesai | `src/app/[locale]/layout.tsx` (`next/font/google`), `tailwind.config.ts` | Butuh internet saat build (Google Fonts); aman di GitHub Actions. |
| Kartu membulat, border halus, bayangan terbatas | Selesai | `--radius: 0.75rem`, `src/components/ui/card.tsx`, `boxShadow.soft` | Border sangat halus (kontras ±1,3:1): lihat bagian Aksesibilitas. |
| Hindari gradien/glassmorphism/hiasan/animasi berlebihan | Selesai | `grep` gradient/blur di `src/` kosong | Animasi hanya transisi soal, ikon selesai, indikator musik (`motion-safe`). |
| Mode terang dan gelap | Selesai | `.dark` di `globals.css`, `src/components/layout/theme-switcher.tsx`, `next-themes` | Kontras gelap diperbaiki **(A2)**; `color-scheme: dark` ditambahkan **(A2)**. Perlu uji manual. |
| Responsif desktop/tablet/mobile | Sebagian **(A2)** | `src/app/[locale]/dashboard/layout.tsx` (sidebar → nav horizontal), `DataTable` `overflow-x-auto` | Header dashboard berpotensi meluber di layar ≤360px; diperbaiki **(A2)** tetapi perlu uji di ponsel sungguhan. |
| Token dan komponen dapat dipakai ulang | Sebagian | `src/components/ui/{button,card,badge,input}.tsx` | Hanya 4 komponen. `<select>` dan `<textarea>` ditulis ulang dengan kelas yang diulang di ±10 tempat; header halaman (judul + lencana) juga diulang. Usulan: komponen `Select`, `Textarea`, `PageHeader` (bukan refactor kecil, jadi tidak dikerjakan). |

## 4. Bahasa

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Indonesia default, Inggris alternatif | Selesai | `src/i18n/routing.ts` (`defaultLocale: "id"`), `public/index.html` | |
| Pengalih bahasa terlihat | Selesai | `src/components/layout/language-switcher.tsx` di header dashboard, survei, login, beranda | |
| Pilihan tersimpan | Sebagian **(A2)** | `language-switcher.tsx` kini menyimpan ke `localStorage` (`rp.locale`) | Sebelumnya hanya lewat URL; membuka alamat akar selalu ke `/id/`. Pemulihan saat membuka akar butuh salinan satu berkas: `docs/status/akun2.public-index.proposed.html` → `public/index.html` (di luar wewenang Akun-2). Tanpa itu, penyimpanan belum berdampak. |
| Seluruh teks antarmuka di berkas locale | Sebagian | `messages/*.json`; pencarian sederhana (`grep`) tidak menemukan kalimat literal di `src/**/*.tsx` (bukan pemeriksaan menyeluruh) | Pengecualian: nilai awal builder berbahasa Indonesia di `src/features/builder/builder-utils.ts` ("Sangat tidak setuju…", "Opsi 1"); itu isi untuk diedit peneliti, tetapi tetap tertanam di kode. Juga `title` di `public/index.html`. |
| Isi kuesioner tidak diterjemahkan otomatis | Selesai | konten di `fixtures-questionnaire.ts` hanya satu bahasa | |

## 5. Rute

Rute peneliti berada di bawah prefiks `/dashboard` (mis. `/dashboard/projects`), bukan di akar seperti tertulis ringkas di brief. Dianggap sesuai maksud brief.

| Rute | Status | Bukti |
|---|---|---|
| `/` | Selesai | `src/app/[locale]/page.tsx`, `public/index.html` (alihan ke `id/`) |
| `/login` | Selesai | `src/app/[locale]/login/page.tsx` |
| `/survey/[slug]` | Selesai | `src/app/[locale]/survey/[slug]/page.tsx` |
| `/consent` | Selesai | `.../consent/page.tsx` |
| `/questions` | Selesai | `.../questions/page.tsx` |
| `/complete` | Selesai | `.../complete/page.tsx` |
| `/dashboard` | Selesai | `src/app/[locale]/dashboard/page.tsx` |
| `/projects` | Selesai | `dashboard/projects/page.tsx` |
| `/projects/new` | Selesai | `dashboard/projects/new/page.tsx` |
| `/projects/[id]` | Selesai | `dashboard/projects/[id]/page.tsx` |
| `/builder/[id]` | Selesai | `dashboard/builder/[id]/page.tsx` |
| `/responses` | Selesai | `dashboard/responses/page.tsx` |
| `/data` | Selesai | `dashboard/data/page.tsx` |
| `/analysis` | Selesai | `dashboard/analysis/page.tsx` |
| `/integrations` | Selesai | `dashboard/integrations/page.tsx` |
| `/settings` | Selesai | `dashboard/settings/page.tsx` |

Catatan lintas rute: rute dinamis memakai `generateStaticParams`, sehingga hanya proyek/slug fixture yang punya halaman; proyek yang dibuat di dialog ("lokal") tidak punya halaman detail/builder (sudah diberi label `projects.local`).

## 6. Dashboard

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Sidebar | Selesai | `src/components/layout/sidebar-nav.tsx`, `dashboard/layout.tsx` | Mobile: navigasi horizontal yang bisa digulir. |
| Topbar | Selesai | `dashboard/layout.tsx` | |
| Sapaan | Selesai | `dashboard.greeting` | Sapaan generik ("Selamat datang"), tanpa nama (belum ada pengguna). |
| Ringkasan proyek | Selesai | kartu "Proyek terbaru" di `dashboard/page.tsx` | |
| Total proyek / responden / kuesioner aktif | Selesai | `dashboard/page.tsx` (`stats`) | Total responden = jumlah `respondentCount` fixture (340); tidak sama dengan 12 respons di halaman Respons (keduanya demo). |
| Aktivitas terbaru | Selesai | `activityRepository.listRecent(5)` | Pesan kosong ditambah **(A2)**. |
| Proyek terbaru | Selesai **(A2)** | `dashboard/page.tsx` | **Bug ditemukan dan diperbaiki**: sebelumnya 3 proyek pertama menurut urutan array (p1, p2, p3), bukan menurut tanggal; kini diurutkan `createdAt` menurun (p4, p2, p1). |
| Tombol aksi cepat | Selesai **(A2)** | `dashboard/page.tsx` | Sebelumnya hanya satu tombol. Kini: Proyek baru, Buka builder (proyek terbaru), Lihat respons, Lihat analisis, Lihat semua proyek. |
| Pengalih bahasa dan tema | Selesai | `language-switcher.tsx`, `theme-switcher.tsx` | |
| Menu profil | Selesai | `src/components/layout/profile-menu.tsx` | Keyboard dan ARIA sudah ada di kode; perlu uji manual. Di layar sempit kini hanya ikon **(A2)**. |
| Data demo berlabel jelas | Selesai **(A2)** | lencana `demoNotice` di dashboard, proyek, respons, data, analisis | Detail proyek, intro, dan persetujuan survei sebelumnya tanpa label; ditambah **(A2)**. |

## 6a. Proyek

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Daftar dan kartu proyek | Selesai | `src/features/projects/project-list.tsx` | |
| Dialog buat proyek | Selesai | `create-project-dialog.tsx` (elemen `<dialog>`), `project-form.tsx` (RHF + Zod) | Proyek hanya di memori halaman. |
| Judul, deskripsi, status, tanggal, status kuesioner | Selesai | `project-list.tsx`, `projects/[id]/page.tsx` | |
| Cari dan filter | Selesai | `project-list.tsx` | Cari menurut judul saja; filter menurut status proyek (bukan status kuesioner). |
| Model TypeScript siap Supabase | Sebagian | `src/types/index.ts`, `src/lib/data/repositories.ts` | Tipe dan repository bersih, tetapi repository hanya-baca (tanpa create/update) dan tipe belum mengenal versi kuesioner, pemilik, atau anggota. Dibahas di `PHASE2_PLAN.md`. |
| Pesan kosong | Selesai **(A2)** | `projects.empty`, `projects.emptyAll` | Dulu "belum ada proyek" dan "tidak ada yang cocok" memakai pesan sama. |

## 7. Builder

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Judul dan deskripsi kuesioner | Selesai | `src/features/builder/builder-editor.tsx` | |
| Seksi | Selesai | `builder-editor.tsx`, `section-utils.ts` (builder dan survey) | Diuji logika murninya dengan skrip; UI belum diuji. |
| Editor soal | Selesai | `question-editor.tsx` | |
| 7 tipe soal | Selesai | `questionTypes` di `builder-utils.ts` | Likert, pilihan ganda, kotak centang, jawaban singkat, panjang, angka, dropdown. |
| Wajib | Selesai | `question-editor.tsx` (`required`) | |
| Urutan | Selesai | tombol naik/turun | Tanpa seret-dan-lepas. |
| Pratinjau | Selesai | `builder-preview.tsx` | Per layar dan semua soal. |
| Publikasi | Sebagian | kotak centang `published` di `builder-editor.tsx` | Hanya di memori; tidak mengubah status proyek atau responden. |
| Likert: jumlah titik bebas | Selesai | `createLikertConfig` (2–10 titik) | "Bebas" dibatasi 2–10. |
| Likert: label, nilai, deskripsi | Selesai | `question-editor.tsx` | |
| Likert: arah | Selesai | `direction` ascending/descending | |
| Likert: reverse scoring | Selesai | `reverseScored` | |
| Skor tidak di komponen visual | Selesai **(A2)** | `src/lib/scoring.ts`, `src/lib/stats.ts`, `src/features/data/dataset.ts`, `src/features/data/item-analysis.ts` | Halaman Analisis tadinya merakit matriks skor dan statistik di dalam file halaman; dipindah ke fungsi murni `analyzeLikertItems` dan hasilnya diuji sama persis dengan logika lama pada data demo. |

## 8. Responden

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Pengantar: judul, deskripsi, peneliti, estimasi waktu, mulai | Selesai | `survey/[slug]/page.tsx` | |
| Persetujuan: sukarela, privasi, setuju/tolak | Selesai | `src/features/survey/consent-view.tsx` | Catatan "mode demo" ditambah **(A2)**: pernyataan privasi tanpa itu menyesatkan karena jawaban tidak disimpan. |
| Soal satu per layar (default) | Selesai | `question-flow.tsx`, `section-utils.ts` | |
| Opsional per seksi | Selesai | `navigationMode: "perSection"` | Demo `demo-servqual` diset per seksi. |
| Progres | Selesai | `question-flow.tsx` | |
| Sebelumnya/berikutnya | Selesai | `question-flow.tsx` | |
| Validasi wajib | Selesai | `validatePage` di `section-utils.ts` | |
| Transisi halus | Selesai | `framer-motion`, menghormati `prefers-reduced-motion` | |
| Mobile-first | Selesai | `survey/[slug]/layout.tsx` (`max-w-2xl p-4`) | Header survei diberi `gap` dan `min-w-0` **(A2)**. Perlu uji ponsel. |
| Kuesioner tanpa soal | Selesai **(A2)** | `question-flow.tsx` | Dulu layar kosong; kini pesan dan tombol kembali. |
| Selesai: konfirmasi, terima kasih, animasi, kontak opsional | Selesai | `complete-view.tsx` | |
| Desain netral, tanpa interaksi yang memengaruhi tafsir butir | Selesai | `question-input.tsx` | Hanya penilaian membaca kode: tidak ada nilai awal terpilih dan tidak ada warna per opsi. Perlu uji manual. |

## 9. Musik opsional

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Tidak autoplay | Selesai | `use-ambient-player.ts` (AudioContext baru dibuat saat Putar) | Perlu uji di Safari/iOS. |
| Putar/jeda | Selesai | `music-player.tsx` | |
| Volume | Selesai | `music-player.tsx` (slider), disimpan di localStorage | |
| Bisu | Selesai | `music-player.tsx` | |
| Pemilih lagu placeholder | Selesai | `src/config/music.ts` (3 preset) | |
| Responsif | Sebagian | `max-w-[calc(100vw-2rem)]` | Belum dilihat di layar sempit. |
| Menangani pembatasan browser | Selesai | galat `blocked`/`unsupported` | Perlu uji nyata. |
| Hanya aset orisinal/berlisensi | Selesai | nada disintesis lewat Web Audio, tanpa berkas audio | |

## 10. Arsitektur siap-masa-depan

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Pemisahan UI, fitur, tipe, util, i18n, akses data, konfigurasi | Selesai | `src/components`, `src/features`, `src/types`, `src/lib`, `src/i18n`, `src/lib/data`, `src/config` | |
| Titik ganti Supabase | Selesai | `src/lib/data/index.ts`, `src/lib/auth/index.ts` | Antarmuka `AuthClient` baru punya `signIn`; perlu `signOut`/sesi nanti. |
| Versi kuesioner | Belum | tidak ada di `src/types/index.ts` | Dirancang di `PHASE2_PLAN.md`. |
| Respons | Selesai | `src/types/response.ts`, `ResponseRepository` | Hanya baca. |
| Ekspor | Selesai (CSV) | `export-csv-button.tsx`, `toCsv` | Excel dan SPSS/R berupa tombol nonaktif berlabel "segera". |
| Google Sheets, mesin R, job analisis | Sebagian | `integrations/page.tsx` | Hanya kartu "Belum aktif"; tanpa model data untuk job. Memang tidak boleh diimplementasi di Tahap 1. |

## 11. Aturan

| Butir | Status | Bukti | Catatan |
|---|---|---|---|
| Jangan overengineer | Selesai | — | Pengecualian kecil: dependensi `recharts` terpasang di `package.json` tetapi tidak dipakai (grafik memakai CSS). |
| Keadaan loading | Sebagian **(A2)** | `dashboard/loading.tsx` | Situs statis hampir tanpa waktu muat data; hanya jaring pengaman saat navigasi klien. |
| Keadaan kosong | Selesai **(A2)** | dashboard (proyek, aktivitas), daftar proyek, responden tanpa soal, Respons/Data/Analisis | |
| Keadaan galat | Sebagian **(A2)** | `src/app/[locale]/error.tsx`, `login-form.tsx`, validasi form | Batas galat render ada. 404 di GitHub Pages TIDAK terlokalisasi (lihat risiko di `akun2.md`). |
| HTML semantik | Selesai | `header`, `main`, `nav`, `section`, `dl`, `fieldset/legend`, `table/th scope` | |
| Aksesibel | Sebagian **(A2)** | label/ARIA di form, menu, pemutar; cincin fokus global **(A2)**; kontras diperbaiki **(A2)** | Batas yang diketahui: border input ±1,3:1 (kurang dari 3:1 yang disarankan WCAG 1.4.11) karena pilihan desain "border halus"; belum diuji dengan pembaca layar. |
| Tidak mengklaim sesuatu berfungsi bila belum diuji | Selesai | dokumen status | Audit ini mengikuti aturan yang sama. |
| Tahap 2 hanya atas instruksi eksplisit | Selesai | tidak ada kode Supabase/jaringan di `src/` | `PHASE2_PLAN.md` hanya rencana. |

## Daftar celah yang masih terbuka (urut kepentingan)

1. Semua yang bertanda (A2) dan paket seksi/musik/login/data belum pernah dibangun: tahap berikutnya adalah build GitHub dan uji manual.
2. Pilihan bahasa baru benar-benar dipulihkan bila `public/index.html` diganti (usulan tersedia).
3. 404 terlokalisasi di GitHub Pages belum ada (risiko build; lihat `akun2.md`).
4. Komponen `Select`/`Textarea`/`PageHeader` belum ada (pengulangan kelas).
5. Token `secondary` belum dipakai; border input rendah kontras (keputusan desain yang perlu Anda putuskan).
6. Tahap 2: semua yang butuh penyimpanan dan autentikasi nyata.
