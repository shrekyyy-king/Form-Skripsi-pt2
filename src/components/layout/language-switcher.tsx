"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/** Kunci penyimpanan pilihan bahasa. Dipakai juga oleh public/index.html (usulan: docs/status/akun2.public-index.proposed.html). */
export const LOCALE_STORAGE_KEY = "rp.locale";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const next = locale === "id" ? "en" : "id";

  const switchLocale = () => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // localStorage bisa diblokir (mode privat/izin); pilihan tetap berlaku lewat URL.
    }
    router.replace(pathname, { locale: next });
  };

  return (
    <Button variant="ghost" size="sm" aria-label={t("switchLanguage")} onClick={switchLocale}>
      <Languages className="h-4 w-4" aria-hidden />
      {locale.toUpperCase()}
    </Button>
  );
}
