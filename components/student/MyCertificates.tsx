"use client";

import { useState } from "react";
import {
  Award,
  Clock,
  Download,
  Eye,
  Loader2,
  Printer,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "@/components/shared/Toast";
import { CardGridSkeleton } from "@/components/shared/Skeletons";
import {
  downloadIssuedCertificate,
  previewIssuedCertificate,
  fetchIssuedCertificateDocument,
  type IssuedCertificateResponse,
} from "@/lib/api/student";
import {
  useGetIssuedCertificatesQuery,
  useGetStudentProfileQuery,
} from "@/lib/redux/apiSlice";

const TYPE_LABEL: Record<string, string> = {
  DEGREE: "Degree",
  COMPLETION: "Certificate of Completion",
  TRANSCRIPT: "Academic Transcript",
  ENROLLMENT_CONFIRMATION: "Enrolment Confirmation",
};

// Same per-type colour idea the classroom cards use, so a student's
// certificates read as the same family of card, not a one-off design.
const TYPE_HEADER: Record<string, string> = {
  DEGREE: "bg-gradient-to-br from-amber-600 to-amber-700",
  COMPLETION: "bg-gradient-to-br from-sky-600 to-sky-700",
  TRANSCRIPT: "bg-gradient-to-br from-emerald-600 to-emerald-700",
  ENROLLMENT_CONFIRMATION: "bg-gradient-to-br from-violet-600 to-violet-700",
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * The certificates a student has been awarded.
 *
 * <p>This list comes from the awards table, not from their requests. A request
 * that has not been approved has no award behind it, so there is nothing here
 * to open — the absence is the access rule, not a hidden button.
 */
export default function MyCertificates() {
  const { data: profile } = useGetStudentProfileQuery();
  const studentId = profile?.studentId ?? "";

  const { data, isLoading, isError } = useGetIssuedCertificatesQuery(studentId, {
    skip: !studentId,
  });

  const [viewing, setViewing] = useState<IssuedCertificateResponse | null>(null);
  const [document, setDocument] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

  const certificates = (data ?? []).filter((c) => c.status === "ISSUED");

  const openDocument = async (certificate: IssuedCertificateResponse) => {
    setViewing(certificate);
    setDocument(null);
    setDocumentUrl(null);
    setLoadingDoc(true);

    const html = await fetchIssuedCertificateDocument(studentId, certificate.issuedId);
    setLoadingDoc(false);

    if (html === null) {
      toast.error("Could not open this certificate. Please try again.");
      setViewing(null);
      return;
    }
    setDocument(html);
  };

  // A PDF has no HTML to render inline, so "preview" opens the same file the
  // download button would, just with an inline disposition — the browser's
  // own PDF viewer shows it instead of forcing a save dialog.
  const openPreview = async (certificate: IssuedCertificateResponse) => {
    const result = await previewIssuedCertificate(studentId, certificate.issuedId);
    if (!result) {
      toast.error("Could not open this certificate. Please try again.");
      return;
    }
    setViewing(certificate);
    setDocumentUrl(result.downloadUrl);
  };

  const handleDownload = async (certificate: IssuedCertificateResponse) => {
    const result = await downloadIssuedCertificate(studentId, certificate.issuedId);
    if (!result) {
      toast.error("No file is attached. Open the certificate to print it instead.");
      return;
    }
    window.open(result.downloadUrl, "_blank", "noopener");
  };

  if (isLoading) {
    return <CardGridSkeleton count={6} />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        Could not load your certificates. Please try again shortly.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {certificates.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <Clock className="h-8 w-8 text-slate-300 dark:text-slate-700" />
          <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No certificates yet
          </p>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            Certificates appear here once the registrar has issued them. You will
            get a notification as soon as one is ready.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <article
              key={certificate.issuedId}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Colored header, matching the classroom card pattern */}
              <div
                className={`relative px-4 py-3.5 text-white ${
                  TYPE_HEADER[certificate.certificateType] ?? "bg-gradient-to-br from-indigo-600 to-indigo-700"
                }`}
              >
                <p className="pr-9 text-sm font-bold leading-tight">
                  {TYPE_LABEL[certificate.certificateType] ?? certificate.certificateType}
                </p>
                <p className="mt-0.5 truncate pr-9 text-[11px] text-white/80">
                  {certificate.programName ?? "—"}
                </p>
                <span className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20">
                  <Award className="h-4 w-4" />
                </span>
              </div>

              {/* Body */}
              <div className="space-y-2 px-4 py-3.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 dark:text-slate-500">Issued {formatDate(certificate.issuedAt)}</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                    Issued
                  </span>
                </div>
                <p className="truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {certificate.certificateNumber}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                  {/*
                    A certificate printed from an uploaded design is a PDF, with
                    no HTML to show inline — View opens the stored HTML, Preview
                    opens the PDF itself, and only one of the two ever applies.
                  */}
                  {certificate.hasDocument && (
                    <button
                      type="button"
                      onClick={() => openDocument(certificate)}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                  )}
                  {certificate.hasFile && !certificate.hasDocument && (
                    <button
                      type="button"
                      onClick={() => openPreview(certificate)}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </button>
                  )}
                  {certificate.hasFile && (
                    <button
                      type="button"
                      onClick={() => handleDownload(certificate)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  )}
                  <a
                    href={`/verify/${certificate.verificationCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Verify
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {viewing && (
        <CertificateViewer
          title={TYPE_LABEL[viewing.certificateType] ?? viewing.certificateType}
          html={document}
          fileUrl={documentUrl}
          loading={loadingDoc}
          onClose={() => {
            setViewing(null);
            setDocument(null);
            setDocumentUrl(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * Shows the awarded document and prints it.
 *
 * <p>The HTML is what the server stored at the moment of issue, so what prints
 * is exactly what was awarded — not a fresh render that a later grade
 * correction could have changed. A PDF certificate has no HTML, so it is
 * embedded directly from its own inline URL instead.
 */
function CertificateViewer({
  title,
  html,
  fileUrl,
  loading,
  onClose,
}: {
  title: string;
  html: string | null;
  fileUrl: string | null;
  loading: boolean;
  onClose: () => void;
}) {
  const print = () => {
    const frame = window.document.getElementById(
      "certificate-frame"
    ) as HTMLIFrameElement | null;
    frame?.contentWindow?.focus();
    frame?.contentWindow?.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <div className="flex items-center gap-2">
            {html && (
              <button
                type="button"
                onClick={print}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                <Printer className="h-3.5 w-3.5" />
                Print / Save as PDF
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-100 p-4 dark:bg-slate-950">
          {loading && (
            <div className="flex items-center justify-center py-20 text-slate-500 dark:text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Opening…
            </div>
          )}
          {html && (
            /*
              An iframe rather than dangerouslySetInnerHTML: it isolates the
              certificate's own styles from the app's, and gives the print
              button a document to print on its own.
            */
            <iframe
              id="certificate-frame"
              title={title}
              srcDoc={html}
              sandbox="allow-same-origin allow-modals"
              className="h-[70vh] w-full rounded-lg border border-slate-200 bg-white"
            />
          )}
          {fileUrl && (
            <iframe
              title={title}
              src={fileUrl}
              className="h-[70vh] w-full rounded-lg border border-slate-200 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
