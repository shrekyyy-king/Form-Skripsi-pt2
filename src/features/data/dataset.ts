import { scoreLikert } from "@/lib/scoring";
import type { Questionnaire } from "@/types";
import type { RespondentResponse } from "@/types/response";

export interface DatasetColumn { label: string; text: string }
type Cell = string | number;

/** Mengubah respons menjadi tabel datar. `applyScoring` menerapkan reverse scoring pada soal Likert. */
export function buildDataset(questionnaire: Questionnaire, responses: RespondentResponse[], applyScoring: boolean) {
  const columns: DatasetColumn[] = questionnaire.questions.map((q, i) => ({ label: `Q${i + 1}`, text: q.text }));
  const rows: Cell[][] = responses.map((r, n) => [
    `R${n + 1}`,
    ...questionnaire.questions.map((q): Cell => {
      const value = r.answers[q.id];
      if (value === undefined) return "";
      if (Array.isArray(value)) return value.join("; ");
      if (q.type === "likert" && q.likert) {
        const num = Number(value);
        if (!Number.isNaN(num)) return applyScoring ? scoreLikert(num, q.likert) : num;
      }
      return value;
    }),
  ]);
  return { columns, header: ["ID", ...columns.map((c) => c.label)], rows };
}

export function toCsv(header: string[], rows: Cell[][]): string {
  const escape = (v: Cell) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
}
