"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "./project-form";
import { toLocalProject, type LocalProject } from "./project-schema";

/** Memakai elemen <dialog> native: fokus terjebak di dalam dialog dan Esc menutup. */
export function CreateProjectDialog({ onCreate }: { onCreate: (project: LocalProject) => void }) {
  const t = useTranslations("projectDetail");
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button onClick={() => ref.current?.showModal()}><Plus className="h-4 w-4" aria-hidden />{t("newProject")}</Button>
      <dialog ref={ref} aria-labelledby="create-project-title"
        className="w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-soft backdrop:bg-black/40">
        <h2 id="create-project-title" className="mb-4 text-lg font-semibold">{t("formTitle")}</h2>
        <ProjectForm submitLabel={t("create")} onCancel={() => ref.current?.close()}
          onSubmit={(values) => { onCreate(toLocalProject(values)); ref.current?.close(); }} />
      </dialog>
    </>
  );
}
