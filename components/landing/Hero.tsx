import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Timetable from "./Timetable";

export default function Hero() {
  return (
    <section className="border-b border-slate-100 bg-gradient-to-b from-indigo-50/60 to-slate-50">
      <div className="mx-auto grid max-w-6xl gap-12 px-8 pb-20 pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:pb-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Academic Year 2024–2025 · Semester 2 is live
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-indigo-950 sm:text-5xl">
            Run the whole term from one place.
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
            Timetables, enrollment, attendance, and grades — connected, so a
            change in one shows up everywhere it matters. Built for registrars
            who are tired of reconciling spreadsheets at midnight.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2"
            >
              Book a walkthrough
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <Link
              href="/dashboard/teacher"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
            >
              See the teacher portal
            </Link>
          </div>

          <p className="mt-5 text-xs font-medium text-slate-400">
            Set up in a term, not a year · ខ្មែរ &amp; English
          </p>
        </div>

        <Timetable />
      </div>
    </section>
  );
}
