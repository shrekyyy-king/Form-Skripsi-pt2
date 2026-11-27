import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandMark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { LoginForm } from "@/features/auth/login-form";
import { Link } from "@/i18n/navigation";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-4">
        <BrandMark />
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 p-4">
        <Card>
          <CardHeader className="gap-2">
            <Badge className="w-fit">{t("stageBadge")}</Badge>
            <h1 className="text-2xl font-semibold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm />
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">{t("inviteOnly")}</p>
        <Link href={routes.home} className={buttonVariants({ variant: "ghost", size: "sm", className: "mx-auto" })}>{t("backHome")}</Link>
      </main>
    </div>
  );
}
