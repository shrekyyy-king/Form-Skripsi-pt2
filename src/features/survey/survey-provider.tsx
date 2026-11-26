"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Questionnaire } from "@/types";

export type AnswerValue = string | string[];

interface SurveyState {
  questionnaire: Questionnaire;
  consented: boolean;
  answers: Record<string, AnswerValue>;
  index: number;
  giveConsent: () => void;
  setAnswer: (id: string, value: AnswerValue) => void;
  setIndex: (index: number) => void;
  reset: () => void;
}

const SurveyContext = createContext<SurveyState | null>(null);

export function SurveyProvider({ questionnaire, children }: { questionnaire: Questionnaire; children: React.ReactNode }) {
  const [consented, setConsented] = useState(false);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [index, setIndex] = useState(0);

  const value = useMemo<SurveyState>(
    () => ({
      questionnaire,
      consented,
      answers,
      index,
      giveConsent: () => setConsented(true),
      setAnswer: (id, v) => setAnswers((prev) => ({ ...prev, [id]: v })),
      setIndex,
      reset: () => { setConsented(false); setAnswers({}); setIndex(0); },
    }),
    [questionnaire, consented, answers, index],
  );
  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurvey must be used within SurveyProvider");
  return ctx;
}
