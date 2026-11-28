import type { NavigationMode, Question, Questionnaire, Section } from "@/types";
import type { AnswerValue } from "./survey-provider";

/*
 * Utilitas murni untuk seksi: dipakai builder dan alur responden.
 * Tidak ada React, tidak ada akses data. Aturan dasarnya:
 * - Urutan tampil = seksi menurut urutan array `sections`, lalu soal "Tanpa seksi" di akhir.
 * - Di dalam satu kelompok, soal mengikuti urutan relatifnya di array `questions`.
 * - `sectionId` yang tidak cocok dengan seksi mana pun diperlakukan sebagai "Tanpa seksi".
 */

export interface QuestionGroup {
  /** `null` = kelompok "Tanpa seksi". */
  section: Section | null;
  questions: Question[];
}

/** Id seksi efektif sebuah soal; `null` bila tanpa seksi atau merujuk seksi yang sudah tidak ada. */
export function resolveSectionId(question: Question, sections: readonly Section[]): string | null {
  const id = question.sectionId;
  if (id === undefined) return null;
  return sections.some((s) => s.id === id) ? id : null;
}

/**
 * Mengelompokkan soal per seksi. Seksi kosong tetap muncul (builder perlu menampilkannya);
 * kelompok "Tanpa seksi" hanya muncul bila berisi soal.
 */
export function groupQuestions(questions: readonly Question[], sections: readonly Section[] = []): QuestionGroup[] {
  const groups: QuestionGroup[] = sections.map((section) => ({
    section,
    questions: questions.filter((q) => resolveSectionId(q, sections) === section.id),
  }));
  const unsectioned = questions.filter((q) => resolveSectionId(q, sections) === null);
  if (unsectioned.length > 0) groups.push({ section: null, questions: unsectioned });
  return groups;
}

/** Urutan datar semua soal sebagaimana dilihat responden dan builder. */
export function orderQuestions(questions: readonly Question[], sections: readonly Section[] = []): Question[] {
  return groupQuestions(questions, sections).flatMap((g) => g.questions);
}

/**
 * Mode navigasi yang benar-benar berlaku. Tanpa seksi, mode "perSection" tidak bermakna,
 * jadi perilaku lama (satu soal per layar) dipakai.
 */
export function resolveNavigationMode(q: Pick<Questionnaire, "sections" | "navigationMode">): NavigationMode {
  if (!q.sections || q.sections.length === 0) return "perQuestion";
  return q.navigationMode ?? "perQuestion";
}

/** Satu layar bagi responden (atau pratinjau). */
export interface SurveyPage {
  /** Kunci stabil untuk animasi/React. */
  key: string;
  /** Seksi layar ini; `null` bila soalnya tanpa seksi. */
  section: Section | null;
  questions: Question[];
  /** Posisi seksi ini di antara kelompok yang berisi soal (mulai 0). */
  groupIndex: number;
  /** Jumlah kelompok yang berisi soal. */
  groupCount: number;
  /** True bila layar ini memuat soal pertama kelompoknya (dipakai untuk menampilkan deskripsi seksi sekali). */
  startsGroup: boolean;
}

/** Menyusun layar sesuai mode. Kelompok kosong dilewati. Mode "perQuestion" menghasilkan satu soal per layar. */
export function buildPages(
  questions: readonly Question[],
  sections: readonly Section[] = [],
  mode: NavigationMode = "perQuestion",
): SurveyPage[] {
  const groups = groupQuestions(questions, sections).filter((g) => g.questions.length > 0);
  const groupCount = groups.length;
  const pages: SurveyPage[] = [];

  groups.forEach((group, groupIndex) => {
    const groupKey = group.section?.id ?? "no-section";
    if (mode === "perSection") {
      pages.push({ key: `section:${groupKey}`, section: group.section, questions: group.questions, groupIndex, groupCount, startsGroup: true });
      return;
    }
    group.questions.forEach((question, i) => {
      pages.push({ key: `question:${question.id}`, section: group.section, questions: [question], groupIndex, groupCount, startsGroup: i === 0 });
    });
  });
  return pages;
}

/** Layar untuk sebuah kuesioner, memakai mode yang berlaku (lihat `resolveNavigationMode`). */
export function buildPagesFor(q: Pick<Questionnaire, "questions" | "sections" | "navigationMode">): SurveyPage[] {
  return buildPages(q.questions, q.sections ?? [], resolveNavigationMode(q));
}

export interface PageProgress {
  /** Layar saat ini, mulai 1. */
  current: number;
  total: number;
  /** 0-100 */
  percent: number;
}

/** Progres berdasarkan layar. Pada mode "perSection" artinya progres per seksi. Indeks di luar rentang dijepit. */
export function getPageProgress(pageCount: number, pageIndex: number): PageProgress {
  if (pageCount <= 0) return { current: 0, total: 0, percent: 0 };
  const clamped = Math.min(Math.max(pageIndex, 0), pageCount - 1);
  const current = clamped + 1;
  return { current, total: pageCount, percent: (current / pageCount) * 100 };
}

export type AnswerError = "required" | "invalidNumber";

// Jawaban teks yang hanya berisi spasi dianggap kosong (soal wajib tidak boleh lolos dengan spasi).
const isEmptyAnswer = (value: AnswerValue | undefined) =>
  value === undefined || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0);

/** Validasi satu jawaban. Mengembalikan kode galat (diterjemahkan di komponen) atau `null` bila valid. */
export function validateAnswer(question: Question, value: AnswerValue | undefined): AnswerError | null {
  if (isEmptyAnswer(value)) return question.required ? "required" : null;
  // Number.isFinite menolak NaN dan Infinity (mis. "1e999").
  if (question.type === "numeric" && typeof value === "string" && !Number.isFinite(Number(value))) return "invalidNumber";
  return null;
}

/** Validasi semua soal pada satu layar. Hanya soal bermasalah yang ada di hasil (kunci = id soal). */
export function validatePage(
  questions: readonly Question[],
  answers: Readonly<Record<string, AnswerValue>>,
): Record<string, AnswerError> {
  const errors: Record<string, AnswerError> = {};
  for (const question of questions) {
    const error = validateAnswer(question, answers[question.id]);
    if (error) errors[question.id] = error;
  }
  return errors;
}

/** Id soal bermasalah pertama menurut urutan layar (untuk memindahkan fokus). */
export function firstErrorId(questions: readonly Question[], errors: Readonly<Record<string, AnswerError>>): string | null {
  return questions.find((q) => errors[q.id] !== undefined)?.id ?? null;
}
