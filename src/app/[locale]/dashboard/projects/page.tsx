import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { ProjectList } from "@/features/projects/project-list";
import { projectRepository } from "@/lib/data";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const projects = await projectRepository.list();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Badge>{t("demoNotice")}</Badge>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
