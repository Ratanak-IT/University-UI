

/**
 * All functions below currently return mock data. Each one is a single
 * seam — replace the body with a real `fetch` and the rest of the app
 * (components, state) does not need to change, since the shapes already
 * match `types.ts`.
 */

import { mockQuestions, mockQuizMeta } from "../data/mockQuizMeta";
import { QuizMeta, QuizQuestion } from "../types/QuizAnswerOption";

export async function fetchQuizPreview(
  quizId: string
): Promise<{ meta: QuizMeta; questions: QuizQuestion[] }> {
  // Replace with:
  // const res = await fetch(`/api/quizzes/${quizId}/preview`);
  // if (!res.ok) throw new Error("Failed to load quiz preview");
  // return res.json();
  await new Promise((r) => setTimeout(r, 150));
  return { meta: { ...mockQuizMeta, id: quizId }, questions: mockQuestions };
}

export async function saveAnswer(
  quizId: string,
  questionId: string,
  optionId: string | null
): Promise<void> {
  // Replace with:
  // await fetch(`/api/quizzes/${quizId}/answers`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ questionId, optionId }),
  // });
  return;
}

export async function toggleFlag(
  quizId: string,
  questionId: string,
  flagged: boolean
): Promise<void> {
  // Replace with:
  // await fetch(`/api/quizzes/${quizId}/questions/${questionId}/flag`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ flagged }),
  // });
  return;
}

export async function finishPreview(quizId: string): Promise<void> {
  // Replace with:
  // await fetch(`/api/quizzes/${quizId}/preview/finish`, { method: "POST" });
  return;
}