"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import {
  fetchMyClassrooms,
  fetchMyProfile,
  fetchClassroomStudents,
  ClassroomResponse,
  StudentProfile,
} from "@/lib/api/student";

type CourseColor = "indigo" | "amber" | "rose" | "emerald";

interface CourseCard {
  id: string;
  name: string;
  code: string;
  initials: string;
  studentCount: number;
  year: string;
  meta: string;
  color: CourseColor;
}

const COLORS: CourseColor[] = ["indigo", "amber", "rose", "emerald"];

const COLOR_HEADER: Record<CourseColor, string> = {
  indigo: "bg-indigo-600",
  amber: "bg-amber-500",
  rose: "bg-rose-600",
  emerald: "bg-emerald-600",
};

function mapClassroom(c: ClassroomResponse, idx: number, studentCount: number): CourseCard {
  const color = COLORS[idx % COLORS.length];
  const initials = c.className
    ? c.className.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()
    : "CS";
  const year =
    c.yearLevel && c.semester
      ? `Year ${c.yearLevel} · Sem ${c.semester}`
      : c.academicYear ?? "";
  const room = c.room ?? "";
  const code = c.inviteCode ?? c.classCode;

  return {
    id: c.classroomId,
    name: c.className,
    code: `${c.classCode} · ${c.subjectName ?? ""}`,
    initials,
    studentCount,
    year,
    meta: `${room ? "Room " + room : ""} ${code ? "· Code " + code : ""}`.trim(),
    color,
  };
}

function CourseCardComponent({ c }: { c: CourseCard }) {
  return (
    <Link
      href={`/dashboard/student/my-classes/${c.id}`}
      className={`block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className={`relative ${COLOR_HEADER[c.color]} px-4 pb-8 pt-4 text-white`}>
        <p className="text-sm font-semibold">{c.name}</p>
        <p className="mt-0.5 text-xs text-white/80">{c.code}</p>
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
          {c.initials}
        </div>
      </div>
      <div className="px-4 pb-4 pt-3">
        <p className="text-sm font-medium text-slate-900">
          {c.studentCount} students <span className="text-slate-500">· {c.year}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">{c.meta}</p>
        <div className="mt-3 flex items-center justify-end">
          <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Open
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function StudentDashboard() {
  const [view, setView] = useState("card");
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const [profileData, classrooms] = await Promise.all([
        fetchMyProfile(),
        fetchMyClassrooms(),
      ]);

      if (profileData) setProfile(profileData);

      if (classrooms && classrooms.length > 0) {
        // Fetch student counts in parallel for each classroom
        const counts = await Promise.all(
          classrooms.map(async (c) => {
            const students = await fetchClassroomStudents(c.classroomId);
            return students ? students.length : 0;
          })
        );

        setCourses(
          classrooms.map((c, i) => mapClassroom(c, i, counts[i]))
        );
      } else {
        setCourses([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const selectClass = "border-slate-200 bg-white text-slate-700";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {/* Welcome header */}
          {profile && (
            <div className="mb-6">
              <h1 className="text-xl font-bold text-slate-900">
                Welcome back, {profile.firstName} 👋
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {profile.studentCode} · {profile.academicYear} · Year {profile.yearLevel} Sem {profile.semester}
              </p>
            </div>
          )}

          <h2 className="text-lg font-semibold sm:text-xl text-slate-900">Course Overview</h2>

          {/* Filter bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {courses.length} classroom{courses.length !== 1 ? "s" : ""} enrolled
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className={`flex overflow-hidden rounded-md border ${selectClass}`}>
                <button
                  onClick={() => setView("card")}
                  aria-label="Card view"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm ${
                    view === "card" ? "bg-slate-100" : ""
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" /> Card
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={`flex items-center gap-1.5 border-l border-slate-200 px-3 py-1.5 text-sm ${
                    view === "list" ? "bg-slate-100" : ""
                  }`}
                >
                  <List className="h-4 w-4" /> List
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="mt-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="text-sm text-slate-500">Loading your classrooms...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-2 text-center">
              <p className="text-lg font-semibold text-slate-700">No classrooms found</p>
              <p className="text-sm text-slate-500">
                You are not enrolled in any classroom yet.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((c) => (
                <CourseCardComponent key={c.id} c={c} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
