import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { MusicPlayer } from "@/features/music/music-player";
import { SurveyLanguageSwitcher } from "@/features/survey/survey-language-switcher";
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
        <header className="flex h-14 items-center justify-between gap-2 border-b px-4">
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{questionnaire.title}</span>
          <div className="flex shrink-0 items-center gap-1">
            <SurveyLanguageSwitcher />
            <ThemeSwitcher />
            <MusicPlayer />
          </div>
        </header>
        <main className="mx-auto w-full max-w-2xl p-4 md:p-8">{children}</main>
      </div>
    </SurveyProvider>
  );
}
