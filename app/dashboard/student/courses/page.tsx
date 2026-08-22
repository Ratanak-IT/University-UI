"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  FileText,
  Video,
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Upload,
  AlertCircle,
  X,
  Play,
} from "lucide-react";
import ModernSelect from "@/components/shared/ModernSelect";
import {
  fetchMyClassrooms,
  fetchMyProfile,
  fetchClassroomLessons,
  fetchClassroomAssignments,
  fetchStudentAssignments,
  fetchStudentQuizzes,
  startQuizAttempt,
  submitQuizAttempt,
  ClassroomResponse,
  StudentProfile,
  LessonResponse,
  AssignmentResponse,
  StudentAssignmentResponse,
  QuizResponse,
  QuizAttemptResponse,
  QuizQuestionItem,
} from "@/lib/api/student";
import Link from "next/link";
import { SecureFileViewerModal } from "@/components/shared/SecureFileViewerModal";

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
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);
  const [viewerFile, setViewerFile] = useState<{ name: string; url: string; isVideo?: boolean } | null>(null);

  // Data per classroom
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [assignments, setAssignments] = useState<CombinedAssignment[]>([]);
  const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Quiz Modal State
  const [activeQuizModal, setActiveQuizModal] = useState<QuizResponse | null>(null);
  const [attemptData, setAttemptData] = useState<QuizAttemptResponse | null>(null);
  const [startingQuiz, setStartingQuiz] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizAttemptResponse | null>(null);
  /**
   * Keyed by questionId. `selectedOptionIndex` is what grading actually uses
   * for a choice question; `answer` carries the option's text (for the
   * result screen and as a fallback) or the typed text for a SHORT_ANSWER
   * question. Storing the index rather than only the text is what lets a
   * teacher reword an option after publishing without silently breaking
   * every student's already-recorded answer.
   */
  const [answers, setAnswers] = useState<
    Record<string, { selectedOptionIndex?: number; answer: string }>
  >({});
  const [currentQ, setCurrentQ] = useState(0);

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
      fetchStudentAssignments(profile.studentId),
      fetchStudentQuizzes(profile.studentId),
    ]).then(([le, classAsgns, studentAsgns, qu]) => {
      setLessons(le ?? []);

      // Build student assignment map by assignmentId
      const subMap = new Map<string, StudentAssignmentResponse>();
      if (studentAsgns?.content) {
        studentAsgns.content.forEach((sa) => {
          subMap.set(sa.assignmentId, sa);
        });
      }

      // Merge classroom assignments with student submission status
      const combined: CombinedAssignment[] = (classAsgns ?? []).map((ca) => {
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
      if (combined.length === 0 && studentAsgns?.content) {
        studentAsgns.content
          .filter((sa) => !selectedClassroom || sa.classroomId === selectedClassroom || !sa.classroomId)
          .forEach((sa) => {
            combined.push({
              assignmentId: sa.assignmentId,
              classroomId: sa.classroomId ?? selectedClassroom,
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

      setAssignments(combined);

      // Quizzes: filter by classroomId if match, or fallback to all student quizzes
      const allQuizzes = qu ?? [];
      const matchedQuizzes = allQuizzes.filter(
        (q) => !q.classroomId || q.classroomId.toLowerCase() === selectedClassroom.toLowerCase()
      );
      setQuizzes(matchedQuizzes.length > 0 ? matchedQuizzes : allQuizzes);

      setLoadingDetail(false);
    });
  }, [selectedClassroom, profile]);

  const current = classrooms.find((c) => c.classroomId === selectedClassroom);

  // Handle start quiz attempt
  const handleStartQuiz = async (quiz: QuizResponse) => {
    setActiveQuizModal(quiz);
    setQuizCompleted(false);
    setQuizResult(null);
    setAnswers({});
    setCurrentQ(0);
    setAttemptData(null);
    if (profile) {
      setStartingQuiz(true);
      const res = await startQuizAttempt(profile.studentId, quiz.quizId);
      if (res) {
        setAttemptData(res);
      }
      setStartingQuiz(false);
    }
  };

  // Handle submit quiz
  const handleSubmitQuiz = async () => {
    if (!activeQuizModal || !profile || !attemptData) return;
    setSubmittingQuiz(true);

    // Build answers array: [{ questionId, selectedOptionIndex?, answer? }]
    const answerItems = attemptData.questions.map((q) => {
      const given = answers[q.questionId];
      return {
        questionId: q.questionId,
        selectedOptionIndex: given?.selectedOptionIndex,
        answer: given?.answer ?? "",
      };
    });

    const result = await submitQuizAttempt(
      profile.studentId,
      activeQuizModal.quizId,
      attemptData.attemptId,
      answerItems
    );

    setSubmittingQuiz(false);
    setQuizCompleted(true);
    setQuizResult(result);

    // Refresh quizzes list
    const updated = await fetchStudentQuizzes(profile.studentId);
    if (updated) {
      const matched = updated.filter(
        (q) => !q.classroomId || q.classroomId.toLowerCase() === selectedClassroom?.toLowerCase()
      );
      setQuizzes(matched.length > 0 ? matched : updated);
    }
  };

  const sortedQuestions = attemptData?.questions
    ? [...attemptData.questions].sort((a, b) => a.questionOrder - b.questionOrder)
    : [];

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
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        {/* Classroom selector header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-black tracking-tight text-indigo-950 dark:text-slate-100 sm:text-2xl">
                {current?.className}
              </h1>
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
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
                    <p className="py-6 text-center text-sm font-medium text-slate-500">No content published in this classroom yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {assignments.map((a) => {
                        const isSubmitted = a.submissionStatus === "SUBMITTED" || a.submissionStatus === "TURNED IN" || a.submissionStatus === "GRADED";
                        return (
                          <div key={a.assignmentId} className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors ${
                            isSubmitted ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100 hover:bg-slate-50"
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                isSubmitted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                              }`}>
                                <ClipboardCheck className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-slate-900">{a.title}</p>
                                  {isSubmitted && (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                                      SUBMITTED
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-medium text-slate-500">
                                  Assignment • {a.maxScore} pts {a.dueDate ? `• Due ${new Date(a.dueDate).toLocaleDateString()}` : ""}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={`/dashboard/student/courses/assignment?classroomId=${selectedClassroom}&assignmentId=${a.assignmentId}`}
                              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                                isSubmitted
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                              }`}
                            >
                              {isSubmitted ? "View Submission" : "View & Submit"} <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        );
                      })}

                      {quizzes.map((q) => (
                        <div key={q.quizId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                              <HelpCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{q.title}</p>
                              <p className="text-xs font-medium text-slate-500">
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
                        <div key={l.lessonId} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{l.title}</p>
                            <p className="text-xs font-medium text-slate-500">Lesson • {new Date(l.createdAt).toLocaleDateString()}</p>
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
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-indigo-950">Lessons ({lessons.length})</h3>
                {lessons.length === 0 ? (
                  <p className="py-12 text-center text-sm font-medium text-slate-500">No lessons posted in this classroom yet.</p>
                ) : (
                  <div className="space-y-4">
                    {lessons.map((l) => (
                      <div key={l.lessonId} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:bg-slate-50">
                        <h4 className="text-base font-bold text-indigo-950">{l.title}</h4>
                        {l.content && <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{l.content}</p>}
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {l.videoLink && (
                            <button
                              type="button"
                              onClick={() => setViewerFile({ name: `${l.title} (Video)`, url: l.videoLink || "", isVideo: true })}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-200 cursor-pointer"
                            >
                              <Video className="h-4 w-4" /> Watch Video Lesson
                            </button>
                          )}
                          {l.files?.map((f) => (
                            <button
                              key={f.fileId}
                              type="button"
                              onClick={() => setViewerFile({ name: f.fileOriginalName, url: f.previewUrl || "", isVideo: false })}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              <FileText className="h-4 w-4 text-indigo-600" /> {f.fileOriginalName}
                            </button>
                          ))}
                        </div>
                        <p className="mt-3 text-xs font-medium text-slate-400">
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
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-bold text-indigo-950">Assignments ({assignments.length})</h3>
                </div>

                {assignments.length === 0 ? (
                  <div className="py-12 text-center">
                    <ClipboardCheck className="mx-auto h-12 w-12 text-slate-300" />
                    <p className="mt-2 text-base font-bold text-slate-700">No assignments yet</p>
                    <p className="mt-1 text-sm text-slate-500">Your teacher hasn&apos;t assigned any tasks for this classroom.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((a) => {
                      const isGraded = a.submissionStatus === "GRADED";
                      const isSubmitted = a.submissionStatus === "SUBMITTED" || a.submissionStatus === "TURNED IN" || isGraded;

                      const statusColor = isGraded
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : isSubmitted
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-50 text-amber-700 border-amber-200";

                      const statusLabel = isGraded
                        ? `GRADED: ${a.score}/${a.maxScore}`
                        : isSubmitted
                        ? "SUBMITTED"
                        : "ASSIGNED";

                      const cardStyle = isSubmitted
                        ? "border-emerald-300 bg-emerald-50/30 shadow-sm"
                        : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md";

                      const buttonStyle = isSubmitted
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                        : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200";

                      return (
                        <div
                          key={a.assignmentId}
                          className={`rounded-2xl border p-5 transition-all ${cardStyle}`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold text-slate-900">{a.title}</h4>
                                <span className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${statusColor}`}>
                                  {isSubmitted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                                  {statusLabel}
                                </span>
                              </div>
                              {a.description && (
                                <p className="text-sm text-slate-600 line-clamp-2">{a.description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-1">
                                <span className="font-bold text-indigo-600">{a.maxScore} points</span>
                                {a.dueDate && (
                                  <span className="flex items-center gap-1 text-slate-600">
                                    <Clock className="h-3.5 w-3.5 text-slate-400" />
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
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-bold text-indigo-950">Quizzes ({quizzes.length})</h3>
                </div>

                {quizzes.length === 0 ? (
                  <div className="py-12 text-center">
                    <HelpCircle className="mx-auto h-12 w-12 text-slate-300" />
                    <p className="mt-2 text-base font-bold text-slate-700">No quizzes available</p>
                    <p className="mt-1 text-sm text-slate-500">No quizzes are currently scheduled for this course.</p>
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
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : isExpired
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : isActive
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-slate-100 text-slate-600 border-slate-200";

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
                          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                        >
                          <div>
                            {/* Card top */}
                            <div className="flex items-center justify-between">
                              <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusBadgeClass}`}>
                                {statusText}
                              </span>
                              <span className="text-xs font-semibold text-slate-400">
                                Attempts: {q.attemptsUsed}/{q.maxAttempts}
                              </span>
                            </div>

                            {/* Title & description */}
                            <h4 className="mt-3 text-lg font-bold text-indigo-950">{q.title}</h4>
                            <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
                              {q.description || "No description provided."}
                            </p>

                            {/* Meta */}
                            <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-indigo-600" />
                                {q.durationMinutes} Mins
                              </span>
                              {q.bestScore !== null && (
                                <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Best Score: {q.bestScore} pts
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Submit / Take Quiz Button */}
                          <div className="mt-5">
                            {isCompleted ? (
                              <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-xs font-bold text-emerald-700">
                                <CheckCircle2 className="h-4 w-4" /> Completed
                              </div>
                            ) : (
                              <button
                                onClick={() => handleStartQuiz(q)}
                                disabled={!isActive}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
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
      </main>

      {/* QUIZ ATTEMPT MODAL */}
      {activeQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-950">{activeQuizModal.title}</h3>
                  <p className="text-xs text-slate-500">
                    {activeQuizModal.durationMinutes} Minutes • {activeQuizModal.maxAttempts} Max Attempts
                    {attemptData && ` • ${sortedQuestions.length} Questions`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveQuizModal(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* STATE: Loading quiz */}
              {startingQuiz && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-600">Loading quiz questions...</p>
                </div>
              )}

              {/* STATE: Quiz completed - show results */}
              {quizCompleted && (
                <div className="py-8 space-y-6">
                  <div className="text-center space-y-3">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">Quiz Submitted!</h4>
                    {quizResult && quizResult.earnedScore !== null && (
                      <div className="mx-auto w-fit rounded-2xl bg-indigo-50 px-8 py-4 border border-indigo-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Your Score</p>
                        <p className="text-3xl font-black text-indigo-950">
                          {quizResult.earnedScore} <span className="text-lg font-bold text-slate-400">/ {quizResult.totalScore}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Show answer results if available */}
                  {quizResult?.answers && quizResult.answers.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Results</p>
                      {quizResult.answers.map((ar, i) => {
                        const q = sortedQuestions.find((sq) => sq.questionId === ar.questionId);
                        return (
                          <div
                            key={ar.questionId}
                            className={`flex items-center justify-between rounded-xl border p-3 ${
                              ar.isCorrect
                                ? "border-emerald-200 bg-emerald-50"
                                : "border-rose-200 bg-rose-50"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                Q{i + 1}: {q?.questionText ?? "Question"}
                              </p>
                              <p className="text-xs text-slate-600">Your answer: {ar.answer || "—"}</p>
                            </div>
                            <div className="shrink-0 ml-3">
                              {ar.isCorrect ? (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                  +{ar.earnedScore}
                                </span>
                              ) : (
                                <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">
                                  0
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <button
                      onClick={() => { setActiveQuizModal(null); setAttemptData(null); }}
                      className="rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* STATE: Taking quiz - show questions */}
              {!startingQuiz && !quizCompleted && attemptData && sortedQuestions.length > 0 && (
                <div className="space-y-5">
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Question {currentQ + 1} of {sortedQuestions.length}</span>
                      <span>{Object.values(answers).filter((a) => a.answer).length} answered</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${((currentQ + 1) / sortedQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question navigation dots */}
                  <div className="flex flex-wrap gap-1.5">
                    {sortedQuestions.map((q, i) => (
                      <button
                        key={q.questionId}
                        onClick={() => setCurrentQ(i)}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                          i === currentQ
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                            : answers[q.questionId]?.answer
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {/* Current question */}
                  {(() => {
                    const q = sortedQuestions[currentQ];
                    return (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Question {currentQ + 1}
                          </span>
                          <span className="text-xs text-slate-400 ml-2">({q.score} pts)</span>
                        </div>
                        <p className="text-base font-semibold text-slate-900">{q.questionText}</p>

                        {/* Answer input: a typed box for SHORT_ANSWER, choice
                            buttons for everything else (TRUE_FALSE is just a
                            two-option MULTIPLE_CHOICE and needs no separate UI). */}
                        {q.type === "SHORT_ANSWER" ? (
                          <textarea
                            value={answers[q.questionId]?.answer ?? ""}
                            onChange={(e) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [q.questionId]: { answer: e.target.value },
                              }))
                            }
                            rows={3}
                            placeholder="Type your answer…"
                            className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        ) : (
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                              <label
                                key={oi}
                                className={`flex items-center gap-3 rounded-xl border p-3.5 text-sm cursor-pointer transition-all ${
                                  answers[q.questionId]?.selectedOptionIndex === oi
                                    ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`q-${q.questionId}`}
                                  value={oi}
                                  checked={answers[q.questionId]?.selectedOptionIndex === oi}
                                  onChange={() =>
                                    setAnswers((prev) => ({
                                      ...prev,
                                      [q.questionId]: { selectedOptionIndex: oi, answer: opt },
                                    }))
                                  }
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                />
                                <span className="text-slate-800 font-medium">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Navigation & Submit */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                      disabled={currentQ === 0}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {currentQ < sortedQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQ((p) => Math.min(sortedQuestions.length - 1, p + 1))}
                        className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={submittingQuiz}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-200"
                      >
                        {submittingQuiz ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" /> Submit Quiz
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STATE: No questions returned */}
              {!startingQuiz && !quizCompleted && attemptData && sortedQuestions.length === 0 && (
                <div className="py-12 text-center space-y-3">
                  <HelpCircle className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="text-base font-bold text-slate-700">No questions available</p>
                  <p className="text-sm text-slate-500">This quiz has no questions yet. Contact your teacher.</p>
                  <button
                    onClick={() => { setActiveQuizModal(null); setAttemptData(null); }}
                    className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* STATE: Failed to start */}
              {!startingQuiz && !quizCompleted && !attemptData && (
                <div className="py-12 text-center space-y-3">
                  <AlertCircle className="mx-auto h-10 w-10 text-rose-400" />
                  <p className="text-base font-bold text-slate-700">Could not start quiz</p>
                  <p className="text-sm text-slate-500">You may have used all attempts or the quiz is not available.</p>
                  <button
                    onClick={() => setActiveQuizModal(null)}
                    className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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