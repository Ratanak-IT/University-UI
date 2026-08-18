"use client";

import { toast } from "@/components/shared/Toast";
import { useEffect, useState, useRef } from "react";
import {
  Award,
  FileCheck,
  Download,
  Clock,
  AlertCircle,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  Printer,
  QrCode,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import {
  downloadStudentCertificate,
  CertificateRequestResponse,
} from "@/lib/api/student";
import {
  useGetStudentProfileQuery,
  useGetStudentCertificatesQuery,
  useCreateCertificateRequestMutation,
} from "@/lib/redux/apiSlice";

export default function CertificatePage() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{
    certificateType: string;
    serialNo: string;
    issueDate: string;
    reason?: string;
  } | null>(null);

  const [type, setType] = useState<
    "ENROLLMENT_CONFIRMATION" | "DEGREE" | "TRANSCRIPT" | "COMPLETION"
  >("ENROLLMENT_CONFIRMATION");
  const [reason, setReason] = useState("");

  const { data: profile, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const studentId = profile?.studentId || "";

  const { data: requests = [], isLoading: loadingRequests } = useGetStudentCertificatesQuery(
    studentId,
    { skip: !studentId }
  );

  const [createRequest, { isLoading: submitting }] = useCreateCertificateRequestMutation();

  const loading = loadingProfile || loadingRequests;
  const printRef = useRef<HTMLDivElement>(null);

  function showToastMsg(msg: string) {
    if (msg.toLowerCase().includes("fail") || msg.toLowerCase().includes("error") || msg.toLowerCase().includes("provide")) {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  }

  async function handleCreateRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!studentId) return;
    if (!reason.trim()) {
      showToastMsg("Please provide a reason for the certificate request.");
      return;
    }

    try {
      await createRequest({ studentId, certificateType: type, reason }).unwrap();
      showToastMsg("Certificate request submitted successfully!");
      setShowRequestModal(false);
      setReason("");
    } catch (err) {
      showToastMsg("Failed to submit certificate request. Please try again.");
    }
  }

  function handleOpenCertificate(certType: string, reqId?: string, createdDate?: string, certReason?: string) {
    const formattedType = certType.replace(/_/g, " ");
    const issueDate = createdDate
      ? new Date(createdDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

    const serialNo = `UMT-${(reqId || "DYNAMIC").substring(0, 8).toUpperCase()}-2026`;

    setSelectedCert({
      certificateType: formattedType,
      serialNo,
      issueDate,
      reason: certReason,
    });
    setShowPreviewModal(true);
  }

  function handlePrintPDF() {
    window.print();
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  const studentFullName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.username || "Student Name"
    : "Sokha Chan";

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8 transition-colors">
      {/* Print Styles for Real PDF Printout */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #ffffff !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-certificate,
          #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 3rem !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
        }
      `}</style>

      {/* Toast */}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Award className="h-4 w-4" />
            Official Academic Documents
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Certificates & Verified Letters
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Generate and request official university-certified academic credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              handleOpenCertificate(
                "ENROLLMENT_CONFIRMATION",
                "INSTANT-DYNAMIC",
                new Date().toISOString(),
                "Official Enrollment Verification"
              )
            }
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-2.5 text-xs sm:text-sm font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-indigo-300 transition-all shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Instant Certificate Preview
          </button>

          <button
            type="button"
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            Request New Document
          </button>
        </div>
      </div>

      {/* Dynamic Certificate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Enrollment Certificate */}
        <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all text-card-foreground">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-emerald-100/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              Verified Student
            </span>
          </div>

          <h3 className="mt-4 font-bold text-card-foreground text-base">
            Certificate of Enrollment
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Official confirmation of student active enrollment for academic year {profile?.academicYear || "2025-2026"}.
          </p>

          <button
            type="button"
            onClick={() =>
              handleOpenCertificate(
                "ENROLLMENT_CONFIRMATION",
                "ENROLL-CONFIRM",
                new Date().toISOString()
              )
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 py-2.5 text-xs font-bold text-foreground hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 transition-all"
          >
            <Eye className="h-4 w-4" />
            Generate & View Certificate
          </button>
        </div>

        {/* Card 2: Academic Completion */}
        <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all text-card-foreground">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-sky-100/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-800 dark:bg-sky-950/60 dark:text-sky-400">
              Academic Record
            </span>
          </div>

          <h3 className="mt-4 font-bold text-card-foreground text-base">
            Certificate of Completion
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Official credential certifying completion of Year {profile?.yearLevel || 2} module requirements.
          </p>

          <button
            type="button"
            onClick={() =>
              handleOpenCertificate(
                "COMPLETION",
                "COMPLETION-CERT",
                new Date().toISOString()
              )
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 py-2.5 text-xs font-bold text-foreground hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 transition-all"
          >
            <Eye className="h-4 w-4" />
            Generate & View Certificate
          </button>
        </div>

        {/* Card 3: Academic Transcript */}
        <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all text-card-foreground">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-amber-100/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
              Official Seal
            </span>
          </div>

          <h3 className="mt-4 font-bold text-card-foreground text-base">
            Official Academic Transcript
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Certified document detailing grades, cumulative GPA, and unit credits.
          </p>

          <button
            type="button"
            onClick={() =>
              handleOpenCertificate(
                "TRANSCRIPT",
                "TRANSCRIPT-OFFICIAL",
                new Date().toISOString()
              )
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 py-2.5 text-xs font-bold text-foreground hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 transition-all"
          >
            <Eye className="h-4 w-4" />
            Generate & View Certificate
          </button>
        </div>
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
              You can click &quot;Request New Document&quot; or click &quot;Generate & View&quot; above for instant university credentials.
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
                      Approved
                    </span>
                  )}
                  {req.status === "REJECTED" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                      <XCircle className="h-3.5 w-3.5" />
                      Rejected
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenCertificate(
                        req.certificateType,
                        req.requestId,
                        req.createdAt,
                        req.reason
                      )
                    }
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 shadow-sm"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View & Print Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-Life University Certificate High-Definition Modal */}
      {showPreviewModal && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-4 sm:p-8 shadow-2xl space-y-6">
            {/* Top Modal Controls */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Official Academic Certificate Viewer
                </h3>
                <p className="text-xs text-slate-500">
                  Serial: {selectedCert.serialNo} · Verified Document
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrintPDF}
                  className="flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-800 shadow-md transition-all"
                >
                  <Printer className="h-4 w-4" />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>

            {/* REAL-LIFE UNIVERSITY CERTIFICATE DOCUMENT */}
            <div
              id="printable-certificate"
              ref={printRef}
              className="relative overflow-hidden rounded-xl border-8 border-double border-amber-600/80 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20 p-8 sm:p-12 text-center text-slate-900 shadow-inner"
            >
              {/* Outer Decorative Frame */}
              <div className="pointer-events-none absolute inset-3 rounded-lg border border-amber-600/40"></div>

              {/* Watermark Logo */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <Building2 className="h-96 w-96 text-amber-900" />
              </div>

              {/* Header Crest */}
              <div className="relative z-10 space-y-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md">
                  <Building2 className="h-9 w-9" />
                </div>

                <p className="text-[11px] font-black tracking-widest text-amber-800 uppercase">
                  Kingdom of Cambodia · Nation Religion King
                </p>
                <h2 className="text-xl font-black uppercase tracking-wider text-slate-900 font-serif">
                  University of Management and Technology
                </h2>
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Faculty of Computer Science & Information Technology
                </p>
              </div>

              {/* Certificate Title */}
              <div className="relative z-10 my-8 space-y-2">
                <div className="mx-auto h-0.5 w-32 bg-amber-600/60"></div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-amber-900 uppercase font-serif py-2">
                  {selectedCert.certificateType}
                </h1>
                <div className="mx-auto h-0.5 w-32 bg-amber-600/60"></div>
              </div>

              {/* Recipient Details */}
              <div className="relative z-10 my-6 space-y-4">
                <p className="text-sm italic text-slate-600">
                  This official document is proudly presented to certify that
                </p>

                <h3 className="text-3xl sm:text-4xl font-black text-indigo-950 font-serif border-b-2 border-amber-600/40 pb-2 inline-block px-8">
                  {studentFullName}
                </h3>

                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Student Identification Code:{" "}
                  <span className="text-indigo-700">{profile?.studentCode || "STU-2024-001"}</span>
                </p>

                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-700">
                  Has fulfilled all academic standards, coursework requirements, and official enrollment obligations as an enrolled student in{" "}
                  <strong className="text-slate-900 font-bold">Year {profile?.yearLevel || 2}</strong> for Academic Year{" "}
                  <strong className="text-slate-900 font-bold">{profile?.academicYear || "2025-2026"}</strong>.
                </p>
              </div>

              {/* Bottom Details & Official Seal */}
              <div className="relative z-10 mt-12 grid grid-cols-3 items-end pt-8 border-t border-amber-600/20 text-xs">
                {/* Left: Date & Serial */}
                <div className="text-left space-y-1">
                  <p className="font-bold text-slate-500 uppercase text-[10px]">Issued On</p>
                  <p className="font-extrabold text-slate-900">{selectedCert.issueDate}</p>
                  <p className="font-bold text-slate-500 uppercase text-[10px] pt-2">Serial Number</p>
                  <p className="font-mono text-indigo-900 font-bold">{selectedCert.serialNo}</p>
                </div>

                {/* Center: Gold Foil Seal Badge */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-1 shadow-lg ring-4 ring-amber-600/30">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-dashed border-amber-900 bg-amber-50 text-center p-1">
                      <ShieldCheck className="h-6 w-6 text-amber-800" />
                      <span className="text-[7px] font-black uppercase text-amber-900 tracking-tighter">
                        OFFICIAL SEAL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Signature */}
                <div className="text-right space-y-1">
                  <div className="mx-auto ml-auto h-10 w-28 border-b-2 border-slate-900/60 font-serif italic text-slate-700 text-sm flex items-end justify-center">
                    Heng Sophal
                  </div>
                  <p className="font-bold text-slate-900">Dr. Heng Sophal</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">
                    Dean of Academic Affairs
                  </p>
                </div>
              </div>

              {/* QR Verification Footer */}
              <div className="relative z-10 mt-8 flex items-center justify-between rounded-lg bg-amber-100/50 p-2.5 text-[10px] font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-indigo-700" />
                  <span>Scan QR or verify credential authenticity at: <strong>https://umt.edu.kh/verify</strong></span>
                </div>
                <span className="font-mono font-bold text-slate-800">STATUS: OFFICIAL VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  onChange={(e) => setType(e.target.value as any)}
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
