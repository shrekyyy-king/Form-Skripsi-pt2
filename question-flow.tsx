"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useRouter } from "@/i18n/navigation";
import { QuestionInput } from "./question-input";
import { useSurvey } from "./survey-provider";

export function QuestionFlow() {
  const t = useTranslations("survey");
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { questionnaire: q, consented, answers, index, setAnswer, setIndex } = useSurvey();
  const [error, setError] = useState<string | null>(null);

  // State hilang saat halaman di-refresh: kembali ke awal.
  useEffect(() => {
    if (!consented) router.replace(routes.survey.intro(q.slug));
  }, [consented, q.slug, router]);

  const question = q.questions[index];
  if (!consented || !question) return null;

  const total = q.questions.length;
  const value = answers[question.id];

  const validate = (): string | null => {
    const empty = value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
    if (empty) return question.required ? t("required") : null;
    if (question.type === "numeric" && typeof value === "string" && Number.isNaN(Number(value))) return t("invalidNumber");
    return null;
  };

  const goNext = () => {
    const message = validate();
    if (message) { setError(message); return; }
    setError(null);
    if (index + 1 < total) setIndex(index + 1);
    else router.push(routes.survey.complete(q.slug));
  };
  const goPrevious = () => { setError(null); setIndex(Math.max(0, index - 1)); };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground" aria-live="polite">{t("progress", { current: index + 1, total })}</p>
        <div role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1} className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={question.id} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.15 }}>
          <fieldset className="space-y-4">
            <legend id={`${question.id}-label`} className="text-lg font-medium">
              {question.text}
              {question.required && <span aria-hidden> *</span>}
            </legend>
            {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
            <QuestionInput question={question} value={value} onChange={(v) => { setError(null); setAnswer(question.id, v); }} />
          </fieldset>
        </motion.div>
      </AnimatePresence>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={goPrevious} disabled={index === 0}>{t("previous")}</Button>
        <Button onClick={goNext}>{index + 1 < total ? t("next") : t("submit")}</Button>
      </div>
    </div>
  );
}
