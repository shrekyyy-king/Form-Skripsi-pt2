import { groupQuestions, orderQuestions, resolveSectionId } from "@/features/survey/section-utils";
import type { Question, Section } from "@/types";
import { moveItem } from "./builder-utils";

/*
 * Mutasi seksi untuk builder. Semua fungsi murni: tidak mengubah argumen, selalu mengembalikan salinan.
 * Larik soal yang dikembalikan selalu berurutan sesuai urutan tampil (seksi demi seksi, "Tanpa seksi" di akhir),
 * supaya urutan tetap sama bila seluruh seksi kelak dihapus.
 */

export function createSection(title: string): Section {
  const id = `sec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  return { id, title };
}

export function addSection(sections: readonly Section[], section: Section): Section[] {
  return [...sections, section];
}

export function updateSection(sections: readonly Section[], id: string, patch: Partial<Omit<Section, "id">>): Section[] {
  return sections.map((s) => (s.id === id ? { ...s, ...patch } : s));
}

export function moveSection(sections: readonly Section[], id: string, delta: -1 | 1): Section[] {
  const index = sections.findIndex((s) => s.id === id);
  if (index === -1) return [...sections];
  return moveItem([...sections], index, delta);
}

/** Menghapus seksi; soalnya pindah ke "Tanpa seksi" (diletakkan di akhir). */
export function removeSection(
  questions: readonly Question[],
  sections: readonly Section[],
  id: string,
): { questions: Question[]; sections: Section[] } {
  const nextSections = sections.filter((s) => s.id !== id);
  // Urutkan dulu menurut tampilan sebelum penghapusan, baru lepaskan sectionId.
  const cleared = orderQuestions(questions, sections).map((q) => (q.sectionId === id ? { ...q, sectionId: undefined } : q));
  return { sections: nextSections, questions: orderQuestions(cleared, nextSections) };
}

/** Menyisipkan soal di akhir kelompok tujuan (`null` = "Tanpa seksi"). `rest` tidak boleh memuat soal yang sama. */
function insertAtGroupEnd(rest: readonly Question[], sections: readonly Section[], question: Question, sectionId: string | null): Question[] {
  const targetId = sectionId !== null && sections.some((s) => s.id === sectionId) ? sectionId : null;
  const placed: Question = { ...question, sectionId: targetId ?? undefined };
  const copy = [...rest];
  let lastIndex = -1;
  copy.forEach((q, i) => { if (resolveSectionId(q, sections) === targetId) lastIndex = i; });
  copy.splice(lastIndex === -1 ? copy.length : lastIndex + 1, 0, placed);
  return orderQuestions(copy, sections);
}

/** Menambah soal baru di akhir seksi tujuan. */
export function addQuestionToSection(questions: readonly Question[], sections: readonly Section[], question: Question, sectionId: string | null): Question[] {
  return insertAtGroupEnd(questions, sections, question, sectionId);
}

/** Memindahkan soal ke seksi lain (ke akhir kelompok tujuan). Tidak berubah bila soal tidak ditemukan atau sudah di sana. */
export function moveQuestionToSection(questions: readonly Question[], sections: readonly Section[], id: string, sectionId: string | null): Question[] {
  const question = questions.find((q) => q.id === id);
  if (!question) return [...questions];
  const targetId = sectionId !== null && sections.some((s) => s.id === sectionId) ? sectionId : null;
  if (resolveSectionId(question, sections) === targetId) return orderQuestions(questions, sections);
  return insertAtGroupEnd(questions.filter((q) => q.id !== id), sections, question, targetId);
}

/** Menaik/menurunkan soal di dalam kelompoknya saja (tidak melompati batas seksi). */
export function moveQuestionInGroup(questions: readonly Question[], sections: readonly Section[], id: string, delta: -1 | 1): Question[] {
  const group = groupQuestions(questions, sections).find((g) => g.questions.some((q) => q.id === id));
  if (!group) return [...questions];
  const position = group.questions.findIndex((q) => q.id === id);
  const neighbor = group.questions[position + delta];
  if (!neighbor) return orderQuestions(questions, sections);

  const ordered = orderQuestions(questions, sections);
  const a = ordered.findIndex((q) => q.id === id);
  const b = ordered.findIndex((q) => q.id === neighbor.id);
  const first = ordered[a];
  const second = ordered[b];
  if (!first || !second) return ordered;
  ordered[a] = second;
  ordered[b] = first;
  return ordered;
}

/** Menghapus soal. */
export function removeQuestion(questions: readonly Question[], sections: readonly Section[], id: string): Question[] {
  return orderQuestions(questions.filter((q) => q.id !== id), sections);
}
