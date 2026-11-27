/** Statistik dasar. Fungsi murni tanpa ketergantungan UI. */
export const mean = (xs: number[]): number => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);

/** Varians sampel (pembagi n - 1). */
export function sampleVariance(xs: number[]): number {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1);
}

export const standardDeviation = (xs: number[]): number => Math.sqrt(sampleVariance(xs));

/**
 * Cronbach's alpha. `matrix[responden][butir]`, semua baris berpanjang sama.
 * Mengembalikan null bila data tidak cukup (kurang dari 2 responden/butir, atau varians total 0).
 */
export function cronbachAlpha(matrix: number[][]): number | null {
  const n = matrix.length;
  const k = matrix[0]?.length ?? 0;
  if (n < 2 || k < 2 || matrix.some((row) => row.length !== k)) return null;
  const itemVariances = Array.from({ length: k }, (_, j) => sampleVariance(matrix.map((row) => row[j] ?? NaN)));
  const totalVariance = sampleVariance(matrix.map((row) => row.reduce((a, b) => a + b, 0)));
  if (!(totalVariance > 0)) return null;
  const alpha = (k / (k - 1)) * (1 - itemVariances.reduce((a, b) => a + b, 0) / totalVariance);
  return Number.isFinite(alpha) ? alpha : null;
}
