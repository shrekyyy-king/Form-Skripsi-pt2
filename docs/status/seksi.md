# Catatan tugas: manajemen seksi (Claude-2)

Status: kode selesai, BELUM dijalankan di Next.js (tidak ada `node_modules`/jaringan di lingkungan ini). Yang sudah diperiksa:
- Logika murni (pengelompokan, urutan, layar, progres, validasi, mutasi builder) diuji dengan skrip `tsx` terhadap data demo: lolos.
- `tsc --strict` + `noUncheckedIndexedAccess` pada berkas yang diubah: tanpa galat, tetapi dengan stub untuk react/next-intl/framer-motion/lucide/komponen ui. Jadi tipe React asli dan `next lint` belum teruji; mohon jalankan CI dan kirim balik galatnya.

## Berkas

Baru:
- `src/features/survey/section-utils.ts` — logika murni bersama: `groupQuestions`, `orderQuestions`, `resolveNavigationMode`, `buildPages`/`buildPagesFor`, `getPageProgress`, `validateAnswer`/`validatePage`/`firstErrorId`.
- `src/features/survey/question-field.tsx` — `QuestionField` (satu soal + galat) dan `SectionHeading`; dipakai alur responden dan pratinjau.
- `src/features/builder/section-utils.ts` — mutasi murni builder: `createSection`, `addSection`, `updateSection`, `moveSection`, `removeSection`, `addQuestionToSection`, `moveQuestionToSection`, `moveQuestionInGroup`, `removeQuestion`.
- `src/features/builder/builder-preview.tsx` — pratinjau yang mengikuti seksi dan mode navigasi.
- `docs/status/seksi.messages.id.json`, `docs/status/seksi.messages.en.json` — fragmen pesan (namespace `builder` dan `survey`, hanya kunci baru; sudah dicek tidak bentrok dengan kunci yang ada dan id/en setara).
- `docs/status/seksi.md` — berkas ini.

Berubah:
- `src/types/index.ts` — hanya menambah: `Section`, `NavigationMode`, `Question.sectionId?`, `Questionnaire.sections?`, `Questionnaire.navigationMode?`.
- `src/features/builder/builder-editor.tsx` — ditulis ulang (lihat di bawah).
- `src/features/survey/question-flow.tsx` — ditulis ulang.
- `src/lib/data/mock/fixtures-questionnaire.ts` — 2 seksi pada `demo-servqual`.

Tidak disentuh: `survey/[slug]/layout.tsx`, `survey-provider.tsx`, `question-input.tsx`, `question-editor.tsx`, rute, `messages/*.json`, berkas status akar.

## Perilaku

Aturan model:
- Urutan tampil = seksi menurut urutan `sections`, lalu soal "Tanpa seksi" di akhir. Di dalam kelompok, soal mengikuti urutan relatifnya di `questions`.
- `sectionId` yang merujuk seksi yang tidak ada diperlakukan sebagai "Tanpa seksi".
- Tanpa seksi sama sekali = perilaku lama. Mode `perSection` tanpa seksi otomatis jatuh ke `perQuestion` (`resolveNavigationMode`).
- Seksi kosong tidak muncul di alur responden; kelompok "Tanpa seksi" yang berisi soal menjadi layar tersendiri (tanpa judul) di akhir pada mode perSection.

Builder:
- Tombol "Tambah seksi"; tiap seksi punya kolom nama, kolom deskripsi, naik/turun, hapus. Hapus seksi memindahkan soalnya ke "Tanpa seksi" (tidak ada konfirmasi; ada petunjuk di kartu).
- Soal dikelompokkan per seksi; naik/turun soal hanya di dalam kelompoknya. Pindah antar seksi lewat pilihan "Seksi soal" di panel editor soal (soal masuk ke akhir seksi tujuan). Soal baru masuk ke seksi yang dipilih pada pilihan di bawah tombol "Tambah" (default "Tanpa seksi"; otomatis ke seksi yang baru dibuat).
- Nomor soal mengikuti urutan tampil (sama dengan yang dilihat responden).
- Mode navigasi ada di kartu atas (bersama saklar publikasi). Bila dipilih "per seksi" tetapi belum ada seksi, muncul catatan bahwa responden tetap melihat satu soal per layar.
- Pratinjau: tombol "Per layar" (meniru alur responden sesuai mode, tanpa validasi) dan "Semua soal" (semua soal sekaligus, dikelompokkan per seksi). Catatan: sebelumnya pratinjau hanya "semua soal"; sekarang defaultnya "Per layar".
- Semua perubahan tetap hanya di memori halaman (mode demo).

Responden:
- `index` di provider kini berarti indeks LAYAR (di mode perQuestion nilainya sama dengan indeks soal seperti dulu), jadi provider tidak perlu diubah.
- perQuestion: satu soal per layar; bila soal punya seksi, tampil "Seksi x dari y" + judul seksi (deskripsi seksi hanya pada soal pertama seksi itu). Progres tetap "Pertanyaan x dari N".
- perSection: semua soal satu seksi per layar; progres "Seksi x dari y"; tombol Berikutnya memvalidasi seluruh soal wajib di layar itu, menampilkan galat di tiap soal + ringkasan, dan memindahkan fokus ke soal pertama yang bermasalah. Layar baru selalu digulir ke atas.
- Judul seksi kosong memakai cadangan "Seksi {n}".

## Keputusan yang perlu Anda ketahui

1. Demo `demo-servqual` saya set `navigationMode: "perSection"`. Alasan: builder belum menyimpan ke mana pun, jadi tanpa ini fitur per-seksi tidak bisa dilihat di alur responden. Spesifikasi hanya meminta "tambah 2 seksi"; jika ingin default lama tetap tampil di demo, hapus satu baris `navigationMode` di `fixtures-questionnaire.ts` (komentar di berkas menjelaskan).
2. Seksi demo: "Penilaian layanan" (s1-s4, Likert) dan "Profil dan saran" (s5-s8).
3. Galat validasi kini tampil di dalam tiap soal (di perQuestion tampilannya sama seperti dulu: satu pesan di bawah soal).

## Untuk integrator

- Gabungkan `seksi.messages.{id,en}.json` ke `messages/id.json` dan `messages/en.json` (merge per namespace `builder` dan `survey`; tidak ada kunci yang sudah ada diubah). Tanpa penggabungan ini halaman builder/responden akan menampilkan kunci mentah atau galat next-intl.
- `survey/[slug]/layout.tsx` (milik tugas musik/login) tidak perlu diubah.
- Pesan `pageErrors` di en memakai ICU plural (`{count, plural, ...}`).
- Pembaruan CURRENT_STATUS/DEVELOPMENT_LOG/NEXT_TASKS: "Manajemen seksi" (butir 2 NEXT_TASKS) selesai di kode, belum diuji.

## Cara uji (setelah digabung dan build lolos)

1. `/id/dashboard/builder/p1`: tambah seksi, ganti nama, urutkan, hapus (soal pindah ke "Tanpa seksi"), pindahkan soal lewat "Seksi soal", ubah mode navigasi, buka Pratinjau (kedua tampilan).
2. `/id/survey/demo-servqual`: setuju lalu lanjut. Layar 1 memuat 4 soal Likert; coba "Berikutnya" tanpa mengisi (galat per soal + ringkasan, fokus ke soal pertama). Layar 2: "Angkatan" wajib; "Semester" diisi huruf harus ditolak.
3. Ganti ke `perQuestion` di fixture untuk memeriksa satu soal per layar dengan judul seksi.
4. Ulangi dengan `/en/...` untuk memeriksa pesan bahasa Inggris.

## Belum / keterbatasan

- Belum diuji di browser/CI. Tampilan (jarak, lebar kolom 20rem untuk header seksi) belum dilihat langsung.
- Tidak ada penyimpanan: seksi hasil builder tidak sampai ke responden (butuh backend, di luar Tahap 1).
- Belum ada seret-dan-lepas; urutan lewat tombol naik/turun.
- Seksi tidak punya logika lompat/kondisional.
