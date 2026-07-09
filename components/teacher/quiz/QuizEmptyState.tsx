import { FileQuestion } from "lucide-react";

export default function QuizEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <FileQuestion size={26} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-slate-900">No quizzes found</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Try a different status filter, or create a new quiz to get started.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-5 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
      >
        + Create New Quiz
      </button>
    </div>
  );
}
