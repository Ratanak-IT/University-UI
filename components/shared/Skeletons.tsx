import React from "react";

/** Skeleton loader for single statistics metric card */
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-5 w-14 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-24 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-7 w-20 animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
    </div>
  );
}

/** Skeleton grid for top stats section */
export function StatsGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton for a filter/toolbar row: a segmented control, a dropdown, a trailing count/action. */
export function FilterBarSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-800 sm:block" />
        <div className="h-8 w-40 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
      <div className="h-4 w-32 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
    </div>
  );
}

/** Skeleton loader for a single card (Classroom, Quiz, Lesson, Assignment) */
export function CardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-3">
        <div className="relative h-16 w-full animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-3.5 w-1/2 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="h-4 w-28 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-8 w-20 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
    </div>
  );
}

/** Grid of card skeletons */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton for table rows (Grades, Attendance, Certificates, Notifications, Student Rosters) */
export function TableRowsSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-8 w-24 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-1/3 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
                <div className="h-3 w-1/4 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
              </div>
            </div>
            {Array.from({ length: cols - 1 }).map((_, c) => (
              <div key={c} className="hidden h-4 w-20 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80 sm:block" />
            ))}
            <div className="h-8 w-16 shrink-0 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton loader for user profile header and detail cards */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm text-center md:flex-row md:text-left dark:border-slate-800 dark:bg-slate-900">
        <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="flex-1 space-y-2">
          <div className="h-7 w-48 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="h-5 w-32 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
        </div>
      </div>
    </div>
  );
}
