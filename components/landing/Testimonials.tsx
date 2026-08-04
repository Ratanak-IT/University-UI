"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  img: string;
  quote: string;
};

const ITEMS: readonly Testimonial[] = [
  {
    name: "Chhay Davin",
    role: "Cybersecurity Officer",
    img: "/teams/chhaydavin.jpg",
    quote: "UMS offers an amazing learning experience for IT students. I recommend their short courses or scholarships for computer science students.",
  },
  {
    name: "Sok Dara",
    role: "Backend Developer",
    img: "/teams/thairatanak.jpg",
    quote: "The Spring Boot and REST API tracks were exactly what I needed. Mentors gave straight, practical feedback on real projects.",
  },
  {
    name: "Chan Sophea",
    role: "UX/UI Designer",
    img: "/teams/sila.jpg",
    quote: "From wireframes to shipped screens, the design courses connected theory with the work I now do every day.",
  },
] as const;

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = ITEMS[i];

  const prev = () => setI((v) => (v - 1 + ITEMS.length) % ITEMS.length);
  const next = () => setI((v) => (v + 1) % ITEMS.length);

  return (
    <section id="fqa" className="bg-background py-28 text-foreground transition-colors duration-200 dark:bg-background dark:text-foreground">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="text-center">
          <p className="font-hanken text-xs font-bold tracking-[0.1em] text-testired">TESTIMONIALS</p>
          <h2 className="font-hanken mt-2 text-[28px] font-bold uppercase text-foreground dark:text-foreground sm:text-[32px]">
            Hear From Our Students
          </h2>
        </div>

        <div className="mt-14 flex items-center justify-center gap-6 sm:gap-16">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground dark:bg-muted/60 dark:hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex max-w-3xl flex-col items-center gap-10 sm:flex-row sm:gap-12">
            <div className="relative shrink-0">
              {/* Background Accent Blob */}
              <div
                aria-hidden
                className="absolute -inset-4 -rotate-12 rounded-[42%_60%_45%_58%] bg-primary/20 dark:bg-primary/30"
              />
              
              {/* Avatar Container */}
              <div className="relative h-52 w-52 overflow-hidden rounded-full border-4 border-background bg-muted shadow-xl dark:border-background sm:h-64 sm:w-64">
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  sizes="(max-width: 640px) 208px, 256px"
                  className="object-cover transition-all duration-300 dark:brightness-95"
                  priority
                />
              </div>
            </div>

            <div className="relative text-center sm:text-left">
              <Quote className="mb-3 h-8 w-8 text-primary/30 dark:text-primary/40" />
              <h3 className="font-hanken text-2xl text-primary">{t.name}</h3>
              <p className="font-hanken mt-1 text-lg font-semibold text-testired">{t.role}</p>
              <p className="font-hanken mt-4 max-w-md text-lg italic leading-[1.6] text-muted-foreground dark:text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground dark:bg-muted/60 dark:hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="mt-12 flex justify-center gap-2">
          {ITEMS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-3 w-3 rounded-full transition-colors ${
                idx === i
                  ? "bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 dark:bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}