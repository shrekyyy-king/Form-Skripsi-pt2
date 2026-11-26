"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuestionInput } from "@/features/survey/question-input";
import type { AnswerValue } from "@/features/survey/survey-provider";
import { cn } from "@/lib/utils";
import type { Question, QuestionType, Questionnaire } from "@/types";
import { createQuestion, moveItem, questionTypes } from "./builder-utils";
import { QuestionEditor } from "./question-editor";

interface Props {
  initial: Questionnaire;
  projectTitle: string;
  initialPublished: boolean;
}

export function BuilderEditor({ initial, projectTitle, initialPublished }: Props) {
  const t = useTranslations("builder");
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [questions, setQuestions] = useState<Question[]>(initial.questions);
  const [selectedId, setSelectedId] = useState<string | null>(initial.questions[0]?.id ?? null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [published, setPublished] = useState(initialPublished);
  const [newType, setNewType] = useState<QuestionType>("likert");
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, AnswerValue>>({});

  const selected = questions.find((q) => q.id === selectedId) ?? null;
  const update = (q: Question) => setQuestions((list) => list.map((x) => (x.id === q.id ? q : x)));
  const add = () => {
    const q = createQuestion(newType);
    setQuestions((list) => [...list, q]);
    setSelectedId(q.id);
  };
  const remove = (id: string) => {
    setQuestions((list) => list.filter((x) => x.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const move = (index: number, delta: -1 | 1) => setQuestions((list) => moveItem(list, index, delta));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{projectTitle}</p>
        </div>
        <Badge>{t("demoNotice")}</Badge>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-5">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">{t("questionnaireTitle")}</span>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">{t("description")}</span>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" className="accent-primary" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              {t("published")}
            </label>
            <p className="text-xs text-muted-foreground">{t("publishNote")}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2" role="group" aria-label={t("mode")}>
        <Button variant={mode === "edit" ? "default" : "outline"} size="sm" aria-pressed={mode === "edit"} onClick={() => setMode("edit")}>{t("tabEdit")}</Button>
        <Button variant={mode === "preview" ? "default" : "outline"} size="sm" aria-pressed={mode === "preview"} onClick={() => setMode("preview")}>{t("tabPreview")}</Button>
      </div>

      {mode === "preview" ? (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground">{t("previewNote")}</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {questions.length === 0 && <p className="text-muted-foreground">{t("noQuestions")}</p>}
            {questions.map((q) => (
              <fieldset key={q.id} className="space-y-3">
                <legend id={`${q.id}-label`} className="font-medium">
                  {q.text || t("emptyText")}
                  {q.required && <span aria-hidden> *</span>}
                </legend>
                {q.description && <p className="text-sm text-muted-foreground">{q.description}</p>}
                <QuestionInput question={{ ...q, choices: q.choices?.filter(Boolean) }} value={previewAnswers[q.id]}
                  onChange={(v) => setPreviewAnswers((prev) => ({ ...prev, [q.id]: v }))} />
              </fieldset>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
          <Card className="self-start">
            <CardHeader><h2 className="font-medium">{t("questions")} ({questions.length})</h2></CardHeader>
            <CardContent className="space-y-3">
              {questions.length === 0 && <p className="text-sm text-muted-foreground">{t("noQuestions")}</p>}
              <ul className="space-y-1">
                {questions.map((q, i) => (
                  <li key={q.id} className={cn("flex items-center gap-1 rounded-md border p-1", q.id === selectedId && "border-primary bg-primary/10")}>
                    <button type="button" className="min-w-0 flex-1 rounded px-2 py-1 text-left text-sm" onClick={() => setSelectedId(q.id)} aria-current={q.id === selectedId}>
                      <span className="block truncate">{i + 1}. {q.text || t("emptyText")}</span>
                      <span className="text-xs text-muted-foreground">{t(`types.${q.type}`)}</span>
                    </button>
                    <Button variant="ghost" size="icon" aria-label={t("moveUp")} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" aria-hidden /></Button>
                    <Button variant="ghost" size="icon" aria-label={t("moveDown")} disabled={i === questions.length - 1} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" aria-hidden /></Button>
                    <Button variant="ghost" size="icon" aria-label={t("remove")} onClick={() => remove(q.id)}><Trash2 className="h-4 w-4" aria-hidden /></Button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <select aria-label={t("type")} className="h-10 min-w-0 flex-1 rounded-md border bg-card px-2 text-sm" value={newType} onChange={(e) => setNewType(e.target.value as QuestionType)}>
                  {questionTypes.map((type) => <option key={type} value={type}>{t(`types.${type}`)}</option>)}
                </select>
                <Button onClick={add}><Plus className="h-4 w-4" aria-hidden /> {t("addQuestion")}</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              {selected ? <QuestionEditor key={selected.id} question={selected} onChange={update} /> : <p className="text-muted-foreground">{t("selectQuestion")}</p>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
