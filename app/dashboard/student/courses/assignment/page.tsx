"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  MoreVertical,
  Users,
  Send,
  Plus,
  MessageSquare,
  Loader2,
  Upload,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  fetchMyProfile,
  fetchStudentAssignmentDetail,
  submitAssignment,
  StudentAssignmentResponse,
  StudentProfile,
} from "@/lib/api/student";

function AssignmentDetailInner() {
  const params = useSearchParams();
  const assignmentId = params.get("assignmentId");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [assignment, setAssignment] = useState<StudentAssignmentResponse | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      if (!assignmentId) return;
      setLoading(true);
      const p = await fetchMyProfile();
      if (p) {
        setProfile(p);
        const a = await fetchStudentAssignmentDetail(p.id, assignmentId);
        if (a) setAssignment(a);
      }
      setLoading(false);
    }
    load();
  }, [assignmentId]);

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
      // Reload assignment data to show updated status
      if (profile) {
        const a = await fetchStudentAssignmentDetail(profile.id, assignmentId);
        if (a) setAssignment(a);
      }
    }
  };

  if (!assignmentId) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-slate-700">No assignment selected</p>
        <p className="text-sm text-slate-500">Please select an assignment from the course page.</p>
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
      </div>
    );
  }

  const a = assignment;
  const isSubmitted = a.submissionStatus === "SUBMITTED" || a.submissionStatus === "GRADED" || a.submissionStatus === "LATE";
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
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
          Assignment — {a.subjectName}
        </h1>
        <p className="mt-1 text-sm text-indigo-600">
          {a.className} / {a.title}
        </p>
      </div>

      {/* Main content */}
      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
        {/* Assignment card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{a.title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {a.className} • {a.subjectName}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
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
            <div className="mt-4 text-sm text-slate-700 whitespace-pre-line">
              {a.description}
            </div>
          )}

          {/* Assignment files */}
          {a.assignmentFiles && a.assignmentFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500">ATTACHED FILES</p>
              {a.assignmentFiles.map((f) => (
                <a
                  key={f.fileId}
                  href={f.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-indigo-100">
                    <FileText className="h-4 w-4 text-indigo-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{f.fileOriginalName}</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Grading info */}
          {isGraded && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800">Graded</span>
              </div>
              <div className="mt-2 flex gap-6 text-sm">
                <div>
                  <p className="text-emerald-600">Score</p>
                  <p className="text-lg font-bold text-emerald-800">{a.score}/{a.maxScore}</p>
                </div>
                {a.gradedAt && (
                  <div>
                    <p className="text-emerald-600">Graded on</p>
                    <p className="font-medium text-emerald-800">{new Date(a.gradedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              {a.feedback && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-emerald-600">Feedback</p>
                  <p className="mt-1 text-sm text-emerald-800">{a.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Class comments placeholder */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-semibold text-slate-900">Class comments</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                {profile?.firstName?.charAt(0)?.toUpperCase() ?? "S"}
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                <input
                  placeholder="Add class comment..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <Send className="h-4 w-4 shrink-0 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Your work */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Your work</p>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor}`}>
                {statusLabel}
              </span>
            </div>

            {/* Show submitted files */}
            {isSubmitted && a.submissionFiles && a.submissionFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {a.submissionFiles.map((f) => (
                  <a
                    key={f.fileId}
                    href={f.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-emerald-100">
                      <FileText className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-900">{f.fileOriginalName}</p>
                    </div>
                  </a>
                ))}
                {a.submittedAt && (
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" /> Submitted {new Date(a.submittedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Upload files (when not submitted) */}
            {!isSubmitted && (
              <div className="mt-3 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  <Plus className="h-4 w-4" /> Add files
                </button>

                {/* Show selected files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-1">
                    {selectedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs">
                        <Upload className="h-3 w-3 text-indigo-600" />
                        <span className="truncate text-indigo-800">{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {submitSuccess ? (
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Submitted!
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={selectedFiles.length === 0 || submitting}
                    className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
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
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-semibold text-slate-900">Private comments</p>
            </div>
            <p className="text-sm text-indigo-600 cursor-pointer hover:underline">+ Add private comment</p>
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