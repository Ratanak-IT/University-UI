export default function QuizCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-6 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-10 border-b border-border pb-4">
        <div className="flex gap-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}