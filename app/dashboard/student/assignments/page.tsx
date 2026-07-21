"use client";

import { useState } from "react";
import { Clock, Check, AlertCircle, Upload } from "lucide-react";

type Status = "todo" | "submitted" | "graded";

const assignments: {
  title: string;
  course: string;
  code: string;
  due: string;
  status: Status;
  score?: string;
  urgent?: boolean;
}[] = [
  { title: "Final Thesis Draft", course: "Web Development", code: "CS-WD201", due: "Tomorrow, 11:59 PM", status: "todo", urgent: true },
  { title: "ER Diagram Exercise", course: "Database Systems", code: "CS-DB301", due: "Thu, 5:00 PM", status: "todo" },
  { title: "Threat Model Report", course: "Software Security", code: "CS-SEC401", due: "Fri, 11:59 PM", status: "todo" },
  { title: "Usability Test Notes", course: "UX Fundamentals", code: "CS-UX202", due: "Next Mon, 3:00 PM", status: "todo" },
  { title: "API Integration Module", course: "Web Development", code: "CS-WD201", due: "Oct 18, 11:59 PM", status: "submitted" },
  { title: "Normalization Worksheet", course: "Database Systems", code: "CS-DB301", due: "Oct 12, 5:00 PM", status: "submitted" },
  { title: "Wireframe Set", course: "UX Fundamentals", code: "CS-UX202", due: "Sep 22, 3:00 PM", status: "graded", score: "18/20" },
  { title: "SQL Injection Lab", course: "Software Security", code: "CS-SEC401", due: "Sep 15, 11:59 PM", status: "graded", score: "24/25" },
  { title: "Portfolio Page", course: "Web Development", code: "CS-WD201", due: "Sep 8, 11:59 PM", status: "graded", score: "37/40" },
];

const TABS: { key: Status | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "todo", label: "To do" },
  { key: "submitted", label: "Submitted" },
  { key: "graded", label: "Graded" },
];

const statusChip: Record<Status, { label: string; cls: string; icon: React.ElementType }> = {
  todo: { label: "To do", cls: "bg-amber-100 text-amber-700", icon: Clock },
  submitted: { label: "Submitted", cls: "bg-indigo-100 text-indigo-700", icon: Upload },
  graded: { label: "Graded", cls: "bg-emerald-100 text-emerald-700", icon: Check },
};

export default function AssignmentsPage() {
  const [tab, setTab] = useState<Status | "all">("all");

  const filtered =
    tab === "all" ? assignments : assignments.filter((a) => a.status === tab);

  const counts = {
    todo: assignments.filter((a) => a.status === "todo").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    graded: assignments.filter((a) => a.status === "graded").length,
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">Assignments</h2>
        <p className="mt-1 text-sm text-slate-500">
          {counts.todo} to do · {counts.submitted} submitted · {counts.graded} graded
        </p>
      </div>

      {/* Tabs */}
      <div className="flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
              tab === t.key
                ? "bg-indigo-700 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-400">
            Nothing here right now.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((a) => {
              const chip = statusChip[a.status];
              const Icon = chip.icon;
              return (
                <li
                  key={`${a.code}-${a.title}`}
                  className="flex items-center gap-4 p-5 transition-colors hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-indigo-950">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {a.course} · {a.code}
                    </p>
                  </div>

                  <div className="hidden w-48 shrink-0 sm:block">
                    <p
                      className={`flex items-center gap-1.5 text-xs font-semibold ${
                        a.urgent ? "text-rose-600" : "text-slate-500"
                      }`}
                    >
                      {a.urgent && <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />}
                      {a.due}
                    </p>
                  </div>

                  {a.score && (
                    <span className="w-16 shrink-0 text-sm font-bold text-indigo-950">
                      {a.score}
                    </span>
                  )}

                  <span
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${chip.cls}`}
                  >
                    <Icon className="h-3 w-3" strokeWidth={2.5} />
                    {chip.label}
                  </span>

                  {a.status === "todo" && (
                    <button className="shrink-0 rounded-lg bg-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-800">
                      Submit
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
