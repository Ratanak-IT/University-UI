"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Plus,
  Loader2,
  Upload,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  fetchClassroomAssignments,
  fetchMyClassrooms,
  submitAssignment,
  StudentAssignmentResponse,
} from "@/lib/api/student";
import { useGetStudentProfileQuery, useGetStudentAssignmentDetailQuery } from "@/lib/redux/apiSlice";
import Link from "next/link";
import { SecureFileViewerModal } from "@/components/shared/SecureFileViewerModal";
import CommentThread from "@/components/shared/CommentThread";
import PrivateCommentThread from "@/components/shared/PrivateCommentThread";
import SafeHtml from "@/components/shared/SafeHtml";
import AssignmentDetailSkeleton from "@/components/student/AssignmentDetailSkeleton";

function AssignmentDetailInner() {
  const params = useSearchParams();
  const assignmentId = params.get("assignmentId");
  const classroomId = params.get("classroomId");
  // Set when arriving from a mention/reply notification.
  const focusCommentId = params.get("comment");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [viewerFile, setViewerFile] = useState<{ name: string; url: string; isVideo?: boolean } | null>(null);
  const [fallbackAssignment, setFallbackAssignment] = useState<StudentAssignmentResponse | null>(null);
  const [loadingFallback, setLoadingFallback] = useState(false);

  const { data: profile, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const {
    data: primaryAssignment,
    isLoading: loadingPrimary,
    isError: primaryFailed,
    refetch: refetchPrimary,
  } = useGetStudentAssignmentDetailQuery(
    { studentId: profile?.studentId ?? "", assignmentId: assignmentId ?? "" },
    { skip: !assignmentId || !profile?.studentId }
  );

  // The detail endpoint 404s for an assignment the student hasn't been
  // graded on yet in some backend states — this rebuilds a minimal view from
  // the classroom's assignment list instead of showing a dead end.
  useEffect(() => {
    if (!assignmentId || primaryAssignment || !primaryFailed) return;
    let cancelled = false;

    async function loadFallback() {
      setLoadingFallback(true);
      let found: StudentAssignmentResponse | null = null;

      if (classroomId) {
        const classAsgns = await fetchClassroomAssignments(classroomId);
        const ca = classAsgns?.find((a) => a.assignmentId === assignmentId);
        if (ca) {
          found = {
            assignmentId: ca.assignmentId, classroomId: ca.classroomId,
            className: "", subjectName: "",
            title: ca.title, description: ca.description, dueDate: ca.dueDate,
            maxScore: ca.maxScore, weight: ca.weight, assignmentFiles: ca.files ?? [],
            submissionId: null, submissionStatus: null, submittedAt: null,
            score: null, feedback: null, gradedAt: null, submissionFiles: [],
          };
        }
      }

      if (!found) {
        const classrooms = await fetchMyClassrooms();
        for (const c of classrooms ?? []) {
          const classAsgns = await fetchClassroomAssignments(c.classroomId);
          const ca = classAsgns?.find((a) => a.assignmentId === assignmentId);
          if (ca) {
            found = {
              assignmentId: ca.assignmentId, classroomId: ca.classroomId,
              className: c.className, subjectName: c.subjectName ?? "",
              title: ca.title, description: ca.description, dueDate: ca.dueDate,
              maxScore: ca.maxScore, weight: ca.weight, assignmentFiles: ca.files ?? [],
              submissionId: null, submissionStatus: null, submittedAt: null,
              score: null, feedback: null, gradedAt: null, submissionFiles: [],
            };
            break;
          }
        }
      }

      if (!cancelled) {
        setFallbackAssignment(found);
        setLoadingFallback(false);
      }
    }
    loadFallback();
    return () => {
      cancelled = true;
    };
  }, [assignmentId, classroomId, primaryAssignment, primaryFailed]);

  const assignment = primaryAssignment ?? fallbackAssignment;
  const loading = loadingProfile || (!!assignmentId && (loadingPrimary || (primaryFailed && loadingFallback)));

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
      if (primaryAssignment) {
        refetchPrimary();
      } else if (assignment) {
        setFallbackAssignment({
          ...assignment,
          submissionStatus: "SUBMITTED",
          submittedAt: new Date().toISOString(),
        });
      }
    }
  };

  if (!assignmentId) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">No assignment selected</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Please select an assignment from the course page.</p>
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Assignment not found</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Unable to load this assignment.</p>
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
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
    : isSubmitted
    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-950">
      {/* Page heading */}
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <Link
            href="/dashboard/student/courses"
            className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Courses
          </Link>
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">
            {a.title}
          </h1>
          {a.className && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {a.className} {a.subjectName ? `• ${a.subjectName}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="grid w-full flex-1 grid-cols-1 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        {/* Assignment card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{a.title}</h2>
              <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {a.maxScore} points
                {a.dueDate && (
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    &nbsp;•&nbsp; Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Description */}
          {a.description && (
            <SafeHtml
              html={a.description}
              className="mt-5 rounded-xl bg-slate-50/70 p-4 text-sm text-slate-700 border border-slate-100 [&_p]:my-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_a]:text-indigo-600 [&_a]:underline [&_img]:max-w-full [&_img]:rounded-md [&_img]:my-2 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-800 dark:[&_a]:text-indigo-400"
            />
          )}

          {/* Assignment files attached by teacher */}
          {a.assignmentFiles && a.assignmentFiles.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ATTACHED MATERIALS</p>
              {a.assignmentFiles.map((f) => (
                <button
                  key={f.fileId}
                  onClick={() => setViewerFile({ name: f.fileOriginalName, url: f.previewUrl })}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors text-left cursor-pointer dark:border-slate-800 dark:hover:bg-slate-800/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{f.fileOriginalName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Grading info if graded */}
          {isGraded && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Graded by Teacher</span>
              </div>
              <div className="mt-3 flex gap-8 text-sm">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">SCORE</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200">{a.score}/{a.maxScore}</p>
                </div>
                {a.gradedAt && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">GRADED ON</p>
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{new Date(a.gradedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              {a.feedback && (
                <div className="mt-4 border-t border-emerald-200/60 pt-3 dark:border-emerald-900/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Feedback</p>
                  <p className="mt-1 text-sm text-emerald-900 dark:text-emerald-200">{a.feedback}</p>
                </div>
              )}
            </div>
          )}

       
          <div className="mt-8 border-t border-slate-100 pt-5 dark:border-slate-800">
            {assignmentId && (
              <CommentThread
                scope={{ kind: "assignment", id: assignmentId }}
                focusCommentId={focusCommentId}
                title="Class comments"
                emptyHint="Ask about the brief — mention a classmate or your teacher with @"
              />
            )}
          </div>
        </div>

        {/* Right side panel: Submission */}
        <div className="space-y-4">
          {/* Your work card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">Your work</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}>
                {statusLabel}
              </span>
            </div>

            {/* Show submitted files */}
            {isSubmitted && a.submissionFiles && a.submissionFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {a.submissionFiles.map((f) => (
                  <button
                    key={f.fileId}
                    onClick={() => setViewerFile({ name: f.fileOriginalName, url: f.previewUrl })}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors text-left cursor-pointer dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{f.fileOriginalName}</p>
                    </div>
                  </button>
                ))}
                {a.submittedAt && (
                  <p className="flex items-center gap-1 text-xs text-slate-500 pt-1 dark:text-slate-400">
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Add files
                </button>

                {/* Show selected files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-1.5">
                    {selectedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200">
                        <Upload className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span className="truncate">{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {submitSuccess ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
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

          <PrivateCommentThread assignmentId={assignmentId} target={{ role: "student" }} />
        </div>
      </main>

      {/* Secure File Viewer Modal */}
      {viewerFile && (
        <SecureFileViewerModal
          isOpen={!!viewerFile}
          onClose={() => setViewerFile(null)}
          fileName={viewerFile.name}
          fileUrl={viewerFile.url}
          isVideo={viewerFile.isVideo}
        />
      )}
    </div>
  );
}

export default function AssignmentDetail() {
  return (
    <Suspense fallback={<AssignmentDetailSkeleton />}>
      <AssignmentDetailInner />
    </Suspense>
  );
}