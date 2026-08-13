"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ClassroomsGrid from "@/components/teacher/my-classroom/ClassroomsGrid";
import StatCards from "@/components/teacher/my-classroom/StatCards";
import WelcomeHeader from "@/components/teacher/WelcomeHeader";
import {
  fetchTeacherProfile,
  fetchTeacherClassrooms,
  fetchClassroomStudents,
  fetchClassroomAssignments,
  fetchAssignmentSubmissions,
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

      const classData = await fetchTeacherClassrooms();
      if (classData && classData.length > 0) {
        let totalEnrolled = 0;
        let pendingGradesCount = 0;

        const populatedClassrooms = await Promise.all(
          classData.map(async (c, i) => {
            const [students, assignments] = await Promise.all([
              fetchClassroomStudents(c.classroomId),
              fetchClassroomAssignments(c.classroomId),
            ]);

            // Count pending grading submissions
            let classroomPendingCount = 0;
            if (assignments && assignments.length > 0) {
              await Promise.all(
                assignments.map(async (asgn) => {
                  const submissions = await fetchAssignmentSubmissions(asgn.assignmentId);
                  const pending = submissions.filter(
                    (sub) => !sub.score && sub.score !== 0
                  ).length;
                  classroomPendingCount += pending;
                })
              );
            }

            totalEnrolled += students.length;
            pendingGradesCount += classroomPendingCount;

            const mapped = mapClassroomToTeacherCard(c, i);
            mapped.students = students.length;
            mapped.toGrade = classroomPendingCount;
            return mapped;
          })
        );

        setClassrooms(populatedClassrooms);

        // Dynamic stats
        setStatsList([
          {
            label: "Classrooms",
            sublabel: "classrooms · active",
            value: classData.length.toString(),
            dotClass: "bg-indigo-600",
            dotBgClass: "bg-indigo-50",
          },
          {
            label: "Students",
            sublabel: "classroom_students",
            value: totalEnrolled.toString(),
            dotClass: "bg-sky-500",
            dotBgClass: "bg-sky-50",
          },
          {
            label: "To grade",
            sublabel: "submissions · pending",
            value: pendingGradesCount.toString(),
            dotClass: "bg-orange-500",
            dotBgClass: "bg-orange-50",
          },
          {
            label: "Attendance to take",
            sublabel: "today · attendance",
            value: "0", // placeholder since there is no attendance creation API yet
            dotClass: "bg-emerald-500",
            dotBgClass: "bg-emerald-50",
          },
        ]);
      } else {
        setClassrooms([]);
        setStatsList([
          {
            label: "Classrooms",
            sublabel: "classrooms · active",
            value: "0",
            dotClass: "bg-indigo-600",
            dotBgClass: "bg-indigo-50",
          },
          {
            label: "Students",
            sublabel: "classroom_students",
            value: "0",
            dotClass: "bg-sky-500",
            dotBgClass: "bg-sky-50",
          },
          {
            label: "To grade",
            sublabel: "submissions · pending",
            value: "0",
            dotClass: "bg-orange-500",
            dotBgClass: "bg-orange-50",
          },
          {
            label: "Attendance to take",
            sublabel: "today · attendance",
            value: "0",
            dotClass: "bg-emerald-500",
            dotBgClass: "bg-emerald-50",
          },
        ]);
      }
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