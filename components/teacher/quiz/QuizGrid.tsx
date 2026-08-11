"use client";


import QuizCard from "./QuizCard";
import CreateQuizCard from "./CreateQuizCard";
import { Quiz } from "@/lib/types/quiz";

interface QuizGridProps {
  quizzes: Quiz[];
  onPreview?: (quiz: Quiz) => void;
  onEdit?: (quiz: Quiz) => void;
  onAssign?: (quiz: Quiz) => void;
  onDuplicate?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
  onCreate?: () => void;
}

export default function QuizGrid({
  quizzes,
  onPreview,
  onEdit,
  onAssign,
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
          onAssign={onAssign}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
      <CreateQuizCard onClick={onCreate} />
    </div>
  );
}
