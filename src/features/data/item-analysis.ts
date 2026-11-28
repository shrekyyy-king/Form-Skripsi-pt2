import { scoreLikert } from "@/lib/scoring";
import { cronbachAlpha, mean, standardDeviation } from "@/lib/stats";
import type { Questionnaire } from "@/types";
import type { RespondentResponse } from "@/types/response";

/** Statistik satu butir Likert. `label` = "Q<nomor soal>" (nomor di seluruh kuesioner, sama dengan kolom dataset). */
export interface ItemStat {
  label: string;
  text: string;
  n: number;
  mean: number;
  sd: number;
  /** Rata-rata sebagai persen dari nilai opsi tertinggi (untuk batang grafik), 0-100. */
  percent: number;
}

export interface ItemAnalysis {
  items: ItemStat[];
  /** Cronbach's alpha; null bila data tidak cukup. */
  alpha: number | null;
}

/** Jawaban kosong atau bukan angka dianggap hilang (NaN). */
function toNumber(value: string | string[] | undefined): number {
  if (typeof value !== "string" || value.trim() === "") return NaN;
  return Number(value);
}

/**
 * Analisis butir Likert. Hanya responden yang menjawab SEMUA butir Likert yang dihitung;
 * reverse scoring diterapkan lewat `scoreLikert`. Fungsi murni, tanpa UI.
 */
export function analyzeLikertItems(questionnaire: Questionnaire, responses: RespondentResponse[]): ItemAnalysis {
  const items = questionnaire.questions.flatMap((q, i) => (q.type === "likert" && q.likert ? [{ q, config: q.likert, label: `Q${i + 1}` }] : []));

  const matrix: number[][] = [];
  for (const r of responses) {
    const row: number[] = [];
    for (const { q, config } of items) {
      const n = toNumber(r.answers[q.id]);
      if (Number.isNaN(n)) break;
      row.push(scoreLikert(n, config));
    }
    if (row.length === items.length && items.length > 0) matrix.push(row);
  }

  const stats = items.map(({ config, label, q }, j): ItemStat => {
    const xs = matrix.map((row) => row[j] ?? NaN);
    const m = mean(xs);
    const max = Math.max(...config.options.map((o) => o.value));
    return { label, text: q.text, n: xs.length, mean: m, sd: standardDeviation(xs), percent: Number.isFinite(m) ? Math.min(100, (m / max) * 100) : 0 };
  });

  return { items: stats, alpha: cronbachAlpha(matrix) };
}
