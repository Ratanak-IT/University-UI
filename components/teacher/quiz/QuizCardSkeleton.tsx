export default function QuizCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="mt-2 h-3.5 w-full animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="mt-1.5 h-3.5 w-2/3 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-8 w-20 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
        </div>
      </div>
    </div>
  );
}