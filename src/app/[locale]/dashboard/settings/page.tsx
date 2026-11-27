import { getTranslations, setRequestLocale } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { brand } from "@/config/brand";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <Card>
        <CardHeader><h2 className="font-medium">{t("appearance")}</h2></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between"><span>{t("language")}</span><LanguageSwitcher /></div>
          <div className="flex items-center justify-between"><span>{t("theme")}</span><ThemeSwitcher /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><h2 className="font-medium">{t("product")}</h2></CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>{t("productName")}: <span className="font-medium">{brand.name}</span></p>
          <p className="text-muted-foreground">{t("brandNote")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
