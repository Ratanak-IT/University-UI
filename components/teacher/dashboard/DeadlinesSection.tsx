import { FileText, HelpCircle, ClipboardCheck } from "lucide-react";
import { Deadline } from "@/lib/types/dashboard";

export default function DeadlinesSection({
  deadlines,
  loading,
}: {
  deadlines: Deadline[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-card-foreground">Upcoming deadlines</h2>
          <p className="text-xs text-muted-foreground">
            {loading
              ? "Loading…"
              : deadlines.length === 0
              ? "Nothing due in the next two weeks"
              : `${deadlines.length} assignment${deadlines.length === 1 ? "" : "s"}/quizzes due soon`}
          </p>
        </div>
        <a
          href="/dashboard/teacher/assignments"
          className="text-xs font-semibold tracking-wide text-primary hover:underline"
        >
          VIEW ALL
        </a>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : deadlines.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
          <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium text-card-foreground">All caught up</p>
          <p className="text-xs text-muted-foreground">
            No assignments or quizzes due in the next two weeks.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {deadlines.map((item) => {
            const Icon = item.kind === "quiz" ? HelpCircle : FileText;
            return (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-border p-4"
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.classCode}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${item.badgeClass}`}
                >
                  {item.due}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
