import { setRequestLocale } from "next-intl/server";
import { NewProjectPanel } from "@/features/projects/new-project-panel";

export default async function NewProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NewProjectPanel />;
}
