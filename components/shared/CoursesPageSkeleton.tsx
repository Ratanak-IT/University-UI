const bar = "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80";

/** Mirrors one "Classroom Content & Activity" row: icon square + title/subtitle + action pill. */
function ActivityRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 shrink-0 rounded-xl ${bar}`} />
        <div className="space-y-1.5">
          <div className={`h-4 w-40 ${bar}`} />
          <div className={`h-3 w-56 ${bar}`} />
        </div>
      </div>
      <div className={`h-8 w-24 shrink-0 rounded-xl ${bar}`} />
    </div>
  );
}

/** Just the tab content area: stat cards + activity list — used when the header/selector/tabs are already rendered. */
export function CoursesContentSkeleton() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className={`mx-auto h-8 w-10 ${bar}`} />
            <div className={`mx-auto mt-2 h-3 w-20 ${bar}`} />
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className={`mb-4 h-5 w-56 ${bar}`} />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ActivityRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}

/**
 * Loading state for /dashboard/student/courses — covers the initial
 * profile+roster fetch (header, classroom card, tabs, and content all
 * placeholders). The per-classroom detail fetch reuses just
 * {@link CoursesContentSkeleton} since the header/selector/tabs are already
 * rendered by then.
 */
export default function CoursesPageSkeleton() {
  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className={`h-3 w-24 ${bar}`} />
          <div className={`h-8 w-40 ${bar}`} />
          <div className={`h-4 w-72 max-w-full ${bar}`} />
        </div>
      </div>

      {/* Classroom selector */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className={`h-6 w-56 ${bar}`} />
            <div className={`h-4 w-64 max-w-full ${bar}`} />
          </div>
          <div className={`h-10 w-60 rounded-xl ${bar}`} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`h-10 w-28 rounded-xl ${bar}`} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <CoursesContentSkeleton />
      </div>
    </div>
  );
}
