import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { questionnaireRepository } from "@/lib/data";

export default async function SurveyIntroPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("survey");
  const q = await questionnaireRepository.getBySlug(slug);
  if (!q) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{q.title}</h1>
      <p className="text-muted-foreground">{q.description}</p>
      <dl className="grid gap-1 text-sm">
        <div className="flex gap-2"><dt className="text-muted-foreground">{t("researcherLabel")}:</dt><dd>{q.researcher}</dd></div>
        <div className="flex gap-2"><dd>{t("estimated", { count: q.estimatedMinutes })}</dd></div>
      </dl>
      <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">{t("demoNote")}</p>
      <Link href={routes.survey.consent(slug)} className={buttonVariants()}>{t("start")}</Link>
    </div>
  );
}
