import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="ums-section-gradient relative overflow-hidden">
      {/* teal hatched circle — top right, near the student */}
      <Image
        src="/images/deco-circle.png"
        alt=""
        aria-hidden
        width={564}
        height={564}
        className="pointer-events-none absolute right-[3%] top-[10%] z-0 w-28 select-none opacity-90 sm:w-40 lg:w-44"
      />
      {/* purple hatched circle — bottom left */}
      <Image
        src="/images/deco-circle-blue.png"
        alt=""
        aria-hidden
        width={382}
        height={382}
        className="pointer-events-none absolute -left-10 bottom-[6%] z-0 w-32 select-none opacity-80 sm:w-40 lg:w-48"
      />

      <div className="relative z-10 mx-auto grid max-w-[1320px] items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-20">
        {/* Left: copy */}
        <div className="relative max-w-xl">
          <svg aria-hidden className="mb-4 h-4 w-16 text-[#ff6b4a]" viewBox="0 0 64 16" fill="none">
            <path d="M2 8c6-8 10 8 16 0s10 8 16 0 10 8 16 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>

          <h1 className="text-[40px] font-bold leading-[1.15] tracking-tight sm:text-[56px] sm:leading-[1.12]">
            <span className="text-accent">Every Course,</span>
            <br />
            <span className="text-primary">Every Skill — One</span>
            <br />
            <span className="ums-underline text-primary">Powerful Platform.</span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-[1.7] text-gray-500">
            UML is your best choice to study Information Technology — built for
            students, instructors, and institutions to thrive in a connected
            learning world.
          </p>

          <div className="mt-8">
            <Link href="#courses" className="inline-flex items-center gap-2 rounded-[14px] bg-brandblue px-6 py-3.5 text-sm font-semibold text-white bg-primary transition-colors hover:bg-primary">
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <svg aria-hidden className="mt-10 h-4 w-14 text-brandblue/60" viewBox="0 0 64 16" fill="none">
            <path d="M2 8c6-8 10 8 16 0s10 8 16 0 10 8 16 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Right: real student cutout over the blob */}
        <div className="relative flex min-h-[420px] items-end justify-center lg:min-h-[560px]">
          <Image
            src="/images/hero-blob.png"
            alt=""
            aria-hidden
            width={1757}
            height={1280}
            priority
            className="pointer-events-none absolute right-0 top-1/2 w-[115%] max-w-none -translate-y-1/2 select-none"
          />
          <Image
            src="/images/hero-student.png"
            alt="Smiling student holding books"
            width={988}
            height={1460}
            priority
            className="relative z-10 h-[420px] w-auto object-contain drop-shadow-xl sm:h-[540px]"
          />
        </div>
      </div>
    </section>
  );
}
