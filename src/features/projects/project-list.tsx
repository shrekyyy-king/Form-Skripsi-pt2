"use client";

import { Search } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import type { Project, ProjectStatus } from "@/types";

export function ProjectList({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");
  const format = useFormatter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => (status === "all" || p.status === status) && (q === "" || p.title.toLowerCase().includes(q)));
  }, [projects, query, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden />
          <Input className="pl-9" type="search" aria-label={t("search")} placeholder={t("search")} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select aria-label={t("filterStatus")} value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus | "all")}
          className="h-10 rounded-md border bg-card px-3 text-sm">
          <option value="all">{t("statusAll")}</option>
          {(["draft", "active", "completed", "archived"] as const).map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">{t("empty")}</CardContent></Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <li key={p.id}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-medium">{p.title}</h2>
                    <Badge>{t(`status.${p.status}`)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{t("questionnaire")}: {t(`questionnaireStatus.${p.questionnaireStatus}`)}</span>
                  <span>{t("respondents", { count: p.respondentCount })}</span>
                  {p.questionnaireStatus === "published" && (
                    <Link href={routes.survey.intro(p.slug)} className="font-medium text-primary hover:underline">{t("openSurvey")}</Link>
                  )}
                  <span>{format.dateTime(new Date(p.createdAt), { dateStyle: "medium" })}</span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
