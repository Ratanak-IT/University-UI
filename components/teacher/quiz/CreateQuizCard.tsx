"use client";

import { Plus } from "lucide-react";

export default function CreateQuizCard({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-white/50 p-5 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/40"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-900">
        <Plus size={22} />
      </span>
      <span className="text-lg font-bold text-slate-900">Create New Quiz</span>
      <span className="text-sm text-slate-500">Start from a template or a blank slate.</span>
    </button>
  );
}
