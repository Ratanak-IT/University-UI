import { TableRowsSkeleton } from "@/components/shared/Skeletons";

const bar = "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80";

/** Loading state for the attendance page — same layout, placeholders instead of data. */
export default function AttendanceSkeleton() {
  return (
    <div className="space-y-6 px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className={`h-4 w-40 ${bar}`} />
          <div className={`h-7 w-64 ${bar}`} />
          <div className={`h-4 w-96 max-w-full ${bar}`} />
        </div>
        <div className={`h-10 w-36 rounded-xl ${bar}`} />
      </div>

      {/* Filters: classroom + date */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className={`h-10 w-48 rounded-xl ${bar}`} />
        <div className={`h-10 w-56 rounded-xl ${bar}`} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800/50">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`h-9 w-32 rounded-lg ${bar}`} />
        ))}
      </div>

      {/* Register */}
      <TableRowsSkeleton rows={6} cols={3} />
    </div>
  );
}
