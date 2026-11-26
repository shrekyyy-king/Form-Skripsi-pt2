import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"],
  defaultLocale: "id",
  localePrefix: "always", // wajib untuk situs statis: /id/... dan /en/...
});

export type Locale = (typeof routing.locales)[number];
