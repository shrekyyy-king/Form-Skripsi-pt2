import type { LikertConfig, Project, Question, QuestionType, Questionnaire } from "@/types";

const defaultFive = ["Sangat tidak setuju", "Tidak setuju", "Netral", "Setuju", "Sangat setuju"];

/** Membuat konfigurasi Likert dengan jumlah titik bebas (2-10); mempertahankan label lama. Fungsi murni. */
export function createLikertConfig(points: number, prev?: LikertConfig): LikertConfig {
  const n = Math.min(10, Math.max(2, Math.round(points)));
  return {
    points: n,
    direction: prev?.direction ?? "ascending",
    reverseScored: prev?.reverseScored ?? false,
    options: Array.from({ length: n }, (_, i) => prev?.options[i] ?? { value: i + 1, label: n === 5 ? (defaultFive[i] ?? String(i + 1)) : String(i + 1) }),
  };
}

export const questionTypes: QuestionType[] = ["likert", "multipleChoice", "checkbox", "shortAnswer", "longAnswer", "numeric", "dropdown"];
const choiceTypes: QuestionType[] = ["multipleChoice", "checkbox", "dropdown"];
export const isChoiceType = (type: QuestionType) => choiceTypes.includes(type);

export function applyType(question: Question, type: QuestionType): Question {
  const next: Question = { ...question, type };
  if (type === "likert") next.likert = question.likert ?? createLikertConfig(5);
  if (isChoiceType(type) && !question.choices?.length) next.choices = ["Opsi 1", "Opsi 2"];
  return next;
}

export function createQuestion(type: QuestionType): Question {
  const id = `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  return applyType({ id, type, text: "", required: false }, type);
}

export function moveItem<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(index, 1);
  if (item === undefined) return list;
  copy.splice(target, 0, item);
  return copy;
}

export function createEmptyQuestionnaire(project: Project): Questionnaire {
  return {
    id: `q-${project.id}`,
    projectId: project.id,
    slug: project.slug,
    title: project.title,
    description: "",
    researcher: "",
    estimatedMinutes: 5,
    consentText: [],
    questions: [],
  };
}
