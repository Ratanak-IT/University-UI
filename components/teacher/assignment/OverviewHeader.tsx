export default function OverviewHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Academic Year 2024–2025 · Semester 2
        </p>
      </div>
    </div>
  );
}