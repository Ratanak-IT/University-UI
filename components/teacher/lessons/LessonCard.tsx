import { CalendarDays, Eye, Pencil, MoreVertical } from "lucide-react";
import { LessonThumbnail, StatusBadge } from "./StatusBadge";
import { Lesson } from "@/lib/types/Lesson";
// import { LessonThumbnail, StatusBadge } from "./LessonThumbnail";
// import type { Lesson } from "./types";

export default function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <LessonThumbnail kind={lesson.thumbnail} />
        <StatusBadge status={lesson.status} />
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-card-foreground">
          {lesson.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {lesson.description}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {lesson.date}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Preview lesson"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Edit lesson"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="More options"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}