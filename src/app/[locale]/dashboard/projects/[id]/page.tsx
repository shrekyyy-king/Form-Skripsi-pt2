import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { projectRepository, questionnaireRepository } from "@/lib/data";

export async function generateStaticParams() {
  const projects = await projectRepository.list();
  return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const project = await projectRepository.getById(id);
  if (!project) notFound();
  const questionnaire = await questionnaireRepository.getByProjectId(id);
  const t = await getTranslations("projectDetail");
  const tp = await getTranslations("projects");
  const format = await getFormatter();

  return (
    <div className="space-y-6">
      <Link href={routes.dashboard.projects} className="text-sm text-muted-foreground hover:underline">← {t("backToProjects")}</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <p className="text-muted-foreground">{project.description || t("descriptionEmpty")}</p>
        </div>
        <Badge>{tp(`status.${project.status}`)}</Badge>
      </div>
      <Card>
        <CardContent className="grid gap-4 pt-5 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">{t("detailQuestionnaire")}</p>
            <p>{tp(`questionnaireStatus.${project.questionnaireStatus}`)}{questionnaire ? ` · ${t("detailQuestions", { count: questionnaire.questions.length })}` : ""}</p>
          </div>
          <div><p className="text-muted-foreground">{tp("title")}</p><p>{tp("respondents", { count: project.respondentCount })}</p></div>
          <div><p className="text-muted-foreground">{t("detailCreated")}</p><p>{format.dateTime(new Date(project.createdAt), { dateStyle: "medium" })}</p></div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Link href={routes.dashboard.builder(project.id)} className={buttonVariants()}>{tp("openBuilder")}</Link>
        {project.questionnaireStatus === "published" && (
          <Link href={routes.survey.intro(project.slug)} className={buttonVariants({ variant: "outline" })}>{tp("openSurvey")}</Link>
        )}
      </div>
    </div>
  );
}
