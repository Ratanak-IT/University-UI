"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import CourseThumb from "./CourseThumb";

const TABS = ["Backend Development", "Web Security", "UX/UI Design", "Frontend Development", "Project Management", "Database"];

const COURSES = [
  { title: "Spring Boot", tag: "Backend", tagBg: "bg-[#eaf2ff]", date: "10/09/25", learners: "1 Learners" },
  { title: "REST API", tag: "Backend", tagBg: "bg-[#ffeae4]", date: "10/09/25", learners: "1 Learners" },
  { title: "JPA / Hibernate", tag: "Backend", tagBg: "bg-[#daf7fe]", date: "1/09/25", learners: "1 Learners" },
  { title: "Build REST API with Real Project", tag: "Backend", tagBg: "bg-[#eff0ff]", date: "1/09/25", learners: "1 Learners" },
];

export default function FeaturedCourses() {
  const [active, setActive] = useState(0);
  return (
    <section className="ums-section-gradient py-28">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[15px] font-medium text-brandblue">Featured Courses</p>
          <h2 className="mt-3 text-[32px] font-bold text-ink sm:text-[38px]"><span className="ums-underline">Start Your Journey</span></h2>
          <p className="mt-5 text-[15px] leading-[1.7] text-muted">Explore high-quality, expert-led courses designed to help you grow your skills and advance your career.</p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3 border-b border-[#e9f1fe]">
          {TABS.map((t, i) => (
            <button key={t} type="button" onClick={() => setActive(i)} className={`-mb-px border-b-2 pb-4 text-[17px] transition-colors ${active === i ? "border-brandblue text-brandblue" : "border-transparent text-muted hover:text-ink"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COURSES.map((c, idx) => (
            <article key={c.title} className="overflow-hidden rounded-[15px] bg-white shadow-sm ring-1 ring-slate-100">
              <div className="relative p-4">
                <CourseThumb index={idx} className="h-44 w-full" />
                <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 -rotate-[7deg] rounded-full ${c.tagBg} px-4 py-1.5 text-[15px] text-teal`}>{c.tag}</span>
              </div>
              <div className="px-6 pb-6 pt-3">
                <h3 className="text-lg font-bold text-ink">{c.title}</h3>
                <div className="mt-4 flex items-center gap-4 text-[14px] text-ink3">
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-brandblue" />{c.date}</span>
                  <span className="h-4 w-px bg-slate-200" />
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-brandblue" />{c.learners}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-xl text-center">
          <p className="text-[15px] leading-[1.7] text-muted">Learn modern technologies through practical projects, industry mentorship, and collaborative learning environments.</p>
          <Link href="#courses" className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-brandblue hover:underline">View All Courses<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
