export type ProjectStatus = "draft" | "active" | "completed" | "archived";
export type QuestionnaireStatus = "none" | "draft" | "published" | "closed";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: ProjectStatus;
  questionnaireStatus: QuestionnaireStatus;
  respondentCount: number;
  createdAt: string; // ISO
}

export interface Activity {
  id: string;
  kind: "response" | "project" | "publish";
  text: string;
  at: string; // ISO
}

export type QuestionType =
  | "likert" | "multipleChoice" | "checkbox" | "shortAnswer" | "longAnswer" | "numeric" | "dropdown";

export interface LikertOption { value: number; label: string; description?: string }
export interface LikertConfig {
  points: number;
  options: LikertOption[];
  direction: "ascending" | "descending";
  reverseScored: boolean;
}
