import { setRequestLocale } from "next-intl/server";
import { ConsentView } from "@/features/survey/consent-view";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ConsentView />;
}
