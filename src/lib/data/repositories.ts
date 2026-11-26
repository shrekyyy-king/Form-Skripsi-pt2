import type { Activity, Project } from "@/types";

/** Kontrak data. Implementasi Supabase kelak cukup memenuhi antarmuka ini. */
export interface ProjectRepository {
  list(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
}
export interface ActivityRepository {
  listRecent(limit: number): Promise<Activity[]>;
}
