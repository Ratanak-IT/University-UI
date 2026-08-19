"use client";

import { useEffect, useState } from "react";
import {
  fetchMyClassrooms
} from "@/lib/api/student";
import { fetchTeacherClassrooms } from "@/lib/api/teacher";
import {
  useGetClassroomByIdQuery,
  useGetClassroomLessonsQuery,
  useGetClassroomAssignmentsQuery,
  useGetClassroomStudentsQuery,
  useDeleteAssignmentMutation,
  useUpdateAssignmentMutation,
} from "@/lib/redux/apiSlice";
import { deleteLesson, updateLesson } from "@/lib/api/lesson";
import { toast } from "@/components/shared/Toast";
import { Loader2, FileText, Video, Users, MapPin, Calendar, BookOpen, Plus, Trash2, Pencil, X } from "lucide-react";
import Link from "next/link";
import { SecureFileViewerModal } from "@/components/shared/SecureFileViewerModal";
import CommentThread from "@/components/shared/CommentThread";

interface ClassroomDetailViewProps {
  classroomId?: string;
  isStudent?: boolean;
}

export default function ClassroomDetailView({
  classroomId,
  isStudent = false,
}: ClassroomDetailViewProps) {
  const [activeTab, setActiveTab] = useState("Stream");

  const [focusCommentId, setFocusCommentId] = useState<string | null>(null);
  useEffect(() => {
    setFocusCommentId(new URLSearchParams(window.location.search).get("comment"));
  }, []);
  const [resolvedId, setResolvedId] = useState<string>(classroomId || "");
  const [viewerFile, setViewerFile] = useState<{ name: string; url: string; isVideo?: boolean } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit Modals State
  const [editingLesson, setEditingLesson] = useState<{ lessonId: string; title: string; content: string; videoLink: string } | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<{ assignmentId: string; title: string; description: string; maxScore: number; dueDate: string } | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteAssignmentMutation] = useDeleteAssignmentMutation();
  const [updateAssignmentMutation] = useUpdateAssignmentMutation();

  const tabs = ["Stream", "Lessons", "Assignments", "People"];

  useEffect(() => {
    if (!classroomId) return;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(classroomId)) {
      setResolvedId(classroomId);
    } else {
      async function resolveCode() {
        const myClassrooms = isStudent
          ? await fetchMyClassrooms()
          : await fetchTeacherClassrooms();
        if (myClassrooms) {
          const matched = myClassrooms.find(
            (c) => c.classCode?.toLowerCase() === classroomId?.toLowerCase()
          );
          if (matched) {
            setResolvedId(matched.classroomId);
          }
        }
      }
      resolveCode();
    }
  }, [classroomId, isStudent]);

  // Use RTK Query Hooks with resolved UUID
  const { data: classroom, isLoading: loadingClassroom } = useGetClassroomByIdQuery(resolvedId, {
    skip: !resolvedId,
  });
  const { data: students = [] } = useGetClassroomStudentsQuery(resolvedId, {
    skip: !resolvedId,
  });
  const { data: lessons = [], refetch: refetchLessons } = useGetClassroomLessonsQuery(resolvedId, {
    skip: !resolvedId,
  });
  const { data: assignments = [], refetch: refetchAssignments } = useGetClassroomAssignmentsQuery(resolvedId, {
    skip: !resolvedId,
  });

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    setDeletingId(lessonId);
    const success = await deleteLesson(lessonId);
    if (success) {
      toast.success("Lesson deleted successfully!");
      refetchLessons();
    } else {
      toast.error("Failed to delete lesson. Please try again.");
    }
    setDeletingId(null);
  };

  const handleSaveLessonEdit = async () => {
    if (!editingLesson || !editingLesson.title.trim()) return;
    setSavingEdit(true);
    const res = await updateLesson(editingLesson.lessonId, {
      title: editingLesson.title,
      content: editingLesson.content,
      videoLink: editingLesson.videoLink,
    });
    setSavingEdit(false);
    if (res) {
      toast.success("Lesson updated successfully!");
      setEditingLesson(null);
      refetchLessons();
    } else {
      toast.error("Failed to update lesson.");
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
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
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-slate-700">Classroom not found</p>
        <p className="text-sm text-slate-500">Unable to load this classroom.</p>
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
      <div className="bg-white">
        <div className="flex items-center gap-8 border-b border-slate-200 px-8">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-4 text-[15px] font-medium transition-colors ${
                  isActive
                    ? "text-indigo-700 font-bold"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-indigo-700" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-8 py-8">
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
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-slate-500">CLASS CODE</p>
              <p className="mt-3 font-mono text-2xl font-bold tracking-wider text-slate-900">
                {classroom.inviteCode || classroom.classCode}
              </p>
            </div>

            {/* Class Info Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Class Details</h3>
              <div className="space-y-2 text-sm">
                {classroom.teacherName && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>Teacher: <strong>{classroom.teacherName}</strong></span>
                  </div>
                )}
                {classroom.subjectName && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span>Subject: {classroom.subjectName}</span>
                  </div>
                )}
                {classroom.room && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>Room {classroom.room}</span>
                  </div>
                )}
                {classroom.academicYear && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{classroom.academicYear}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Assignments count */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Quick Stats</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-center">
                  <p className="text-lg font-bold text-indigo-700">{lessons.length}</p>
                  <p className="text-xs text-indigo-600">Lessons</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center">
                  <p className="text-lg font-bold text-amber-700">{assignments.length}</p>
                  <p className="text-xs text-amber-600">Assignments</p>
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
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                          <BookOpen className="h-5 w-5 text-emerald-700" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            Course Overview & Syllabus Introduction
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Welcome to {classroom.className}! Review the course structure and grading policies.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                          <FileText className="h-5 w-5 text-amber-700" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            Assignment 1: Project Plan Proposal
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
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
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
                      <div key={a.assignmentId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                            <FileText className="h-5 w-5 text-amber-700" strokeWidth={1.75} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{a.createdBy} posted a new assignment: {a.title}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {a.dueDate ? `Due ${new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "No due date"} · {a.maxScore} points
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {lessons.map((l) => (
                      <div key={l.lessonId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                            <BookOpen className="h-5 w-5 text-emerald-700" strokeWidth={1.75} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{l.createdBy} posted a new lesson: {l.title}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                <CommentThread
                  scope={{ kind: "classroom", id: resolvedId }}
                  focusCommentId={focusCommentId}
                />
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
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                        <BookOpen className="h-5 w-5 text-emerald-700" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900">Module 1: Course Introduction & Architecture Overview</h4>
                        <p className="mt-1 text-sm text-slate-600">
                          Comprehensive introduction to core concepts, key learning objectives, and practical application modules.
                        </p>
                        <p className="mt-3 text-xs text-slate-400">Course Syllabus · Module 1</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  lessons.map((l) => (
                    <div key={l.lessonId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{l.title}</h4>
                        {!isStudent && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingLesson({ lessonId: l.lessonId, title: l.title, content: l.content || "", videoLink: l.videoLink || "" })}
                              title="Edit lesson"
                              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(l.lessonId)}
                              disabled={deletingId === l.lessonId}
                              title="Delete lesson"
                              className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors disabled:opacity-50"
                            >
                              {deletingId === l.lessonId ? (
                                <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      {l.content && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{l.content}</p>
                      )}
                      {l.videoLink && (
                        <button
                          type="button"
                          onClick={() => setViewerFile({ name: `${l.title} (Video)`, url: l.videoLink || "", isVideo: true })}
                          className="mt-2 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline font-medium cursor-pointer dark:text-indigo-400"
                        >
                          <Video className="h-4 w-4" /> Watch Video
                        </button>
                      )}
                      {l.files && l.files.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {l.files.map((f) => (
                            <button
                              key={f.fileId}
                              type="button"
                              onClick={() => setViewerFile({ name: f.fileOriginalName, url: f.previewUrl || "", isVideo: false })}
                              className="flex items-center gap-2 text-sm text-indigo-600 hover:underline font-medium cursor-pointer text-left dark:text-indigo-400"
                            >
                              <FileText className="h-3.5 w-3.5" /> {f.fileOriginalName}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                        Posted by {l.createdBy} · {new Date(l.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
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
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{a.title}</h4>
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
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{a.description}</p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">{a.maxScore} points</span>
                            {a.dueDate && (
                              <span>Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
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
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ─── People Tab ─── */}
            {activeTab === "People" && (
              <div className="space-y-4">
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
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                            {s.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
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

      {/* Protected In-App File Viewer Modal */}
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
