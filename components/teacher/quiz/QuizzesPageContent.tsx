"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";

import QuizFilterBar, { ViewMode } from "./QuizFilterBar";
import QuizGrid from "./QuizGrid";
import QuizCardSkeleton from "./QuizCardSkeleton";
import QuizEmptyState from "./QuizEmptyState";
import { Quiz, QuizStatus, SortOption } from "@/lib/data/quiz";
import { deleteQuiz, duplicateQuiz, getQuizzes } from "@/lib/data/quizzes";

type StatusFilter = QuizStatus | "all";

export default function QuizzesPageContent() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("dateModified");
  const [view, setView] = useState<ViewMode>("grid");

  const loadQuizzes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuizzes({ status, sort });
      setQuizzes(data);
    } catch (err) {
      setError("We couldn't load your quizzes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [status, sort]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  // --- Action handlers: wire these up to your routes / modals ------------
  const handlePreview = (quiz: Quiz) => {
    // e.g. router.push(`/quizzes/${quiz.id}/preview`)
    console.log("Preview quiz:", quiz.id);
  };

  const handleEdit = (quiz: Quiz) => {
    // e.g. router.push(`/quizzes/${quiz.id}/edit`)
    console.log("Edit quiz:", quiz.id);
  };

  const handleCreate = () => {
    // e.g. router.push("/quizzes/new")
    console.log("Create new quiz");
  };

  const handleDuplicate = async (quiz: Quiz) => {
    const optimisticId = crypto.randomUUID();
    try {
      const created = await duplicateQuiz(quiz.id);
      setQuizzes((prev) => [created, ...prev]);
    } catch (err) {
      console.error("Failed to duplicate quiz", err);
    }
  };

  const handleDelete = async (quiz: Quiz) => {
    const previous = quizzes;
    setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
    try {
      await deleteQuiz(quiz.id);
    } catch (err) {
      // Roll back on failure
      setQuizzes(previous);
      console.error("Failed to delete quiz", err);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary dark:text-primary">My Quizzes</h1>
          <p className="mt-1 text-slate-500">
            Create, manage, and monitor student assessment progress.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <Plus size={18} />
          Create New Quiz
        </button>
      </div>

      <QuizFilterBar
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
      />

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <QuizCardSkeleton key={i} />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <QuizEmptyState onCreate={handleCreate} />
      ) : (
        <QuizGrid
          quizzes={quizzes}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
