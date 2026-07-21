"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";

const SIZES = [
  "Under 1,000 students",
  "1,000 – 5,000 students",
  "5,000 – 20,000 students",
  "Over 20,000 students",
];

export default function DemoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [size, setSize] = useState(SIZES[1]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !institution.trim()) {
      setError("Please fill in your name, work email, and institution.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setStatus("sending");

    // Simulated submit. Point this at your real endpoint when the backend is ready:
    //   await fetch("/api/demo-requests", { method: "POST", body: JSON.stringify({...}) })
    await new Promise((r) => setTimeout(r, 700));
    setStatus("sent");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back to home
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-2">
            {/* Left: pitch */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-700">
                Book a walkthrough
              </p>
              <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-indigo-950 sm:text-5xl">
                See your own institution running in UMS.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
                Bring your current course list and last term&apos;s timetable. We&apos;ll
                load them in and walk you through a real term — not a demo account
                with made-up students.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "45 minutes, no slide deck",
                  "Your data, your course codes",
                  "Straight answers on migration and pricing",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-700 text-white">
                    <Check className="h-6 w-6" strokeWidth={3} />
                  </span>
                  <h2 className="mt-5 text-xl font-bold text-indigo-950">
                    Request received
                  </h2>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                    Thanks, {name.split(" ")[0]}. We&apos;ll email {email} within one
                    working day to find a time.
                  </p>
                  <Link
                    href="/"
                    className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Back to home
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                      {error}
                    </p>
                  )}

                  <Field label="Full name" htmlFor="name">
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sok Dara"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Work email" htmlFor="email">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dara@university.edu"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Institution" htmlFor="institution">
                    <input
                      id="institution"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="University of Technology"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Size" htmlFor="size">
                    <select
                      id="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className={inputClass}
                    >
                      {SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Anything specific you want to see?" htmlFor="notes">
                    <textarea
                      id="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="We're mainly struggling with timetable clashes…"
                      className={`${inputClass} h-auto py-2.5`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2 disabled:opacity-70"
                  >
                    {status === "sending" && (
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                    )}
                    {status === "sending" ? "Sending…" : "Request walkthrough"}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    No credit card. We&apos;ll only use this to contact you.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700/15";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
