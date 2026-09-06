import { StatCardSkeleton, CardGridSkeleton } from "@/components/shared/Skeletons";

/** Loading state for /dashboard/teacher — same layout as the real page, placeholders instead of data. */
export default function DashboardSkeleton() {
  return (
    <div className="px-8 py-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
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
