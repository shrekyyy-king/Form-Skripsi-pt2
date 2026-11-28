"use client";

import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";

/**
 * Dipakai saat notFound() dipanggil di dalam rute [locale] (mis. proyek/slug tidak ada).
 * Catatan: di GitHub Pages (ekspor statis) alamat yang tidak ada dilayani host lewat 404.html
 * bawaan Next, bukan berkas ini. Berkas ini berguna untuk `next dev` dan hosting dinamis Tahap 2.
 */
export default function LocaleNotFound() {
  const t = useTranslations("states");
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-4">
      <Card>
        <CardHeader className="gap-2">
          <p className="text-sm font-medium text-muted-foreground">404</p>
          <h1 className="text-2xl font-semibold">{t("notFoundTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("notFoundText")}</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href={routes.home} className={buttonVariants()}>{t("backHome")}</Link>
          <Link href={routes.dashboard.root} className={buttonVariants({ variant: "outline" })}>{t("backDashboard")}</Link>
        </CardContent>
      </Card>
    </main>
  );
}
