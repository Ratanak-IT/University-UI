"use client";

import { useMemo, useState } from "react";
import RosterTable from "./RosterTable";
import StatsGrid from "./StatsGrid";
import StudentsHeader from "./StudentsHeader";
import StudentsPageSkeleton from "./StudentsPageSkeleton";
import {
  useGetTeacherClassroomsQuery,
  useGetStudentsForClassroomsQuery,
  useGetTeacherStudentMetricsQuery,
} from "@/lib/redux/apiSlice";

export type StudentRosterItem = {
  id: string;
  name: string;
  email: string;
  idCode: string;
  className: string;
  year: string;
  gender: "Male" | "Female" | "Other";
  enrollmentDate: string;
  gradStatus: "In Progress" | "Completed" | "At Risk";
  avatarUrl: string;
  attendancePercent: number | null;
  performancePercent: number | null;
};

export default function StudentsPage() {
  const [classroomFilter, setClassroomFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: classData = [], isLoading: loadingClassrooms } = useGetTeacherClassroomsQuery();
  const { data: metrics = [], isLoading: loadingMetrics } = useGetTeacherStudentMetricsQuery();

  const classroomArgs = useMemo(
    () => classData.map((c) => ({ classroomId: c.classroomId, className: c.className || "Classroom" })),
    [classData]
  );
  const { data: rosterRows = [], isFetching: loadingRoster } = useGetStudentsForClassroomsQuery(
    classroomArgs,
    { skip: classroomArgs.length === 0 }
  );

  const loading = loadingClassrooms || loadingMetrics || (classroomArgs.length > 0 && loadingRoster);

  const classroomNames = useMemo(
    () => classData.map((c) => c.className || "Classroom"),
    [classData]
  );

  const students = useMemo<StudentRosterItem[]>(() => {
    const metricsByStudentId = new Map(metrics.map((m) => [m.studentId, m]));
    const seen = new Set<string>();
    const result: StudentRosterItem[] = [];
    for (const row of rosterRows) {
      const s = row.student;
      if (seen.has(s.studentId)) continue;
      seen.add(s.studentId);
      const m = metricsByStudentId.get(s.studentId);
      result.push({
        id: s.studentId,
        name: s.fullName || "Student",
        email: s.email || "",
        idCode: s.studentCode || "",
        className: row.className,
        year: s.yearLevel ? `Year ${s.yearLevel}` : "Year 1",
        gender: s.gender === "FEMALE" ? "Female" : "Male",
        enrollmentDate: s.joinedAt
          ? new Date(s.joinedAt).toLocaleDateString()
          : new Date().toLocaleDateString(),
        gradStatus: "In Progress", // Default status as backend doesn't have at-risk/grad-status mappings
        avatarUrl: s.avatarUrl || "",
        attendancePercent: m?.attendancePercent ?? null,
        performancePercent: m?.performancePercent ?? null,
      });
    }
    return result;
  }, [rosterRows, metrics]);

  const yearOptions = useMemo(() => {
    const unique = Array.from(new Set(students.map((s) => s.year))).sort();
    return [
      { label: "Year Level", value: "all" },
      ...unique.map((y) => ({ label: y, value: y })),
    ];
  }, [students]);

  const statusOptions = useMemo(() => {
    const unique = Array.from(new Set(students.map((s) => s.gradStatus)));
    return [
      { label: "Status", value: "all" },
      ...unique.map((s) => ({ label: s, value: s })),
    ];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (classroomFilter !== "all" && s.className !== classroomFilter) return false;
      if (yearFilter !== "all" && s.year !== yearFilter) return false;
      if (statusFilter !== "all" && s.gradStatus !== statusFilter) return false;
      return true;
    });
  }, [students, classroomFilter, yearFilter, statusFilter]);

  const clearFilters = () => {
    setClassroomFilter("all");
    setYearFilter("all");
    setStatusFilter("all");
  };

  if (loading) {
    return <StudentsPageSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <StudentsHeader />
      <StatsGrid students={filteredStudents} />
      <RosterTable
        students={filteredStudents}
        classroomNames={classroomNames}
        yearOptions={yearOptions}
        statusOptions={statusOptions}
        classroomFilter={classroomFilter}
        yearFilter={yearFilter}
        statusFilter={statusFilter}
        onClassroomFilterChange={setClassroomFilter}
        onYearFilterChange={setYearFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={clearFilters}
      />
    </div>
  );
}
