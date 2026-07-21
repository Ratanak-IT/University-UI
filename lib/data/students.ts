import type { LucideIcon } from "lucide-react";
import { Users, CalendarCheck, Zap, GraduationCap } from "lucide-react";

export type Student = {
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
};

export type StatCardData = {
  id: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeTone: "positive" | "neutral" | "info";
  label: string;
  value: string;
  helperText: string;
};

export const statCards: StatCardData[] = [
  {
    id: "total-students",
    icon: Users,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    badge: "+4.2%",
    badgeTone: "positive",
    label: "Total Students",
    value: "12,856",
    helperText: "12 new this week",
  },
  {
    id: "avg-attendance",
    icon: CalendarCheck,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    badge: "94%",
    badgeTone: "info",
    label: "Avg. Attendance",
    value: "92.4%",
    helperText: "Daily average this month",
  },
  {
    id: "recent-performance",
    icon: Zap,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    badge: "+0.8%",
    badgeTone: "positive",
    label: "Recent Performance",
    value: "B+ (84%)",
    helperText: "Trending up from B",
  },
  {
    id: "graduation-readiness",
    icon: GraduationCap,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    badge: "Final Year",
    badgeTone: "neutral",
    label: "Graduation Readiness",
    value: "88%",
    helperText: "Students meeting all criteria",
  },
];

export const students: Student[] = [
  {
    id: "1",
    name: "Sovann Keo",
    email: "sovann.keo@student.edu",
    idCode: "STD-2024-001",
    className: "Web Development A",
    year: "Year 3",
    gender: "Male",
    enrollmentDate: "Sep 12, 2021",
    gradStatus: "In Progress",
    avatarUrl: "https://i.pravatar.cc/64?img=12",
  },
  {
    id: "2",
    name: "Sokha Chan",
    email: "sokha.chan@student.edu",
    idCode: "STD-2024-002",
    className: "Web Development A",
    year: "Year 3",
    gender: "Female",
    enrollmentDate: "Sep 12, 2021",
    gradStatus: "In Progress",
    avatarUrl: "https://i.pravatar.cc/64?img=32",
  },
  {
    id: "3",
    name: "Dara Pich",
    email: "dara.pich@student.edu",
    idCode: "STD-2024-003",
    className: "Mobile App Design",
    year: "Year 2",
    gender: "Male",
    enrollmentDate: "Sep 12, 2021",
    gradStatus: "Completed",
    avatarUrl: "https://i.pravatar.cc/64?img=15",
  },
  {
    id: "4",
    name: "Ratana Sok",
    email: "ratana.sok@student.edu",
    idCode: "STD-2024-004",
    className: "Data Structures",
    year: "Year 3",
    gender: "Female",
    enrollmentDate: "Sep 12, 2021",
    gradStatus: "At Risk",
    avatarUrl: "https://i.pravatar.cc/64?img=45",
  },
  {
    id: "5",
    name: "Vichet Long",
    email: "vichet.long@student.edu",
    idCode: "STD-2024-005",
    className: "Web Development A",
    year: "Year 3",
    gender: "Male",
    enrollmentDate: "Sep 12, 2021",
    gradStatus: "In Progress",
    avatarUrl: "https://i.pravatar.cc/64?img=51",
  },
];