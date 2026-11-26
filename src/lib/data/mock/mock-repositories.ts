import type { ActivityRepository, ProjectRepository } from "../repositories";
import { demoActivities, demoProjects } from "./fixtures";

export const mockProjectRepository: ProjectRepository = {
  async list() { return demoProjects; },
  async getById(id) { return demoProjects.find((p) => p.id === id) ?? null; },
};
export const mockActivityRepository: ActivityRepository = {
  async listRecent(limit) { return demoActivities.slice(0, limit); },
};
