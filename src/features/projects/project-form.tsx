"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projectSchema, type ProjectFormValues } from "./project-schema";

interface Props {
  submitLabel: string;
  onSubmit: (values: ProjectFormValues) => void;
  onCancel?: () => void;
}

export function ProjectForm({ submitLabel, onSubmit, onCancel }: Props) {
  const t = useTranslations("projectDetail");
  const tp = useTranslations("projects");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", description: "", status: "draft" },
  });

  return (
    <form noValidate className="space-y-4" onSubmit={handleSubmit((values) => { onSubmit(values); reset(); })}>
      <label className="block space-y-1 text-sm">
        <span className="font-medium">{t("fieldTitle")}</span>
        <Input aria-invalid={errors.title ? true : undefined} {...register("title")} />
        {errors.title?.message && <span role="alert" className="text-destructive">{t(`errors.${errors.title.message}`)}</span>}
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium">{t("fieldDescription")}</span>
        <textarea rows={4} aria-invalid={errors.description ? true : undefined}
          className="w-full rounded-md border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" {...register("description")} />
        {errors.description?.message && <span role="alert" className="text-destructive">{t(`errors.${errors.description.message}`)}</span>}
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium">{t("fieldStatus")}</span>
        <select className="h-10 w-full rounded-md border bg-card px-3 text-sm" {...register("status")}>
          {(["draft", "active", "completed", "archived"] as const).map((s) => <option key={s} value={s}>{tp(`status.${s}`)}</option>)}
        </select>
      </label>
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>{t("cancel")}</Button>}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
