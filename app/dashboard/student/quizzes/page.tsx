"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchMyProfile,
  fetchStudentQuizzes,
  QuizResponse,
  StudentProfile,
} from "@/lib/api/student";

type QStatus = "open" | "done" | "upcoming";

const chip: Record<QStatus, string> = {
  open: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-slate-100 text-slate-500",
};

const label: Record<QStatus, string> = {
  open: "Open now",
  done: "Completed",
  upcoming: "Not open yet",
};

function quizStatus(q: QuizResponse): QStatus {
  if (q.attemptsUsed > 0 && q.attemptsUsed >= q.maxAttempts) return "done";
  const now = Date.now();
  const start = q.startAt ? new Date(q.startAt).getTime() : 0;
  const end = q.endAt ? new Date(q.endAt).getTime() : Infinity;
  if (now < start) return "upcoming";
  if (now > end) return "done";
  return "open";
}

export default function QuizzesPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const p = await fetchMyProfile();
      if (p) {
        setProfile(p);
        const data = await fetchStudentQuizzes(p.studentId);
        if (data) setQuizzes(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const openCount = quizzes.filter((q) => quizStatus(q) === "open").length;

  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">Quizzes</h2>
        <p className="mt-1 text-sm text-slate-500">
          {loading ? "Loading..." : `${openCount} quiz${openCount !== 1 ? "zes" : ""} open right now.`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-lg font-semibold text-slate-700">No quizzes found</p>
          <p className="text-sm text-slate-500">No quizzes have been assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((q) => {
            const s = quizStatus(q);
            return (
              <div key={q.quizId} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-indigo-950">{q.title}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${chip[s]}`}>
                    {label[s]}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  {q.className} · {q.subjectName}
                </p>

                <p className="mt-4 text-xs text-slate-500">
                  {q.durationMinutes} mins · Attempts: {q.attemptsUsed}/{q.maxAttempts}
                </p>

                {q.bestScore !== null ? (
                  <p className="mt-4 text-2xl font-black text-indigo-950">
                    {q.bestScore}
                  </p>
                ) : (
                  <button
                    disabled={s !== "open"}
                    className="mt-4 w-full rounded-lg bg-indigo-700 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    {s === "open" ? "Start quiz" : "Not available"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
