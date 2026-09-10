/** "2 days overdue" / "Due today" / "Due in 3d" — the phrasing a teacher scans in a list. */
export function formatDue(diffDays: number): string {
  if (diffDays < 0) return diffDays === -1 ? "1 day overdue" : `${Math.abs(diffDays)} days overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays}d`;
}

/** Urgency badge color: overdue (rose) > due very soon (amber) > further out (sky). */
export function badgeClassFor(diffDays: number): string {
  if (diffDays < 0) return "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400";
  if (diffDays <= 1) return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
  return "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400";
}

/** Whole-day distance from now to a timestamp, rounded up (so "in 0.2 days" reads as due tomorrow, not today). */
export function daysUntil(ts: number, now: number): number {
  return Math.ceil((ts - now) / 86400000);
}
