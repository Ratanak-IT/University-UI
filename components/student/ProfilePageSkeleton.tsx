const bar = "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80";

/** Loading state for /dashboard/student/profile — same layout, placeholders instead of data. */
export default function ProfilePageSkeleton() {
  return (
    <div className="px-8 py-8">
      <div className="mb-6 space-y-1.5">
        <div className={`h-4 w-24 ${bar}`} />
        <div className={`h-4 w-56 ${bar}`} />
      </div>

      <div className="space-y-6">
        {/* Identity card */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className={`h-20 w-20 shrink-0 rounded-full ${bar}`} />
            <div className="space-y-2">
              <div className={`h-5 w-40 ${bar}`} />
              <div className={`h-5 w-32 rounded-full ${bar}`} />
            </div>
          </div>
          <div className={`h-10 w-32 rounded-xl ${bar}`} />
        </div>

        {/* Personal information */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className={`mb-5 h-5 w-44 ${bar}`} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className={`h-3 w-32 ${bar}`} />
                <div className={`h-10 w-full rounded-xl ${bar}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Academic program */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className={`mb-5 h-5 w-40 ${bar}`} />
          <div className="space-y-1.5">
            <div className={`h-3 w-40 ${bar}`} />
            <div className={`h-10 w-full rounded-xl ${bar}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
