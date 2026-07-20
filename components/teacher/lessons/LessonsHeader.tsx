"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function LessonsHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary dark:text-primary">
          My Lessons
        </h1>
        <p className="mt-1 text-slate-500">
          Manage and organize your academic curriculum materials.
        </p>
      </div>

      <Link
        href="/dashboard/teacher/lessons/create-lesson"
        className="flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-900"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Create New Lesson
      </Link>
    </div>
  );
}