"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { groupQuestions, orderQuestions, resolveSectionId } from "@/features/survey/section-utils";
import { cn } from "@/lib/utils";
import type { NavigationMode, Question, QuestionType, Questionnaire, Section } from "@/types";
import { BuilderPreview } from "./builder-preview";
import { createQuestion, questionTypes } from "./builder-utils";
import { QuestionEditor } from "./question-editor";
import {
  addQuestionToSection,
  addSection,
  createSection,
  moveQuestionInGroup,
  moveQuestionToSection,
  moveSection,
  removeQuestion,
  removeSection,
  updateSection,
} from "./section-utils";

interface Props {
  initial: Questionnaire;
  projectTitle: string;
  initialPublished: boolean;
}

const selectClass = "h-10 rounded-md border bg-card px-3 text-sm";

export function BuilderEditor({ initial, projectTitle, initialPublished }: Props) {
  const t = useTranslations("builder");
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [sections, setSections] = useState<Section[]>(initial.sections ?? []);
  const [questions, setQuestions] = useState<Question[]>(() => orderQuestions(initial.questions, initial.sections ?? []));
  const [navigationMode, setNavigationMode] = useState<NavigationMode>(initial.navigationMode ?? "perQuestion");
  const [selectedId, setSelectedId] = useState<string | null>(() => orderQuestions(initial.questions, initial.sections ?? [])[0]?.id ?? null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [published, setPublished] = useState(initialPublished);
  const [newType, setNewType] = useState<QuestionType>("likert");
  const [newSectionId, setNewSectionId] = useState<string | null>(null);

  const hasSections = sections.length > 0;
  const selected = questions.find((q) => q.id === selectedId) ?? null;
  const targetSectionId = newSectionId !== null && sections.some((s) => s.id === newSectionId) ? newSectionId : null;
  const numberById = new Map(questions.map((q, i) => [q.id, i + 1]));
  const sectionLabel = (s: Section, i: number) => s.title.trim() || t("defaultSectionTitle", { number: i + 1 });

  const update = (q: Question) => setQuestions((list) => list.map((x) => (x.id === q.id ? q : x)));
  const add = () => {
    const q = createQuestion(newType);
    setQuestions((list) => addQuestionToSection(list, sections, q, targetSectionId));
    setSelectedId(q.id);
  };
  const remove = (id: string) => {
    setQuestions((list) => removeQuestion(list, sections, id));
    if (selectedId === id) setSelectedId(null);
  };
  const move = (id: string, delta: -1 | 1) => setQuestions((list) => moveQuestionInGroup(list, sections, id, delta));
  const assign = (id: string, sectionId: string | null) => setQuestions((list) => moveQuestionToSection(list, sections, id, sectionId));

  const addNewSection = () => {
    const section = createSection(t("defaultSectionTitle", { number: sections.length + 1 }));
    setSections((list) => addSection(list, section));
    setNewSectionId(section.id);
  };
  const deleteSection = (id: string) => {
    const result = removeSection(questions, sections, id);
    setSections(result.sections);
    setQuestions(result.questions);
  };

  const renderRows = (list: Question[]) => (
    <ul className="space-y-1">
      {list.map((q, i) => (
        <li key={q.id} className={cn("flex items-center gap-1 rounded-md border p-1", q.id === selectedId && "border-primary bg-primary/10")}>
          <button type="button" className="min-w-0 flex-1 rounded px-2 py-1 text-left text-sm" onClick={() => setSelectedId(q.id)} aria-current={q.id === selectedId}>
            <span className="block truncate">{numberById.get(q.id)}. {q.text || t("emptyText")}</span>
            <span className="text-xs text-muted-foreground">{t(`types.${q.type}`)}</span>
          </button>
          <Button variant="ghost" size="icon" aria-label={t("moveUp")} disabled={i === 0} onClick={() => move(q.id, -1)}><ArrowUp className="h-4 w-4" aria-hidden /></Button>
          <Button variant="ghost" size="icon" aria-label={t("moveDown")} disabled={i === list.length - 1} onClick={() => move(q.id, 1)}><ArrowDown className="h-4 w-4" aria-hidden /></Button>
          <Button variant="ghost" size="icon" aria-label={t("remove")} onClick={() => remove(q.id)}><Trash2 className="h-4 w-4" aria-hidden /></Button>
        </li>
      ))}
    </ul>
  );

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
          <div className="space-y-1">
            <label className="block space-y-1 text-sm">
              <span className="font-medium">{t("navigationMode")}</span>
              <select className={cn(selectClass, "block w-full sm:w-72")} value={navigationMode}
                onChange={(e) => setNavigationMode(e.target.value === "perSection" ? "perSection" : "perQuestion")}>
                <option value="perQuestion">{t("navPerQuestion")}</option>
                <option value="perSection">{t("navPerSection")}</option>
              </select>
            </label>
            <p className="text-xs text-muted-foreground">{navigationMode === "perSection" && !hasSections ? t("navNeedsSections") : t("navNote")}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2" role="group" aria-label={t("mode")}>
        <Button variant={mode === "edit" ? "default" : "outline"} size="sm" aria-pressed={mode === "edit"} onClick={() => setMode("edit")}>{t("tabEdit")}</Button>
        <Button variant={mode === "preview" ? "default" : "outline"} size="sm" aria-pressed={mode === "preview"} onClick={() => setMode("preview")}>{t("tabPreview")}</Button>
      </div>

      {mode === "preview" ? (
        <BuilderPreview title={title} description={description} questions={questions} sections={sections} navigationMode={navigationMode} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
          <Card className="self-start">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-medium">{t("questions")} ({questions.length})</h2>
                <Button variant="outline" size="sm" onClick={addNewSection}><Plus className="h-4 w-4" aria-hidden /> {t("addSection")}</Button>
              </div>
              {hasSections && <p className="text-xs text-muted-foreground">{t("removeSectionHint")}</p>}
            </CardHeader>
            <CardContent className="space-y-3">
              {questions.length === 0 && !hasSections && <p className="text-sm text-muted-foreground">{t("noQuestions")}</p>}

              {!hasSections && questions.length > 0 && renderRows(questions)}

              {hasSections && groupQuestions(questions, sections).map((group) => {
                const section = group.section;
                if (!section) {
                  return (
                    <div key="no-section" className="space-y-1">
                      <h3 className="px-1 text-sm font-medium text-muted-foreground">{t("unsectioned")}</h3>
                      {renderRows(group.questions)}
                    </div>
                  );
                }
                const i = sections.findIndex((s) => s.id === section.id);
                return (
                  <div key={section.id} className="space-y-1">
                    <div className="space-y-1 rounded-md bg-muted p-1">
                      <div className="flex items-center gap-1">
                        <Input aria-label={t("sectionName")} placeholder={t("defaultSectionTitle", { number: i + 1 })} value={section.title}
                          onChange={(e) => setSections((list) => updateSection(list, section.id, { title: e.target.value }))} />
                        <Button variant="ghost" size="icon" aria-label={t("moveSectionUp")} disabled={i === 0} onClick={() => setSections((list) => moveSection(list, section.id, -1))}><ArrowUp className="h-4 w-4" aria-hidden /></Button>
                        <Button variant="ghost" size="icon" aria-label={t("moveSectionDown")} disabled={i === sections.length - 1} onClick={() => setSections((list) => moveSection(list, section.id, 1))}><ArrowDown className="h-4 w-4" aria-hidden /></Button>
                        <Button variant="ghost" size="icon" aria-label={t("removeSection")} onClick={() => deleteSection(section.id)}><Trash2 className="h-4 w-4" aria-hidden /></Button>
                      </div>
                      <Input className="h-8 text-xs" aria-label={t("sectionDescription")} placeholder={t("sectionDescription")} value={section.description ?? ""}
                        onChange={(e) => setSections((list) => updateSection(list, section.id, { description: e.target.value }))} />
                    </div>
                    {group.questions.length === 0 ? <p className="px-1 text-xs text-muted-foreground">{t("emptySection")}</p> : renderRows(group.questions)}
                  </div>
                );
              })}

              <div className="space-y-2">
                <div className="flex gap-2">
                  <select aria-label={t("type")} className={cn(selectClass, "min-w-0 flex-1 px-2")} value={newType} onChange={(e) => setNewType(e.target.value as QuestionType)}>
                    {questionTypes.map((type) => <option key={type} value={type}>{t(`types.${type}`)}</option>)}
                  </select>
                  <Button onClick={add}><Plus className="h-4 w-4" aria-hidden /> {t("addQuestion")}</Button>
                </div>
                {hasSections && (
                  <select aria-label={t("addToSection")} className={cn(selectClass, "w-full px-2")} value={targetSectionId ?? ""} onChange={(e) => setNewSectionId(e.target.value || null)}>
                    <option value="">{t("addToUnsectioned")}</option>
                    {sections.map((s, i) => <option key={s.id} value={s.id}>{t("addToNamed", { name: sectionLabel(s, i) })}</option>)}
                  </select>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-5">
              {selected && hasSections && (
                <label className="block space-y-1 text-sm">
                  <span className="font-medium">{t("questionSection")}</span>
                  <select className={cn(selectClass, "block w-full sm:w-72")} value={resolveSectionId(selected, sections) ?? ""} onChange={(e) => assign(selected.id, e.target.value || null)}>
                    <option value="">{t("unsectioned")}</option>
                    {sections.map((s, i) => <option key={s.id} value={s.id}>{sectionLabel(s, i)}</option>)}
                  </select>
                </label>
              )}
              {selected ? <QuestionEditor key={selected.id} question={selected} onChange={update} /> : <p className="text-muted-foreground">{t("selectQuestion")}</p>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
