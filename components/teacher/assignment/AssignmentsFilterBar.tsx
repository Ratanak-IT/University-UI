"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronDown, Check } from "lucide-react";
import { ClassroomFilter } from "@/lib/types/AssignmentGroup";

interface AssignmentsFilterBarProps {
  classroom: ClassroomFilter;
  onClassroomChange: (value: ClassroomFilter) => void;
  classroomOptions: string[];
  shownCount: number;
  totalCount: number;
}

export default function AssignmentsFilterBar({
  classroom,
  onClassroomChange,
  classroomOptions,
  shownCount,
  totalCount,
}: AssignmentsFilterBarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: { value: ClassroomFilter; label: string }[] = [
    { value: "all", label: "All Classrooms" },
    ...classroomOptions.map((name) => ({ value: name, label: name })),
  ];
  const current = options.find((o) => o.value === classroom);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted"
        >
          <BookOpen size={16} />
          {current?.label ?? "All Classrooms"}
          <ChevronDown size={16} />
        </button>

        {open && (
          <div className="absolute left-0 z-10 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onClassroomChange(option.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-sm text-card-foreground hover:bg-muted"
              >
                {option.label}
                {option.value === classroom && <Check size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-card-foreground">{shownCount}</span>{" "}
        of <span className="font-semibold text-card-foreground">{totalCount}</span>{" "}
        assignment groups
      </p>
    </div>
  );
}