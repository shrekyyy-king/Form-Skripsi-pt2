"use client";

import { useTranslations } from "next-intl";

/**
 * Tampil sesaat saat berpindah halaman dashboard di sisi klien. Komponen klien (bukan server)
 * supaya tidak memicu pembacaan locale dinamis, yang dilarang pada ekspor statis.
 * Hanya di dashboard: alur responden menyimpan jawaban di layout-nya dan tidak boleh terganggu.
 */
export default function DashboardLoading() {
  const t = useTranslations("states");
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="sr-only">{t("loading")}</span>
      <div aria-hidden className="h-8 w-1/3 rounded-md bg-muted motion-safe:animate-pulse" />
      <div aria-hidden className="grid gap-4 sm:grid-cols-3">
        <div className="h-24 rounded-lg bg-muted motion-safe:animate-pulse" />
        <div className="h-24 rounded-lg bg-muted motion-safe:animate-pulse" />
        <div className="h-24 rounded-lg bg-muted motion-safe:animate-pulse" />
      </div>
      <div aria-hidden className="h-40 rounded-lg bg-muted motion-safe:animate-pulse" />
    </div>
  );
}
