"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Check, Upload, Loader2, AlertCircle } from "lucide-react";
import {
  fetchStudentAssignmentsList,
  StudentAssignmentListItem,
} from "@/lib/api/student";
import { useGetStudentProfileQuery } from "@/lib/redux/apiSlice";

type Status = "todo" | "submitted" | "graded";

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

function mapStatus(s: string | null): Status {
  if (!s) return "todo";
  if (s === "GRADED") return "graded";
  return "submitted"; // SUBMITTED or LATE
}

export default function AssignmentsPage() {
  const [tab, setTab] = useState<Status | "all">("all");
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [assignments, setAssignments] = useState<StudentAssignmentListItem[]>([]);

  // Reuses the same cached profile the navbar already fetched, instead of
  // firing a second, redundant request for data that's already in hand.
  const { data: profile, isLoading: loadingProfile } = useGetStudentProfileQuery();

  useEffect(() => {
    if (!profile?.studentId) return;
    let cancelled = false;

    async function load() {
      setLoadingAssignments(true);
      const data = await fetchStudentAssignmentsList(profile!.studentId);
      if (!cancelled && data) setAssignments(data);
      if (!cancelled) setLoadingAssignments(false);
    }
    load();

    return () => {
      cancelled = true;
    };
  }, [profile]);

  const loading = loadingProfile || loadingAssignments;

  const mapped = assignments.map((a) => ({
    ...a,
    status: mapStatus(a.submissionStatus),
  }));

  const filtered = tab === "all" ? mapped : mapped.filter((a) => a.status === tab);

  const counts = {
    todo: mapped.filter((a) => a.status === "todo").length,
    submitted: mapped.filter((a) => a.status === "submitted").length,
    graded: mapped.filter((a) => a.status === "graded").length,
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">Assignments</h2>
        <p className="mt-1 text-sm text-slate-500">
          {loading
            ? "Loading..."
            : `${counts.todo} to do · ${counts.submitted} submitted · ${counts.graded} graded`}
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
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
        </div>
      ) : (
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
                const isDueSoon =
                  a.dueDate &&
                  a.status === "todo" &&
                  new Date(a.dueDate).getTime() - Date.now() < 48 * 60 * 60 * 1000;

                return (
                  <li key={a.assignmentId}>
                    <Link
                      href={`/dashboard/student/courses/assignment?classroomId=${a.classroomId}&assignmentId=${a.assignmentId}`}
                      className="flex items-center gap-4 p-5 transition-colors hover:bg-slate-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-indigo-950">{a.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {a.className} · {a.subjectName}
                        </p>
                      </div>

                      <div className="hidden w-48 shrink-0 sm:block">
                        <p
                          className={`flex items-center gap-1.5 text-xs font-semibold ${
                            isDueSoon ? "text-rose-600" : "text-slate-500"
                          }`}
                        >
                          {isDueSoon && <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />}
                          {a.dueDate
                            ? new Date(a.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "No due date"}
                        </p>
                      </div>

                      {a.score !== null && (
                        <span className="w-16 shrink-0 text-sm font-bold text-indigo-950">
                          {a.score}/{a.maxScore}
                        </span>
                      )}

                      <span
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${chip.cls}`}
                      >
                        <Icon className="h-3 w-3" strokeWidth={2.5} />
                        {chip.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
