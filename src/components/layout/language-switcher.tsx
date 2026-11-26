"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const next = locale === "id" ? "en" : "id";

  return (
    <Button variant="ghost" size="sm" aria-label={t("switchLanguage")} onClick={() => router.replace(pathname, { locale: next })}>
      <Languages className="h-4 w-4" aria-hidden />
      {locale.toUpperCase()}
    </Button>
  );
}
