import { Database, FlaskConical, Table2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function IntegrationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("integrations");
  const items = [
    { key: "googleSheets", icon: Table2 },
    { key: "supabase", icon: Database },
    { key: "rEngine", icon: FlaskConical },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-3">
        {items.map(({ key, icon: Icon }) => (
          <li key={key}>
            <Card className="h-full">
              <CardHeader>
                <Icon className="h-6 w-6 text-primary" aria-hidden />
                <h2 className="font-medium">{t(key)}</h2>
                <p className="text-sm text-muted-foreground">{t(`${key}Desc`)}</p>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Badge>{t("notActive")}</Badge>
                <Button size="sm" variant="outline" disabled>{t("connect")}</Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
