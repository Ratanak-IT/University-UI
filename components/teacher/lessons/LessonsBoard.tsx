// "use client";

// import { useMemo, useState } from "react";
// import LessonsFilterBar from "./LessonsFilterBar";
// import LessonsGrid from "./LessonsGrid";
// import LessonsPagination from "./LessonsPagination";
// import { LessonFilter } from "@/lib/types/Lesson";
// import { lessons } from "@/lib/data/lessons";

// const PAGE_SIZE = 6;

// export default function LessonsBoard() {
//   const [filter, setFilter] = useState<LessonFilter>("all");
//   const [page, setPage] = useState(1);

//   const filteredLessons = useMemo(() => {
//     if (filter === "all") return lessons;
//     if (filter === "published")
//       return lessons.filter((l) => l.status === "published");
//     return lessons.filter((l) => l.status === "draft");
//   }, [filter]);

//   const totalPages = Math.max(1, Math.ceil(filteredLessons.length / PAGE_SIZE));
//   const safePage = Math.min(page, totalPages);

//   const visibleLessons = useMemo(() => {
//     const start = (safePage - 1) * PAGE_SIZE;
//     return filteredLessons.slice(start, start + PAGE_SIZE);
//   }, [filteredLessons, safePage]);

//   return (
//     <div className="flex flex-col gap-6">
//       <LessonsFilterBar
//         active={filter}
//         onChange={(next) => {
//           setFilter(next);
//           setPage(1);
//         }}
//         shownCount={filteredLessons.length}
//         totalCount={lessons.length}
//       />

//       <LessonsGrid lessons={visibleLessons} />

//       <LessonsPagination
//         shownStudents={visibleLessons.length}
//         totalStudents={filteredLessons.length}
//         currentPage={safePage}
//         totalPages={totalPages}
//         onPageChange={setPage}
//       />
//     </div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import LessonsFilterBar from "./LessonsFilterBar";
import LessonsGrid from "./LessonsGrid";
import LessonsPagination from "./LessonsPagination";
import { LessonFilter, ClassroomFilter } from "@/lib/types/Lesson";
import { lessons } from "@/lib/data/lessons";

const PAGE_SIZE = 6;

// "Database Systems 301 • Module 1" -> "Database Systems 301"
function classroomFromLabel(courseLabel: string): string {
  return courseLabel.split("•")[0].trim();
}

export default function LessonsBoard() {
  const [filter, setFilter] = useState<LessonFilter>("all");
  const [classroom, setClassroom] = useState<ClassroomFilter>("all");
  const [page, setPage] = useState(1);

  const classroomOptions = useMemo(() => {
    const names = new Set(lessons.map((l) => classroomFromLabel(l.courseLabel)));
    return Array.from(names).sort();
  }, []);

  const filteredLessons = useMemo(() => {
    let result = lessons;

    if (filter === "published") {
      result = result.filter((l) => l.status === "published");
    } else if (filter === "drafts") {
      result = result.filter((l) => l.status === "draft");
    }

    if (classroom !== "all") {
      result = result.filter((l) => classroomFromLabel(l.courseLabel) === classroom);
    }

    return result;
  }, [filter, classroom]);

  const totalPages = Math.max(1, Math.ceil(filteredLessons.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const visibleLessons = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredLessons.slice(start, start + PAGE_SIZE);
  }, [filteredLessons, safePage]);

  return (
    <div className="flex flex-col gap-6">
      <LessonsFilterBar
        active={filter}
        onChange={(next) => {
          setFilter(next);
          setPage(1);
        }}
        classroom={classroom}
        onClassroomChange={(next) => {
          setClassroom(next);
          setPage(1);
        }}
        classroomOptions={classroomOptions}
        shownCount={filteredLessons.length}
        totalCount={lessons.length}
      />

      <LessonsGrid lessons={visibleLessons} />

      <LessonsPagination
        shownStudents={visibleLessons.length}
        totalStudents={filteredLessons.length}
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}