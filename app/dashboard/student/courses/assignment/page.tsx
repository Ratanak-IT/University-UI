"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Users,
  Send,
  Plus,
  MessageSquare,
  Loader2,
  Upload,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  fetchMyProfile,
  fetchStudentAssignmentDetail,
  fetchClassroomAssignments,
  fetchMyClassrooms,
  submitAssignment,
  StudentAssignmentResponse,
  StudentProfile,
} from "@/lib/api/student";
import Link from "next/link";

function AssignmentDetailInner() {
  const params = useSearchParams();
  const assignmentId = params.get("assignmentId");
  const classroomId = params.get("classroomId");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [assignment, setAssignment] = useState<StudentAssignmentResponse | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      if (!assignmentId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const p = await fetchMyProfile();
      if (p) setProfile(p);

      let loadedAssignment: StudentAssignmentResponse | null = null;

      // 1. Try fetchStudentAssignmentDetail
      if (p) {
        try {
          loadedAssignment = await fetchStudentAssignmentDetail(p.studentId, assignmentId);
        } catch {
          // ignore error and fallback
        }
      }

      // 2. If null and classroomId is provided, fetch from classroom assignments
      if (!loadedAssignment && classroomId) {
        const classAsgns = await fetchClassroomAssignments(classroomId);
        const ca = classAsgns?.find((a) => a.assignmentId === assignmentId);
        if (ca) {
          loadedAssignment = {
            assignmentId: ca.assignmentId,
            classroomId: ca.classroomId,
            className: "",
            subjectName: "",
            title: ca.title,
            description: ca.description,
            dueDate: ca.dueDate,
            maxScore: ca.maxScore,
            weight: ca.weight,
            assignmentFiles: ca.files ?? [],
            submissionId: null,
            submissionStatus: null,
            submittedAt: null,
            score: null,
            feedback: null,
            gradedAt: null,
            submissionFiles: [],
          };
        }
      }

      // 3. Fallback: search across all enrolled classrooms
      if (!loadedAssignment) {
        const classrooms = await fetchMyClassrooms();
        if (classrooms) {
          for (const c of classrooms) {
            const classAsgns = await fetchClassroomAssignments(c.classroomId);
            const ca = classAsgns?.find((a) => a.assignmentId === assignmentId);
            if (ca) {
              loadedAssignment = {
                assignmentId: ca.assignmentId,
                classroomId: ca.classroomId,
                className: c.className,
                subjectName: c.subjectName ?? "",
                title: ca.title,
                description: ca.description,
                dueDate: ca.dueDate,
                maxScore: ca.maxScore,
                weight: ca.weight,
                assignmentFiles: ca.files ?? [],
                submissionId: null,
                submissionStatus: null,
                submittedAt: null,
                score: null,
                feedback: null,
                gradedAt: null,
                submissionFiles: [],
              };
              break;
            }
          }
        }
      }

      if (loadedAssignment) setAssignment(loadedAssignment);
      setLoading(false);
    }
    load();
  }, [assignmentId, classroomId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!assignmentId || selectedFiles.length === 0) return;
    setSubmitting(true);
    const result = await submitAssignment(assignmentId, selectedFiles);
    setSubmitting(false);
    if (result) {
      setSubmitSuccess(true);
      // Reload assignment data to show updated submission status
      if (profile) {
        try {
          const a = await fetchStudentAssignmentDetail(profile.studentId, assignmentId);
          if (a) setAssignment(a);
        } catch {
          // Keep current state with SUBMITTED status
          if (assignment) {
            setAssignment({
              ...assignment,
              submissionStatus: "SUBMITTED",
              submittedAt: new Date().toISOString(),
            });
          }
        }
      }
    }
  };

  if (!assignmentId) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-slate-700">No assignment selected</p>
        <p className="text-sm text-slate-500">Please select an assignment from the course page.</p>
        <Link
          href="/dashboard/student/courses"
          className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-slate-700">Assignment not found</p>
        <p className="text-sm text-slate-500">Unable to load this assignment.</p>
        <Link
          href="/dashboard/student/courses"
          className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </div>
    );
  }

  const a = assignment;
  const isSubmitted =
    a.submissionStatus === "SUBMITTED" ||
    a.submissionStatus === "TURNED IN" ||
    a.submissionStatus === "GRADED" ||
    a.submissionStatus === "LATE" ||
    submitSuccess;
  const isGraded = a.submissionStatus === "GRADED";

  const statusLabel = isGraded
    ? "GRADED"
    : isSubmitted
    ? "TURNED IN"
    : "ASSIGNED";

  const statusColor = isGraded
    ? "bg-emerald-50 text-emerald-700"
    : isSubmitted
    ? "bg-blue-50 text-blue-700"
    : "bg-slate-100 text-slate-600";

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      {/* Page heading */}
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/student/courses"
            className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Courses
          </Link>
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
            {a.title}
          </h1>
          {a.className && (
            <p className="text-xs font-medium text-slate-500">
              {a.className} {a.subjectName ? `• ${a.subjectName}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        {/* Assignment card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-slate-900">{a.title}</h2>
              <p className="mt-1 text-sm font-semibold text-indigo-600">
                {a.maxScore} points
                {a.dueDate && (
                  <span className="font-normal text-slate-500">
                    &nbsp;•&nbsp; Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Description */}
          {a.description && (
            <div className="mt-5 rounded-xl bg-slate-50/70 p-4 text-sm text-slate-700 whitespace-pre-line border border-slate-100">
              {a.description}
            </div>
          )}

          {/* Assignment files attached by teacher */}
          {a.assignmentFiles && a.assignmentFiles.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">ATTACHED MATERIALS</p>
              {a.assignmentFiles.map((f) => (
                <a
                  key={f.fileId}
                  href={f.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{f.fileOriginalName}</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Grading info if graded */}
          {isGraded && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-900">Graded by Teacher</span>
              </div>
              <div className="mt-3 flex gap-8 text-sm">
                <div>
                  <p className="text-xs font-semibold text-emerald-700">SCORE</p>
                  <p className="text-2xl font-black text-emerald-900">{a.score}/{a.maxScore}</p>
                </div>
                {a.gradedAt && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">GRADED ON</p>
                    <p className="text-sm font-bold text-emerald-900">{new Date(a.gradedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              {a.feedback && (
                <div className="mt-4 border-t border-emerald-200/60 pt-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Feedback</p>
                  <p className="mt-1 text-sm text-emerald-900">{a.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Class comments placeholder */}
          <div className="mt-8 border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-bold text-slate-900">Class comments</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
                {profile?.firstName?.charAt(0)?.toUpperCase() ?? "S"}
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5">
                <input
                  placeholder="Add class comment..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <Send className="h-4 w-4 shrink-0 text-indigo-600 cursor-pointer hover:text-indigo-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Right side panel: Submission */}
        <div className="space-y-4">
          {/* Your work card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-slate-900">Your work</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}>
                {statusLabel}
              </span>
            </div>

            {/* Show submitted files */}
            {isSubmitted && a.submissionFiles && a.submissionFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {a.submissionFiles.map((f) => (
                  <a
                    key={f.fileId}
                    href={f.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-900">{f.fileOriginalName}</p>
                    </div>
                  </a>
                ))}
                {a.submittedAt && (
                  <p className="flex items-center gap-1 text-xs text-slate-500 pt-1">
                    <Clock className="h-3.5 w-3.5" /> Submitted {new Date(a.submittedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Upload & Turn In */}
            {!isSubmitted && (
              <div className="mt-4 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="h-4 w-4 text-indigo-600" /> Add files
                </button>

                {/* Show selected files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-1.5">
                    {selectedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-900">
                        <Upload className="h-3.5 w-3.5 text-indigo-600" />
                        <span className="truncate">{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {submitSuccess ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-bold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-4.5 w-4.5" /> Submitted!
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={selectedFiles.length === 0 || submitting}
                    className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4.5 w-4.5 animate-spin" /> Submitting...
                      </span>
                    ) : (
                      "Turn in"
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Private comments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-bold text-slate-900">Private comments</p>
            </div>
            <p className="text-xs font-semibold text-indigo-600 cursor-pointer hover:underline">+ Add private comment</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AssignmentDetail() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <AssignmentDetailInner />
    </Suspense>
  );
}