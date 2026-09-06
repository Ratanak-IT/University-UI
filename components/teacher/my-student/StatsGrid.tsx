
import { Users, CalendarCheck, Zap, GraduationCap } from "lucide-react";
import StatCard from "./StatCard";
import { StudentRosterItem } from "./StudentsPage";
import { StatCardData } from "@/lib/data/students";

function average(values: (number | null)[]): number | null {
  const present = values.filter((v): v is number => v !== null);
  if (present.length === 0) return null;
  return present.reduce((sum, v) => sum + v, 0) / present.length;
}

export default function StatsGrid({ students }: { students: StudentRosterItem[] }) {
  const total = students.length;
  const femaleCount = students.filter((s) => s.gender === "Female").length;
  const femalePercent = total > 0 ? Math.round((femaleCount / total) * 100) : 0;

  const avgAttendance = average(students.map((s) => s.attendancePercent));
  const avgPerformance = average(students.map((s) => s.performancePercent));

  const formatPercent = (v: number | null) => (v === null ? "—" : `${v.toFixed(1)}%`);

  const statCardsList: StatCardData[] = [
    {
      id: "total-students",
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      badge: "Active",
      badgeTone: "positive",
      label: "Total Students",
      value: total.toLocaleString(),
      helperText: "Matches the classroom/year/status filters",
    },
    {
      id: "gender-ratio",
      icon: GraduationCap,
      iconBg: "bg-violet-100 dark:bg-violet-950/40",
      iconColor: "text-indigo-700 dark:text-indigo-400",
      badge: `${femalePercent}% Female`,
      badgeTone: "neutral",
      label: "Gender Diversity",
      value: `${femaleCount} / ${total}`,
      helperText: "Female student count ratio",
    },
    {
      id: "avg-attendance",
      icon: CalendarCheck,
      iconBg: "bg-sky-100 dark:bg-sky-950/40",
      iconColor: "text-sky-600 dark:text-sky-400",
      badge: avgAttendance !== null ? "Live" : "No data",
      badgeTone: avgAttendance !== null ? "info" : "neutral",
      label: "Avg. Attendance",
      value: formatPercent(avgAttendance),
      helperText: "Across students in the current filter",
    },
    {
      id: "avg-performance",
      icon: Zap,
      iconBg: "bg-amber-100 dark:bg-amber-950/40",
      iconColor: "text-amber-500 dark:text-amber-400",
      badge: avgPerformance !== null ? "Live" : "No data",
      badgeTone: avgPerformance !== null ? "positive" : "neutral",
      label: "Average Performance",
      value: formatPercent(avgPerformance),
      helperText: "Average graded score in the current filter",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCardsList.map((stat) => (
        <StatCard key={stat.id} data={stat} />
      ))}
    </div>
  );
}
