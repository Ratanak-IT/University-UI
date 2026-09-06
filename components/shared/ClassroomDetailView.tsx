"use client";

import { useMemo, useState } from "react";
import PersonAvatar from "@/components/shared/PersonAvatar";
import {
  LessonResponse,
  QuizResponse,
} from "@/lib/api/student";
import {
  useGetClassroomByIdQuery,
  useGetClassroomLessonsQuery,
  useGetClassroomAssignmentsQuery,
  useGetClassroomStudentsQuery,
  useGetClassroomTeachersQuery,
  useGetStudentProfileQuery,
  useGetTeacherQuizzesQuery,
  useGetStudentQuizzesQuery,
  useGetMyClassroomsQuery,
  useGetTeacherClassroomsQuery,
  useDeleteAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteSavedLessonMutation,
  useUpdateSavedLessonMutation,
  QuizManageResponse,
} from "@/lib/redux/apiSlice";
import { toast } from "@/components/shared/Toast";
import { apiErrorMessage } from "@/lib/api/errors";
import { htmlToPreviewText } from "@/components/shared/SafeHtml";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Loader2, FileText, Users, MapPin, Calendar, BookOpen, Plus, Trash2, Pencil, X, ChevronRight, GraduationCap, HelpCircle, Clock, CheckCircle2, ClipboardList } from "lucide-react";
import Link from "next/link";
import { SecureFileViewerModal } from "@/components/shared/SecureFileViewerModal";
import { LessonDetailModal } from "@/components/shared/LessonDetailModal";
import { LessonCard } from "@/components/teacher/my-classroom/LessonCard";
import QuizResultsModal from "@/components/teacher/quiz/QuizResultsModal";
import ClassroomDetailSkeleton from "@/components/shared/ClassroomDetailSkeleton";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type StudentQuizWindowStatus = "open" | "done" | "missed" | "upcoming";

const STUDENT_QUIZ_BADGE: Record<StudentQuizWindowStatus, { label: string; cls: string }> = {
  open: { label: "OPEN", cls: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900" },
  done: { label: "COMPLETED", cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900" },
  missed: { label: "MISSED", cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900" },
  upcoming: { label: "UPCOMING", cls: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" },
};

/** Mirrors the status rules on the student quizzes pages: a closed window without a settled attempt is "missed", not "Completed". */
function studentQuizWindowStatus(q: { attemptsUsed: number; maxAttempts: number; startAt: string | null; endAt: string | null }): StudentQuizWindowStatus {
  if (q.attemptsUsed > 0 && q.attemptsUsed >= q.maxAttempts) return "done";
  const now = Date.now();
  const start = q.startAt ? new Date(q.startAt).getTime() : 0;
  const end = q.endAt ? new Date(q.endAt).getTime() : Infinity;
  if (now < start) return "upcoming";
  if (now > end) return "missed";
  return "open";
}

interface ClassroomDetailViewProps {
  classroomId?: string;
  isStudent?: boolean;
}

export default function ClassroomDetailView({
  classroomId,
  isStudent = false,
}: ClassroomDetailViewProps) {
  const [activeTab, setActiveTab] = useState("Stream");
  const isDirectId = !!classroomId && UUID_REGEX.test(classroomId);
  const [viewerFile, setViewerFile] = useState<{ name: string; url: string; isVideo?: boolean } | null>(null);
  const [detailLesson, setDetailLesson] = useState<LessonResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit Modals State
  const [editingLesson, setEditingLesson] = useState<{ lessonId: string; title: string; content: string; videoLink: string } | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<{ assignmentId: string; title: string; description: string; maxScore: number; dueDate: string } | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteAssignmentMutation] = useDeleteAssignmentMutation();
  const [updateAssignmentMutation] = useUpdateAssignmentMutation();
  const [deleteSavedLesson] = useDeleteSavedLessonMutation();
  const [updateSavedLesson] = useUpdateSavedLessonMutation();

  const tabs = ["Stream", "Lessons", "Assignments", "Quizzes", "People"];

  // A class code in the URL (rather than a UUID) needs resolving against the
  // roster the user already has cached — skipped entirely once resolved.
  const { data: myStudentClassrooms } = useGetMyClassroomsQuery(undefined, {
    skip: !classroomId || isDirectId || !isStudent,
  });
  const { data: myTeacherClassrooms } = useGetTeacherClassroomsQuery(undefined, {
    skip: !classroomId || isDirectId || isStudent,
  });
  const lookedUpId = useMemo(() => {
    if (!classroomId || isDirectId) return "";
    const myClassrooms = isStudent ? myStudentClassrooms : myTeacherClassrooms;
    const matched = myClassrooms?.find(
      (c) => c.classCode?.toLowerCase() === classroomId?.toLowerCase()
    );
    return matched?.classroomId ?? "";
  }, [classroomId, isDirectId, isStudent, myStudentClassrooms, myTeacherClassrooms]);
  const resolvedId = isDirectId ? (classroomId as string) : lookedUpId;

  // Use RTK Query Hooks with resolved UUID
  const { data: classroom, isLoading: loadingClassroom } = useGetClassroomByIdQuery(resolvedId, {
    skip: !resolvedId,
  });
  const { data: students = [] } = useGetClassroomStudentsQuery(resolvedId, {
    skip: !resolvedId,
  });
  const { data: teachers = [] } = useGetClassroomTeachersQuery(resolvedId, {
    skip: !resolvedId,
  });
  const { data: lessons = [], refetch: refetchLessons } = useGetClassroomLessonsQuery(resolvedId, {
    skip: !resolvedId,
  });
  const { data: assignments = [], refetch: refetchAssignments } = useGetClassroomAssignmentsQuery(resolvedId, {
    skip: !resolvedId,
  });

  // Quizzes are fetched only once the tab is actually opened — the same
  // click-to-load principle as this page's detail fetches elsewhere, rather
  // than pulling them in eagerly alongside lessons/assignments.
  const { data: studentProfile } = useGetStudentProfileQuery(undefined, { skip: !isStudent });
  const { data: teacherQuizzes = [] } = useGetTeacherQuizzesQuery(undefined, { skip: isStudent });
  const { data: studentQuizzes = [], isFetching: loadingQuizzes } = useGetStudentQuizzesQuery(
    studentProfile?.studentId ?? "",
    { skip: activeTab !== "Quizzes" || !isStudent || !studentProfile?.studentId || !resolvedId }
  );
  const [resultsQuizId, setResultsQuizId] = useState<string | null>(null);
  const [resultsQuizTitle, setResultsQuizTitle] = useState<string>("");

  const classroomQuizzes = isStudent
    ? studentQuizzes.filter((q) => q.classroomId === resolvedId)
    : teacherQuizzes.filter((q) => q.classrooms?.some((c) => c.classroomId === resolvedId));

  const [pendingDeleteLessonId, setPendingDeleteLessonId] = useState<string | null>(null);
  const [pendingDeleteAssignmentId, setPendingDeleteAssignmentId] = useState<string | null>(null);

  const handleDeleteLesson = (lessonId: string) => {
    setPendingDeleteLessonId(lessonId);
  };

  const confirmDeleteLesson = async () => {
    if (!pendingDeleteLessonId) return;
    const lessonId = pendingDeleteLessonId;
    setPendingDeleteLessonId(null);
    setDeletingId(lessonId);
    try {
      await deleteSavedLesson(lessonId).unwrap();
      toast.success("Lesson deleted successfully!");
      refetchLessons();
    } catch (err) {
      toast.error("Failed to delete lesson", apiErrorMessage(err, "Please try again."));
    }
    setDeletingId(null);
  };

  const handleSaveLessonEdit = async () => {
    if (!editingLesson || !editingLesson.title.trim()) return;
    setSavingEdit(true);
    try {
      await updateSavedLesson({
        lessonId: editingLesson.lessonId,
        title: editingLesson.title,
        content: editingLesson.content,
        videoLink: editingLesson.videoLink,
      }).unwrap();
      toast.success("Lesson updated successfully!");
      setEditingLesson(null);
      refetchLessons();
    } catch (err) {
      toast.error("Failed to update lesson", apiErrorMessage(err, "Please try again."));
    }
    setSavingEdit(false);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setPendingDeleteAssignmentId(assignmentId);
  };

  const confirmDeleteAssignment = async () => {
    if (!pendingDeleteAssignmentId) return;
    const assignmentId = pendingDeleteAssignmentId;
    setPendingDeleteAssignmentId(null);
    setDeletingId(assignmentId);
    try {
      await deleteAssignmentMutation(assignmentId).unwrap();
      toast.success("Assignment deleted successfully!");
      refetchAssignments();
    } catch {
      toast.error("Failed to delete assignment. Please try again.");
    }
    setDeletingId(null);
  };

  const handleSaveAssignmentEdit = async () => {
    if (!editingAssignment || !editingAssignment.title.trim()) return;
    setSavingEdit(true);
    try {
      await updateAssignmentMutation({
        assignmentId: editingAssignment.assignmentId,
        title: editingAssignment.title,
        description: editingAssignment.description,
        maxScore: editingAssignment.maxScore,
        dueDate: editingAssignment.dueDate,
      }).unwrap();
      toast.success("Assignment updated successfully!");
      setEditingAssignment(null);
      refetchAssignments();
    } catch {
      toast.error("Failed to update assignment.");
    }
    setSavingEdit(false);
  };

  const loading = loadingClassroom || !resolvedId;

  if (loading) {
    return <ClassroomDetailSkeleton />;
  }

  if (!classroom) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Classroom not found</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Unable to load this classroom.</p>
      </div>
    );
  }

  const heroTitle = classroom.className;
  const heroBadge = classroom.programName
    ? `${classroom.programName} · Year ${classroom.yearLevel ?? ""}`
    : classroom.classCode;
  const heroSemester = classroom.semester ? `Semester ${classroom.semester}` : "";
  const heroRoom = classroom.room ? `Room ${classroom.room}` : "";

  return (
    <div>
      {/* Tab Bar */}
      <div className="bg-white dark:bg-slate-900">
        <div className="flex items-center gap-5 overflow-x-auto border-b border-slate-200 px-4 sm:gap-8 sm:px-8 dark:border-slate-800">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative shrink-0 whitespace-nowrap py-4 text-[15px] font-medium transition-colors ${
                  isActive
                    ? "text-indigo-700 font-bold dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-indigo-700 dark:bg-indigo-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-6 sm:px-8 sm:py-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-8 py-9">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -right-20 bottom-[-60px] h-40 w-40 rounded-full bg-white/10" />
          <div className="relative">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              {heroBadge}
            </span>
            <h1 className="mt-4 text-4xl font-bold text-white">{heroTitle}</h1>
            <p className="mt-2 text-sm text-white/80">
              {heroSemester} · {students.length} students · {heroRoom}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left sidebar */}
          <div className="space-y-5">
            {/* Class Code Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">CLASS CODE</p>
              <p className="mt-3 font-mono text-2xl font-bold tracking-wider text-slate-900 dark:text-slate-100">
                {classroom.inviteCode || classroom.classCode}
              </p>
            </div>

            {/* Class Info Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Class Details</h3>
              <div className="space-y-2 text-sm">
                {classroom.teacherName && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>Teacher: <strong>{classroom.teacherName}</strong></span>
                  </div>
                )}
                {classroom.subjectName && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <BookOpen className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>Subject: {classroom.subjectName}</span>
                  </div>
                )}
                {classroom.room && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>Room {classroom.room}</span>
                  </div>
                )}
                {classroom.academicYear && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>{classroom.academicYear}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Assignments count */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Quick Stats</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-center dark:bg-indigo-950/60">
                  <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{lessons.length}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">Lessons</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-950/60">
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{assignments.length}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">Assignments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="space-y-5">
            {/* ─── Stream Tab ─── */}
            {activeTab === "Stream" && (
              <div className="space-y-4">
                {assignments.length === 0 && lessons.length === 0 ? (
                  <div className="space-y-4">
                    {/* Demo/Sample Activity items for new classrooms */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950">
                          <BookOpen className="h-5 w-5 text-emerald-700 dark:text-emerald-400" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Course Overview & Syllabus Introduction
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Welcome to {classroom.className}! Review the course structure and grading policies.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950">
                          <FileText className="h-5 w-5 text-amber-700 dark:text-amber-400" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Assignment 1: Project Plan Proposal
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Due in 7 days · 100 points
                          </p>
                        </div>
                      </div>
                    </div>

                    {!isStudent && classroom && (
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <Link
                          href={`/dashboard/teacher/lessons/create-lesson?classroomId=${classroom.classroomId}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Create New Lesson
                        </Link>
                        <Link
                          href={`/dashboard/teacher/assignments/create-assignment?classroomId=${classroom.classroomId}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Create New Assignment
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {assignments.map((a) => (
                      <Link
                        key={a.assignmentId}
                        href={
                          isStudent
                            ? `/dashboard/student/courses/assignment?assignmentId=${a.assignmentId}&classroomId=${resolvedId}`
                            : `/dashboard/teacher/assignments/${a.assignmentId}`
                        }
                        className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-amber-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-900"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950">
                          <FileText className="h-5 w-5 text-amber-700 dark:text-amber-400" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{a.createdBy} posted a new assignment: {a.title}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {a.dueDate ? `Due ${new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "No due date"} · {a.maxScore} points
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-amber-600 transition-colors" />
                      </Link>
                    ))}
                    {lessons.map((l) => (
                      <div
                        key={l.lessonId}
                        role="button"
                        tabIndex={0}
                        onClick={() => setDetailLesson(l)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setDetailLesson(l);
                          }
                        }}
                        className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950">
                          <BookOpen className="h-5 w-5 text-emerald-700 dark:text-emerald-400" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{l.createdBy} posted a new lesson: {l.title}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* ─── Lessons Tab ─── */}
            {activeTab === "Lessons" && (
              <div className="space-y-4">
                {!isStudent && classroom && (
                  <div className="flex justify-end">
                    <Link
                      href={`/dashboard/teacher/lessons/create-lesson?classroomId=${classroom.classroomId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 transition-colors shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Create Lesson
                    </Link>
                  </div>
                )}

                {lessons.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950">
                        <BookOpen className="h-5 w-5 text-emerald-700 dark:text-emerald-400" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Module 1: Course Introduction & Architecture Overview</h4>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          Comprehensive introduction to core concepts, key learning objectives, and practical application modules.
                        </p>
                        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Course Syllabus · Module 1</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {lessons.map((l) => (
                      <LessonCard
                        key={l.lessonId}
                        lesson={l}
                        isStudent={isStudent}
                        isDeleting={deletingId === l.lessonId}
                        onOpen={setDetailLesson}
                        onEdit={(lesson) =>
                          setEditingLesson({
                            lessonId: lesson.lessonId,
                            title: lesson.title,
                            content: lesson.content || "",
                            videoLink: lesson.videoLink || "",
                          })
                        }
                        onDelete={handleDeleteLesson}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Assignments Tab ─── */}
            {activeTab === "Assignments" && (
              <div className="space-y-4">
                {!isStudent && classroom && (
                  <div className="flex justify-end">
                    <Link
                      href={`/dashboard/teacher/assignments/create?classroomId=${classroom.classroomId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 transition-colors shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Create Assignment
                    </Link>
                  </div>
                )}

                {assignments.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No assignments posted yet.</p>
                  </div>
                ) : (
                  assignments.map((a) => (
                    <div key={a.assignmentId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
                          <FileText className="h-5 w-5 text-indigo-700 dark:text-indigo-300" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            {isStudent ? (
                              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{a.title}</h4>
                            ) : (
                              <Link
                                href={`/dashboard/teacher/assignments/${a.assignmentId}`}
                                className="text-sm font-bold text-slate-900 hover:text-indigo-600 hover:underline dark:text-slate-100 dark:hover:text-indigo-400"
                              >
                                {a.title}
                              </Link>
                            )}
                            {!isStudent && (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setEditingAssignment({ assignmentId: a.assignmentId, title: a.title, description: a.description || "", maxScore: a.maxScore || 100, dueDate: a.dueDate || "" })}
                                  title="Edit assignment"
                                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAssignment(a.assignmentId)}
                                  disabled={deletingId === a.assignmentId}
                                  title="Delete assignment"
                                  className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors disabled:opacity-50"
                                >
                                  {deletingId === a.assignmentId ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                          {a.description && (
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{htmlToPreviewText(a.description)}</p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">{a.maxScore} points</span>
                            {a.dueDate && (
                              <span>Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                            )}
                            {!isStudent && a.totalStudents != null && (
                              <span
                                className={`inline-flex items-center gap-1 font-medium ${
                                  a.submittedCount === a.totalStudents && a.totalStudents > 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-500 dark:text-slate-400"
                                }`}
                              >
                                <Users className="h-3.5 w-3.5" />
                                {a.submittedCount ?? 0} / {a.totalStudents} submitted
                              </span>
                            )}
                          </div>
                          {a.files && a.files.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {a.files.map((f) => (
                                <button
                                  key={f.fileId}
                                  type="button"
                                  onClick={() => setViewerFile({ name: f.fileOriginalName, url: f.previewUrl, isVideo: false })}
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 font-medium cursor-pointer dark:border-slate-800 dark:text-indigo-400 dark:hover:bg-slate-800"
                                >
                                  <FileText className="h-3 w-3" /> {f.fileOriginalName}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* A named action, not just a linked title: opening
                              the grader was previously unreachable from here,
                              which is where a teacher actually starts. */}
                          {!isStudent && (
                            <Link
                              href={`/dashboard/teacher/assignments/${a.assignmentId}`}
                              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-950"
                            >
                              Review submissions
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ─── Quizzes Tab ─── */}
            {activeTab === "Quizzes" && (
              <div className="space-y-4">
                {!isStudent && classroom && (
                  <div className="flex justify-end">
                    <Link
                      href="/dashboard/teacher/quiz/create-quiz"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 transition-colors shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Create Quiz
                    </Link>
                  </div>
                )}

                {isStudent && loadingQuizzes ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  </div>
                ) : classroomQuizzes.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                    <HelpCircle className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-700" />
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No quizzes in this classroom yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {isStudent
                      ? (classroomQuizzes as QuizResponse[]).map((q) => {
                            const status = studentQuizWindowStatus(q);
                            const badge = STUDENT_QUIZ_BADGE[status];
                            return (
                              <Link
                                key={q.quizId}
                                href={`/dashboard/student/courses?classroomId=${resolvedId}&tab=Quizzes`}
                                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{q.title}</h4>
                                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${badge.cls}`}>
                                      {badge.label}
                                    </span>
                                  </div>
                                  {q.description && (
                                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">{q.description}</p>
                                  )}
                                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {q.durationMinutes} mins</span>
                                    <span>Attempts: {q.attemptsUsed}/{q.maxAttempts}</span>
                                  </div>
                                  {q.bestScore !== null && (
                                    <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                      <CheckCircle2 className="h-3.5 w-3.5" /> Best score: {q.bestScore}
                                    </p>
                                  )}
                                </div>
                                <span className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition-colors group-hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300 dark:group-hover:bg-indigo-950">
                                  {status === "open" ? "Take Quiz" : "View"}
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </span>
                              </Link>
                            );
                          })
                      : (classroomQuizzes as QuizManageResponse[]).map((q) => (
                          <div
                            key={q.quizId}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{q.title}</h4>
                                <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  {q.questions?.length ?? 0} questions
                                </span>
                              </div>
                              {q.description && (
                                <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">{q.description}</p>
                              )}
                              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {q.durationMinutes} mins</span>
                                <span>Max attempts: {q.maxAttempts}</span>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setResultsQuizId(q.quizId);
                                  setResultsQuizTitle(q.title);
                                }}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-950"
                              >
                                <ClipboardList className="h-3.5 w-3.5" /> Results
                              </button>
                              <Link
                                href={`/dashboard/teacher/quiz/create-quiz?editId=${q.quizId}`}
                                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── People Tab ─── */}
            {activeTab === "People" && (
              <div className="space-y-4">
                {/* Teachers */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Teachers ({teachers.length})</h3>
                  </div>
                  {teachers.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500 dark:text-slate-400">No teachers assigned.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                      {teachers.map((t) => (
                        <li key={t.teacherId} className="flex items-center gap-3 px-5 py-3">
                          <PersonAvatar name={t.fullname} avatarUrl={t.avatarUrl} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{t.fullname}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t.email}</p>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            <GraduationCap className="h-3 w-3" /> Teacher
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Students */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Students ({students.length})</h3>
                  </div>
                  {students.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500 dark:text-slate-400">No students enrolled.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                      {students.map((s) => (
                        <li key={s.studentId} className="flex items-center gap-3 px-5 py-3">
                          <PersonAvatar name={s.fullName} avatarUrl={s.avatarUrl} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{s.fullName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{s.studentCode} · {s.email}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Edit Lesson</h3>
              <button type="button" onClick={() => setEditingLesson(null)} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">LESSON TITLE</label>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">CONTENT / DESCRIPTION</label>
                <textarea
                  rows={4}
                  value={editingLesson.content}
                  onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">VIDEO LINK (OPTIONAL)</label>
                <input
                  type="text"
                  value={editingLesson.videoLink}
                  onChange={(e) => setEditingLesson({ ...editingLesson, videoLink: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingEdit}
                onClick={handleSaveLessonEdit}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Edit Assignment</h3>
              <button type="button" onClick={() => setEditingAssignment(null)} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">ASSIGNMENT TITLE</label>
                <input
                  type="text"
                  value={editingAssignment.title}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={editingAssignment.description}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">MAX SCORE</label>
                  <input
                    type="number"
                    value={editingAssignment.maxScore}
                    onChange={(e) => setEditingAssignment({ ...editingAssignment, maxScore: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">DUE DATE</label>
                  <input
                    type="datetime-local"
                    value={editingAssignment.dueDate ? editingAssignment.dueDate.substring(0, 16) : ""}
                    onChange={(e) => setEditingAssignment({ ...editingAssignment, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingAssignment(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingEdit}
                onClick={handleSaveAssignmentEdit}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Protected In-App File Viewer Modal (used by Assignments tab) */}
      <SecureFileViewerModal
        isOpen={!!viewerFile}
        onClose={() => setViewerFile(null)}
        fileName={viewerFile?.name || ""}
        fileUrl={viewerFile?.url || ""}
        isVideo={viewerFile?.isVideo}
      />

      {/* Lesson Detail Popup: video + files + description combined */}
      <LessonDetailModal lesson={detailLesson} onClose={() => setDetailLesson(null)} />

      <ConfirmDialog
        open={pendingDeleteLessonId !== null}
        message="Are you sure you want to delete this lesson? This action cannot be undone."
        onConfirm={confirmDeleteLesson}
        onCancel={() => setPendingDeleteLessonId(null)}
      />
      <ConfirmDialog
        open={pendingDeleteAssignmentId !== null}
        message="Are you sure you want to delete this assignment? This action cannot be undone."
        onConfirm={confirmDeleteAssignment}
        onCancel={() => setPendingDeleteAssignmentId(null)}
      />

      {!isStudent && (
        <QuizResultsModal
          quizId={resultsQuizId}
          quizTitle={resultsQuizTitle}
          onClose={() => setResultsQuizId(null)}
          classroomId={resolvedId}
        />
      )}
    </div>
  );
}