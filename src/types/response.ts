/** Satu responden yang menyelesaikan kuesioner. Kunci `answers` = id soal. */
export interface RespondentResponse {
  id: string;
  questionnaireSlug: string;
  submittedAt: string; // ISO
  answers: Record<string, string | string[]>;
}
