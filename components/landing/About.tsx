import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Users } from "lucide-react";

const POINTS = [
  { title: "Smart Student Portal", body: null },
  { title: "Efficient Teacher Management", body: null },
  { title: "Earn Real Certificates", body: "Complete courses and receive professional certificates to boost your career." },
];

export default function About() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative">
          {/* teal hatched circle behind, top-left */}
          <Image
            src="/images/deco-circle.png"
            alt=""
            aria-hidden
            width={564}
            height={564}
            className="pointer-events-none absolute -left-6 -top-6 z-0 w-36 select-none opacity-90"
          />
          {/* purple hatched circle, bottom-right */}
          <Image
            src="/images/deco-circle-blue.png"
            alt=""
            aria-hidden
            width={382}
            height={382}
            className="pointer-events-none absolute -bottom-8 right-4 z-0 w-32 select-none opacity-80"
          />
          {/* photo tile */}
          <div className="relative z-10 aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl">
            <Image
              src="/images/about-learner.png"
              alt="Student with headphones reading"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 460px"
            />
          </div>
          {/* floating cards */}
          <div className="absolute right-2 top-8 z-20 rounded-2xl bg-white px-5 py-4 shadow-lg">
            <Users className="h-6 w-6 text-teal" />
            <p className="mt-2 text-2xl font-bold text-ink">60+</p>
            <p className="text-sm text-muted">Active Learners</p>
          </div>
          <div className="absolute bottom-10 -left-2 z-20 rounded-2xl bg-brandblue/90 px-6 py-4 text-white shadow-lg backdrop-blur">
            <Users className="h-6 w-6" />
            <p className="mt-2 text-sm font-semibold">Expert Instructors</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-teal">About UML</p>
          <h2 className="mt-2 text-[34px] font-bold text-ink sm:text-[40px]">Learning Possibilities.</h2>
          <p className="mt-5 max-w-md text-[15px] leading-[1.7] text-muted">
            At UML, we provide innovative digital solutions that enhance academic
            management and improve the learning experience for students,
            lecturers, and administrators.
          </p>
          <ul className="mt-8 space-y-6">
            {POINTS.map((p, i) => (
              <li key={p.title} className={i < POINTS.length - 1 ? "border-b border-slate-100 pb-6" : ""}>
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal/15 text-teal">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span className="text-lg text-ink">{p.title}</span>
                </div>
                {p.body && <p className="mt-2 pl-9 text-[15px] leading-[1.7] text-muted">{p.body}</p>}
              </li>
            ))}
          </ul>
          <Link href="#about" className="mt-8 inline-flex items-center gap-2 rounded-[10px] bg-brandblue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary">
            Learn More
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
