"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { ProjectForm } from "./project-form";
import type { ProjectFormValues } from "./project-schema";

export function NewProjectPanel() {
  const t = useTranslations("projectDetail");
  const [created, setCreated] = useState<ProjectFormValues | null>(null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("newProject")}</h1>
      {created && (
        <Card><CardContent className="space-y-1 pt-5 text-sm" role="status">
          <p className="font-medium">{t("createdTitle", { title: created.title })}</p>
          <p className="text-muted-foreground">{t("createdNote")}</p>
        </CardContent></Card>
      )}
      <Card><CardContent className="pt-5"><ProjectForm submitLabel={t("create")} onSubmit={setCreated} /></CardContent></Card>
      <Link href={routes.dashboard.projects} className={buttonVariants({ variant: "outline" })}>{t("backToProjects")}</Link>
    </div>
  );
}
