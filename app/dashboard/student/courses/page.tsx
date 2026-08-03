"use client";

import { useEffect, useState } from "react";
import { Loader2, FileText, Video, BookOpen, ClipboardCheck, HelpCircle } from "lucide-react";
import {
  fetchMyClassrooms,
  fetchMyProfile,
  fetchClassroomLessons,
  fetchClassroomAssignments,
  fetchStudentAssignments,
  fetchStudentQuizzes,
  ClassroomResponse,
  StudentProfile,
  LessonResponse,
  AssignmentResponse,
  StudentAssignmentResponse,
  QuizResponse,
} from "@/lib/api/student";
import Link from "next/link";

const TABS = ["Overview", "Lessons", "Assignments", "Quizzes"];

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);

  // Data per classroom
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<StudentAssignmentResponse[]>([]);
  const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Load profile + classrooms on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [p, c] = await Promise.all([fetchMyProfile(), fetchMyClassrooms()]);
      if (p) setProfile(p);
      if (c && c.length > 0) {
        setClassrooms(c);
        setSelectedClassroom(c[0].classroomId);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Load detail when selectedClassroom changes
  useEffect(() => {
    if (!selectedClassroom || !profile) return;
    setLoadingDetail(true);
    Promise.all([
      fetchClassroomLessons(selectedClassroom),
      fetchClassroomAssignments(selectedClassroom),
      fetchStudentAssignments(profile.id),
      fetchStudentQuizzes(profile.id),
    ]).then(([le, as, sa, qu]) => {
      setLessons(le ?? []);
      setAssignments(as ?? []);
      // Filter student assignments to selected classroom
      const studentAsgn = sa?.content?.filter((a) => a.classroomId === selectedClassroom) ?? [];
      setStudentAssignments(studentAsgn);
      setQuizzes((qu ?? []).filter((q) => q.classroomId === selectedClassroom));
      setLoadingDetail(false);
    });
  }, [selectedClassroom, profile]);

  const current = classrooms.find((c) => c.classroomId === selectedClassroom);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (classrooms.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-slate-700">No courses found</p>
        <p className="text-sm text-slate-500">You are not enrolled in any classroom yet.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        {/* Classroom selector */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">{current?.className}</h1>
              <p className="mt-1 text-sm text-slate-500">
                Teacher: {current?.teacherName ?? "—"} &nbsp;•&nbsp; {current?.academicYear ?? ""} &nbsp;•&nbsp; Semester {current?.semester ?? ""}
              </p>
            </div>
            {classrooms.length > 1 && (
              <select
                value={selectedClassroom ?? ""}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {classrooms.map((c) => (
                  <option key={c.classroomId} value={c.classroomId}>
                    {c.className} ({c.classCode})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <div className="flex flex-wrap gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === activeTab
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            {/* Overview */}
            {activeTab === "Overview" && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                  <p className="text-2xl font-bold text-indigo-600">{lessons.length}</p>
                  <p className="mt-1 text-sm text-slate-500">Lessons</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                  <p className="text-2xl font-bold text-amber-600">{assignments.length}</p>
                  <p className="mt-1 text-sm text-slate-500">Assignments</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{quizzes.length}</p>
                  <p className="mt-1 text-sm text-slate-500">Quizzes</p>
                </div>

                {/* Recent activity */}
                <div className="sm:col-span-3 rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="mb-4 text-sm font-bold text-slate-900">Recent Activity</h3>
                  {assignments.length === 0 && lessons.length === 0 ? (
                    <p className="text-sm text-slate-500">No activity yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {assignments.slice(0, 5).map((a) => (
                        <div key={a.assignmentId} className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                            <ClipboardCheck className="h-4 w-4 text-amber-700" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900">{a.title}</p>
                            <p className="text-xs text-slate-500">
                              {a.maxScore} pts · {a.dueDate ? `Due ${new Date(a.dueDate).toLocaleDateString()}` : "No due date"}
                            </p>
                          </div>
                        </div>
                      ))}
                      {lessons.slice(0, 5).map((l) => (
                        <div key={l.lessonId} className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                            <BookOpen className="h-4 w-4 text-emerald-700" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900">{l.title}</p>
                            <p className="text-xs text-slate-500">{new Date(l.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lessons */}
            {activeTab === "Lessons" && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Lessons ({lessons.length})</h3>
                {lessons.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">No lessons posted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((l) => (
                      <div key={l.lessonId} className="rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50">
                        <h4 className="text-sm font-bold text-slate-900">{l.title}</h4>
                        {l.content && <p className="mt-1 text-sm text-slate-600 line-clamp-2">{l.content}</p>}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {l.videoLink && (
                            <a href={l.videoLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                              <Video className="h-3.5 w-3.5" /> Watch Video
                            </a>
                          )}
                          {l.files?.map((f) => (
                            <a key={f.fileId} href={f.previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100">
                              <FileText className="h-3 w-3" /> {f.fileOriginalName}
                            </a>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                          By {l.createdBy} · {new Date(l.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Assignments */}
            {activeTab === "Assignments" && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Assignments ({studentAssignments.length})</h3>
                {studentAssignments.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">No assignments yet.</p>
                ) : (
                  <div className="space-y-3">
                    {studentAssignments.map((a) => {
                      const statusColors: Record<string, string> = {
                        SUBMITTED: "bg-blue-50 text-blue-700",
                        GRADED: "bg-emerald-50 text-emerald-700",
                        LATE: "bg-red-50 text-red-700",
                      };
                      const statusBadge = a.submissionStatus
                        ? statusColors[a.submissionStatus] ?? "bg-slate-100 text-slate-600"
                        : "bg-slate-100 text-slate-600";

                      return (
                        <Link
                          key={a.assignmentId}
                          href={`/dashboard/student/courses/assignment?classroomId=${selectedClassroom}&assignmentId=${a.assignmentId}`}
                          className="block rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
                              {a.description && <p className="mt-1 text-sm text-slate-600 line-clamp-2">{a.description}</p>}
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <span className="font-medium text-indigo-600">{a.maxScore} pts</span>
                                {a.dueDate && <span>Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
                                {a.score !== null && <span>Score: {a.score}/{a.maxScore}</span>}
                              </div>
                            </div>
                            <span className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge}`}>
                              {a.submissionStatus ?? "NOT SUBMITTED"}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Quizzes */}
            {activeTab === "Quizzes" && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Quizzes ({quizzes.length})</h3>
                {quizzes.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">No quizzes yet.</p>
                ) : (
                  <div className="space-y-3">
                    {quizzes.map((q) => {
                      const now = new Date();
                      const start = q.startAt ? new Date(q.startAt) : null;
                      const end = q.endAt ? new Date(q.endAt) : null;
                      const isActive = (!start || now >= start) && (!end || now <= end);
                      const isExpired = end && now > end;

                      return (
                        <div key={q.quizId} className="rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                                <HelpCircle className="h-5 w-5 text-violet-700" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">{q.title}</h4>
                                {q.description && <p className="mt-1 text-sm text-slate-600 line-clamp-2">{q.description}</p>}
                                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                                  <span>{q.durationMinutes} mins</span>
                                  <span>Attempts: {q.attemptsUsed}/{q.maxAttempts}</span>
                                  {q.bestScore !== null && <span>Best: {q.bestScore}</span>}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                isExpired
                                  ? "bg-red-50 text-red-700"
                                  : isActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {isExpired ? "CLOSED" : isActive ? "OPEN" : "UPCOMING"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}