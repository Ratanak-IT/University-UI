import { StatCardSkeleton, CardGridSkeleton } from "@/components/shared/Skeletons";

/** Mirrors EngagementChart's shape: title + filter pill + a 260px chart area. */
function EngagementChartSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-5 w-48 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-8 w-28 animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
      <div className="h-[260px] w-full animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
    </div>
  );
}

/** Mirrors ContentLibraryCard's shape: title + a 200px donut area + a short legend list. */
function ContentLibraryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 h-5 w-36 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="flex items-center justify-center">
        <div className="h-[200px] w-[200px] animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
      <div className="mt-4 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-3.5 w-24 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
            <div className="h-3.5 w-8 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Loading state for /dashboard/teacher — same layout as the real page, placeholders instead of data. */
export default function DashboardSkeleton() {
  return (
    <div className="px-8 py-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <EngagementChartSkeleton />
        <ContentLibraryCardSkeleton />
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-5 w-40 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-4 w-20 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
        </div>
        <CardGridSkeleton count={4} />
      </div>
    </div>
  );
}
