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
      // Jawaban kosong (termasuk hanya spasi) = sel kosong, BUKAN 0 (Number("") === 0).
      if (value === undefined || (typeof value === "string" && value.trim() === "")) return "";
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

// Sel teks yang diawali karakter ini ditafsirkan sebagai RUMUS oleh Excel/Sheets (CSV injection).
const FORMULA_START = /^[=+\-@\t\r]/;
// Angka biasa (mis. "-3", "+62812", "4,5") bukan rumus; jangan diubah.
const PLAIN_NUMBER = /^[+-]?\d+(?:[.,]\d+)?$/;

/** Menetralkan sel teks berbahaya dengan awalan apostrof (saran OWASP). Angka (tipe number) tidak disentuh. */
function neutralize(value: Cell): string {
  if (typeof value === "number") return String(value);
  return FORMULA_START.test(value) && !PLAIN_NUMBER.test(value) ? `'${value}` : value;
}

export function toCsv(header: string[], rows: Cell[][]): string {
  const escape = (v: Cell) => {
    const s = neutralize(v);
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
}
