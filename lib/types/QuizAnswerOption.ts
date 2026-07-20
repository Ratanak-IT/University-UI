export type QuestionType = "multiple_choice" | "true_false" | "short_answer";

export interface QuizAnswerOption {
  id: string;
  label: string; // "A", "B", "C"...
  text: string;
}

export interface QuizQuestion {
  id: string;
  index: number; // 1-based position in the quiz
  type: QuestionType;
  content: string;
  options: QuizAnswerOption[];
}

export interface QuizMeta {
  id: string;
  title: string;
  description: string;
  courseName: string;
  totalQuestions: number;
  durationSeconds: number;
}

export type QuestionNavStatus = "current" | "answered" | "unvisited";

export interface QuizAttemptState {
  answers: Record<string, string | null>; // questionId -> selected optionId
  flagged: Record<string, boolean>;
  visited: Record<string, boolean>;
  currentQuestionId: string;
  timeLeftSeconds: number;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Multiple Choice",
  true_false: "True / False",
  short_answer: "Short Answer",
};