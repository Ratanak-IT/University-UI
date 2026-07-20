"use client";

import { CirclePlus } from "lucide-react";
import { QuestionCard } from "./QuestionCard";
import { createEmptyQuestion, QuizQuestion } from "@/lib/types/createEmptyQuestion";


interface QuestionsSectionProps {
  questions: QuizQuestion[];
  onQuestionsChange: (questions: QuizQuestion[]) => void;
}

export function QuestionsSection({ questions, onQuestionsChange }: QuestionsSectionProps) {
  function addQuestion() {
    onQuestionsChange([...questions, createEmptyQuestion(questions.length)]);
  }

  function updateQuestion(index: number, question: QuizQuestion) {
    onQuestionsChange(questions.map((q, i) => (i === index ? question : q)));
  }

  function deleteQuestion(index: number) {
    onQuestionsChange(questions.filter((_, i) => i !== index));
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-lg font-semibold text-foreground">Questions</h2>
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
        >
          <CirclePlus className="h-4 w-4" />
          Add Question
        </button>
      </div>

      <div className="mt-5 space-y-5">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            onChange={(q) => updateQuestion(index, q)}
            onDelete={() => deleteQuestion(index)}
            canDelete={questions.length > 1}
          />
        ))}
      </div>
    </section>
  );
}