"use client";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { routes } from "@/config/routes";
import { usePathname } from "@/i18n/navigation";
import { useSurvey } from "./survey-provider";

/**
 * Pindah bahasa memasang ulang layout survei sehingga jawaban hilang.
 * Karena itu pengalih hanya ditampilkan di halaman pengantar (sebelum ada jawaban).
 */
export function SurveyLanguageSwitcher() {
  const pathname = usePathname();
  const { questionnaire } = useSurvey();
  const here = pathname.replace(/\/+$/, "");
  return here === routes.survey.intro(questionnaire.slug) ? <LanguageSwitcher /> : null;
}
