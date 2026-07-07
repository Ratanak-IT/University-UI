"use client";

import ClassroomsGrid from "@/components/teacher/my-classroom/ClassroomsGrid";
import StatCards from "@/components/teacher/my-classroom/StatCards";

import WelcomeHeader from "@/components/teacher/WelcomeHeader";
import { classrooms } from "@/lib/data/dashboardData";
import { stats } from "@/lib/data/teacherDashboardData";



export default function DashboardPage() {
  return (
    <div className="px-8 py-8">
      <WelcomeHeader
        teacherName="Mr. Davin"
        academicYear="2024–2025"
        semester="Semester 2"
        activeClassrooms={6}
        onNewClassroom={() => {
          // handle new classroom creation
        }}
      />

      <StatCards stats={stats} />

      <ClassroomsGrid classrooms={classrooms} />
    </div>
  );
}