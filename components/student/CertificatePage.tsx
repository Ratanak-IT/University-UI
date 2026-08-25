"use client";

import { toast } from "@/components/shared/Toast";
import { useState } from "react";
import {
  Award,
  FileCheck,
  Clock,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  useGetStudentProfileQuery,
  useGetStudentCertificatesQuery,
  useCreateCertificateRequestMutation,
} from "@/lib/redux/apiSlice";

type CertificateType = "ENROLLMENT_CONFIRMATION" | "DEGREE" | "TRANSCRIPT" | "COMPLETION";

/**
 * A student's certificate requests — submit a new one, and see where each
 * past request stands. There is nothing to preview or print here: a request
 * only becomes a real document once staff approve it and issue it, at which
 * point it shows up on the "My certificates" tab, backed by the actual
 * issued file rather than a document assembled in the browser.
 */
export default function CertificatePage() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [type, setType] = useState<CertificateType>("ENROLLMENT_CONFIRMATION");
  const [reason, setReason] = useState("");

  const { data: profile, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const studentId = profile?.studentId || "";

  const { data: requests = [], isLoading: loadingRequests } = useGetStudentCertificatesQuery(
    studentId,
    { skip: !studentId }
  );

  const [createRequest, { isLoading: submitting }] = useCreateCertificateRequestMutation();

  const loading = loadingProfile || loadingRequests;

  async function handleCreateRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!studentId) return;
    if (!reason.trim()) {
      toast.error("Please provide a reason for the certificate request.");
      return;
    }

    try {
      await createRequest({ studentId, certificateType: type, reason }).unwrap();
      toast.success("Certificate request submitted successfully!");
      setShowRequestModal(false);
      setReason("");
    } catch {
      toast.error("Failed to submit certificate request. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Approved requests appear on the &quot;My certificates&quot; tab once issued.
        </p>
        <button
          type="button"
          onClick={() => setShowRequestModal(true)}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          Request New Document
        </button>
      </div>

      {/* Requests List History */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 text-card-foreground">
        <h2 className="text-lg font-bold text-card-foreground">
          Submitted Request History
        </h2>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileCheck className="h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
              No certificate requests recorded
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Click &quot;Request New Document&quot; to submit your first request.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests.map((req) => (
              <div
                key={req.requestId}
                className="flex flex-wrap items-center justify-between py-4 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {req.certificateType.replace(/_/g, " ")} CERTIFICATE
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Requested on: {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                      Reason: {req.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {req.status === "PENDING" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                      <Clock className="h-3.5 w-3.5" />
                      Pending Approval
                    </span>
                  )}
                  {req.status === "APPROVED" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approved — see My certificates
                    </span>
                  )}
                  {req.status === "REJECTED" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                      <XCircle className="h-3.5 w-3.5" />
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Request Official Academic Certificate
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Submit a formal application for academic verification.
            </p>

            <form onSubmit={handleCreateRequest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Certificate Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CertificateType)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="ENROLLMENT_CONFIRMATION">Enrollment Confirmation Certificate</option>
                  <option value="COMPLETION">Attendance / Completion Certificate</option>
                  <option value="TRANSCRIPT">Academic Transcript Certificate</option>
                  <option value="DEGREE">Graduation / Degree Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Reason / Purpose
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="E.g., Internship application, Visa verification..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
