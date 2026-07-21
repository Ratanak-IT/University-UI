import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="ums-section-gradient grid items-center gap-10 rounded-[25px] px-8 py-16 lg:grid-cols-2 lg:px-24">
          <div className="max-w-lg">
            <h2 className="text-[32px] font-bold leading-tight text-black sm:text-[38px]">Empowering Education Through Technology</h2>
            <p className="mt-6 text-[15px] leading-[1.7] text-muted">Explore expert-led courses that help you grow faster, smarter, and stronger.</p>
            <Link href="/dashboard/teacher" className="mt-7 inline-flex items-center gap-2 rounded-[5px] bg-brandblue px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary">Get Started<ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="flex justify-center">
            <svg aria-hidden viewBox="0 0 320 200" className="h-64 w-full max-w-md">
              <path d="M20 170 C 90 170, 130 120, 190 80 L 230 55" fill="none" stroke="#c7d4f0" strokeWidth="26" strokeLinecap="round" />
              <path d="M215 75 L 255 40 L 250 85 Z" fill="#c7d4f0" />
              <circle cx="185" cy="70" r="16" fill="#2053b5" />
              <path d="M185 88 c-14 0 -24 9 -26 22 l 52 0 c-2 -13 -12 -22 -26 -22z" fill="#ff6b4a" />
              <rect x="140" y="118" width="34" height="26" rx="5" fill="#e8543f" />
              <rect x="151" y="112" width="12" height="8" rx="2" fill="#e8543f" />
              <circle cx="90" cy="60" r="4" fill="#f0b429" />
              <circle cx="270" cy="120" r="5" fill="#42b9a8" />
              <circle cx="60" cy="120" r="3" fill="#2053b5" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
