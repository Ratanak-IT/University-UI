import { CardGridSkeleton } from "@/components/shared/Skeletons";

/** Mirrors this page's StatCards: a small icon square, then a big number, a label, and a sublabel. */
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 h-9 w-9 animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="h-7 w-14 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="mt-2 h-4 w-24 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="mt-1.5 h-3.5 w-32 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
    </div>
  );
}

/** Loading state for /dashboard/teacher/my-classroom — same layout, placeholders instead of data. */
export default function MyClassroomSkeleton() {
  return (
    <div className="px-8 py-8">
      {/* WelcomeHeader */}
      <div className="mb-8">
        <div className="h-7 w-64 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* ClassroomsGrid */}
      <div className="mb-4 mt-8 h-6 w-40 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
      <CardGridSkeleton count={6} />
    </div>
  );
}
