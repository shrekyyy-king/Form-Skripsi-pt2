"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { Link, useRouter } from "@/i18n/navigation";
import { QuestionField, SectionHeading } from "./question-field";
import { buildPagesFor, firstErrorId, getPageProgress, resolveNavigationMode, validatePage, type AnswerError } from "./section-utils";
import { useSurvey, type AnswerValue } from "./survey-provider";

/**
 * Alur pengisian. `index` di provider adalah indeks LAYAR:
 * - perQuestion: satu soal per layar (sama dengan perilaku lama; judul seksi tampil bila ada),
 * - perSection: semua soal satu seksi per layar, validasi dan progres per seksi.
 */
export function QuestionFlow() {
  const t = useTranslations("survey");
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { questionnaire: q, consented, answers, index, setAnswer, setIndex } = useSurvey();
  const [errors, setErrors] = useState<Record<string, AnswerError>>({});

  const mode = resolveNavigationMode(q);
  const pages = useMemo(() => buildPagesFor(q), [q]);
  const page = pages[index];

  // State hilang saat halaman di-refresh: kembali ke awal.
  useEffect(() => {
    if (!consented) router.replace(routes.survey.intro(q.slug));
  }, [consented, q.slug, router]);

  // Layar baru yang panjang (mode perSection) selalu dimulai dari atas.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [index, reduceMotion]);

  if (!consented) return null;
  if (!page) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">{t("noQuestions")}</p>
        <Link href={routes.survey.intro(q.slug)} className={buttonVariants({ variant: "outline" })}>{t("backToStart")}</Link>
      </div>
    );
  }

  const progress = getPageProgress(pages.length, index);
  const isLast = index + 1 >= pages.length;
  const errorText = (code: AnswerError) => (code === "required" ? t("required") : t("invalidNumber"));
  const errorCount = Object.keys(errors).length;

  const goNext = () => {
    const found = validatePage(page.questions, answers);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const target = firstErrorId(page.questions, found);
      const element = target ? document.getElementById(`field-${target}`) : null;
      if (element) {
        element.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
        element.focus({ preventScroll: true });
      }
      return;
    }
    setErrors({});
    if (isLast) router.push(routes.survey.complete(q.slug));
    else setIndex(index + 1);
  };
  const goPrevious = () => {
    setErrors({});
    setIndex(Math.max(0, index - 1));
  };
  const handleChange = (id: string, value: AnswerValue) => {
    setErrors((prev) => {
      if (prev[id] === undefined) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setAnswer(id, value);
  };

  const sectionTitle = page.section ? page.section.title.trim() || t("sectionFallbackTitle", { number: page.groupIndex + 1 }) : null;
  const progressLabel =
    mode === "perSection"
      ? t("sectionProgress", { current: progress.current, total: progress.total })
      : t("progress", { current: progress.current, total: progress.total });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground" aria-live="polite">{progressLabel}</p>
        <div role="progressbar" aria-label={progressLabel} aria-valuemin={1} aria-valuemax={progress.total} aria-valuenow={progress.current} className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress.percent}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={page.key} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-6">
          {sectionTitle && (
            <SectionHeading
              title={sectionTitle}
              description={page.startsGroup ? page.section?.description : undefined}
              label={mode === "perQuestion" ? t("sectionProgress", { current: page.groupIndex + 1, total: page.groupCount }) : undefined}
            />
          )}
          {page.questions.map((question) => {
            const code = errors[question.id];
            return (
              <QuestionField
                key={question.id}
                question={question}
                value={answers[question.id]}
                onChange={(v) => handleChange(question.id, v)}
                error={code ? errorText(code) : null}
                announceError={mode === "perQuestion"}
                legendClassName="text-lg"
              />
            );
          })}
        </motion.div>
      </AnimatePresence>

      {mode === "perSection" && errorCount > 0 && <p role="alert" className="text-sm text-destructive">{t("pageErrors", { count: errorCount })}</p>}

      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={goPrevious} disabled={index === 0}>{t("previous")}</Button>
        <Button onClick={goNext}>{isLast ? t("submit") : t("next")}</Button>
      </div>
    </div>
  );
}
