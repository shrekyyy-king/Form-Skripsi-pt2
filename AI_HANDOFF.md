# Serah Terima untuk AI Lain

1. Baca `CLAUDE.md`, `CURRENT_STATUS.md`, `NEXT_TASKS.md`, lalu `ai-context/PROJECT_CONTEXT.md`. Untuk mutu kode baca `docs/QA_REPORT.md`.
2. Kerjakan tugas teratas di `NEXT_TASKS.md`, satu bagian per respons.
3. Pengguna bekerja lewat Claude web/aplikasi Windows, bukan Claude Code: kode diberikan sebagai berkas/zip (hanya berkas yang berubah, struktur folder utuh), dan pengguna menjalankan `npm` sendiri / build lewat GitHub Actions. Minta log galat bila ada.
4. Setelah selesai, perbarui tiga berkas status dan sebutkan berkas yang dibuat serta yang belum.
5. Jangan masuk Tahap 2 tanpa instruksi eksplisit pengguna.
6. Jangan klaim sesuatu berfungsi bila belum dijalankan. Audit 2026-11-27 hanya membaca kode; `typecheck`/`lint`/`build` belum dijalankan olehnya.
7. Berkas berawalan titik (`.github`, `.gitignore`, ...) tidak ikut zip; dibuat manual di GitHub. Zip hasil kerja jangan menyertakannya.
8. Kerja paralel antar-akun: aturan kepemilikan berkas ada di `docs/PARALLEL_WORK.md`. Catatan tiap akun di `docs/status/<nama>.md`.
