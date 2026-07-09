import { LessonFilter } from "@/lib/types/Lesson";
import { ListFilter, ChevronDown } from "lucide-react";


const TABS: { id: LessonFilter; label: string }[] = [
  { id: "all", label: "All Lessons" },
  { id: "published", label: "Published" },
  { id: "drafts", label: "Drafts" },
];

interface LessonsFilterBarProps {
  active: LessonFilter;
  onChange: (filter: LessonFilter) => void;
  shownCount: number;
  totalCount: number;
}

export default function LessonsFilterBar({
  active,
  onChange,
  shownCount,
  totalCount,
}: LessonsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active === tab.id
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-card-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-border" />

        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-card-foreground"
        >
          <ListFilter className="h-4 w-4" />
          Sort by: <span className="text-card-foreground">Newest</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-card-foreground">{shownCount}</span>{" "}
        of <span className="font-semibold text-card-foreground">{totalCount}</span>{" "}
        lessons
      </p>
    </div>
  );
}