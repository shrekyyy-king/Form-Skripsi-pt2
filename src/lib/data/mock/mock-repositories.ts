import type { ActivityRepository, ProjectRepository, QuestionnaireRepository, ResponseRepository } from "../repositories";
import { demoActivities, demoProjects } from "./fixtures";
import { demoQuestionnaires } from "./fixtures-questionnaire";
import { demoResponses } from "./fixtures-responses";

export const mockProjectRepository: ProjectRepository = {
  async list() { return demoProjects; },
  async getById(id) { return demoProjects.find((p) => p.id === id) ?? null; },
};
export const mockActivityRepository: ActivityRepository = {
  async listRecent(limit) { return demoActivities.slice(0, limit); },
};
export const mockQuestionnaireRepository: QuestionnaireRepository = {
  async getBySlug(slug) { return demoQuestionnaires.find((q) => q.slug === slug) ?? null; },
  async getByProjectId(projectId) { return demoQuestionnaires.find((q) => q.projectId === projectId) ?? null; },
  async listSlugs() { return demoQuestionnaires.map((q) => q.slug); },
};
export const mockResponseRepository: ResponseRepository = {
  async listByQuestionnaire(slug) { return demoResponses.filter((r) => r.questionnaireSlug === slug); },
};
