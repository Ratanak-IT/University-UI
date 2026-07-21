import { LucideIcon } from "lucide-react";

export type StatItem = {
  label: string;
  sublabel: string;
  value: string;
  dotClass: string;
  dotBgClass: string;
};

export type StatCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  badge: string | null;
};

export type EngagementPoint = { day: string; value: number };

export type ContentLibrarySlice = { name: string; value: number; color: string };

export type Classroom = {
  title: string;
  code: string;
  track: string;
  initials: string;
  students: number;
  year: string;
  room: string;
  classCode: string;
  toGrade: number;
  headerClass: string;
  initialsTextClass: string;
  badgeClass: string;
};

export type Deadline = {
  title: string;
  classCode: string;
  due: string;
  badgeClass: string;
};

export type AttendanceRow = {
  name: string;
  id: string;
  avatar: string;
  classroom: string;
  date: string;
  status: string;
  statusClass: string;
  score: string;
  note: string;
};