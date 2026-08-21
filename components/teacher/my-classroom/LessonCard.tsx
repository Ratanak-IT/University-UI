"use client";

import { BookOpen, Video, Paperclip, Pencil, Trash2, Loader2, ChevronRight } from "lucide-react";
import type { LessonResponse } from "@/lib/api/student";

interface LessonCardProps {
  lesson: LessonResponse;
  isStudent?: boolean;
  isDeleting?: boolean;
  onOpen: (lesson: LessonResponse) => void;
  onEdit?: (lesson: LessonResponse) => void;
  onDelete?: (lessonId: string) => void;
}

/**
 * Clickable lesson tile for the classroom "Lessons" grid. The whole card opens the
 * lesson detail popup; teacher-only edit/delete controls stop propagation so they
 * don't trigger the open action.
 */
export function LessonCard({ lesson, isStudent = false, isDeleting = false, onOpen, onEdit, onDelete }: LessonCardProps) {
  const fileCount = lesson.files?.length ?? 0;
  const hasVideo = Boolean(lesson.videoLink);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(lesson)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(lesson);
        }
      }}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950">
          <BookOpen className="h-5 w-5 text-emerald-700 dark:text-emerald-400" strokeWidth={1.75} />
        </div>
        {!isStudent && (
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(lesson);
              }}
              title="Edit lesson"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(lesson.lessonId);
              }}
              disabled={isDeleting}
              title="Delete lesson"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" /> : <Trash2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
      </div>

      <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{lesson.title}</h4>

      {lesson.content && (
        <p className="mt-1.5 flex-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{lesson.content}</p>
      )}

      {(hasVideo || fileCount > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hasVideo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Video className="h-3 w-3" /> Video
            </span>
          )}
          {fileCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Paperclip className="h-3 w-3" /> {fileCount} file{fileCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
          {lesson.createdBy} · {new Date(lesson.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
          View <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
