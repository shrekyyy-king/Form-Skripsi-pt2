import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { DataTable, QuestionLegend } from "@/features/data/data-table";
import { buildDataset } from "@/features/data/dataset";
import { loadDemoData } from "@/features/data/load-demo";

export default async function ResponsesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("responses");
  const demo = await loadDemoData();
  const dataset = demo ? buildDataset(demo.questionnaire, demo.responses, false) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Badge>{t("demoNotice")}</Badge>
      </div>
      {dataset && dataset.rows.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">{t("count", { count: dataset.rows.length })}</p>
          <DataTable head={dataset.header} rows={dataset.rows} />
          <QuestionLegend columns={dataset.columns} />
        </>
      ) : <p className="text-muted-foreground">{t("empty")}</p>}
    </div>
  );
}
