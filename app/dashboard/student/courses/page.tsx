"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Video,
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Upload,
  Play,
} from "lucide-react";
import ModernSelect from "@/components/shared/ModernSelect";
import SafeHtml, { htmlToPreviewText } from "@/components/shared/SafeHtml";
import { StudentAssignmentResponse, QuizResponse } from "@/lib/api/student";
import {
  useGetStudentProfileQuery,
  useGetMyClassroomsQuery,
  useGetClassroomLessonsQuery,
  useGetClassroomAssignmentsQuery,
  useGetStudentAssignmentsQuery,
  useGetStudentQuizzesQuery,
} from "@/lib/redux/apiSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SecureFileViewerModal } from "@/components/shared/SecureFileViewerModal";
import CoursesPageSkeleton, { CoursesContentSkeleton } from "@/components/shared/CoursesPageSkeleton";

const TABS = ["Overview", "Lessons", "Assignments", "Quizzes"];

interface CombinedAssignment {
  assignmentId: string;
  classroomId: string;
  title: string;
  description: string;
  dueDate: string | null;
  maxScore: number;
  weight: number;
  files: any[];
  submissionStatus: string; // SUBMITTED | GRADED | LATE | NOT SUBMITTED
  score: number | null;
  submittedAt: string | null;
}

export default function CoursesPage() {
  const router = useRouter();
  // A notification (a new quiz, an assignment, ...) links here with
  // ?classroomId=&tab= so the click lands on the exact class and tab it was
  // about, not on whichever classroom happens to load first.
  const searchParams = useSearchParams();
  const linkedClassroomId = searchParams.get("classroomId");
  const linkedTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(
    linkedTab && TABS.includes(linkedTab) ? linkedTab : "Overview"
  );
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);
  const [viewerFile, setViewerFile] = useState<{ name: string; url: string; isVideo?: boolean } | null>(null);

  const { data: profile, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const { data: classrooms = [], isLoading: loadingClassrooms } = useGetMyClassroomsQuery();

  // Pick the linked (or first) classroom once the roster arrives.
  useEffect(() => {
    if (selectedClassroom || classrooms.length === 0) return;
    const linked = linkedClassroomId
      ? classrooms.find((cls) => cls.classroomId === linkedClassroomId)
      : undefined;
    setSelectedClassroom(linked ? linked.classroomId : classrooms[0].classroomId);
    // Deliberately not depending on linkedClassroomId after the first pick —
    // this only decides the initial selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classrooms]);

  const loading = loadingProfile || loadingClassrooms;

  const { data: lessons = [], isFetching: loadingLessons } = useGetClassroomLessonsQuery(
    selectedClassroom ?? "",
    { skip: !selectedClassroom }
  );
  const { data: classAsgns = [], isFetching: loadingClassAsgns } = useGetClassroomAssignmentsQuery(
    selectedClassroom ?? "",
    { skip: !selectedClassroom }
  );
  const { data: studentAsgnsPage, isFetching: loadingStudentAsgns } = useGetStudentAssignmentsQuery(
    { studentId: profile?.studentId ?? "" },
    { skip: !profile }
  );
  const { data: allQuizzes = [], isFetching: loadingQuizzes } = useGetStudentQuizzesQuery(
    profile?.studentId ?? "",
    { skip: !profile }
  );

  const loadingDetail = loadingLessons || loadingClassAsgns || loadingStudentAsgns || loadingQuizzes;

  const assignments = useMemo<CombinedAssignment[]>(() => {
    const studentAsgns = studentAsgnsPage?.content ?? [];
    const subMap = new Map<string, StudentAssignmentResponse>();
    studentAsgns.forEach((sa) => subMap.set(sa.assignmentId, sa));

    const combined: CombinedAssignment[] = classAsgns.map((ca) => {
      const sa = subMap.get(ca.assignmentId);
      return {
        assignmentId: ca.assignmentId,
        classroomId: ca.classroomId,
        title: ca.title,
        description: ca.description,
        dueDate: ca.dueDate,
        maxScore: ca.maxScore,
        weight: ca.weight,
        files: ca.files ?? [],
        submissionStatus: sa?.submissionStatus ?? (sa?.submittedAt ? "SUBMITTED" : "NOT SUBMITTED"),
        score: sa?.score ?? null,
        submittedAt: sa?.submittedAt ?? null,
      };
    });

    // If classAsgns is empty but studentAsgns has entries, add them
    if (combined.length === 0 && studentAsgns.length > 0) {
      studentAsgns
        .filter((sa) => !selectedClassroom || sa.classroomId === selectedClassroom || !sa.classroomId)
        .forEach((sa) => {
          combined.push({
            assignmentId: sa.assignmentId,
            classroomId: sa.classroomId ?? selectedClassroom ?? "",
            title: sa.title,
            description: sa.description,
            dueDate: sa.dueDate,
            maxScore: sa.maxScore,
            weight: sa.weight,
            files: sa.assignmentFiles ?? [],
            submissionStatus: sa.submissionStatus ?? (sa.submittedAt ? "SUBMITTED" : "NOT SUBMITTED"),
            score: sa.score ?? null,
            submittedAt: sa.submittedAt ?? null,
          });
        });
    }

    return combined;
  }, [classAsgns, studentAsgnsPage, selectedClassroom]);

  const quizzes = useMemo<QuizResponse[]>(() => {
    if (!selectedClassroom) return allQuizzes;
    const matched = allQuizzes.filter(
      (q) => !q.classroomId || q.classroomId.toLowerCase() === selectedClassroom.toLowerCase()
    );
    return matched.length > 0 ? matched : allQuizzes;
  }, [allQuizzes, selectedClassroom]);

  const current = classrooms.find((c) => c.classroomId === selectedClassroom);

  // Sitting a quiz is its own page, not a dialog over this one: a modal can be
  // dismissed by a stray backdrop click, competes with fullscreen, and leaves
  // this list polling behind it while the student is trying to concentrate.
  const handleStartQuiz = (quiz: QuizResponse) => {
    router.push(`/dashboard/student/quiz/${quiz.quizId}`);
  };


  if (loading) {
    return <CoursesPageSkeleton />;
  }

  if (classrooms.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">No courses found</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">You are not enrolled in any classroom yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-colors">
      {/* Header — same eyebrow/title/subtitle pattern as Grades, Attendance,
          Certificates and Notifications. */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-4 w-4" />
            My Learning
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            My Courses
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Lessons, assignments and quizzes for each class you&apos;re enrolled in.
          </p>
        </div>
      </div>

      {/* Classroom selector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-black tracking-tight text-indigo-950 dark:text-slate-100 sm:text-2xl">
              {current?.className}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Teacher: <span className="font-semibold text-slate-700 dark:text-slate-200">{current?.teacherName ?? "—"}</span> &nbsp;•&nbsp; {current?.academicYear ?? ""} &nbsp;•&nbsp; Semester {current?.semester ?? ""}
            </p>
          </div>
          {classrooms.length > 1 && (
            <div className="w-60">
              <ModernSelect
                value={selectedClassroom ?? ""}
                onChange={(val) => setSelectedClassroom(val)}
                options={classrooms.map((c) => ({
                  value: c.classroomId,
                  label: `${c.className} (${c.classCode})`,
                }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                tab === activeTab
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loadingDetail ? (
        <div className="space-y-4">
          <CoursesContentSkeleton />
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="space-y-4">
              {/* Stats cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{lessons.length}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Lessons</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{assignments.length}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Assignments</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{quizzes.length}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Quizzes</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 text-base font-bold text-indigo-950 dark:text-slate-100">Classroom Content & Activity</h3>
                {assignments.length === 0 && lessons.length === 0 && quizzes.length === 0 ? (
                  <p className="py-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">No content published in this classroom yet.</p>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((a) => {
                      const isSubmitted = a.submissionStatus === "SUBMITTED" || a.submissionStatus === "TURNED IN" || a.submissionStatus === "GRADED";
                      return (
                        <div key={a.assignmentId} className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors ${
                          isSubmitted ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isSubmitted ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                            }`}>
                              <ClipboardCheck className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{a.title}</p>
                                {isSubmitted && (
                                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    SUBMITTED
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Assignment • {a.maxScore} pts {a.dueDate ? `• Due ${new Date(a.dueDate).toLocaleDateString()}` : ""}
                              </p>
                            </div>
                          </div>
                          <Link
                            href={`/dashboard/student/courses/assignment?classroomId=${selectedClassroom}&assignmentId=${a.assignmentId}`}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                              isSubmitted
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-950"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-950"
                            }`}
                          >
                            {isSubmitted ? "View Submission" : "View & Submit"} <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      );
                    })}

                    {quizzes.map((q) => (
                      <div key={q.quizId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                            <HelpCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{q.title}</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Quiz • {q.durationMinutes} mins • Attempts: {q.attemptsUsed}/{q.maxAttempts}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleStartQuiz(q)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-violet-700"
                        >
                          Take Quiz <Play className="h-3.5 w-3.5 fill-current" />
                        </button>
                      </div>
                    ))}

                    {lessons.map((l) => (
                      <div key={l.lessonId} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{l.title}</p>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Lesson • {new Date(l.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LESSONS */}
          {activeTab === "Lessons" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-base font-bold text-indigo-950 dark:text-slate-100">Lessons ({lessons.length})</h3>
              {lessons.length === 0 ? (
                <p className="py-12 text-center text-sm font-medium text-slate-500 dark:text-slate-400">No lessons posted in this classroom yet.</p>
              ) : (
                <div className="space-y-4">
                  {lessons.map((l) => (
                    <div key={l.lessonId} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/50">
                      <h4 className="text-base font-bold text-indigo-950 dark:text-slate-100">{l.title}</h4>
                      {l.content && (
                        <SafeHtml
                          html={l.content}
                          className="mt-2 text-sm text-slate-600 dark:text-slate-300 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_a]:text-indigo-600 [&_a]:underline [&_img]:max-w-full [&_img]:rounded-md [&_img]:my-2"
                        />
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {l.videoLink && (
                          <button
                            type="button"
                            onClick={() => setViewerFile({ name: `${l.title} (Video)`, url: l.videoLink || "", isVideo: true })}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-200 cursor-pointer dark:bg-indigo-950/60 dark:text-gray-200 dark:hover:bg-indigo-950"
                          >
                            <Video className="h-4 w-4" /> Watch Video Lesson
                          </button>
                        )}
                        {l.files?.map((f) => (
                          <button
                            key={f.fileId}
                            type="button"
                            onClick={() => setViewerFile({ name: f.fileOriginalName, url: f.previewUrl || "", isVideo: false })}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> {f.fileOriginalName}
                          </button>
                        ))}
                      </div>
                      <p className="mt-3 text-xs font-medium text-slate-400 dark:text-slate-500">
                        Posted by {l.createdBy} on {new Date(l.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ASSIGNMENTS (WITH SUBMIT FUNCTIONALITY) */}
          {activeTab === "Assignments" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-indigo-950 dark:text-slate-100">Assignments ({assignments.length})</h3>
              </div>

              {assignments.length === 0 ? (
                <div className="py-12 text-center">
                  <ClipboardCheck className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
                  <p className="mt-2 text-base font-bold text-slate-700 dark:text-slate-200">No assignments yet</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your teacher hasn&apos;t assigned any tasks for this classroom.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((a) => {
                    const isGraded = a.submissionStatus === "GRADED";
                    const isSubmitted = a.submissionStatus === "SUBMITTED" || a.submissionStatus === "TURNED IN" || isGraded;

                    const statusColor = isGraded
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                      : isSubmitted
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900";

                    const statusLabel = isGraded
                      ? `GRADED: ${a.score}/${a.maxScore}`
                      : isSubmitted
                      ? "SUBMITTED"
                      : "ASSIGNED";

                    const cardStyle = isSubmitted
                      ? "border-emerald-300 bg-emerald-50/30 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/20"
                      : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800";

                    const buttonStyle = isSubmitted
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none";

                    return (
                      <div
                        key={a.assignmentId}
                        className={`rounded-2xl border p-5 transition-all ${cardStyle}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{a.title}</h4>
                              <span className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${statusColor}`}>
                                {isSubmitted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                                {statusLabel}
                              </span>
                            </div>
                            {a.description && (
                              <p className="text-sm text-slate-600 line-clamp-2 dark:text-slate-300">{htmlToPreviewText(a.description)}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{a.maxScore} points</span>
                              {a.dueDate && (
                                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                  <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                  Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* View & Submit Button */}
                          <div className="shrink-0">
                            <Link
                              href={`/dashboard/student/courses/assignment?classroomId=${selectedClassroom}&assignmentId=${a.assignmentId}`}
                              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm ${buttonStyle}`}
                            >
                              <Upload className="h-4 w-4" />
                              {isSubmitted ? "View Submission" : "Submit Assignment"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QUIZZES (TEACHER STYLE + TAKE QUIZ SUBMISSION) */}
          {activeTab === "Quizzes" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-indigo-950 dark:text-slate-100">Quizzes ({quizzes.length})</h3>
              </div>

              {quizzes.length === 0 ? (
                <div className="py-12 text-center">
                  <HelpCircle className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
                  <p className="mt-2 text-base font-bold text-slate-700 dark:text-slate-200">No quizzes available</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">No quizzes are currently scheduled for this course.</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {quizzes.map((q) => {
                    const now = new Date();
                    const start = q.startAt ? new Date(q.startAt) : null;
                    const end = q.endAt ? new Date(q.endAt) : null;
                    const isActive = (!start || now >= start) && (!end || now <= end);
                    const isExpired = end && now > end;
                    const isCompleted = q.attemptsUsed > 0 && q.attemptsUsed >= q.maxAttempts;

                    const statusBadgeClass = isCompleted
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                      : isExpired
                      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900"
                      : isActive
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900"
                      : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

                    const statusText = isCompleted
                      ? "COMPLETED"
                      : isExpired
                      ? "EXPIRED"
                      : isActive
                      ? "OPEN"
                      : "UPCOMING";

                    return (
                      <div
                        key={q.quizId}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div>
                          {/* Card top */}
                          <div className="flex items-center justify-between">
                            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusBadgeClass}`}>
                              {statusText}
                            </span>
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                              Attempts: {q.attemptsUsed}/{q.maxAttempts}
                            </span>
                          </div>

                          {/* Title & description */}
                          <h4 className="mt-3 text-lg font-bold text-indigo-950 dark:text-slate-100">{q.title}</h4>
                          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
                            {q.description || "No description provided."}
                          </p>

                          {/* Meta */}
                          <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              {q.durationMinutes} Mins
                            </span>
                            {q.bestScore !== null && (
                              <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" />
                                Best Score: {q.bestScore} pts
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Submit / Take Quiz Button */}
                        <div className="mt-5">
                          {isCompleted ? (
                            <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                              <CheckCircle2 className="h-4 w-4" /> Completed
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartQuiz(q)}
                              disabled={!isActive}
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200 dark:shadow-none"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" />
                              {isActive ? "Start Quiz Attempt" : "Not Available Yet"}
                            </button>
                          )}
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

      {/* QUIZ ATTEMPT MODAL */}

      {/* Secure Read-Only In-App File Viewer */}
      <SecureFileViewerModal
        isOpen={!!viewerFile}
        onClose={() => setViewerFile(null)}
        fileName={viewerFile?.name || ""}
        fileUrl={viewerFile?.url || ""}
        isVideo={viewerFile?.isVideo}
      />
    </div>
  );
}
