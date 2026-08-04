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
    <section className="bg-background py-16 text-foreground transition-colors duration-200">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative">
          <Image
            src="/images/deco-circle.png"
            alt=""
            aria-hidden
            width={564}
            height={564}
            className="pointer-events-none absolute -left-6 -top-6 z-0 w-36 select-none opacity-90 dark:opacity-40"
          />
          <Image
            src="/images/deco-circle-blue.png"
            alt=""
            aria-hidden
            width={382}
            height={382}
            className="pointer-events-none absolute -bottom-8 right-4 z-0 w-32 select-none opacity-80 dark:opacity-40"
          />
          {/* photo tile */}
          <div className="relative z-10 aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl">
            <Image
              src="/images/about-learner.png"
              alt="Student with headphones reading"
              fill
              className="object-cover object-top dark:brightness-90"
              sizes="(max-width: 1024px) 90vw, 460px"
            />
          </div>

          <div className="absolute -left-2 bottom-10 z-20 rounded-2xl bg-primary/90 px-6 py-4 text-primary-foreground shadow-lg backdrop-blur">
            <Users className="h-6 w-6" />
            <p className="mt-2 text-sm font-semibold">Expert Instructors</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-primary">About UML</p>
          <h2 className="mt-2 text-[34px] font-bold text-foreground sm:text-[40px]">Learning Possibilities.</h2>
          <p className="mt-5 max-w-md text-[15px] leading-[1.7] text-muted-foreground">
            At UML, we provide innovative digital solutions that enhance academic
            management and improve the learning experience for students,
            lecturers, and administrators.
          </p>
          <ul className="mt-8 space-y-6">
            {POINTS.map((p, i) => (
              <li key={p.title} className={i < POINTS.length - 1 ? "border-b border-border pb-6" : ""}>
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span className="text-lg font-medium text-foreground">{p.title}</span>
                </div>
                {p.body && <p className="mt-2 pl-9 text-[15px] leading-[1.7] text-muted-foreground">{p.body}</p>}
              </li>
            ))}
          </ul>
          <Link href="#about" className="mt-8 inline-flex items-center gap-2 rounded-[10px] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Learn More
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}