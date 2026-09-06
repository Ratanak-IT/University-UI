const bar = "animate-pulse rounded-md bg-slate-200/80";

/** Loading state for /dashboard/student/courses/assignment — same layout, placeholders instead of data. */
export default function AssignmentDetailSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      {/* Page heading */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <div className={`h-3 w-28 ${bar}`} />
          <div className={`h-6 w-64 max-w-full ${bar}`} />
          <div className={`h-3 w-40 ${bar}`} />
        </div>
      </div>

      {/* Main content */}
      <main className="grid w-full flex-1 grid-cols-1 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        {/* Assignment card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className={`h-10 w-10 shrink-0 rounded-xl ${bar}`} />
            <div className="min-w-0 flex-1 space-y-2">
              <div className={`h-5 w-72 max-w-full ${bar}`} />
              <div className={`h-4 w-48 ${bar}`} />
            </div>
          </div>

          <div className={`mt-5 h-28 w-full rounded-xl ${bar}`} />

          <div className="mt-5 space-y-2">
            <div className={`h-3 w-32 ${bar}`} />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                <div className={`h-9 w-9 shrink-0 rounded-lg ${bar}`} />
                <div className={`h-4 w-40 ${bar}`} />
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-100 pt-5">
            <div className={`h-5 w-32 ${bar}`} />
            <div className={`mt-3 h-16 w-full rounded-xl ${bar}`} />
          </div>
        </div>

        {/* Right side panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`h-4 w-20 ${bar}`} />
              <div className={`h-5 w-16 rounded-full ${bar}`} />
            </div>
            <div className={`mt-4 h-12 w-full rounded-xl ${bar}`} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`h-4 w-28 ${bar}`} />
            <div className={`mt-3 h-16 w-full rounded-xl ${bar}`} />
          </div>
        </div>
      </main>
    </div>
  );
}
