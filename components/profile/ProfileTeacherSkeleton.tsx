const bar = "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card shadow-sm ${className}`}>{children}</div>;
}

/** Loading state for the teacher profile page — same two-column layout, placeholders instead of data. */
export default function ProfileTeacherSkeleton() {
  return (
    <div className="min-h-screen bg-background px-8 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Header card */}
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-20 w-20 shrink-0 rounded-full ${bar}`} />
                <div className="space-y-2">
                  <div className={`h-5 w-40 ${bar}`} />
                  <div className={`h-5 w-48 rounded-full ${bar}`} />
                </div>
              </div>
              <div className={`h-10 w-36 rounded-lg ${bar}`} />
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <div className={`mb-5 h-5 w-44 ${bar}`} />
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className={`h-3 w-24 ${bar}`} />
                  <div className={`h-9 w-full rounded-lg ${bar}`} />
                </div>
              ))}
            </div>
          </Card>

          {/* Professional Expertise */}
          <Card className="p-6">
            <div className={`mb-5 h-5 w-48 ${bar}`} />
            <div className="mb-5 space-y-1.5">
              <div className={`h-3 w-36 ${bar}`} />
              <div className={`h-9 w-full rounded-lg ${bar}`} />
            </div>
            <div className="space-y-2.5">
              <div className={`h-3 w-32 ${bar}`} />
              <div className="flex flex-wrap items-center gap-2">
                <div className={`h-7 w-40 rounded-full ${bar}`} />
                <div className={`h-7 w-32 rounded-full ${bar}`} />
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <div className={`mb-4 h-3 w-32 ${bar}`} />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="mb-4 flex items-start gap-3 last:mb-0">
                <div className={`h-8 w-8 shrink-0 rounded-lg ${bar}`} />
                <div className="space-y-1.5">
                  <div className={`h-3 w-20 ${bar}`} />
                  <div className={`h-4 w-28 ${bar}`} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
