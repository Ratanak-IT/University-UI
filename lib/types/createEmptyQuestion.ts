export type QuestionType = "multiple_choice" | "true_false" | "short_answer";

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  content: string;
  type: QuestionType;
  points: number;
  options: QuizOption[];
  correctOptionId: string | null;
}

export interface QuizFormData {
  title: string;
  description: string;
  openingDate: string;
  timeLimitMinutes: string;
  courseId: string;
  questions: QuizQuestion[];
}

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "true_false", label: "True / False" },
  { value: "short_answer", label: "Short Answer" },
];

export const COURSES = [
  "Introduction to Algorithms",
  "Database Systems",
  "Web Development",
  "Software Engineering",
] as const;

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export function createEmptyQuestion(index: number): QuizQuestion {
  return {
    id: makeId(),
    content: "",
    type: "multiple_choice",
    points: 10,
    options: [
      { id: makeId(), text: "" },
      { id: makeId(), text: "" },
    ],
    correctOptionId: null,
  };
}

export const initialQuizFormData: QuizFormData = {
  title: "",
  description: "",
  openingDate: "",
  timeLimitMinutes: "",
  courseId: "",
  questions: [createEmptyQuestion(0)],
};