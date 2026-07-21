import { ChevronLeft, ChevronRight } from "lucide-react";

interface LessonsPaginationProps {
  shownStudents: number;
  totalStudents: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function LessonsPagination({
  shownStudents,
  totalStudents,
  currentPage,
  totalPages,
  onPageChange,
}: LessonsPaginationProps) {
  // Build a compact page list, e.g. 1 2 3 … 32
  const pages: (number | "ellipsis")[] = [];
  const lastPage = totalPages;
  for (let p = 1; p <= Math.min(3, lastPage); p++) pages.push(p);
  if (lastPage > 4) pages.push("ellipsis");
  if (lastPage > 3) pages.push(lastPage);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-card-foreground">{shownStudents}</span>{" "}
        of <span className="font-semibold text-card-foreground">{totalStudents}</span>{" "}
        students
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                p === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}