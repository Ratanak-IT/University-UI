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

import { LessonFilter, ClassroomFilter } from "@/lib/types/Lesson";
import { ListFilter, BookOpen } from "lucide-react";
import ModernSelect from "@/components/shared/ModernSelect";

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

export default function LessonsFilterBar({
  active,
  onChange,
  classroom,
  onClassroomChange,
  classroomOptions,
  shownCount,
  totalCount,
}: LessonsFilterBarProps) {
  const dropdownOptions = [
    { value: "all", label: "All Classrooms" },
    ...classroomOptions.map((name) => ({ value: name, label: name })),
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                active === tab.id
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        <div className="w-52">
          <ModernSelect
            options={dropdownOptions}
            value={classroom}
            onChange={(val) => onClassroomChange(val)}
            icon={BookOpen}
          />
        </div>
      </div>

      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Showing <span className="font-bold text-slate-900 dark:text-slate-100">{shownCount}</span> of{" "}
        <span className="font-bold text-slate-900 dark:text-slate-100">{totalCount}</span> lessons
      </p>
    </div>
  );
}