import { z } from "zod";
import type { Project } from "@/types";

// Pesan galat berupa kunci terjemahan (projectDetail.errors.*), bukan teks.
export const projectSchema = z.object({
  title: z.string().trim().min(3, "titleMin"),
  description: z.string().trim().max(500, "descriptionMax"),
  status: z.enum(["draft", "active", "completed", "archived"]),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;
export type LocalProject = Project & { local?: boolean };

/** Proyek buatan sisi klien (demo). Tidak punya halaman detail/builder statis. */
export function toLocalProject(values: ProjectFormValues): LocalProject {
  const id = `local-${Date.now().toString(36)}`;
  return {
    id, slug: id, title: values.title, description: values.description, status: values.status,
    questionnaireStatus: "none", respondentCount: 0, createdAt: new Date().toISOString(), local: true,
  };
}
