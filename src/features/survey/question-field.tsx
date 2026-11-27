"use client";

import { cn } from "@/lib/utils";
import type { Question } from "@/types";
import { QuestionInput } from "./question-input";
import type { AnswerValue } from "./survey-provider";

interface FieldProps {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  /** Teks galat yang sudah diterjemahkan; kosong = tidak ada galat. */
  error?: string | null;
  /** Teks pengganti bila teks soal masih kosong (pratinjau builder). */
  fallbackText?: string;
  /** Pakai role="alert" pada galat. Matikan bila halaman sudah punya ringkasan galat sendiri. */
  announceError?: boolean;
  legendClassName?: string;
}

/** Satu soal lengkap: judul, deskripsi, input, galat. Id `field-<id soal>` dipakai untuk memindahkan fokus ke soal yang belum valid. */
export function QuestionField({ question, value, onChange, error, fallbackText, announceError = true, legendClassName }: FieldProps) {
  const errorId = `${question.id}-error`;
  return (
    <fieldset id={`field-${question.id}`} tabIndex={-1} aria-describedby={error ? errorId : undefined} className="space-y-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <legend id={`${question.id}-label`} className={cn("font-medium", legendClassName)}>
        {question.text || fallbackText}
        {question.required && <span aria-hidden> *</span>}
      </legend>
      {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
      <QuestionInput question={question} value={value} onChange={onChange} />
      {error && <p id={errorId} role={announceError ? "alert" : undefined} className="text-sm text-destructive">{error}</p>}
    </fieldset>
  );
}

interface HeadingProps {
  title: string;
  description?: string;
  /** Baris kecil di atas judul, mis. "Seksi 2 dari 3". */
  label?: string;
}

/** Judul seksi di atas soal. */
export function SectionHeading({ title, description, label }: HeadingProps) {
  return (
    <header className="space-y-1">
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </header>
  );
}
