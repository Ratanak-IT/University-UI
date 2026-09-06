import type { LucideIcon } from "lucide-react";

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

