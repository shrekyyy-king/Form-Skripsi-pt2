import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BuilderEditor } from "@/features/builder/builder-editor";
import { createEmptyQuestionnaire } from "@/features/builder/builder-utils";
import { projectRepository, questionnaireRepository } from "@/lib/data";

export async function generateStaticParams() {
  const projects = await projectRepository.list();
  return projects.map((p) => ({ id: p.id }));
}

export default async function BuilderPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const project = await projectRepository.getById(id);
  if (!project) notFound();
  const existing = await questionnaireRepository.getByProjectId(id);
  const initial = existing ?? createEmptyQuestionnaire(project);
  return <BuilderEditor initial={initial} projectTitle={project.title} initialPublished={project.questionnaireStatus === "published"} />;
}
