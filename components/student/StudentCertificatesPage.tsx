"use client";

import { useState } from "react";
import { Award, Inbox } from "lucide-react";
import MyCertificates from "./MyCertificates";
import CertificatePage from "./CertificatePage";

const TABS = [
  { id: "issued", label: "My certificates", icon: Award },
  { id: "requests", label: "My requests", icon: Inbox },
] as const;

type Tab = (typeof TABS)[number]["id"];

/**
 * Certificates, split into what the student has been given and what they have
 * asked for.
 *
 * <p>Keeping them apart matters: a pending request looks like a certificate if
 * the two share a list, and a student who thinks they already hold a degree
 * will act on it.
 */
export default function StudentCertificatesPage() {
  const [tab, setTab] = useState<Tab>("issued");

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-colors">
      {/* Header — same eyebrow/title/subtitle pattern as Grades, Attendance
          and Notifications, so the certificates page reads as part of the
          same dashboard rather than a bolted-on screen. */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Award className="h-4 w-4" />
            Official Academic Documents
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Certificates
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Certificates you have been awarded, and requests you have submitted for new ones.
          </p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-card text-indigo-600 shadow-sm dark:text-indigo-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "issued" ? <MyCertificates /> : <CertificatePage />}
    </div>
  );
}
