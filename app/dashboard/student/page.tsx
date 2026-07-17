import type { Metadata } from "next";
import StudentDashboard from "@/components/student/StudentDashboard";

export const metadata: Metadata = { title: "Student Dashboard" };

export default function StudentDashboardPage() {
  return <StudentDashboard />;
}
