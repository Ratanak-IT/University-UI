"use client";

import { useMemo } from "react";
import ClassroomsGrid from "@/components/teacher/my-classroom/ClassroomsGrid";
import StatCards from "@/components/teacher/my-classroom/StatCards";
import MyClassroomSkeleton from "@/components/teacher/my-classroom/MyClassroomSkeleton";
import WelcomeHeader from "@/components/teacher/WelcomeHeader";
import { mapClassroomToTeacherCard } from "@/lib/api/teacher";
import {
  useGetTeacherProfileQuery,
  useGetTeacherClassroomsQuery,
  useGetTeacherDashboardSummaryQuery,
} from "@/lib/redux/apiSlice";
import { StatItem } from "@/lib/types/dashboard";

export default function DashboardPage() {
  const { data: profile, isLoading: loadingProfile } = useGetTeacherProfileQuery();
  // Only fetch the lightweight classroom list — enough to render cards.
  // Per-classroom detail (students, assignments, submissions) is fetched
  // on demand when the user opens a specific classroom. The aggregate
  // stats below come from one dedicated summary endpoint (COUNT queries
  // on the backend) instead of looping over every classroom's detail.
  const { data: classData = [], isLoading: loadingClassrooms } = useGetTeacherClassroomsQuery();
  const { data: summary, isLoading: loadingSummary } = useGetTeacherDashboardSummaryQuery();

  const loading = loadingProfile || loadingClassrooms || loadingSummary;

  const classrooms = useMemo(
    () => classData.map((c, i) => mapClassroomToTeacherCard(c, i)),
    [classData]
  );

  const statsList = useMemo<StatItem[]>(
    () => [
      {
        label: "Classrooms",
        sublabel: "classrooms · active",
        value: (summary?.activeClasses ?? classData.length).toString(),
        dotClass: "bg-indigo-600",
        dotBgClass: "bg-indigo-50",
      },
      {
        label: "Students",
        sublabel: "classroom_students",
        value: (summary?.totalStudents ?? 0).toString(),
        dotClass: "bg-sky-500",
        dotBgClass: "bg-sky-50",
      },
      {
        label: "To grade",
        sublabel: "submissions · pending",
        value: (summary?.toGrade ?? 0).toString(),
        dotClass: "bg-orange-500",
        dotBgClass: "bg-orange-50",
      },
      {
        label: "Attendance to take",
        sublabel: "today · attendance",
        value: (summary?.attendanceToday ?? 0).toString(),
        dotClass: "bg-emerald-500",
        dotBgClass: "bg-emerald-50",
      },
    ],
    [summary, classData.length]
  );

  if (loading) {
    return <MyClassroomSkeleton />;
  }

  const teacherName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "Teacher";

  return (
    <div className="px-8 py-8">
      <WelcomeHeader
        teacherName={teacherName}
        academicYear={classrooms[0]?.year.split(" · ")[2] || "2024–2025"}
        semester={classrooms[0]?.year.split(" · ")[1] || "Semester 2"}
        activeClassrooms={classrooms.length}
        onNewClassroom={() => {
          // handle new classroom creation
        }}
      />

      <StatCards stats={statsList} />

      <ClassroomsGrid classrooms={classrooms} />
    </div>
  );
}
