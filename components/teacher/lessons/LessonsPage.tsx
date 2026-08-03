"use client";

import { useMemo, useState } from "react";
import LessonsFilterBar from "./LessonsFilterBar";
import LessonCard from "./LessonCard";
import { Lesson, LessonFilter, ClassroomFilter } from "@/lib/types/Lesson";

// TODO: replace with real data fetching once the backend is wired up.
const lessons: Lesson[] = [
  {
    id: "1",
    title: "Introduction to Relational Databases",
    description:
      "Covers tables, primary keys, foreign keys, and normalization basics.",
    date: "Jul 2, 2026",
    status: "published",
    thumbnail: "database",
  },
  {
    id: "2",
    title: "Networking Fundamentals",
    description: "TCP/IP, OSI model, and how packets move across a network.",
    date: "Jun 28, 2026",
    status: "published",
    thumbnail: "network",
  },
  {
    id: "3",
    title: "Data Structures: Trees & Graphs",
    description: "Binary trees, traversal strategies, and graph representations.",
    date: "Jun 20, 2026",
    status: "draft",
    thumbnail: "structures",
  },
  {
    id: "4",
    title: "Intro to Data Analytics",
    description: "Descriptive statistics and exploratory data analysis workflows.",
    date: "Jun 15, 2026",
    status: "published",
    thumbnail: "analytics",
  },
  {
    id: "5",
    title: "Human-Computer Interaction Basics",
    description: "Usability heuristics and designing for the end user.",
    date: "Jun 9, 2026",
    status: "draft",
    thumbnail: "hci",
  },
  {
    id: "6",
    title: "Sorting Algorithms Deep Dive",
    description: "Quicksort, mergesort, and comparing time complexity trade-offs.",
    date: "Jun 1, 2026",
    status: "published",
    thumbnail: "algorithms",
  },
];

export default function LessonsPage() {
  const [activeFilter, setActiveFilter] = useState<LessonFilter>("all");
  const [classroom, setClassroom] = useState<ClassroomFilter>("all");

  const filteredLessons = useMemo(() => {
    let result = lessons;
    if (activeFilter === "published") {
      result = result.filter((lesson) => lesson.status === "published");
    } else if (activeFilter === "drafts") {
      result = result.filter((lesson) => lesson.status === "draft");
    }
    return result;
  }, [activeFilter]);

  return (
    <div className="space-y-4">
      <LessonsFilterBar
        active={activeFilter}
        onChange={setActiveFilter}
        classroom={classroom}
        onClassroomChange={setClassroom}
        classroomOptions={[]}
        shownCount={filteredLessons.length}
        totalCount={lessons.length}
      />

      {filteredLessons.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No lessons match this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}