import { getTranslations, setRequestLocale } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { BrandMark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 p-6">
      <BrandMark />
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("subtitle")}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Link href={routes.dashboard.root} className={buttonVariants()}>{t("openDashboard")}</Link>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </main>
  );
}
