import { StatCardSkeleton } from "@/components/shared/Skeletons";

const bar = "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80";

/** Mirrors DeadlinesSection / the Recent Activity card: title + "view all" link, then a few bordered list rows. */
export function DashboardListCardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className={`h-5 w-40 ${bar}`} />
        <div className={`h-3 w-16 ${bar}`} />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className={`h-4 w-40 ${bar}`} />
              <div className={`h-5 w-16 rounded-full ${bar}`} />
            </div>
            <div className={`mt-2 h-3 w-24 ${bar}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Loading state for /dashboard/student — same layout, placeholders instead of data. */
export default function StudentDashboardSkeleton() {
  return (
    <div className="px-8 py-8">
      <div className="mb-6 space-y-2">
        <div className={`h-6 w-56 ${bar}`} />
        <div className={`h-4 w-72 max-w-full ${bar}`} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DashboardListCardSkeleton />
        <DashboardListCardSkeleton />
      </div>
    </div>
  );
}
