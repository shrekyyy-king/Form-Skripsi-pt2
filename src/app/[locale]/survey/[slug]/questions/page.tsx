import { setRequestLocale } from "next-intl/server";
import { QuestionFlow } from "@/features/survey/question-flow";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <QuestionFlow />;
}
