"use client";

import { useMemo, useState } from "react";
import LessonsFilterBar from "./LessonsFilterBar";
import LessonsGrid from "./LessonsGrid";
import LessonsPagination from "./LessonsPagination";
import { LessonFilter } from "@/lib/types/Lesson";
import { lessons } from "@/lib/data/lessons";


const TOTAL_STUDENTS = 256; // ← replace with your real total from the API

export default function LessonsBoard() {
  const [filter, setFilter] = useState<LessonFilter>("all");
  const [page, setPage] = useState(1);

  const filteredLessons = useMemo(() => {
    if (filter === "all") return lessons;
    if (filter === "published")
      return lessons.filter((l) => l.status === "published");
    return lessons.filter((l) => l.status === "draft");
  }, [filter]);

  return (
    <div className="flex flex-col gap-6">
      <LessonsFilterBar
        active={filter}
        onChange={(next) => {
          setFilter(next);
          setPage(1);
        }}
        shownCount={filteredLessons.length}
        totalCount={lessons.length}
      />

      <LessonsGrid lessons={filteredLessons} />

      <LessonsPagination
        shownStudents={8}
        totalStudents={TOTAL_STUDENTS}
        currentPage={page}
        totalPages={32}
        onPageChange={setPage}
      />
    </div>
  );
}