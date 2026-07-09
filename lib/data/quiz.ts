export type QuizStatus = "published" | "draft" | "scheduled";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  status: QuizStatus;
  questionCount: number;
  durationMinutes: number;
  updatedAt: string; // ISO date string, used for "Date Modified" sorting
}

export type SortOption = "dateModified" | "title" | "status";
