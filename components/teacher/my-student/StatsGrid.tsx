
import { Users, CalendarCheck, Zap, GraduationCap } from "lucide-react";
import StatCard from "./StatCard";
import { StudentRosterItem } from "./StudentsPage";
import { StatCardData } from "@/lib/data/students";

export default function StatsGrid({ students }: { students: StudentRosterItem[] }) {
  const total = students.length;
  const femaleCount = students.filter((s) => s.gender === "Female").length;
  const femalePercent = total > 0 ? Math.round((femaleCount / total) * 100) : 0;

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
      helperText: "All assigned classrooms combined",
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
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      badge: "92%",
      badgeTone: "info",
      label: "Avg. Attendance",
      value: "92.4%",
      helperText: "Classrooms daily average",
    },
    {
      id: "recent-performance",
      icon: Zap,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      badge: "Stable",
      badgeTone: "positive",
      label: "Average Performance",
      value: "B+ (84%)",
      helperText: "Overall classroom average",
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