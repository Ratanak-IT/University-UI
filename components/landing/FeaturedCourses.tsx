"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Users, BookOpen } from "lucide-react";

const TABS = [
  "Backend Development",
  "Web Security",
  "UX/UI Design",
  "Frontend Development",
  "Project Management",
  "Database",
] as const;

type Course = {
  id: string;
  title: string;
  category: typeof TABS[number];
  tag: string;
  date: string;
  learners: string;
  image: string;
};

const COURSES: Course[] = [
  { 
    id: "1",
    title: "Spring Boot", 
    category: "Backend Development",
    tag: "Backend", 
    date: "10/09/25", 
    learners: "1 Learners",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: "2",
    title: "REST API", 
    category: "Backend Development",
    tag: "Backend", 
    date: "10/09/25", 
    learners: "1 Learners",
    image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: "3",
    title: "JPA / Hibernate", 
    category: "Backend Development",
    tag: "Backend", 
    date: "1/09/25", 
    learners: "1 Learners",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: "4",
    title: "Build REST API with Real Project", 
    category: "Backend Development",
    tag: "Backend", 
    date: "1/09/25", 
    learners: "1 Learners",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: "5",
    title: "OWASP Top 10 Security", 
    category: "Web Security",
    tag: "Security", 
    date: "15/10/25", 
    learners: "4 Learners",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: "6",
    title: "Figma Masterclass & Prototyping", 
    category: "UX/UI Design",
    tag: "Design", 
    date: "20/10/25", 
    learners: "8 Learners",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: "7",
    title: "React & Next.js Core Concepts", 
    category: "Frontend Development",
    tag: "Frontend", 
    date: "05/11/25", 
    learners: "12 Learners",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
  },
];

export default function FeaturedCourses() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Backend Development");

  const filteredCourses = COURSES.filter(
    (course) => course.category === activeTab
  );

  return (
    <section className="bg-background py-28 text-foreground transition-colors duration-200 dark:bg-background dark:text-foreground">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[15px] font-medium text-primary">Featured Courses</p>
          <h2 className="mt-3 text-[32px] font-bold text-foreground dark:text-foreground sm:text-[38px]">
            <span className="ums-underline">Start Your Journey</span>
          </h2>
          <p className="mt-5 text-[15px] leading-[1.7] text-muted-foreground dark:text-muted-foreground">
            Explore high-quality, expert-led courses designed to help you grow your skills and advance your career.
          </p>
        </div>

        {/* Dynamic Category Navigation */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3 border-b border-border dark:border-border/60">
          {TABS.map((tab) => (
            <button 
              key={tab} 
              type="button" 
              onClick={() => setActiveTab(tab)} 
              className={`-mb-px border-b-2 pb-4 text-[17px] font-medium transition-colors ${
                activeTab === tab 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filtered Course Display */}
        {filteredCourses.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCourses.map((c) => (
              <article 
                key={c.id} 
                className="overflow-hidden rounded-[15px] bg-card text-card-foreground ring-1 ring-border shadow-xs hover:shadow-md transition-all dark:bg-card dark:text-card-foreground dark:ring-border/60 dark:hover:border-primary/40 dark:hover:shadow-primary/5"
              >
                <div className="relative p-4">
                  <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted dark:bg-muted/30">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-all duration-300 hover:scale-105 dark:brightness-90 dark:hover:brightness-100"
                    />
                  </div>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 -rotate-[7deg] rounded-full bg-secondary px-4 py-1.5 text-[15px] font-medium text-secondary-foreground shadow-xs border border-transparent dark:bg-secondary/90 dark:text-secondary-foreground dark:border-border/60">
                    {c.tag}
                  </span>
                </div>
                <div className="px-6 pb-6 pt-3">
                  <h3 className="text-lg font-bold text-foreground dark:text-foreground">{c.title}</h3>
                  <div className="mt-4 flex items-center gap-4 text-[14px] text-muted-foreground dark:text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {c.date}
                    </span>
                    <span className="h-4 w-px bg-border dark:bg-border/60" />
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      {c.learners}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[15px] border border-dashed border-border bg-card/50 p-12 text-center dark:border-border/60 dark:bg-card/30">
            <BookOpen className="h-10 w-10 text-muted-foreground/60 dark:text-muted-foreground/40" />
            <h3 className="mt-3 text-lg font-semibold text-foreground dark:text-foreground">No courses available yet</h3>
            <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
              New courses for &quot;{activeTab}&quot; are currently being scheduled.
            </p>
          </div>
        )}

        <div className="mx-auto mt-10 max-w-xl text-center">
          <p className="text-[15px] leading-[1.7] text-muted-foreground dark:text-muted-foreground">
            Learn modern technologies through practical projects, industry mentorship, and collaborative learning environments.
          </p>
          <Link href="#courses" className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-primary hover:underline">
            View All Courses<ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}