import type { RespondentResponse } from "@/types/response";

// DATA DEMO: bukan data responden nyata. Urutan: [s1, s2, s3 (reverse), s4].
const likert: number[][] = [
  [4, 5, 2, 4], [5, 4, 1, 5], [3, 3, 3, 3], [4, 4, 2, 4], [2, 3, 4, 2], [5, 5, 1, 5],
  [4, 3, 2, 4], [3, 4, 3, 3], [5, 4, 2, 5], [2, 2, 4, 2], [4, 5, 2, 5], [3, 3, 3, 4],
];
const cohorts = ["2021", "2022", "2023", "2024", "2025"];

export const demoResponses: RespondentResponse[] = likert.map((row, i) => ({
  id: `r${i + 1}`,
  questionnaireSlug: "demo-servqual",
  submittedAt: new Date(Date.UTC(2026, 10, 1 + i, 8)).toISOString(),
  answers: { s1: String(row[0]), s2: String(row[1]), s3: String(row[2]), s4: String(row[3]), s6: cohorts[i % cohorts.length] ?? "2021" },
}));
