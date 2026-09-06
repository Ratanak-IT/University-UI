const bar = "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80";

/** Loading state for ClassroomDetailView — shared by teacher and student routes. */
export default function ClassroomDetailSkeleton() {
  return (
    <div>
      {/* Tab Bar */}
      <div className="bg-white dark:bg-slate-900">
        <div className="flex items-center gap-8 border-b border-slate-200 px-8 py-4 dark:border-slate-800">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`h-4 w-16 ${bar}`} />
          ))}
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-200/80 px-8 py-9 dark:bg-slate-800/80">
          <div className={`h-5 w-32 rounded-full bg-white/30`} />
          <div className="mt-4 h-9 w-72 max-w-full rounded-md bg-white/30" />
          <div className="mt-3 h-4 w-56 rounded-md bg-white/20" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className={`h-3 w-24 ${bar}`} />
              <div className={`mt-3 h-7 w-32 ${bar}`} />
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className={`h-4 w-28 ${bar}`} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`h-4 w-40 ${bar}`} />
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className={`h-4 w-24 ${bar}`} />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className={`h-16 rounded-xl ${bar}`} />
                <div className={`h-16 rounded-xl ${bar}`} />
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 shrink-0 rounded-xl ${bar}`} />
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 w-1/2 ${bar}`} />
                    <div className={`h-3 w-1/3 ${bar}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
