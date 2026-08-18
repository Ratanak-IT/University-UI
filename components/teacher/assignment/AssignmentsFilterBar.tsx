"use client";

import { BookOpen } from "lucide-react";
import { ClassroomFilter } from "@/lib/types/AssignmentGroup";
import ModernSelect from "@/components/shared/ModernSelect";

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
  const options = [
    { value: "all", label: "All Classrooms" },
    ...classroomOptions.map((name) => ({ value: name, label: name })),
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="w-56">
        <ModernSelect
          options={options}
          value={classroom}
          onChange={(val) => onClassroomChange(val)}
          icon={BookOpen}
        />
      </div>

      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Showing <span className="font-bold text-slate-900 dark:text-slate-100">{shownCount}</span> of{" "}
        <span className="font-bold text-slate-900 dark:text-slate-100">{totalCount}</span> assignment groups
      </p>
    </div>
  );
}