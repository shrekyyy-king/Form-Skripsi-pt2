"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QuestionField, SectionHeading } from "@/features/survey/question-field";
import { buildPages, getPageProgress, groupQuestions, resolveNavigationMode, type QuestionGroup } from "@/features/survey/section-utils";
import type { AnswerValue } from "@/features/survey/survey-provider";
import type { NavigationMode, Question, Section } from "@/types";

interface Props {
  title: string;
  description: string;
  questions: Question[];
  sections: Section[];
  navigationMode: NavigationMode;
}

/** Pratinjau kuesioner: "Per layar" meniru alur responden (sesuai mode navigasi), "Semua" menampilkan seluruh soal sekaligus. Tanpa validasi, jawaban tidak disimpan. */
export function BuilderPreview({ title, description, questions, sections, navigationMode }: Props) {
  const t = useTranslations("builder");
  const ts = useTranslations("survey");
  const [view, setView] = useState<"paged" | "all">("paged");
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  // Pilihan kosong dibuang agar pratinjau sama dengan yang dilihat responden.
  const cleaned = questions.map((q) => ({ ...q, choices: q.choices?.filter(Boolean) }));
  const mode = resolveNavigationMode({ sections, navigationMode });
  const pages = buildPages(cleaned, sections, mode);
  const index = Math.min(pageIndex, Math.max(0, pages.length - 1));
  const page = pages[index];
  const progress = getPageProgress(pages.length, index);

  const sectionName = (section: Section | null, groupIndex: number) =>
    section ? section.title.trim() || t("defaultSectionTitle", { number: groupIndex + 1 }) : null;

  const renderField = (question: Question) => (
    <QuestionField key={question.id} question={question} value={answers[question.id]} fallbackText={t("emptyText")}
      onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))} />
  );

  const renderGroup = (group: QuestionGroup, groupIndex: number) => {
    const name = sectionName(group.section, groupIndex);
    return (
      <div key={group.section?.id ?? "no-section"} className="space-y-6">
        {name && <SectionHeading title={name} description={group.section?.description} />}
        {group.questions.map(renderField)}
      </div>
    );
  };

  const progressLabel =
    mode === "perSection"
      ? ts("sectionProgress", { current: progress.current, total: progress.total })
      : ts("progress", { current: progress.current, total: progress.total });

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{t("previewNote")}</p>
        <div className="flex gap-2 pt-2" role="group" aria-label={t("previewView")}>
          <Button variant={view === "paged" ? "default" : "outline"} size="sm" aria-pressed={view === "paged"} onClick={() => setView("paged")}>{t("previewPaged")}</Button>
          <Button variant={view === "all" ? "default" : "outline"} size="sm" aria-pressed={view === "all"} onClick={() => setView("all")}>{t("previewAll")}</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.length === 0 && <p className="text-muted-foreground">{t("noQuestions")}</p>}

        {questions.length > 0 && view === "all" && groupQuestions(cleaned, sections).filter((g) => g.questions.length > 0).map(renderGroup)}

        {questions.length > 0 && view === "paged" && page && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground" aria-live="polite">{progressLabel}</p>
              <div role="progressbar" aria-label={progressLabel} aria-valuemin={1} aria-valuemax={progress.total} aria-valuenow={progress.current} className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
            {page.section && (
              <SectionHeading
                title={sectionName(page.section, page.groupIndex) ?? ""}
                description={page.startsGroup ? page.section.description : undefined}
                label={mode === "perQuestion" ? ts("sectionProgress", { current: page.groupIndex + 1, total: page.groupCount }) : undefined}
              />
            )}
            {page.questions.map(renderField)}
            <div className="flex justify-between gap-2">
              <Button variant="outline" disabled={index === 0} onClick={() => setPageIndex(index - 1)}>{ts("previous")}</Button>
              <Button variant="outline" disabled={index + 1 >= pages.length} onClick={() => setPageIndex(index + 1)}>{ts("next")}</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
