"use client";

import Link from "next/link";
import { CalendarDays, Eye, Pencil, Trash2 } from "lucide-react";
import { LessonThumbnail, StatusBadge } from "./StatusBadge";
import { Lesson } from "@/lib/types/Lesson";

export default function LessonCard({
  lesson,
  onAssign,
  onEdit,
  onDelete,
}: {
  lesson: Lesson;
  onAssign?: (lessonId: string) => void;
  onEdit?: (lesson: Lesson) => void;
  onDelete?: (lessonId: string) => void;
}) {
  return (
    <div
      className="block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <article className="p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <StatusBadge status={lesson.status} />
          </div>
          <h3 className="line-clamp-2 font-bold text-slate-900 dark:text-slate-100 text-base">
            {lesson.title}
          </h3>
          <div
            className="mt-1.5 line-clamp-2 text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: lesson.description || "" }}
          />

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {lesson.date}
            </span>

            <div className="flex items-center gap-1">
              {onAssign && (
                <button
                  type="button"
                  onClick={() => onAssign(lesson.id)}
                  className="mr-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
                >
                  Assign
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(lesson)}
                  title="Edit lesson"
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/40 dark:hover:text-amber-400"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(lesson.id)}
                  title="Delete lesson"
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <Link
                href={`/dashboard/teacher/lessons/${lesson.id}`}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}