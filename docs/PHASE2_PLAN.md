# Rencana Tahap 2 (backend)

**Status dokumen: RENCANA. Tidak ada kode, tidak ada yang dijalankan.** Sesuai `CLAUDE.md` dan brief, Tahap 2 baru boleh dikerjakan atas instruksi eksplisit pengguna. Dokumen ini dibuat agar keputusan besar sudah dipikirkan saat instruksi itu datang.

Nama produk, nama paket, dan batas gratis layanan pihak ketiga dalam dokumen ini adalah **contoh dan ingatan umum**, bukan hasil pengecekan hari ini. Sebelum memutuskan, periksa ketentuan dan harga terbaru masing-masing layanan.

## 1. Titik awal: apa yang sudah siap, apa yang belum

Siap (Tahap 1):
- Dua "sambungan" yang sengaja dibuat untuk diganti: `src/lib/data/index.ts` (repository data) dan `src/lib/auth/index.ts` (klien autentikasi).
- Model domain di `src/types` (Project, Questionnaire, Section, Question, LikertConfig, RespondentResponse) dan logika murni (`src/lib/scoring.ts`, `src/lib/stats.ts`, `src/features/data/dataset.ts`, `item-analysis.ts`, `src/features/survey/section-utils.ts`).

Belum / harus diubah:
- Repository **hanya baca** (`list`, `getById`, `getBySlug`, `listByQuestionnaire`). Belum ada simpan, ubah, hapus, publikasi, kirim respons.
- Tidak ada konsep **versi kuesioner**, pemilik proyek, anggota tim, atau status kirim respons.
- Situs diekspor statis ke GitHub Pages: tidak ada server, middleware, route handler, atau cookie. Halaman dinamis hanya untuk slug/id yang sudah ada saat build (`generateStaticParams`).
- `AuthClient` baru punya `signIn` (mock yang selalu menolak).

## 2. Gambaran arsitektur sasaran

```
Peneliti (browser) ──► Next.js (server, hosting dinamis) ──► Supabase: Postgres + Auth
Responden (browser) ─►        │                                (RLS aktif di semua tabel)
                              ├──► Penyimpanan berkas (ekspor)   
                              ├──► Google Sheets API (sinkron satu arah)
                              └──► Layanan R (HTTP, terpisah) ◄── job analisis
```

Prinsip:
1. **Postgres adalah sumber kebenaran**; Google Sheets dan berkas ekspor hanyalah salinan.
2. **Semua akses data peneliti lewat RLS**; kunci "service role" hanya di server dan hanya untuk tugas yang memang perlu melewati RLS (mengirim undangan, menerima respons publik, memanggil layanan R).
3. UI tidak tahu Supabase: ia memanggil repository dan `AuthClient`. Penggantian terjadi di dua berkas sambungan di atas.
4. Tidak membuat dua jalur logika skor: skor Likert tetap dihitung di fungsi murni TypeScript, dan layanan R menerima data mentah plus konfigurasi.

## 3. Strategi hosting

**Masalah**: GitHub Pages hanya melayani berkas statis. Tahap 2 butuh (a) halaman untuk kuesioner dan proyek yang dibuat saat berjalan (slug baru tidak ada saat build), (b) tempat menyimpan rahasia (kunci server), (c) penerima kiriman respons, (d) perlindungan rute dashboard. Semuanya butuh server.

| Opsi | Cocok bila | Kekurangan |
|---|---|---|
| **A. Next.js di host server (mis. Vercel)** | Pengguna tanpa terminal: sambung repo GitHub, deploy otomatis, variabel lingkungan lewat dasbor web | Paket gratis umumnya untuk penggunaan non-komersial dengan batas; periksa ketentuan. Keluar dari "hanya GitHub". |
| B. Tetap statis (GitHub Pages) + semua data dari browser langsung ke Supabase | Tidak mau pindah host | Rute dinamis tetap butuh trik (satu halaman statis + parameter kueri); tidak ada tempat rahasia untuk undangan, Sheets, R; aturan RLS harus sempurna karena semua logika ada di browser. Tidak disarankan. |
| C. Host alternatif untuk Next.js (mis. Cloudflare, kontainer di Cloud Run/Fly/Render) | Ingin kontrol atau biaya lain | Penyiapan lebih banyak; pengguna tanpa terminal lebih sulit. |

**Rekomendasi: A.** Urutan aman: pindahkan dulu ke host server **dengan data mock tetap dipakai** (Fase 1), untuk membuktikan alur deploy sebelum menyentuh data.

Konsekuensi teknis pindah ke host server:
- `output: "export"` dan `basePath` di `next.config.ts` dilepas untuk build produksi. GitHub Pages bisa dipertahankan sebagai "demo statis" hanya bila build memakai saklar lingkungan; tetapi dua mode berarti dua jalur uji. Putuskan: pertahankan demo atau pensiunkan (lihat Keputusan Terbuka).
- Middleware kembali tersedia: dipakai untuk (1) menjaga sesi dan melindungi `/dashboard`, (2) opsional kembali ke `localePrefix` tanpa awalan untuk bahasa default.
- Kewajiban `generateStaticParams` untuk `survey/[slug]`, `projects/[id]`, `builder/[id]` hilang; halaman dirender saat diminta. Slug tidak ada → `notFound()` sungguhan (halaman `not-found.tsx` terlokalisasi yang sudah ada mulai berfungsi).
- `public/index.html` (alihan akar) digantikan oleh pengalihan bahasa di middleware.
- Pilih **wilayah** Supabase dan host yang berdekatan dengan pengguna (Asia Tenggara) untuk mengurangi latensi.

## 4. Skema Supabase

Konvensi: kunci utama `uuid`; waktu `timestamptz` (UTC); `created_at`/`updated_at` di tiap tabel; nama tabel jamak huruf kecil; enum untuk nilai tetap. Skema dikelola sebagai **berkas migrasi bernomor di repo** (`supabase/migrations`), supaya perubahan bisa ditinjau dan diulang. Pengguna tanpa terminal menjalankannya lewat editor SQL di dasbor Supabase (atau alur GitHub Actions bila nanti dibuat).

### 4.1 Tabel

**profiles** (satu baris per pengguna peneliti)
| Kolom | Isi |
|---|---|
| id | sama dengan id pengguna di Supabase Auth |
| display_name | nama tampil (untuk sapaan dashboard) |
| role | `admin` atau `researcher` |
| preferred_locale | `id`/`en` |

**invitations** (catatan niat undangan)
| Kolom | Isi |
|---|---|
| email, role | siapa dan peran apa |
| project_id (opsional) | bila undangan ke proyek tertentu |
| invited_by | admin/pemilik yang mengundang |
| status | `pending`, `accepted`, `revoked`, `expired` |
| expires_at | kedaluwarsa |

**projects** (↔ `Project`)
| Kolom | Isi |
|---|---|
| slug (unik), title, description | seperti sekarang |
| status | `draft`/`active`/`completed`/`archived` |
| owner_id | pemilik |
| archived_at | penghapusan lunak |
`respondentCount` dan `questionnaireStatus` **tidak disimpan**: dihitung (tampilan/fungsi) agar tidak pernah tidak sinkron.

**project_members**: `project_id`, `user_id`, `role` (`owner`/`editor`/`viewer`).

**questionnaires** (↔ "kuesioner" sebagai wadah; satu proyek bisa punya lebih dari satu)
| Kolom | Isi |
|---|---|
| project_id | induk |
| slug (unik global) | alamat publik `/survey/[slug]` |
| status | `none`/`draft`/`published`/`closed` |
| published_version_id | versi yang dilihat responden |
| opens_at, closes_at (opsional) | jendela pengisian |

**questionnaire_versions** (↔ `Questionnaire`; INI yang membuat hasil lama tetap benar)
| Kolom | Isi |
|---|---|
| questionnaire_id, version_number | urutan versi |
| state | `draft` (maks. satu per kuesioner), `published`, `archived` |
| title, description, researcher_name, estimated_minutes, contact_email | konten yang dilihat responden |
| consent_text | paragraf persetujuan (daftar teks) |
| navigation_mode | `perQuestion`/`perSection` |
| published_at, created_by | audit |
Aturan: versi `published` **tidak boleh diubah**. Mengedit kuesioner yang sudah terbit = membuat draf baru (salinan) lalu menerbitkannya sebagai versi berikutnya.

**sections** (↔ `Section`): `version_id`, `position`, `title`, `description`, `section_key` (pengenal stabil lintas versi).

**questions** (↔ `Question`)
| Kolom | Isi |
|---|---|
| version_id, section_id (boleh kosong = tanpa seksi), position | letak |
| question_key | pengenal stabil lintas versi (untuk membandingkan butir yang sama di versi berbeda) |
| type | 7 tipe (enum) |
| text, description, required | seperti sekarang |
| likert_config | JSON (`points`, `options`, `direction`, `reverseScored`) |
| choices | JSON daftar pilihan |

**responses** (↔ `RespondentResponse`)
| Kolom | Isi |
|---|---|
| questionnaire_id, version_id | versi yang dijawab |
| submitted_at, locale | |
| consented_at | waktu persetujuan |
| is_preview | tandai respons uji peneliti (dikecualikan dari data) |
| idempotency_key (unik) | mencegah kiriman ganda |
Tidak menyimpan IP, user agent, atau email responden secara bawaan.

**answers** (satu baris per soal yang dijawab; mudah dianalisis dengan SQL)
| Kolom | Isi |
|---|---|
| response_id, question_id, question_key | |
| value_text / value_number / value_choices | tepat satu terisi sesuai tipe (dijaga constraint) |
Unik pada (response_id, question_id). Nilai Likert disimpan **mentah**; reverse scoring diterapkan saat dibaca memakai konfigurasi versinya.

**analysis_jobs**: `questionnaire_id`, `version_ids`, `requested_by`, `kind` (deskriptif, reliabilitas, EFA, CFA, …), `params` (JSON), `engine` (`ts`/`r`), `status` (`queued`/`running`/`succeeded`/`failed`), `started_at`, `finished_at`, `error_message`, `dataset_row_count`, `dataset_hash`.

**analysis_results**: `job_id`, `result` (JSON), `artifacts` (jalur berkas, mis. grafik).

**exports**: `questionnaire_id`, `format`, `requested_by`, `status`, `file_path`, `expires_at`.

**integrations**: `project_id`, `kind` (`google_sheets`), `config` (ID spreadsheet, nama sheet), `status`, `last_synced_at`, `last_error`. **Rahasia/kredensial tidak disimpan di tabel ini.**

**audit_log**: `actor_id`, `action`, `entity`, `entity_id`, `at`, `meta`. Sumber untuk "Aktivitas terbaru" di dashboard (menggantikan fixture `Activity`).

### 4.2 Catatan desain
- **Mengapa versi menyalin seksi dan soal** (bukan hanya JSON tunggal): analisis per butir tetap bisa memakai SQL, dan `question_key` memungkinkan membandingkan butir yang sama antarversi. Harga yang dibayar: penerbitan harus menyalin baris dalam satu transaksi.
- **Satu sumber logika skor**: reverse scoring dihitung di TypeScript (`scoreLikert`) dan diteruskan sebagai data ke layanan R. Jangan menulis ulang di SQL. Tambahkan uji "golden": fixture yang sama harus menghasilkan nilai identik di TypeScript dan di R.
- **Konten peneliti dwibahasa** tidak ada di rencana ini (brief: tidak diterjemahkan otomatis). Bila kelak dibutuhkan, tambahkan tabel terjemahan per versi; jangan diam-diam menambah kolom bahasa sekarang.
- **Penghapusan lunak** untuk proyek (`archived_at`); penghapusan permanen respons hanya oleh pemilik/admin dan tercatat di `audit_log` (untuk permintaan penghapusan data).

## 5. Autentikasi berbasis undangan dan RLS

### 5.1 Alur undangan
1. Di pengaturan Supabase Auth, **matikan pendaftaran mandiri** (tidak ada registrasi publik). Verifikasi dengan mencoba mendaftar lewat alamat API: harus ditolak.
2. Admin pertama dibuat sekali secara manual (undangan dari dasbor Supabase).
3. Admin/pemilik proyek mengundang peneliti dari UI: server (bukan browser) memakai fungsi undangan admin Supabase dengan kunci service role, lalu mencatat baris `invitations`.
4. Penerima membuka tautan email, membuat kata sandi, dan baris `profiles` dibuat otomatis lewat pemicu basis data dengan peran sesuai undangan.
5. Opsional: wajibkan autentikasi dua faktor untuk admin.

### 5.2 Penerapan di kode (satu titik ganti)
- Perluas antarmuka `AuthClient` (kini hanya `signIn`) dengan keluar, ambil sesi, dan langganan perubahan sesi; isi `src/lib/auth/index.ts` dengan implementasi Supabase. `LoginForm` sudah menerima klien lewat prop.
- Sesi memakai cookie (paket resmi Supabase untuk Next.js server-side), dibaca middleware untuk melindungi `/dashboard`.
- Item "Keluar" di `ProfileMenu` yang kini nonaktif diaktifkan; item "Masuk" disembunyikan saat sudah masuk.

### 5.3 Kebijakan RLS (dijelaskan dengan kata-kata, ditulis sebagai SQL nanti)
RLS **diaktifkan di semua tabel**; tanpa kebijakan = tidak ada akses. Fungsi bantu: "apakah pengguna ini anggota proyek X dengan peran minimal Y".

| Tabel | Anonim (responden) | Peneliti |
|---|---|---|
| profiles | tidak ada | baca milik sendiri; admin baca semua; ubah milik sendiri (kecuali peran) |
| projects, project_members | tidak ada | anggota membaca; owner/editor mengubah; pembuatan oleh peneliti login (pemilik = dirinya); penghapusan oleh owner/admin |
| questionnaires, versions, sections, questions | **tidak ada akses langsung**; konten terbit dibaca lewat fungsi/tampilan baca-saja per slug yang hanya mengembalikan versi terbit | anggota membaca; editor+ menulis; versi terbit tidak dapat diubah (dijaga pemicu) |
| responses, answers | **tidak ada baca**; tidak ada tulis langsung (lihat bagian 7) | anggota membaca; tidak ada ubah; hapus hanya owner/admin |
| analysis_jobs, analysis_results, exports | tidak ada | anggota membaca; editor+ membuat |
| integrations | tidak ada | owner/editor; **kredensial tidak pernah terbaca klien** |
| audit_log | tidak ada | owner/admin membaca; hanya server/pemicu menulis |

**Pengujian RLS wajib** sebelum data nyata masuk: skrip pemeriksaan yang berpura-pura menjadi (1) anonim, (2) peneliti A, (3) peneliti B (bukan anggota proyek A), (4) admin; setiap pengguna mencoba membaca/menulis data milik proyek lain, dan semuanya harus gagal. Simpan skrip di repo dan jalankan ulang setiap migrasi mengubah kebijakan (lewat editor SQL, atau GitHub Actions pada proyek Supabase uji).

## 6. Mengganti repository mock

Urutan (dari paling aman):
1. **Perluas kontrak dulu, sambil mock tetap jalan.** Tambahkan ke antarmuka di `src/lib/data/repositories.ts`: buat/ubah/arsipkan proyek; simpan draf kuesioner; terbitkan (membuat versi baru); kirim respons; daftar respons per versi; baca data publik per slug. Mock mengimplementasikannya di memori. Dengan begitu UI dan alur berubah dahulu, tanpa basis data.
2. **Tulis implementasi Supabase di `src/lib/data/supabase/`** (folder baru; mock tidak dihapus, dipakai untuk uji dan demo).
3. **Pemeta tunggal** antara baris basis data dan tipe domain (`src/types`). UI tidak boleh melihat bentuk baris basis data. Tipe baris dibuat manual atau dibangkitkan lewat alur CI (bukan di komputer pengguna).
4. **Pemilih implementasi** di `src/lib/data/index.ts` lewat variabel lingkungan (mock vs Supabase). Satu tempat, seperti komentar di berkas itu.
5. **Dua jenis klien**: klien sisi server (cookie sesi pengguna, dipakai Server Component dan aksi server) dan klien peramban (hanya bila benar-benar perlu, mis. langganan perubahan status job). Penulisan dilakukan lewat aksi server/route handler, bukan langsung dari komponen.
6. **Cache dan penyegaran**: setelah ubah/terbit, segarkan halaman yang terpengaruh (tag/path), karena halaman tidak lagi dibangun statis.
7. Tipe yang harus ditambah: versi kuesioner, anggota proyek, status job, dan `Activity` diturunkan dari `audit_log`.

## 7. Penyimpanan respons

Alur kirim:
1. Jawaban tetap di memori peramban selama mengisi (`SurveyProvider`, tidak ada penyimpanan sebelum selesai).
2. Saat "Kirim", peramban mengirim satu permintaan ke server berisi: slug, id versi yang dilihat, bahasa, jawaban, penanda persetujuan, dan kunci idempotensi buatan klien.
3. **Server memvalidasi terhadap versi terbit** (bukan percaya klien): kuesioner `published` dan dalam jendela buka; versi cocok; semua soal wajib terjawab; tipe benar; nilai Likert termasuk opsi; pilihan termasuk daftar; angka valid; persetujuan diberikan.
4. Simpan `responses` dan `answers` dalam **satu transaksi** lewat fungsi basis data tepercaya. Kunci idempotensi unik mencegah ganda saat klik ulang atau jaringan putus.
5. Balas dengan penanda sukses saja (tanpa data pribadi). Halaman "Selesai" memakai jawaban itu.

Perlindungan penyalahgunaan: pembatasan laju per alamat IP (IP hanya diproses sesaat, tidak disimpan), kolom jebakan (honeypot) atau tantangan anti-bot opsional, batas ukuran jawaban teks panjang, dan tanda `is_preview` untuk uji peneliti.

Privasi (keputusan, bukan sekadar teknis): bila responden menolak persetujuan, **tidak ada data disimpan** (sesuai teks yang sudah ada). Catatan persetujuan = `consented_at` plus versi teks persetujuan (melekat pada versi kuesioner). Jangan menyimpan data identitas bila penelitian dirancang anonim.

Pengisian parsial (simpan sebelum selesai) **tidak termasuk** rencana awal: menambah data pribadi tersimpan sebelum persetujuan jelas dan memperumit analisis. Putuskan terpisah.

## 8. Ekspor

- **CSV**: sudah ada di sisi klien dari data demo. Pindah ke server agar bekerja untuk data besar dan bisa diaudit; pakai ulang `buildDataset` dan `toCsv`.
- **Excel**: dibuat di server dari dataset yang sama; sertakan lembar kedua "Buku kode" (nama variabel, teks soal, tipe, skala dan label Likert, apakah reverse scoring).
- **SPSS/R**: dua jalur. (a) Murah: CSV + berkas sintaks SPSS yang memberi label variabel dan nilai; (b) lengkap: berkas `.sav` dibuat layanan R (paket seperti haven) memakai buku kode yang sama. Mulai dari (a), tambah (b) bersama layanan R.
- Berkas ekspor yang disimpan di penyimpanan memakai tautan bertanda tangan yang kedaluwarsa, dan tiap ekspor tercatat di `audit_log`.
- Pilihan ekspor: skor mentah vs skor setelah reverse scoring (halaman Data sudah membedakan dua mode ini).

## 9. Google Sheets

Prinsip: **satu arah** (Postgres → Sheets); Sheets tidak pernah dibaca kembali sebagai sumber data.

Cara yang disarankan: akun layanan (service account) milik aplikasi. Peneliti membagikan spreadsheet-nya ke alamat akun layanan itu sebagai penyunting, lalu mengisi ID spreadsheet di halaman Integrasi. Alternatif (peneliti memberi izin lewat OAuth) lebih ramah tetapi menambah layar persetujuan Google, penyimpanan token, dan peninjauan aplikasi; tunda.

Alur: respons baru → tugas antrean → tambah baris (batch) → catat `last_synced_at` atau `last_error`, dengan percobaan ulang bertahap. Baris pertama diisi dari buku kode. Versi kuesioner baru → lembar baru (kolom berubah).

Risiko: batas kuota API; spreadsheet diubah manual sehingga tidak sama dengan basis data; siapa pun yang punya akses ke spreadsheet melihat jawaban (pertimbangan privasi); kredensial akun layanan hanya di variabel lingkungan server.

## 10. Mesin R dan job analisis

**Bagian yang tidak perlu R**: statistik dasar (rata-rata, simpangan baku, Cronbach's alpha) sudah ada di `src/lib/stats.ts` dan `item-analysis.ts`; sambungkan dulu ke data nyata (Fase 8). R dipakai untuk yang tidak ada di TypeScript: analisis faktor eksploratori dan konfirmatori, omega, korelasi/uji lanjutan, dan ekspor `.sav`.

**Arsitektur**: layanan R terpisah (kontainer dengan R dan paket analisis seperti psych dan lavaan, dibungkus HTTP, mis. plumber), di host kontainer. Vercel/serverless tidak cocok menjalankan R.

**Pola job** (asinkron, karena analisis bisa lebih lama dari batas waktu permintaan web):
1. Peneliti menekan "Jalankan analisis" → server membuat baris `analysis_jobs` (`queued`) setelah memeriksa hak akses.
2. Server memanggil layanan R dengan permintaan bertanda tangan (HMAC) berisi id job dan **tautan data bertanda tangan berumur pendek**. Layanan R tidak memegang kredensial basis data.
3. Layanan R mengambil dataset (mentah + konfigurasi Likert), menghitung, dan mengembalikan JSON hasil (dan grafik opsional).
4. Server menyimpan ke `analysis_results`, mengubah status job. Halaman Analisis memantau status (polling sederhana dulu; langganan perubahan nanti).
5. Hasil di-cache berdasarkan (versi, parameter, `dataset_hash`) agar tidak menghitung ulang yang sama.

Keamanan: layanan R hanya menerima permintaan bertanda tangan; tidak terbuka ke publik; batas waktu dan memori per job; tidak menyimpan data responden setelah job selesai.

## 11. Urutan kerja

Ukuran: S (kecil), M (sedang), L (besar). Tiap fase punya kriteria "selesai"; jangan lanjut sebelum terpenuhi.

| Fase | Isi | Ukuran | Selesai bila |
|---|---|---|---|
| 0 | Keputusan terbuka (bagian 13), akun Supabase dan host, rencana privasi dan izin etik | S | Keputusan tertulis di `docs/DECISIONS.md` |
| 1 | Pindah hosting ke server dengan **data mock**; lepas ekspor statis; middleware locale | M | Demo yang sama berjalan di host baru; build hijau; tautan lama diputuskan nasibnya |
| 2 | Migrasi skema + RLS + data awal dari fixture; **uji RLS** | L | Skrip uji RLS lolos untuk 4 peran |
| 3 | Autentikasi undangan; ganti `AuthClient`; lindungi `/dashboard` | M | Tanpa login tidak bisa buka dashboard; pendaftaran mandiri ditolak; undangan berhasil |
| 4 | Repository baca (proyek, kuesioner) dari Supabase | M | Dashboard dan survei tampil dari basis data; mock masih bisa dipilih |
| 5 | Penulisan: proyek, builder simpan draf, terbitkan (versi baru) | L | Menerbitkan membuat versi baru; versi lama tidak berubah |
| 6 | Respons publik: validasi server, transaksi, idempotensi, batas laju | L | Kirim ganda tidak menggandakan; data tidak valid ditolak server; menolak persetujuan tidak menyimpan apa pun |
| 7 | Halaman Respons/Data dari data nyata; ekspor CSV/Excel/buku kode | M | Hasil ekspor sama dengan tampilan tabel pada fixture yang sama |
| 8 | Analisis TypeScript pada data nyata | S | Angka sama dengan hasil sekarang pada fixture |
| 9 | Layanan R + job analisis; `.sav` | L | Alpha dari R sama dengan TypeScript pada fixture (uji golden) |
| 10 | Google Sheets | M | Respons baru muncul di spreadsheet uji; kegagalan tercatat dan diulang |
| 11 | Pengerasan: pencadangan dan latihan pemulihan, pemantauan galat, audit aksesibilitas, pemeriksaan ulang RLS, uji beban ringan | M | Daftar periksa rilis terisi |

Kerja tanpa terminal (mengikuti `docs/LESSONS_LEARNED.md`): migrasi SQL ditinjau di repo dan dijalankan lewat editor SQL web; variabel lingkungan diisi di dasbor host dan Supabase; build tetap di CI; galat dikirim balik sebagai log. Setiap fase diserahkan sebagai zip berisi hanya berkas yang berubah, dengan catatan di `docs/status/`.

## 12. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kebijakan RLS salah | Data responden terbaca atau terubah pihak lain | RLS di semua tabel; uji 4 peran (bagian 5.3); tinjau ulang tiap migrasi |
| Kunci service role bocor ke browser | Seluruh RLS terlewati | Hanya di variabel lingkungan server; jangan diberi awalan publik; jangan dicatat di log |
| Spam atau pengisian massal | Data tercemar | Validasi server, batas laju, idempotensi, honeypot/anti-bot, tanda `is_preview` |
| Kehilangan data | Penelitian rusak | Pencadangan; ekspor berkala; latih pemulihan sebelum data nyata. Cek apakah paket yang dipakai menyediakan pemulihan titik waktu |
| Proyek gratis dijeda atau berubah batasnya | Kuesioner tidak bisa diisi pada waktu kritis | Periksa ketentuan terkini; pertimbangkan paket berbayar selama masa pengumpulan data |
| Dua jalur deploy (Pages dan host server) | Biaya uji ganda, hasil berbeda | Putuskan di Fase 0 apakah demo statis dipertahankan |
| Kompleksitas versi kuesioner | Salah menghubungkan butir antarversi | `question_key` stabil; uji migrasi dan analisis lintas versi dengan fixture |
| Logika skor ganda (TypeScript vs R) | Angka berbeda | Satu sumber (TypeScript), R menerima data mentah + konfigurasi; uji golden |
| Privasi dan etika | Pelanggaran aturan data pribadi atau persyaratan kampus | Rancang anonimitas dari awal; tinjau dengan komite etik kampus; periksa UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022) dan kebijakan institusi; tulis kebijakan privasi dan masa simpan data |
| Pengguna tanpa terminal | Kesalahan manual saat migrasi dan variabel lingkungan | Migrasi bernomor dan idempoten, daftar langkah di `docs/`, skrip uji yang bisa dijalankan dari dasbor atau CI |
| Ketergantungan pada satu vendor | Sulit pindah | Postgres standar bisa diekspor; akses data di balik repository |
| Akses audio/animasi dan aksesibilitas tidak diuji | Hambatan bagi sebagian responden | Masuk daftar periksa Fase 11; uji pembaca layar dan keyboard |

## 13. Keputusan terbuka (perlu jawaban pengguna sebelum Fase 1)

1. Host server mana (rekomendasi: A, bagian 3), dan apakah GitHub Pages dipertahankan sebagai demo atau dipensiunkan?
2. Wilayah data Supabase dan host (rekomendasi: yang terdekat dengan responden).
3. Apakah satu proyek boleh punya banyak kuesioner, atau satu saja (menyederhanakan Fase 2 dan 5)?
4. Apakah proyek punya banyak anggota (peran owner/editor/viewer) atau satu peneliti per proyek?
5. Anonim penuh, atau perlu identitas/kode responden? Apakah perlu kode akses/token untuk membatasi siapa yang boleh mengisi?
6. Apakah menyimpan pengisian parsial diperlukan?
7. Masa simpan data dan siapa yang boleh menghapus respons?
8. Apakah isi kuesioner perlu dua bahasa (terjemahan oleh peneliti)? Bila ya, tabel terjemahan dirancang sejak Fase 2.
9. Domain sendiri atau alamat bawaan host?
10. Seberapa penting `.sav` asli dan analisis lanjutan (EFA/CFA) untuk skripsi ini? Ini menentukan apakah Fase 9 dikerjakan sekarang atau ditunda.
