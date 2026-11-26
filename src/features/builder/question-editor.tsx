"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import type { LikertOption, Question, QuestionType } from "@/types";
import { applyType, createLikertConfig, isChoiceType, questionTypes } from "./builder-utils";

const selectClass = "h-10 rounded-md border bg-card px-3 text-sm";

export function QuestionEditor({ question, onChange }: { question: Question; onChange: (question: Question) => void }) {
  const t = useTranslations("builder");
  const likert = question.likert;
  const set = (patch: Partial<Question>) => onChange({ ...question, ...patch });
  const updateOption = (index: number, patch: Partial<LikertOption>) => {
    if (!likert) return;
    set({ likert: { ...likert, options: likert.options.map((o, i) => (i === index ? { ...o, ...patch } : o)) } });
  };

  return (
    <div className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span className="font-medium">{t("questionText")}</span>
        <Input value={question.text} onChange={(e) => set({ text: e.target.value })} />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium">{t("questionDescription")}</span>
        <Input value={question.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
      </label>

      <div className="flex flex-wrap items-end gap-4">
        <label className="space-y-1 text-sm">
          <span className="block font-medium">{t("type")}</span>
          <select className={selectClass} value={question.type} onChange={(e) => onChange(applyType(question, e.target.value as QuestionType))}>
            {questionTypes.map((type) => <option key={type} value={type}>{t(`types.${type}`)}</option>)}
          </select>
        </label>
        <label className="flex h-10 items-center gap-2 text-sm">
          <input type="checkbox" className="accent-primary" checked={question.required} onChange={(e) => set({ required: e.target.checked })} />
          {t("required")}
        </label>
      </div>

      {question.type === "likert" && likert && (
        <fieldset className="space-y-3 rounded-md border p-3">
          <legend className="px-1 text-sm font-medium">{t("likertSettings")}</legend>
          <div className="flex flex-wrap items-end gap-4">
            <label className="space-y-1 text-sm">
              <span className="block">{t("points")}</span>
              <select className={selectClass} value={likert.points} onChange={(e) => set({ likert: createLikertConfig(Number(e.target.value), likert) })}>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="block">{t("direction")}</span>
              <select className={selectClass} value={likert.direction} onChange={(e) => set({ likert: { ...likert, direction: e.target.value === "descending" ? "descending" : "ascending" } })}>
                <option value="ascending">{t("ascending")}</option>
                <option value="descending">{t("descending")}</option>
              </select>
            </label>
            <label className="flex h-10 items-center gap-2 text-sm">
              <input type="checkbox" className="accent-primary" checked={likert.reverseScored} onChange={(e) => set({ likert: { ...likert, reverseScored: e.target.checked } })} />
              {t("reverseScored")}
            </label>
          </div>
          <div className="space-y-2">
            {likert.options.map((o, i) => (
              <div key={i} className="grid items-center gap-2 sm:grid-cols-[4.5rem_1fr_1fr]">
                <Input type="number" aria-label={t("optionValue")} value={o.value}
                  onChange={(e) => { const n = Number(e.target.value); if (!Number.isNaN(n)) updateOption(i, { value: n }); }} />
                <Input aria-label={t("optionLabel")} placeholder={t("optionLabel")} value={o.label} onChange={(e) => updateOption(i, { label: e.target.value })} />
                <Input aria-label={t("optionDescription")} placeholder={t("optionDescription")} value={o.description ?? ""} onChange={(e) => updateOption(i, { description: e.target.value })} />
              </div>
            ))}
          </div>
        </fieldset>
      )}

      {isChoiceType(question.type) && (
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t("choices")}</span>
          <textarea rows={5} className="w-full rounded-md border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={(question.choices ?? []).join("\n")} onChange={(e) => set({ choices: e.target.value.split("\n") })} />
        </label>
      )}
    </div>
  );
}
