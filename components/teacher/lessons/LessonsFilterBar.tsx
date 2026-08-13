// import { LessonFilter } from "@/lib/types/Lesson";
// import { ListFilter, ChevronDown } from "lucide-react";


// const TABS: { id: LessonFilter; label: string }[] = [
//   { id: "all", label: "All Lessons" },
//   { id: "published", label: "Published" },
//   { id: "drafts", label: "Drafts" },
// ];

// interface LessonsFilterBarProps {
//   active: LessonFilter;
//   onChange: (filter: LessonFilter) => void;
//   shownCount: number;
//   totalCount: number;
// }

// export default function LessonsFilterBar({
//   active,
//   onChange,
//   shownCount,
//   totalCount,
// }: LessonsFilterBarProps) {
//   return (
//     <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
//       <div className="flex flex-wrap items-center gap-4">
//         <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
//           {TABS.map((tab) => (
//             <button
//               key={tab.id}
//               type="button"
//               onClick={() => onChange(tab.id)}
//               className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
//                 active === tab.id
//                   ? "bg-card text-primary shadow-sm"
//                   : "text-muted-foreground hover:text-card-foreground"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         <div className="h-6 w-px bg-border" />

//         <button
//           type="button"
//           className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-card-foreground"
//         >
//           <ListFilter className="h-4 w-4" />
//           Sort by: <span className="text-card-foreground">Newest</span>
//           <ChevronDown className="h-4 w-4" />
//         </button>
//       </div>

//       <p className="text-sm text-muted-foreground">
//         Showing <span className="font-semibold text-card-foreground">{shownCount}</span>{" "}
//         of <span className="font-semibold text-card-foreground">{totalCount}</span>{" "}
//         lessons
//       </p>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { LessonFilter, ClassroomFilter } from "@/lib/types/Lesson";
import { ListFilter, ChevronDown, BookOpen, Check } from "lucide-react";

const TABS: { id: LessonFilter; label: string }[] = [
  { id: "all", label: "All Lessons" },
  { id: "published", label: "Published" },
  { id: "drafts", label: "Drafts" },
];

interface LessonsFilterBarProps {
  active: LessonFilter;
  onChange: (filter: LessonFilter) => void;
  classroom: ClassroomFilter;
  onClassroomChange: (value: ClassroomFilter) => void;
  classroomOptions: string[];
  shownCount: number;
  totalCount: number;
}

function ClassroomDropdown({
  value,
  onChange,
  options,
}: {
  value: ClassroomFilter;
  onChange: (value: ClassroomFilter) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const allOptions: { value: ClassroomFilter; label: string }[] = [
    { value: "all", label: "All Classrooms" },
    ...options.map((name) => ({ value: name, label: name })),
  ];
  const current = allOptions.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-card-foreground"
      >
        <BookOpen className="h-4 w-4" />
        {current?.label ?? "All Classrooms"}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 z-10 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg">
          {allOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-sm text-card-foreground hover:bg-muted"
            >
              {option.label}
              {option.value === value && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LessonsFilterBar({
  active,
  onChange,
  classroom,
  onClassroomChange,
  classroomOptions,
  shownCount,
  totalCount,
}: LessonsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active === tab.id
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-card-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-border" />

        <ClassroomDropdown
          value={classroom}
          onChange={onClassroomChange}
          options={classroomOptions}
        />

        <div className="h-6 w-px bg-border" />

        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-card-foreground"
        >
          <ListFilter className="h-4 w-4" />
          Sort by: <span className="text-card-foreground">Newest</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-card-foreground">{shownCount}</span>{" "}
        of <span className="font-semibold text-card-foreground">{totalCount}</span>{" "}
        lessons
      </p>
    </div>
  );
}