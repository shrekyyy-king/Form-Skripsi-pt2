import { Construction } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export function PlaceholderPage({ navKey }: { navKey: string }) {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t(`nav.${navKey}`)}</h1>
      <Card><CardContent className="flex items-center gap-3 py-8 text-muted-foreground">
        <Construction className="h-5 w-5" aria-hidden /> {t("common.comingSoon")}
      </CardContent></Card>
    </div>
  );
}
