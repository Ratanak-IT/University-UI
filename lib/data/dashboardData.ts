import { Users, BookMarked, Folder } from "lucide-react";
import {
  StatCard,
  EngagementPoint,
  ContentLibrarySlice,
  Classroom,
  Deadline,
} from "../types/dashboard";

export const statCards: StatCard[] = [
  {
    label: "Total Enrolled",
    value: "1,248",
    icon: Users,
    iconBg: "bg-violet-100",
    iconColor: "text-indigo-700",
    badge: "+12%",
  },
  {
    label: "Active Classes",
    value: "6",
    icon: BookMarked,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
    badge: null,
  },
  {
    label: "Course Materials",
    value: "42",
    icon: Folder,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-900",
    badge: null,
  },
];

export const engagementData: EngagementPoint[] = [
  { day: "1", value: 20 },
  { day: "5", value: 35 },
  { day: "10", value: 48 },
  { day: "13", value: 46 },
  { day: "16", value: 62 },
  { day: "19", value: 58 },
  { day: "22", value: 44 },
  { day: "25", value: 52 },
  { day: "28", value: 70 },
  { day: "30", value: 66 },
];

export const contentLibraryData: ContentLibrarySlice[] = [
  { name: "Video Courses", value: 70, color: "#1e2a5e" },
  { name: "Uploaded Books", value: 30, color: "#c7d2fe" },
];

export const classrooms: Classroom[] = [
  {
    title: "Web Development",
    code: "CS-WD201",
    track: "Frontend",
    initials: "WD",
    students: 32,
    year: "Year 4 · Sem 2",
    room: "Room 204",
    classCode: "wd-7x2k",
    toGrade: 3,
    headerClass: "bg-indigo-700",
    initialsTextClass: "text-indigo-700",
    badgeClass: "bg-violet-100 text-violet-700",
  },
  {
    title: "Database Systems",
    code: "CS-DB301",
    track: "SQL & Design",
    initials: "DB",
    students: 28,
    year: "Year 3 · Sem 2",
    room: "Room 110",
    classCode: "db-3k9p",
    toGrade: 1,
    headerClass: "bg-amber-500",
    initialsTextClass: "text-amber-600",
    badgeClass: "bg-sky-100 text-sky-700",
  },
  {
    title: "UI/UX Design",
    code: "CS-UX202",
    track: "Figma",
    initials: "UX",
    students: 30,
    year: "Year 2 · Sem 2",
    room: "Room 208",
    classCode: "ux-7m2q",
    toGrade: 2,
    headerClass: "bg-emerald-600",
    initialsTextClass: "text-emerald-700",
    badgeClass: "bg-orange-100 text-orange-700",
  },
  {
    title: "UI/UX Design",
    code: "CS-UX202",
    track: "Figma",
    initials: "UX",
    students: 30,
    year: "Year 2 · Sem 2",
    room: "Room 208",
    classCode: "ux-7m2q",
    toGrade: 2,
    headerClass: "bg-emerald-600",
    initialsTextClass: "text-emerald-700",
    badgeClass: "bg-orange-100 text-orange-700",
  },
];

export const deadlines: Deadline[] = [
  { id: "mock-1", title: "Mid-term Project", classCode: "CS101-A", due: "OCT 24", badgeClass: "bg-rose-100 text-rose-600" },
  { id: "mock-2", title: "Final Portfolio", classCode: "UXD202-B", due: "NOV 12", badgeClass: "bg-slate-100 text-slate-600" },
  { id: "mock-3", title: "Weekly Quiz 08", classCode: "DSTR301", due: "TOMORROW", badgeClass: "bg-sky-100 text-sky-700" },
];

