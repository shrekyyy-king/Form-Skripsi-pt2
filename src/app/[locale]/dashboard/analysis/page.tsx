import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable, QuestionLegend } from "@/features/data/data-table";
import { analyzeLikertItems } from "@/features/data/item-analysis";
import { loadDemoData } from "@/features/data/load-demo";

export default async function AnalysisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("analysis");
  const format = await getFormatter();
  const demo = await loadDemoData();
  const num = (v: number) => (Number.isFinite(v) ? format.number(v, { maximumFractionDigits: 2 }) : "-");

  const analysis = demo ? analyzeLikertItems(demo.questionnaire, demo.responses) : null;
  const stats = analysis?.items ?? [];
  const alpha = analysis?.alpha ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Badge>{t("demoNotice")}</Badge>
      </div>
      {stats.length === 0 ? <p className="text-muted-foreground">{t("notEnough")}</p> : (
        <>
          <Card>
            <CardHeader><h2 className="font-medium">{t("reliability")}</h2></CardHeader>
            <CardContent className="space-y-1">
              <p className="text-3xl font-semibold">{alpha === null ? "-" : t("alphaValue", { value: num(alpha) })}</p>
              <p className="text-xs text-muted-foreground">{t("alphaNote")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><h2 className="font-medium">{t("itemStats")}</h2></CardHeader>
            <CardContent className="space-y-4">
              <DataTable head={[t("item"), t("n"), t("mean"), t("sd")]} rows={stats.map((s) => [s.label, s.n, num(s.mean), num(s.sd)])} />
              <QuestionLegend columns={stats.map((s) => ({ label: s.label, text: s.text }))} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><h2 className="font-medium">{t("chartTitle")}</h2></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {stats.map((s) => (
                  <li key={s.label} className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 text-sm">
                    <span>{s.label}</span>
                    <div className="h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${s.label}: ${num(s.mean)}`}>
                      <div className="h-full bg-primary" style={{ width: `${s.percent}%` }} />
                    </div>
                    <span className="text-right">{num(s.mean)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
