import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, QuestionLegend } from "@/features/data/data-table";
import { buildDataset } from "@/features/data/dataset";
import { ExportCsvButton } from "@/features/data/export-csv-button";
import { loadDemoData } from "@/features/data/load-demo";

export default async function DataPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("data");
  const demo = await loadDemoData();
  const dataset = demo ? buildDataset(demo.questionnaire, demo.responses, true) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Badge>{t("demoNotice")}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{t("description")}</p>
      {dataset && dataset.rows.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-2">
            <ExportCsvButton header={dataset.header} rows={dataset.rows} fileName="data-demo.csv" label={t("exportCsv")} />
            <Button variant="outline" disabled>{t("exportExcel")} ({t("soon")})</Button>
            <Button variant="outline" disabled>{t("exportStats")} ({t("soon")})</Button>
          </div>
          <DataTable head={dataset.header} rows={dataset.rows} />
          <QuestionLegend columns={dataset.columns} />
        </>
      ) : <p className="text-muted-foreground">{t("empty")}</p>}
    </div>
  );
}
