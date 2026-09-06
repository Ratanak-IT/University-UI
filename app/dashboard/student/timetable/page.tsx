"use client";

import { useMemo } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useGetStudentProfileQuery, useGetStudentTimetableQuery } from "@/lib/redux/apiSlice";
import type { TimetableSlotResponse, Weekday } from "@/lib/api/student";

const DAY_ORDER: Weekday[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_LABEL: Record<Weekday, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};
// JS Date#getDay(): 0 = Sunday ... 6 = Saturday, so this maps that index
// straight onto DAY_ORDER for "is this column today".
const JS_DAY_TO_WEEKDAY: Weekday[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

// One color per classroom, cycling — a student tells classes apart by color
// at a glance rather than reading every card.
const COLORS = [
  { bar: "bg-indigo-600", chip: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" },
  { bar: "bg-amber-500", chip: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" },
  { bar: "bg-emerald-600", chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  { bar: "bg-rose-500", chip: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300" },
  { bar: "bg-sky-600", chip: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300" },
  { bar: "bg-violet-600", chip: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300" },
];

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

const TYPE_LABEL: Record<TimetableSlotResponse["type"], string> = {
  LECTURE: "Lecture",
  LAB: "Lab",
  TUTORIAL: "Tutorial",
  SEMINAR: "Seminar",
  EXAM: "Exam",
  OTHER: "Other",
};

export default function TimetablePage() {
  const { data: profile, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const studentId = profile?.studentId ?? "";
  const { data: slots = [], isLoading: loadingSlots } = useGetStudentTimetableQuery(studentId, {
    skip: !studentId,
  });

  const loading = loadingProfile || loadingSlots;
  const todayWeekday = JS_DAY_TO_WEEKDAY[new Date().getDay()];

  // A color per classroom, assigned in the order classrooms first appear —
  // stable across renders since it's derived from the data, not random.
  const colorByClassroom = useMemo(() => {
    const map = new Map<string, (typeof COLORS)[number]>();
    let i = 0;
    for (const s of slots) {
      if (!map.has(s.classroomId)) {
        map.set(s.classroomId, COLORS[i % COLORS.length]);
        i++;
      }
    }
    return map;
  }, [slots]);

  // Only show days that actually have a class — Sunday almost never does,
  // and hiding an all-empty column keeps the grid from wasting space.
  const days = useMemo(() => {
    const present = new Set(slots.map((s) => s.dayOfWeek));
    const base = DAY_ORDER.filter((d) => d !== "SUNDAY" || present.has("SUNDAY"));
    return base;
  }, [slots]);

  const byDay = useMemo(() => {
    const map = new Map<Weekday, TimetableSlotResponse[]>();
    for (const day of days) map.set(day, []);
    for (const s of slots) {
      if (!map.has(s.dayOfWeek)) continue;
      map.get(s.dayOfWeek)!.push(s);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [slots, days]);

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Calendar className="h-4 w-4" />
            My Schedule
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Timetable
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Your weekly class schedule across every course you&apos;re enrolled in.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, d) => (
            <div key={d} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 h-3 w-16 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, s) => (
                  <div key={s} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                    <div className="h-1 w-full bg-slate-200/80 dark:bg-slate-800/80" />
                    <div className="space-y-1.5 p-2.5">
                      <div className="h-3 w-16 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
                      <div className="h-4 w-24 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
                      <div className="h-3 w-20 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
          <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-700" />
          <p className="font-semibold text-slate-700 dark:text-slate-200">No timetable set yet</p>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Once your classes have a weekly schedule set up, it will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {days.map((day) => {
            const isToday = day === todayWeekday;
            const dayList = byDay.get(day) ?? [];
            return (
              <div
                key={day}
                className={`rounded-2xl border p-4 ${
                  isToday
                    ? "border-indigo-300 bg-indigo-50/40 dark:border-indigo-800 dark:bg-indigo-950/20"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p
                    className={`text-xs font-extrabold uppercase tracking-wider ${
                      isToday ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {DAY_LABEL[day]}
                  </p>
                  {isToday && (
                    <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      Today
                    </span>
                  )}
                </div>

                {dayList.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">No classes</p>
                ) : (
                  <div className="space-y-2">
                    {dayList.map((s) => {
                      const color = colorByClassroom.get(s.classroomId) ?? COLORS[0];
                      return (
                        <div
                          key={s.scheduleId}
                          className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30"
                        >
                          <div className={`h-1 w-full ${color.bar}`} />
                          <div className="p-2.5">
                            <p className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              <Clock className="h-3 w-3" />
                              {formatTime(s.startTime)}
                              {s.endTime && ` – ${formatTime(s.endTime)}`}
                            </p>
                            <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-slate-100" title={s.subjectName ?? s.className}>
                              {s.subjectName ?? s.className}
                            </p>
                            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                              {s.className} {s.teacherName ? `· ${s.teacherName}` : ""}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${color.chip}`}>
                                {TYPE_LABEL[s.type]}
                              </span>
                              {s.room && (
                                <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                                  <MapPin className="h-3 w-3" />
                                  {s.room}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
