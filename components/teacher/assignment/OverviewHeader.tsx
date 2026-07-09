import { Calendar, Folder } from "lucide-react";

export default function OverviewHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4​">
      <div>
        <h1 className="text-3xl font-bold text-slate-900​">Overview</h1>
        <p className="mt-1 text-slate-500">
          Academic Year 2024–2025 · Semester 2
        </p>
      </div>

      <div className="flex items-center gap-6 pt-1">
        <a
          href="#"
          className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-800"
        >
          <Calendar className="h-4 w-4" />
          Google Calendar
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-800"
        >
          <Folder className="h-4 w-4" />
          Class Drive folder
        </a>
      </div>
    </div>
  );
}