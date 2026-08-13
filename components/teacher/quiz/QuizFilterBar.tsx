// "use client";

// import { useEffect, useRef, useState } from "react";
// import { SlidersHorizontal, Calendar, LayoutGrid, List, Check } from "lucide-react";
// import { QuizStatus, SortOption } from "@/lib/types/quiz";


// type StatusFilter = QuizStatus | "all";
// export type ViewMode = "grid" | "list";

// interface QuizFilterBarProps {
//   status: StatusFilter;
//   onStatusChange: (status: StatusFilter) => void;
//   sort: SortOption;
//   onSortChange: (sort: SortOption) => void;
//   view: ViewMode;
//   onViewChange: (view: ViewMode) => void;
// }

// const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
//   { value: "all", label: "All Status" },
//   { value: "published", label: "Published" },
//   { value: "draft", label: "Draft" },
//   { value: "scheduled", label: "Scheduled" },
// ];

// const SORT_OPTIONS: { value: SortOption; label: string }[] = [
//   { value: "dateModified", label: "Date Modified" },
//   { value: "title", label: "Title (A–Z)" },
//   { value: "status", label: "Status" },
// ];

// function Dropdown<T extends string>({
//   icon,
//   options,
//   value,
//   onChange,
// }: {
//   icon: React.ReactNode;
//   options: { value: T; label: string }[];
//   value: T;
//   onChange: (value: T) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);
//   const current = options.find((o) => o.value === value);

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         type="button"
//         onClick={() => setOpen((o) => !o)}
//         className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted"
//       >
//         {icon}
//         {current?.label}
//       </button>

//       {open && (
//         <div className="absolute left-0 z-10 mt-1 w-48 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg">
//           {options.map((option) => (
//             <button
//               key={option.value}
//               type="button"
//               onClick={() => {
//                 onChange(option.value);
//                 setOpen(false);
//               }}
//               className="flex w-full items-center justify-between px-3 py-2 text-sm text-card-foreground hover:bg-muted"
//             >
//               {option.label}
//               {option.value === value && <Check size={14} className="text-primary" />}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function QuizFilterBar({
//   status,
//   onStatusChange,
//   sort,
//   onSortChange,
//   view,
//   onViewChange,
// }: QuizFilterBarProps) {
//   return (
//     <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//       <div className="flex flex-wrap items-center gap-3">
//         <Dropdown
//           icon={<SlidersHorizontal size={16} />}
//           options={STATUS_OPTIONS}
//           value={status}
//           onChange={onStatusChange}
//         />
//         <Dropdown
//           icon={<Calendar size={16} />}
//           options={SORT_OPTIONS}
//           value={sort}
//           onChange={onSortChange}
//         />
//       </div>

//       <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
//         <button
//           type="button"
//           onClick={() => onViewChange("grid")}
//           className={`rounded-md p-1.5 ${
//             view === "grid" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-card-foreground"
//           }`}
//           aria-label="Grid view"
//         >
//           <LayoutGrid size={18} />
//         </button>
//         <button
//           type="button"
//           onClick={() => onViewChange("list")}
//           className={`rounded-md p-1.5 ${
//             view === "list" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-card-foreground"
//           }`}
//           aria-label="List view"
//         >
//           <List size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, Calendar, LayoutGrid, List, Check, BookOpen } from "lucide-react";
import { QuizStatus, SortOption } from "@/lib/types/quiz";

type StatusFilter = QuizStatus | "all";
type ClassroomFilter = string | "all";
export type ViewMode = "grid" | "list";

interface QuizFilterBarProps {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  classroom: ClassroomFilter;
  onClassroomChange: (value: ClassroomFilter) => void;
  classroomOptions: string[];
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "dateModified", label: "Date Modified" },
  { value: "title", label: "Title (A–Z)" },
  { value: "status", label: "Status" },
];

function Dropdown<T extends string>({
  icon,
  options,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

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
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted"
      >
        {icon}
        {current?.label ?? "All"}
      </button>

      {open && (
        <div className="absolute left-0 z-10 mt-1 w-48 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg">
          {options.map((option) => (
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

export default function QuizFilterBar({
  status,
  onStatusChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  classroom,
  onClassroomChange,
  classroomOptions,
}: QuizFilterBarProps) {
  const CLASSROOM_OPTIONS: { value: ClassroomFilter; label: string }[] = [
    { value: "all", label: "All Classrooms" },
    ...classroomOptions.map((name) => ({ value: name, label: name })),
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Dropdown
          icon={<BookOpen size={16} />}
          options={CLASSROOM_OPTIONS}
          value={classroom}
          onChange={onClassroomChange}
        />
        <Dropdown
          icon={<SlidersHorizontal size={16} />}
          options={STATUS_OPTIONS}
          value={status}
          onChange={onStatusChange}
        />
        <Dropdown
          icon={<Calendar size={16} />}
          options={SORT_OPTIONS}
          value={sort}
          onChange={onSortChange}
        />
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => onViewChange("grid")}
          className={`rounded-md p-1.5 ${
            view === "grid" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-card-foreground"
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid size={18} />
        </button>
        <button
          type="button"
          onClick={() => onViewChange("list")}
          className={`rounded-md p-1.5 ${
            view === "list" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-card-foreground"
          }`}
          aria-label="List view"
        >
          <List size={18} />
        </button>
      </div>
    </div>
  );
}