import type { AttendanceStatus, SessionStatus } from "@/lib/types/attendance";

/**
 * The four marks, in the order a teacher scans them: the common case first,
 * the exception last. Single letters keep the control narrow enough to sit on
 * one row of a phone.
 */
export const MARKS: {
  value: AttendanceStatus;
  short: string;
  label: string;
  active: string;
}[] = [
  {
    value: "PRESENT",
    short: "P",
    label: "Present",
    active: "bg-emerald-600 text-white",
  },
  {
    value: "LATE",
    short: "L",
    label: "Late",
    active: "bg-amber-500 text-white",
  },
  {
    value: "ABSENT",
    short: "A",
    label: "Absent",
    active: "bg-rose-600 text-white",
  },
  {
    value: "EXCUSED",
    short: "E",
    label: "Excused",
    active: "bg-sky-600 text-white",
  },
];

export function markLabel(status: AttendanceStatus | null): string {
  return MARKS.find((m) => m.value === status)?.label ?? "Not marked";
}

export function markTextClass(status: AttendanceStatus | null): string {
  switch (status) {
    case "PRESENT":
      return "text-emerald-600 dark:text-emerald-400";
    case "LATE":
      return "text-amber-600 dark:text-amber-400";
    case "ABSENT":
      return "text-rose-600 dark:text-rose-400";
    case "EXCUSED":
      return "text-sky-600 dark:text-sky-400";
    default:
      return "text-slate-400 dark:text-slate-500";
  }
}

export const SESSION_STATUS_CLASS: Record<SessionStatus, string> = {
  SCHEDULED:
    "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  HELD: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400",
  CANCELLED:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-400",
};

export const SESSION_STATUS_LABEL: Record<SessionStatus, string> = {
  SCHEDULED: "Not taken",
  HELD: "Taken",
  CANCELLED: "Cancelled",
};

/** "08:00:00" reads better as "08:00" once seconds are dropped. */
export function shortTime(time: string | null): string {
  if (!time) return "";
  return time.slice(0, 5);
}

export function formatSessionDate(date: string): string {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Attendance banding, so a struggling student is visible at a glance. */
export function attendanceToneClass(percent: number | null): string {
  if (percent === null) return "text-slate-400 dark:text-slate-500";
  if (percent >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (percent >= 80) return "text-slate-900 dark:text-slate-100";
  if (percent >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

/** The user's own timezone, not UTC — `toISOString()` alone shifts the date. */
export function localToday(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}
