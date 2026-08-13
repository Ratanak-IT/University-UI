"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Calendar,
  Award,
  FileText,
  MessageSquare,
  ArrowLeft,
  Download,
  AlertCircle,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import {
  fetchAssignmentById,
  fetchAssignmentSubmissions,
  gradeSubmission,
  AssignmentResponse,
  SubmissionResponse,
} from "@/lib/api/assignment";

export default function AssignmentDetailPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params?.assignmentId;
  const router = useRouter();

  const [assignment, setAssignment] = useState<AssignmentResponse | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Grading Form State
  const [selectedSub, setSelectedSub] = useState<SubmissionResponse | null>(null);
  const [gradeScore, setGradeScore] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [gradingLoading, setGradingLoading] = useState(false);
  const [gradeMessage, setGradeMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadData() {
    if (!assignmentId) return;
    setLoading(true);
    setError(null);
    try {
      const [detail, subs] = await Promise.all([
        fetchAssignmentById(assignmentId),
        fetchAssignmentSubmissions(assignmentId),
      ]);

      if (detail) {
        setAssignment(detail);
      } else {
        setError("Assignment not found.");
      }

      if (subs) {
        setSubmissions(subs);
      }
    } catch (err) {
      console.error("Error loading assignment details:", err);
      setError("Failed to load assignment information.");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [assignmentId]);

  function selectSubmission(sub: SubmissionResponse) {
    setSelectedSub(sub);
    setGradeScore(sub.score !== null ? String(sub.score) : "");
    setFeedbackText(sub.feedback || "");
    setGradeMessage(null);
  }

  async function handleSaveGrade() {
    if (!selectedSub) return;
    const scoreVal = parseFloat(gradeScore);
    if (isNaN(scoreVal) || scoreVal < 0) {
      setGradeMessage({ type: "error", text: "Please enter a valid non-negative score." });
      return;
    }
    if (assignment && scoreVal > assignment.maxScore) {
      setGradeMessage({ type: "error", text: `Score cannot exceed maximum of ${assignment.maxScore}.` });
      return;
    }

    setGradingLoading(true);
    setGradeMessage(null);

    const res = await gradeSubmission(selectedSub.submissionId, scoreVal, feedbackText);
    setGradingLoading(false);

    if (res) {
      setGradeMessage({ type: "success", text: "Grade saved successfully!" });
      // Update local submissions list
      setSubmissions((prev) =>
        prev.map((s) => (s.submissionId === res.submissionId ? res : s))
      );
      setSelectedSub(res);
    } else {
      setGradeMessage({ type: "error", text: "Failed to save grade. Please try again." });
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" strokeWidth={2} />
          <p className="text-sm font-medium text-muted-foreground">Loading submissions portal...</p>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <main className="p-8 max-w-2xl mx-auto">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-6 text-center dark:border-rose-950 dark:bg-rose-950/20">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-600 dark:text-rose-400" />
          <h1 className="mt-4 text-lg font-bold text-foreground">Error Loading Portal</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error || "Could not retrieve assignment details."}</p>
          <button
            onClick={() => router.back()}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </div>
      </main>
    );
  }

  const submittedCount = submissions.filter((s) => s.status === "SUBMITTED" || s.status === "LATE").length;
  const gradedCount = submissions.filter((s) => s.status === "GRADED").length;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header Navigation */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        {/* Top metrics bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl border border-slate-100 bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Submissions to Grade</p>
            <p className="mt-2 text-3xl font-extrabold text-amber-600">{submittedCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Graded Submissions</p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-600">{gradedCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Class submissions</p>
            <p className="mt-2 text-3xl font-extrabold text-indigo-600">{submissions.length}</p>
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
          
          {/* Left Panel: Assignment Details & Student Submissions List */}
          <div className="space-y-6">
            
            {/* Assignment Info Card */}
            <div className="rounded-2xl border border-slate-100 bg-card p-6 shadow-sm">
              <h1 className="text-2xl font-extrabold text-foreground">{assignment.title}</h1>
              
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : "No Deadline"}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-emerald-500" />
                  Points: {assignment.maxScore} pts
                </span>
              </div>

              {assignment.description && (
                <div className="mt-6 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Instructions</h3>
                  <div dangerouslySetInnerHTML={{ __html: assignment.description }} />
                </div>
              )}

              {assignment.files && assignment.files.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Attachments</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {assignment.files.map((file) => (
                      <a
                        key={file.fileId}
                        href={file.filePreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                      >
                        <FileText className="h-5 w-5 text-indigo-600 shrink-0" />
                        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">{file.fileOriginalName}</span>
                        <Download className="h-4 w-4 text-slate-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student Submissions Table */}
            <div className="rounded-2xl border border-slate-100 bg-card p-6 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-4">Class Roster & Submissions</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-400 font-bold uppercase">
                      <th className="pb-3 pr-4">Student</th>
                      <th className="pb-3 px-4">Code</th>
                      <th className="pb-3 px-4">Submitted At</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 pl-4 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                          No student submissions found for this classroom.
                        </td>
                      </tr>
                    ) : (
                      submissions.map((sub) => {
                        const isSelected = selectedSub?.submissionId === sub.submissionId;
                        return (
                          <tr
                            key={sub.submissionId}
                            onClick={() => selectSubmission(sub)}
                            className={`border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors ${
                              isSelected ? "bg-indigo-50/20 dark:bg-indigo-950/20" : ""
                            }`}
                          >
                            <td className="py-4 pr-4 font-semibold text-sm text-foreground">{sub.studentName}</td>
                            <td className="py-4 px-4 text-xs text-slate-500">{sub.studentCode}</td>
                            <td className="py-4 px-4 text-xs text-slate-500">
                              {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "—"}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                  sub.status === "GRADED"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : sub.status === "LATE"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {sub.status}
                              </span>
                            </td>
                            <td className="py-4 pl-4 text-right font-bold text-sm text-slate-700">
                              {sub.score !== null ? `${sub.score} / ${assignment.maxScore}` : "—"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Panel: Grading Panel */}
          <aside className="sticky top-6">
            {selectedSub ? (
              <div className="rounded-2xl border border-slate-100 bg-card p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Grade Submission</h2>
                  <p className="text-xs text-slate-400 mt-1">Student: <span className="font-semibold text-slate-700">{selectedSub.studentName}</span></p>
                </div>

                {/* Submitted Files */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted Attachments</h3>
                  {selectedSub.files && selectedSub.files.length > 0 ? (
                    selectedSub.files.map((file) => (
                      <a
                        key={file.fileId}
                        href={file.filePreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                      >
                        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-indigo-600">{file.fileOriginalName}</span>
                        <ExternalLink className="h-4 w-4 text-indigo-500 shrink-0 ml-2" />
                      </a>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No attachments submitted.</p>
                  )}
                </div>

                {/* Input Fields */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {gradeMessage && (
                    <div
                      className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium ${
                        gradeMessage.type === "success"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {gradeMessage.type === "success" && <CheckCircle className="h-4 w-4 shrink-0" />}
                      {gradeMessage.text}
                    </div>
                  )}

                  <div>
                    <label htmlFor="student-score" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Score (Max {assignment.maxScore})
                    </label>
                    <div className="relative">
                      <input
                        id="student-score"
                        type="number"
                        min="0"
                        max={assignment.maxScore}
                        step="0.5"
                        value={gradeScore}
                        onChange={(e) => setGradeScore(e.target.value)}
                        disabled={gradingLoading || gradeMessage?.type === "success"}
                        placeholder="e.g. 85"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">/ {assignment.maxScore}</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="student-feedback" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Feedback Comments
                    </label>
                    <textarea
                      id="student-feedback"
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      disabled={gradingLoading || gradeMessage?.type === "success"}
                      placeholder="Write constructive comments for the student..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveGrade}
                    disabled={gradingLoading || !gradeScore || gradeMessage?.type === "success"}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-700 py-3 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-55"
                  >
                    {gradingLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving Grade...
                      </>
                    ) : (
                      "Confirm & Return Grade"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-card p-8 text-center shadow-sm space-y-3">
                <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />
                <h3 className="font-bold text-sm text-foreground">Select a Student</h3>
                <p className="text-xs text-muted-foreground">Select a student from the class roster list to grade their submission and provide feedback.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}