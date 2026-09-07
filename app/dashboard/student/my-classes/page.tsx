"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ClassroomResponse } from "@/lib/api/student";
import { useGetMyClassroomsQuery, useGetStudentsForClassroomsQuery } from "@/lib/redux/apiSlice";
import { CardGridSkeleton } from "@/components/shared/Skeletons";

// Same four header/text/badge triples the teacher classroom card cycles
// through, so a student's card is the same design, not a lookalike.
const COLORS = [
  { header: "bg-indigo-700", text: "text-indigo-700", badge: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300" },
  { header: "bg-amber-500", text: "text-amber-600", badge: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300" },
  { header: "bg-rose-500", text: "text-rose-600", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" },
  { header: "bg-emerald-600", text: "text-emerald-700", badge: "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300" },
];

interface ClassCard {
  id: string;
  title: string;
  code: string;
  track: string;
  initials: string;
  teacher: string;
  students: number;
  year: string;
  room: string;
  headerClass: string;
  initialsTextClass: string;
  badgeClass: string;
}

function mapClassroom(c: ClassroomResponse, idx: number, studentCount: number): ClassCard {
  const color = COLORS[idx % COLORS.length];

  const initials = c.className
    ? c.className.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()
    : "CS";

  const year = c.yearLevel && c.semester
    ? `Year ${c.yearLevel} · Sem ${c.semester}`
    : c.academicYear ?? "—";

  return {
    id: c.classroomId,
    title: c.className,
    code: c.classCode,
    track: c.subjectName ?? "",
    initials,
    teacher: c.teacherName ?? "—",
    students: studentCount,
    year,
    room: c.room ? `Room ${c.room}` : "—",
    headerClass: color.header,
    initialsTextClass: color.text,
    badgeClass: color.badge,
  };
}

export default function MyClassesPage() {
  const { data: classrooms = [], isLoading: loadingClassrooms } = useGetMyClassroomsQuery();

  const classroomArgs = useMemo(
    () => classrooms.map((c) => ({ classroomId: c.classroomId, className: c.className })),
    [classrooms]
  );
  const { data: rosterRows = [], isFetching: loadingRoster } = useGetStudentsForClassroomsQuery(
    classroomArgs,
    { skip: classroomArgs.length === 0 }
  );

  const loading = loadingClassrooms || (classroomArgs.length > 0 && loadingRoster);

  const classes = useMemo<ClassCard[]>(() => {
    const countByClassroomId = new Map<string, number>();
    for (const row of rosterRows) {
      countByClassroomId.set(row.classroomId, (countByClassroomId.get(row.classroomId) ?? 0) + 1);
    }
    return classrooms.map((c, i) => mapClassroom(c, i, countByClassroomId.get(c.classroomId) ?? 0));
  }, [classrooms, rosterRows]);

  return (
    <div className="space-y-6 p-8 transition-colors">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950 dark:text-slate-100">My Classes</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {loading ? "Loading..." : `${classes.length} course${classes.length !== 1 ? "s" : ""} enrolled this semester.`}
        </p>
      </div>

      {loading ? (
        <CardGridSkeleton count={6} />
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">No classrooms found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">You are not enrolled in any classroom yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/student/my-classes/${c.id}`}
              className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Colored header */}
              <div className={`relative px-5 py-5 ${c.headerClass}`}>
                <h3 className="text-lg font-bold text-white">{c.title}</h3>
                <p className="mt-0.5 text-sm text-white/80">
                  {c.track}
                </p>
                <span
                  className={`absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-bold ${c.initialsTextClass}`}
                >
                  {c.initials}
                </span>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <p className="text-sm text-card-foreground">
                  {c.teacher} · {c.year}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.room}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${c.badgeClass}`}>
                    {c.students} students
                  </span>
                  <span className="text-sm font-semibold text-primary group-hover:underline">
                    Open
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
