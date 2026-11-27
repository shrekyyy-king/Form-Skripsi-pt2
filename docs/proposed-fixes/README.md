# Usulan perbaikan

Berkas `.txt` di folder ini adalah versi utuh usulan untuk berkas sumber (lihat `docs/QA_REPORT.md`). Belum dijalankan atau diuji. Disimpan sebagai `.txt` supaya tidak ikut `typecheck`/`build`.

| Berkas usulan | Menggantikan | Temuan |
|---|---|---|
| `request.ts.txt` | `src/i18n/request.ts` | S-2 |
| `scoring.ts.txt` | `src/lib/scoring.ts` | R-7 (mengubah tipe kembalian menjadi `number \| null`; belum ada pemanggil sehingga aman) |

Temuan lain (S-1, S-3, S-4, S-5, S-6, R-*) belum dibuatkan berkas utuh karena perbaikannya bergantung pada hasil gabungan tugas Seksi (berkas builder/survey berubah di sana).
