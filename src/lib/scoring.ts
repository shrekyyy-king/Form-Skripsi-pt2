import type { LikertConfig } from "@/types";

/** Skor akhir sebuah jawaban Likert; memperhitungkan reverse scoring. Fungsi murni. */
export function scoreLikert(value: number, config: LikertConfig): number {
  if (!config.reverseScored) return value;
  const values = config.options.map((o) => o.value);
  return Math.max(...values) + Math.min(...values) - value;
}
