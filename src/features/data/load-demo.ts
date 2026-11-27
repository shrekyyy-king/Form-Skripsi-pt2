import { questionnaireRepository, responseRepository } from "@/lib/data";

/** Memuat kuesioner pertama beserta respons demo-nya. Null bila belum ada. */
export async function loadDemoData() {
  const [slug] = await questionnaireRepository.listSlugs();
  if (!slug) return null;
  const questionnaire = await questionnaireRepository.getBySlug(slug);
  if (!questionnaire) return null;
  return { questionnaire, responses: await responseRepository.listByQuestionnaire(slug) };
}
