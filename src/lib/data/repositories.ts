import type { Activity, Project, Questionnaire } from "@/types";

/** Kontrak data. Implementasi Supabase kelak cukup memenuhi antarmuka ini. */
export interface ProjectRepository {
  list(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
}
export interface ActivityRepository {
  listRecent(limit: number): Promise<Activity[]>;
}
export interface QuestionnaireRepository {
  getBySlug(slug: string): Promise<Questionnaire | null>;
  getByProjectId(projectId: string): Promise<Questionnaire | null>;
  listSlugs(): Promise<string[]>;
}
