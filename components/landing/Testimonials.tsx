"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import StudentArt from "./StudentArt";

const ITEMS = [
  { name: "Chhay Davin", role: "Cybersecurity Officer", skin: "light", top: "blue", hair: "dark", quote: "UMS offers an amazing learning experience for IT students. I recommend their short courses or scholarships for computer science students." },
  { name: "Sok Dara", role: "Backend Developer", skin: "medium", top: "teal", hair: "black", quote: "The Spring Boot and REST API tracks were exactly what I needed. Mentors gave straight, practical feedback on real projects." },
  { name: "Chan Sophea", role: "UX/UI Designer", skin: "light", top: "orange", hair: "brown", quote: "From wireframes to shipped screens, the design courses connected theory with the work I now do every day." },
] as const;

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = ITEMS[i];
  const prev = () => setI((v) => (v - 1 + ITEMS.length) % ITEMS.length);
  const next = () => setI((v) => (v + 1) % ITEMS.length);

  return (
    <section id="contact" className="bg-[#f7f9fb] py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="text-center">
          <p className="font-hanken text-xs font-bold tracking-[0.1em] text-testired">TESTIMONIALS</p>
          <h2 className="font-hanken mt-2 text-[28px] font-bold uppercase text-[#001a42] sm:text-[32px]">Hear From Our Students</h2>
        </div>

        <div className="mt-14 flex items-center justify-center gap-6 sm:gap-16">
          <button type="button" onClick={prev} aria-label="Previous" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e6e8ea] text-slate-600 hover:bg-slate-300"><ChevronLeft className="h-5 w-5" /></button>

          <div className="flex max-w-3xl flex-col items-center gap-10 sm:flex-row sm:gap-12">
            <div className="relative shrink-0">
              <div aria-hidden className="absolute -inset-6 -rotate-12 rounded-[42%_60%_45%_58%] bg-primary" />
              <div className="relative flex h-52 w-52 items-end justify-center overflow-hidden rounded-full border-4 border-[#f7f9fb] bg-gradient-to-br from-[#eaf2ff] to-[#dbe7ff] shadow-xl sm:h-64 sm:w-64">
                <StudentArt variant="avatar" skin={t.skin} top={t.top} hair={t.hair} className="h-[94%] w-auto" />
              </div>
            </div>
            <div className="relative text-center sm:text-left">
              <Quote className="mb-3 h-8 w-8 text-primary/30" />
              <h3 className="font-hanken text-2xl text-[#004395]">{t.name}</h3>
              <p className="font-hanken mt-1 text-lg font-semibold text-testired">{t.role}</p>
              <p className="font-hanken mt-4 max-w-md text-lg italic leading-[1.6] text-[#45464d]">&ldquo;{t.quote}&rdquo;</p>
            </div>
          </div>

          <button type="button" onClick={next} aria-label="Next" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e6e8ea] text-slate-600 hover:bg-slate-300"><ChevronRight className="h-5 w-5" /></button>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {ITEMS.map((_, idx) => (
            <button key={idx} type="button" onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`} className={`h-3 w-3 rounded-full transition-colors ${idx === i ? "bg-linkblue" : "bg-slate-300/60"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
