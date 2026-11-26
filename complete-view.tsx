"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { Link, useRouter } from "@/i18n/navigation";
import { useSurvey } from "./survey-provider";

export function CompleteView() {
  const t = useTranslations("survey");
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { questionnaire: q, consented, reset } = useSurvey();

  useEffect(() => {
    if (!consented) router.replace(routes.survey.intro(q.slug));
  }, [consented, q.slug, router]);

  if (!consented) return null;

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <motion.div initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
        <CheckCircle2 className="h-16 w-16 text-primary" aria-hidden />
      </motion.div>
      <h1 className="text-2xl font-semibold">{t("completeTitle")}</h1>
      <p className="text-muted-foreground">{t("completeText")}</p>
      <p className="rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">{t("demoNote")}</p>
      {q.contactEmail && <p className="text-sm">{t("contact")} {q.contactEmail}</p>}
      <Link href={routes.survey.intro(q.slug)} onClick={reset} className={buttonVariants({ variant: "outline" })}>{t("backToStart")}</Link>
    </div>
  );
}
