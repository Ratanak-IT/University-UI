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
  id?: string;
  title: string;
  code: string;
  track: string;
  initials: string;
  /** Undefined when only list data was fetched — fetching the real count costs a per-classroom round trip. */
  students?: number;
  year: string;
  room: string;
  classCode: string;
  toGrade?: number;
  headerClass: string;
  initialsTextClass: string;
  badgeClass: string;
};

export type Deadline = {
  /** The assignment's own id — titles are not unique across classes. */
  id: string;
  title: string;
  classCode: string;
  due: string;
  badgeClass: string;
};

export type AttendanceRow = {
  name: string;
  id: string;
  classroom: string;
  date: string;
  status: string;
  statusClass: string;
  note: string;
};