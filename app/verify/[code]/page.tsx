import { API_BASE } from "@/lib/api/config";

/**
 * Public certificate verification.
 *
 * <p>Outside the dashboard and outside auth on purpose: whoever checks a
 * certificate — an employer, another university — has no account here. The
 * fetch runs on the server so it never depends on the visitor holding a token.
 */

interface VerificationResult {
  valid: boolean;
  message: string;
  studentName: string | null;
  certificateType: string | null;
  certificateNumber: string | null;
  programName: string | null;
  issuedAt: string | null;
  revoked: boolean;
}

async function verify(code: string): Promise<VerificationResult | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/verify/${encodeURIComponent(code)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return (await res.json()) as VerificationResult;
  } catch {
    // Saying "could not check" is better than showing a stack trace to a
    // stranger who just scanned a QR code.
    return null;
  }
}

function typeLabel(type: string | null): string {
  if (!type) return "Certificate";
  return type.replace(/_/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const result = await verify(code);

  const state = !result
    ? "error"
    : result.valid
      ? "valid"
      : result.revoked
        ? "revoked"
        : "unknown";

  const tone = {
    valid: "border-emerald-200 bg-emerald-50 text-emerald-800",
    revoked: "border-amber-200 bg-amber-50 text-amber-800",
    unknown: "border-red-200 bg-red-50 text-red-800",
    error: "border-slate-200 bg-slate-50 text-slate-700",
  }[state];

  const heading = {
    valid: "This certificate is genuine",
    revoked: "This certificate was withdrawn",
    unknown: "No certificate matches this code",
    error: "Could not check right now",
  }[state];

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-lg space-y-5">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">
            Certificate verification
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            University of Technology
          </h1>
        </div>

        <div className={`rounded-2xl border px-6 py-5 text-center ${tone}`}>
          <p className="text-lg font-bold">{heading}</p>
          <p className="mt-1 text-sm">
            {result?.message ??
              "The verification service is unavailable. Please try again shortly."}
          </p>
        </div>

        {result?.certificateNumber && (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-6 py-5">
            {/*
              Only what proves authenticity. No grades, no contact details —
              anyone with the code can read this page, so it must not become a
              way to look up student records.
            */}
            <Row label="Awarded to" value={result.studentName} />
            <Row label="Certificate" value={typeLabel(result.certificateType)} />
            <Row label="Programme" value={result.programName} />
            <Row
              label="Issued"
              value={
                result.issuedAt
                  ? new Date(result.issuedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : null
              }
            />
            <Row label="Reference" value={result.certificateNumber} mono />
          </div>
        )}

        <p className="text-center text-xs text-slate-500">
          For anything further, contact the Registrar&apos;s Office.
        </p>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-500">
        {label}
      </span>
      <span className={`text-sm font-semibold text-slate-900 ${mono ? "font-mono" : ""}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}
