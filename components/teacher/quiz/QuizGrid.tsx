"use client";


import QuizCard from "./QuizCard";
import CreateQuizCard from "./CreateQuizCard";
import { Quiz } from "@/lib/data/quiz";

interface QuizGridProps {
  quizzes: Quiz[];
  onPreview?: (quiz: Quiz) => void;
  onEdit?: (quiz: Quiz) => void;
  onDuplicate?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
  onCreate?: () => void;
}

export default function QuizGrid({
  quizzes,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  onCreate,
}: QuizGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onPreview={onPreview}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
      <CreateQuizCard onClick={onCreate} />
    </div>
  );
}
