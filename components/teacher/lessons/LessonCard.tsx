"use client";

import Link from "next/link";
import { CalendarDays, Eye, Pencil, MoreVertical } from "lucide-react";
import { LessonThumbnail, StatusBadge } from "./StatusBadge";
import { Lesson } from "@/lib/types/Lesson";
// import { LessonThumbnail, StatusBadge } from "./LessonThumbnail";
// import type { Lesson } from "./types";

export default function LessonCard({
  lesson,
  onAssign,
}: {
  lesson: Lesson;
  onAssign?: (lessonId: string) => void;
}) {
  return (
    <div
      className="block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <article>
        <div className="relative">
          <LessonThumbnail kind={lesson.thumbnail} />
          <StatusBadge status={lesson.status} />
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 font-semibold text-card-foreground">
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