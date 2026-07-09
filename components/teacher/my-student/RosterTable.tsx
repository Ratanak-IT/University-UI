"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { students as allStudents } from "../../../lib/data/students";
import GradStatusBadge from "./GradStatusBadge";
import Pagination from "./Pagination";

const PAGE_SIZE = 5;
const TOTAL_STUDENTS = 256; // total across the whole system, independent of the demo rows below

const columns = [
  "Student",
  "ID Code",
  "Class Name",
  "Year",
  "Gender",
  "Enrollment Date",
  "Grad Status",
];

function FilterSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
    >
      {label}
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

export default function RosterTable() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(TOTAL_STUDENTS / PAGE_SIZE);

  // The demo dataset only has a handful of real rows, so we cycle through it
  // to simulate pagination across the full roster.
  const visibleStudents = useMemo(() => {
    return Array.from({ length: PAGE_SIZE }, (_, i) => {
      const source = allStudents[(page - 1 + i) % allStudents.length];
      return { ...source, id: `${source.id}-${page}-${i}` };
    });
  }, [page]);

  const rangeStart = (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, TOTAL_STUDENTS);

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-foreground">Active Roster</h2>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect label="All Classrooms" />
          <FilterSelect label="Year Level" />
          <FilterSelect label="Status" />
          <button
            type="button"
            onClick={() => setPage(1)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear Filters
          </button>
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
            {visibleStudents.map((student) => (
              <tr key={student.id} className="border-t border-border">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={student.avatarUrl}
                      alt={student.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {student.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-foreground">{student.idCode}</td>
                <td className="px-5 py-4 text-sm text-foreground">{student.className}</td>
                <td className="px-5 py-4 text-sm text-foreground">{student.year}</td>
                <td className="px-5 py-4 text-sm text-foreground">{student.gender}</td>
                <td className="px-5 py-4 text-sm text-foreground">{student.enrollmentDate}</td>
                <td className="px-5 py-4">
                  <GradStatusBadge status={student.gradStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {rangeStart}–{rangeEnd} of {TOTAL_STUDENTS} students
        </p>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}