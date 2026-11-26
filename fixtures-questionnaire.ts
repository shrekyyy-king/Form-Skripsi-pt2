import type { LikertConfig, Questionnaire } from "@/types";

// DATA DEMO: bukan data nyata.
const agree5: LikertConfig = {
  points: 5,
  direction: "ascending",
  reverseScored: false,
  options: [
    { value: 1, label: "Sangat tidak setuju" },
    { value: 2, label: "Tidak setuju" },
    { value: 3, label: "Netral" },
    { value: 4, label: "Setuju" },
    { value: 5, label: "Sangat setuju" },
  ],
};

export const demoQuestionnaires: Questionnaire[] = [
  {
    id: "q1",
    slug: "demo-servqual",
    title: "Kualitas Layanan Akademik (Demo)",
    description: "Kuesioner demo untuk mencoba alur responden. Isinya contoh, bukan instrumen penelitian sungguhan.",
    researcher: "Peneliti Demo",
    estimatedMinutes: 3,
    contactEmail: "peneliti@example.com",
    consentText: [
      "Penelitian ini bertujuan menggambarkan pengalaman Anda terhadap layanan akademik.",
      "Anda diminta menjawab beberapa pernyataan. Tidak ada jawaban benar atau salah.",
    ],
    questions: [
      { id: "s1", type: "likert", required: true, likert: agree5, text: "Staf layanan akademik merespons kebutuhan saya dengan cepat." },
      { id: "s2", type: "likert", required: true, likert: agree5, text: "Informasi yang diberikan akurat dan jelas." },
      { id: "s3", type: "likert", required: true, likert: { ...agree5, reverseScored: true }, text: "Prosedur layanan sulit dipahami." },
      { id: "s4", type: "likert", required: true, likert: agree5, text: "Secara keseluruhan saya puas dengan layanan akademik." },
      { id: "s5", type: "checkbox", required: false, text: "Layanan apa saja yang pernah Anda gunakan?", choices: ["Administrasi", "Perpustakaan", "Konseling", "Beasiswa"] },
      { id: "s6", type: "dropdown", required: true, text: "Angkatan Anda", choices: ["2021", "2022", "2023", "2024", "2025"] },
      { id: "s7", type: "numeric", required: false, text: "Semester berapa Anda saat ini?" },
      { id: "s8", type: "longAnswer", required: false, text: "Saran untuk perbaikan layanan (opsional)" },
    ],
  },
];
