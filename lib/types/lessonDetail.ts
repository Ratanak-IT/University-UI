export type ModuleItemKind = "lesson" | "quiz" | "assignment";
export type ModuleItemStatus = "completed" | "in-progress" | "upcoming";

export interface ModuleItem {
  id: string;
  kind: ModuleItemKind;
  title: string;
  meta: string;
  status: ModuleItemStatus;
}

export type LessonTabId = "description" | "resources" | "discussion";

export interface LearningObjective {
  id: string;
  label: string;
}

export interface LessonData {
  title: string;
  course: string;
  module: string;
  progressPercent: number;
  description: string[];
  objectives: LearningObjective[];
  moduleItems: ModuleItem[];
}