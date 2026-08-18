"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Check } from "lucide-react";
import GradStatusBadge from "./GradStatusBadge";
import Pagination from "./Pagination";
import { StudentRosterItem } from "./StudentsPage";

const PAGE_SIZE = 5;

const columns = [
  "Student",
  "ID Code",
  "Class Name",
  "Year",
  "Gender",
  "Enrollment Date",
  "Grad Status",
];

type FilterOption = { label: string; value: string };

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? label;
  const isActive = value !== "all";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
          isActive
            ? "border-primary bg-primary/10 text-primary"
            : "border-border bg-card text-foreground hover:bg-muted"
        }`}
      >
        {selectedLabel}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 z-10 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
            >
              {opt.label}
              {value === opt.value && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RosterTable({
  students,
  classroomNames,
}: {
  students: StudentRosterItem[];
  classroomNames: string[];
}) {
  const [page, setPage] = useState(1);
  const [classroomFilter, setClassroomFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const classroomOptions = useMemo<FilterOption[]>(() => {
    return [
      { label: "All Classrooms", value: "all" },
      ...classroomNames.map((c) => ({ label: c, value: c })),
    ];
  }, [classroomNames]);

  const yearOptions = useMemo<FilterOption[]>(() => {
    const unique = Array.from(new Set(students.map((s) => s.year))).sort();
    return [
      { label: "Year Level", value: "all" },
      ...unique.map((y) => ({ label: String(y), value: String(y) })),
    ];
  }, [students]);

  const statusOptions = useMemo<FilterOption[]>(() => {
    const unique = Array.from(new Set(students.map((s) => s.gradStatus)));
    return [
      { label: "Status", value: "all" },
      ...unique.map((s) => ({ label: s, value: s })),
    ];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (classroomFilter !== "all" && s.className !== classroomFilter) return false;
      if (yearFilter !== "all" && String(s.year) !== yearFilter) return false;
      if (statusFilter !== "all" && s.gradStatus !== statusFilter) return false;
      return true;
    });
  }, [students, classroomFilter, yearFilter, statusFilter]);

  const totalStudents = filteredStudents.length;
  const totalPages = Math.max(1, Math.ceil(totalStudents / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const visibleStudents = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, safePage]);

  const rangeStart = totalStudents === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, totalStudents);

  const hasActiveFilters =
    classroomFilter !== "all" || yearFilter !== "all" || statusFilter !== "all";

  function handleFilterChange(setter: (v: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  function clearFilters() {
    setClassroomFilter("all");
    setYearFilter("all");
    setStatusFilter("all");
    setPage(1);
  }

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-foreground">Active Roster</h2>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="All Classrooms"
            options={classroomOptions}
            value={classroomFilter}
            onChange={(v) => handleFilterChange(setClassroomFilter, v)}
          />
          <FilterSelect
            label="Year Level"
            options={yearOptions}
            value={yearFilter}
            onChange={(v) => handleFilterChange(setYearFilter, v)}
          />
          <FilterSelect
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(v) => handleFilterChange(setStatusFilter, v)}
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-muted/60">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-sm text-muted-foreground"
                >
                  No students match the selected filters.
                </td>
              </tr>
            ) : (
              visibleStudents.map((student) => (
                <tr key={student.id} className="border-t border-border">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {student.avatarUrl ? (
                        <Image
                          src={student.avatarUrl}
                          alt={student.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white text-sm">
                          {student.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {student.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground">{student.idCode}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{student.className}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{student.year}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{student.gender}</td>
                  <td className="px-5 py-4 text-sm text-foreground">
                    {student.enrollmentDate}
                  </td>
                  <td className="px-5 py-4">
                    <GradStatusBadge status={student.gradStatus} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {totalStudents === 0
            ? "No students found"
            : `Showing ${rangeStart}–${rangeEnd} of ${totalStudents} students`}
        </p>
        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}