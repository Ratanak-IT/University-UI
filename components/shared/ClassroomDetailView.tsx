"use client";

import { useEffect, useState } from "react";
import {
  fetchClassroomById,
  fetchClassroomStudents,
  fetchClassroomLessons,
  fetchClassroomAssignments,
  fetchMyClassrooms,
  ClassroomResponse,
  ClassroomStudentResponse,
  LessonResponse,
  AssignmentResponse,
} from "@/lib/api/student";
import { fetchTeacherClassrooms } from "@/lib/api/teacher";
import {
  useGetClassroomByIdQuery,
  useGetClassroomLessonsQuery,
  useGetClassroomAssignmentsQuery,
  useGetClassroomStudentsQuery,
} from "@/lib/redux/apiSlice";
import { Loader2, FileText, Video, Users, MapPin, Calendar, BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { SecureFileViewerModal } from "@/components/shared/SecureFileViewerModal";

interface ClassroomDetailViewProps {
  classroomId?: string;
  isStudent?: boolean;
}

export default function ClassroomDetailView({
  classroomId,
  isStudent = false,
}: ClassroomDetailViewProps) {
  const [activeTab, setActiveTab] = useState("Stream");
  const [resolvedId, setResolvedId] = useState<string>(classroomId || "");
  const [viewerFile, setViewerFile] = useState<{ name: string; url: string; isVideo?: boolean } | null>(null);

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
  const { data: lessons = [] } = useGetClassroomLessonsQuery(resolvedId, {
    skip: !resolvedId,
  });
  const { data: assignments = [] } = useGetClassroomAssignmentsQuery(resolvedId, {
    skip: !resolvedId,
  });

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
                    <div key={l.lessonId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-900">{l.title}</h4>
                      {l.content && (
                        <p className="mt-2 text-sm text-slate-600 line-clamp-3">{l.content}</p>
                      )}
                      {l.videoLink && (
                        <button
                          type="button"
                          onClick={() => setViewerFile({ name: `${l.title} (Video)`, url: l.videoLink || "", isVideo: true })}
                          className="mt-2 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline font-medium cursor-pointer"
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
                              className="flex items-center gap-2 text-sm text-indigo-600 hover:underline font-medium cursor-pointer text-left"
                            >
                              <FileText className="h-3.5 w-3.5" /> {f.fileOriginalName}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="mt-3 text-xs text-slate-400">
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
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <p className="text-sm text-slate-500">No assignments posted yet.</p>
                  </div>
                ) : (
                  assignments.map((a) => (
                    <div key={a.assignmentId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                          <FileText className="h-5 w-5 text-indigo-700" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
                          {a.description && (
                            <p className="mt-1 text-sm text-slate-600 line-clamp-2">{a.description}</p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                            <span className="font-medium text-indigo-600">{a.maxScore} points</span>
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
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 font-medium cursor-pointer"
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
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                    <h3 className="text-sm font-bold text-slate-900">Students ({students.length})</h3>
                  </div>
                  {students.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500">No students enrolled.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {students.map((s) => (
                        <li key={s.studentId} className="flex items-center gap-3 px-5 py-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                            {s.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900">{s.fullName}</p>
                            <p className="text-xs text-slate-500">{s.studentCode} · {s.email}</p>
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
