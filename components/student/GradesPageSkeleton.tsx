import { TableRowsSkeleton } from "@/components/shared/Skeletons";

const bar = "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80";

/** Loading state for /dashboard/student/grades — same layout, placeholders instead of data. */
export default function GradesPageSkeleton() {
  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      {/* Profile banner */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className={`h-16 w-16 shrink-0 rounded-full ${bar}`} />
          <div className="space-y-2">
            <div className={`h-6 w-40 ${bar}`} />
            <div className={`h-4 w-56 ${bar}`} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`h-16 w-28 rounded-xl ${bar}`} />
          <div className={`h-16 w-28 rounded-xl ${bar}`} />
        </div>
      </div>

      {/* Header actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className={`h-5 w-64 ${bar}`} />
          <div className={`h-3 w-72 ${bar}`} />
        </div>
        <div className={`h-10 w-40 rounded-xl ${bar}`} />
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className={`mb-4 h-9 w-9 rounded-lg ${bar}`} />
            <div className={`h-3 w-24 ${bar}`} />
            <div className={`mt-2 h-8 w-16 ${bar}`} />
            <div className={`mt-2 h-3 w-32 ${bar}`} />
          </div>
        ))}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className={`mb-3 h-3 w-28 ${bar}`} />
          <div className="flex items-center gap-4">
            <div className={`h-24 w-24 shrink-0 rounded-full ${bar}`} />
            <div className="space-y-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`h-3 w-20 ${bar}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subject grades table */}
      <div className="mt-6">
        <TableRowsSkeleton rows={6} cols={5} />
      </div>
    </div>
  );
}
