"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import type { Question } from "@/types";
import type { AnswerValue } from "./survey-provider";

const optionClass =
  "flex cursor-pointer items-start gap-3 rounded-md border bg-card p-3 text-sm transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring";
const fieldClass = "w-full rounded-md border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface Props {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}

export function QuestionInput({ question, value, onChange }: Props) {
  const t = useTranslations("survey");
  const name = question.id;
  const text = typeof value === "string" ? value : "";
  const list = Array.isArray(value) ? value : [];
  const choices = question.choices ?? [];

  if (question.type === "likert" && question.likert) {
    const options = question.likert.direction === "descending" ? [...question.likert.options].reverse() : question.likert.options;
    return (
      <div role="radiogroup" aria-labelledby={`${name}-label`} className="grid gap-2">
        {options.map((o) => (
          <label key={o.value} className={optionClass}>
            <input type="radio" className="mt-0.5 accent-primary" name={name} checked={text === String(o.value)} onChange={() => onChange(String(o.value))} />
            <span>
              <span className="font-medium">{o.value}. {o.label}</span>
              {o.description && <span className="block text-muted-foreground">{o.description}</span>}
            </span>
          </label>
        ))}
      </div>
    );
  }

  switch (question.type) {
    case "multipleChoice":
      return (
        <div role="radiogroup" aria-labelledby={`${name}-label`} className="grid gap-2">
          {choices.map((c) => (
            <label key={c} className={optionClass}>
              <input type="radio" className="mt-0.5 accent-primary" name={name} checked={text === c} onChange={() => onChange(c)} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div role="group" aria-labelledby={`${name}-label`} className="grid gap-2">
          {choices.map((c) => (
            <label key={c} className={optionClass}>
              <input type="checkbox" className="mt-0.5 accent-primary" checked={list.includes(c)}
                onChange={(e) => onChange(e.target.checked ? [...list, c] : list.filter((x) => x !== c))} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      );
    case "dropdown":
      return (
        <select aria-labelledby={`${name}-label`} className={`${fieldClass} h-10`} value={text} onChange={(e) => onChange(e.target.value)}>
          <option value="">{t("select")}</option>
          {choices.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      );
    case "longAnswer":
      return <textarea aria-labelledby={`${name}-label`} rows={5} className={`${fieldClass} py-2`} value={text} onChange={(e) => onChange(e.target.value)} />;
    case "numeric":
      return <Input aria-labelledby={`${name}-label`} type="number" inputMode="decimal" value={text} onChange={(e) => onChange(e.target.value)} />;
    default:
      return <Input aria-labelledby={`${name}-label`} type="text" value={text} onChange={(e) => onChange(e.target.value)} />;
  }
}
