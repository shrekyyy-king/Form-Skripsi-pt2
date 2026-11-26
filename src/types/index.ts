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

export interface Question {
  id: string;
  type: QuestionType;
  text: string; // konten peneliti, tidak diterjemahkan otomatis
  description?: string;
  required: boolean;
  likert?: LikertConfig; // untuk type "likert"
  choices?: string[]; // untuk multipleChoice, checkbox, dropdown
}

export interface Questionnaire {
  id: string;
  projectId?: string;
  slug: string;
  title: string;
  description: string;
  researcher: string;
  estimatedMinutes: number;
  consentText: string[];
  contactEmail?: string;
  questions: Question[];
}
