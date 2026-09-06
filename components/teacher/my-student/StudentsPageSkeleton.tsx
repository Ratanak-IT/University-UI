const bar = "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80";

/** Mirrors StatCard: icon square + badge pill, then label + value + helper text. */
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className={`h-11 w-11 rounded-xl ${bar}`} />
        <div className={`h-5 w-14 rounded-full ${bar}`} />
      </div>
      <div className={`mt-4 h-3 w-24 ${bar}`} />
      <div className={`mt-1.5 h-6 w-16 ${bar}`} />
      <div className={`mt-1.5 h-3 w-32 ${bar}`} />
    </div>
  );
}

const COLUMN_WIDTHS = ["w-40", "w-20", "w-24", "w-14", "w-16", "w-24", "w-20"];

/** Loading state for /dashboard/teacher/my-student — same layout, placeholders instead of data. */
export default function StudentsPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* StudentsHeader */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className={`h-8 w-32 ${bar}`} />
          <div className={`mt-2 h-4 w-72 ${bar}`} />
        </div>
        <div className={`h-9 w-24 rounded-lg ${bar}`} />
      </div>

      {/* StatsGrid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* RosterTable */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className={`h-6 w-32 ${bar}`} />
          <div className="flex flex-wrap items-center gap-2">
            <div className={`h-9 w-32 rounded-lg ${bar}`} />
            <div className={`h-9 w-28 rounded-lg ${bar}`} />
            <div className={`h-9 w-24 rounded-lg ${bar}`} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-muted/60">
                {COLUMN_WIDTHS.map((_, i) => (
                  <th key={i} className="px-5 py-3">
                    <div className={`h-3 w-16 ${bar}`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, r) => (
                <tr key={r} className="border-t border-border">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 shrink-0 rounded-full ${bar}`} />
                      <div className="min-w-0 space-y-1.5">
                        <div className={`h-4 w-28 ${bar}`} />
                        <div className={`h-3 w-36 ${bar}`} />
                      </div>
                    </div>
                  </td>
                  {COLUMN_WIDTHS.slice(1).map((w, c) => (
                    <td key={c} className="px-5 py-4">
                      <div className={`h-4 ${w} ${bar}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className={`h-4 w-48 ${bar}`} />
          <div className={`h-8 w-32 rounded-lg ${bar}`} />
        </div>
      </div>
    </div>
  );
}
