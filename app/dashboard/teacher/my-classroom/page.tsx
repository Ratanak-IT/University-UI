"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ClassroomsGrid from "@/components/teacher/my-classroom/ClassroomsGrid";
import StatCards from "@/components/teacher/my-classroom/StatCards";
import WelcomeHeader from "@/components/teacher/WelcomeHeader";
import {
  fetchTeacherProfile,
  fetchTeacherClassrooms,
  fetchTeacherDashboardSummary,
  mapClassroomToTeacherCard,
  TeacherProfile,
} from "@/lib/api/teacher";
import { Classroom, StatItem } from "@/lib/types/dashboard";

export default function DashboardPage() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [statsList, setStatsList] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const profData = await fetchTeacherProfile();
      if (profData) setProfile(profData);

      // Only fetch the lightweight classroom list — enough to render cards.
      // Per-classroom detail (students, assignments, submissions) is fetched
      // on demand when the user opens a specific classroom. The aggregate
      // stats below come from one dedicated summary endpoint (COUNT queries
      // on the backend) instead of looping over every classroom's detail.
      const [classData, summary] = await Promise.all([
        fetchTeacherClassrooms(),
        fetchTeacherDashboardSummary(),
      ]);
      setClassrooms(classData.map((c, i) => mapClassroomToTeacherCard(c, i)));

      setStatsList([
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
      ]);

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" strokeWidth={2} />
      </div>
    );
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
