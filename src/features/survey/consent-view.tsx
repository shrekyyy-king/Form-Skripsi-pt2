"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { Link, useRouter } from "@/i18n/navigation";
import { useSurvey } from "./survey-provider";

export function ConsentView() {
  const t = useTranslations("survey");
  const router = useRouter();
  const { questionnaire: q, giveConsent } = useSurvey();
  const [agreed, setAgreed] = useState(false);
  const [declined, setDeclined] = useState(false);

  if (declined) {
    return (
      <div className="space-y-4">
        <p>{t("declined")}</p>
        <Link href={routes.survey.intro(q.slug)} className={buttonVariants({ variant: "outline" })}>{t("backToStart")}</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("consentTitle")}</h1>
      <Card><CardContent className="space-y-3 pt-5 text-sm">
        {q.consentText.map((p) => <p key={p}>{p}</p>)}
        <p>{t("voluntary")}</p>
        <p>{t("privacy")}</p>
      </CardContent></Card>
      <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">{t("demoNote")}</p>
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input type="checkbox" className="mt-0.5 accent-primary" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>{t("agreeLabel")}</span>
      </label>
      <div className="flex flex-wrap gap-2">
        <Button disabled={!agreed} onClick={() => { giveConsent(); router.push(routes.survey.questions(q.slug)); }}>{t("agree")}</Button>
        <Button variant="outline" onClick={() => setDeclined(true)}>{t("decline")}</Button>
      </div>
    </div>
  );
}
