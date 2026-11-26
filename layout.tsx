import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { SurveyProvider } from "@/features/survey/survey-provider";
import { questionnaireRepository } from "@/lib/data";

export async function generateStaticParams() {
  const slugs = await questionnaireRepository.listSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function SurveyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const questionnaire = await questionnaireRepository.getBySlug(slug);
  if (!questionnaire) notFound();

  return (
    <SurveyProvider questionnaire={questionnaire}>
      <div className="min-h-screen">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <span className="truncate text-sm font-medium">{questionnaire.title}</span>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </header>
        <main className="mx-auto w-full max-w-2xl p-4 md:p-8">{children}</main>
      </div>
    </SurveyProvider>
  );
}
