import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="bg-indigo-950">
      <div className="mx-auto max-w-6xl px-8 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-wide text-indigo-300">
            NEXT TERM
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start the next term on UMS.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-indigo-200/70">
            Bring us your current course list and last term&apos;s timetable.
            We&apos;ll show you your own institution running in UMS — not a demo
            account with made-up students.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-950 transition-colors hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
            >
              Book a walkthrough
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <Link
              href="/about-us"
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Talk to us first
            </Link>
          </div>

          <p className="mt-6 text-xs font-medium text-indigo-200/50">
            45 minutes · No slides · Your data stays yours
          </p>
        </div>
      </div>
    </section>
  );
}
