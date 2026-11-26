/**
 * Satu-satunya tempat untuk mengubah identitas produk.
 * Komponen WAJIB membaca dari sini, bukan menulis nama produk secara langsung.
 */
export const brand = {
  name: "Research Platform", // sementara, belum final
  shortName: "RP",
  tagline: { id: "Platform kuesioner dan analisis riset", en: "Research questionnaire and analysis platform" },
  logoPath: null as string | null, // contoh: "/logo.svg"; null = pakai inisial shortName
} as const;
