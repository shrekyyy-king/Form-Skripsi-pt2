"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";

/** Batas galat untuk galat render di sisi klien. Tidak menangkap 404 dari server hosting (lihat docs/status/akun2.md). */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("states");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-4">
      <Card role="alert">
        <CardHeader className="gap-2">
          <h1 className="text-2xl font-semibold">{t("errorTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("errorText")}</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={reset}>{t("retry")}</Button>
          <Link href={routes.dashboard.root} className={buttonVariants({ variant: "outline" })}>{t("backDashboard")}</Link>
        </CardContent>
      </Card>
    </main>
  );
}
