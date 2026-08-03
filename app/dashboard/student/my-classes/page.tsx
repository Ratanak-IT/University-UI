"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, MapPin, Loader2 } from "lucide-react";
import {
  fetchMyClassrooms,
  fetchClassroomStudents,
  ClassroomResponse,
} from "@/lib/api/student";

const HEADER_COLORS = [
  "bg-indigo-700",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-600",
  "bg-sky-600",
  "bg-violet-600",
];

interface ClassCard {
  id: string;
  title: string;
  code: string;
  track: string;
  initials: string;
  teacher: string;
  students: number;
  room: string;
  header: string;
}

function mapClassroom(c: ClassroomResponse, idx: number, studentCount: number): ClassCard {
  const initials = c.className
    ? c.className.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()
    : "CS";
  return {
    id: c.classroomId,
    title: c.className,
    code: c.classCode,
    track: c.subjectName ?? "",
    initials,
    teacher: c.teacherName ?? "—",
    students: studentCount,
    room: c.room ? `Room ${c.room}` : "—",
    header: HEADER_COLORS[idx % HEADER_COLORS.length],
  };
}

export default function MyClassesPage() {
  const [classes, setClasses] = useState<ClassCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const classrooms = await fetchMyClassrooms();

      if (classrooms && classrooms.length > 0) {
        const counts = await Promise.all(
          classrooms.map(async (c) => {
            const students = await fetchClassroomStudents(c.classroomId);
            return students ? students.length : 0;
          })
        );
        setClasses(classrooms.map((c, i) => mapClassroom(c, i, counts[i])));
      } else {
        setClasses([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">My Classes</h2>
        <p className="mt-1 text-sm text-slate-500">
          {loading ? "Loading..." : `${classes.length} course${classes.length !== 1 ? "s" : ""} enrolled this semester.`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
          <span className="text-sm text-slate-500">Loading classrooms...</span>
        </div>
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <p className="text-lg font-semibold text-slate-700">No classrooms found</p>
          <p className="text-sm text-slate-500">You are not enrolled in any classroom yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/student/my-classes/${c.id}`}
              className="block overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Colored header */}
              <div className={`relative px-5 py-4 text-white ${c.header}`}>
                <p className="pr-12 text-base font-bold leading-tight">{c.title}</p>
                <p className="mt-0.5 text-xs text-white/80">
                  {c.code} · {c.track}
                </p>
                <span className="absolute bottom-3 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  {c.initials}
                </span>
              </div>

              {/* Body */}
              <div className="space-y-2 px-5 py-4">
                <p className="text-sm font-medium text-indigo-950">{c.teacher}</p>
                <p className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" strokeWidth={2} />
                    {c.students} students
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" strokeWidth={2} />
                    {c.room}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
