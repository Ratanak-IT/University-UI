"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, BookMarked, Folder } from "lucide-react";
import StatCards from "@/components/teacher/dashboard/StatCards";
import {
  engagementData,
  contentLibraryData,
  attendance,
} from "../../../lib/data/dashboardData";
import EngagementChart from "@/components/teacher/dashboard/EngagementChart";
import ContentLibraryCard from "@/components/teacher/dashboard/ContentLibraryCard";
import ClassroomsSection from "@/components/teacher/dashboard/ClassroomsSection";
import DeadlinesSection from "@/components/teacher/dashboard/DeadlinesSection";
import AttendanceSnapshot from "@/components/teacher/dashboard/AttendanceSnapshot";
import {
  fetchTeacherProfile,
  fetchTeacherClassrooms,
  fetchClassroomStudents,
  fetchClassroomAssignments,
  fetchAssignmentSubmissions,
  mapClassroomToTeacherCard,
  TeacherProfile,
} from "@/lib/api/teacher";
import { fetchClassroomLessons } from "@/lib/api/student";
import { Classroom, StatCard, Deadline } from "@/lib/types/dashboard";

export default function DashboardPage() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [statsList, setStatsList] = useState<StatCard[]>([]);
  const [deadlinesList, setDeadlinesList] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const profData = await fetchTeacherProfile();
      if (profData) setProfile(profData);

      const classData = await fetchTeacherClassrooms();
      if (classData && classData.length > 0) {
        let totalEnrolled = 0;
        let totalMaterials = 0;
        let pendingGradesCount = 0;
        const allDeadlines: { title: string; classCode: string; dueDate: string }[] = [];

        const populatedClassrooms = await Promise.all(
          classData.map(async (c, i) => {
            const [students, assignments, lessons] = await Promise.all([
              fetchClassroomStudents(c.classroomId),
              fetchClassroomAssignments(c.classroomId),
              fetchClassroomLessons(c.classroomId),
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

                  if (asgn.dueDate) {
                    allDeadlines.push({
                      title: asgn.title,
                      classCode: c.className || c.classCode,
                      dueDate: asgn.dueDate,
                    });
                  }
                })
              );
            }

            totalEnrolled += students.length;
            totalMaterials += (lessons?.length || 0) + (assignments?.length || 0);
            pendingGradesCount += classroomPendingCount;

            const mapped = mapClassroomToTeacherCard(c, i);
            mapped.students = students.length;
            mapped.toGrade = classroomPendingCount;
            return mapped;
          })
        );

        setClassrooms(populatedClassrooms);

        // Sort deadlines by due date
        const sortedDeadlines: Deadline[] = allDeadlines
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 5)
          .map((d) => {
            const diffDays = Math.ceil(
              (new Date(d.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
            );
            let dueText = new Date(d.dueDate).toLocaleDateString();
            let badgeStyle = "bg-slate-100 text-slate-700";
            if (diffDays > 0 && diffDays <= 2) {
              dueText = `${diffDays} days left`;
              badgeStyle = "bg-rose-100 text-rose-700";
            } else if (diffDays === 0) {
              dueText = "Due today";
              badgeStyle = "bg-amber-100 text-amber-700";
            } else if (diffDays < 0) {
              dueText = "Overdue";
              badgeStyle = "bg-rose-200 text-rose-800";
            }

            return {
              title: d.title,
              classCode: d.classCode,
              due: dueText,
              badgeClass: badgeStyle,
            };
          });

        setDeadlinesList(sortedDeadlines);

        // Build stats
        setStatsList([
          {
            label: "Total Enrolled",
            value: totalEnrolled.toLocaleString(),
            icon: Users,
            iconBg: "bg-violet-100 dark:bg-violet-950/40",
            iconColor: "text-indigo-700 dark:text-indigo-400",
            badge: classData.length > 0 ? `+${(classData.length * 5)}%` : null,
          },
          {
            label: "Active Classes",
            value: classData.length.toString(),
            icon: BookMarked,
            iconBg: "bg-slate-100 dark:bg-slate-800",
            iconColor: "text-slate-700 dark:text-slate-300",
            badge: null,
          },
          {
            label: "Course Materials",
            value: totalMaterials.toString(),
            icon: Folder,
            iconBg: "bg-indigo-100 dark:bg-indigo-950/40",
            iconColor: "text-indigo-900 dark:text-indigo-400",
            badge: null,
          },
        ]);
      } else {
        setClassrooms([]);
        setStatsList([
          {
            label: "Total Enrolled",
            value: "0",
            icon: Users,
            iconBg: "bg-violet-100 dark:bg-violet-950/40",
            iconColor: "text-indigo-700 dark:text-indigo-400",
            badge: null,
          },
          {
            label: "Active Classes",
            value: "0",
            icon: BookMarked,
            iconBg: "bg-slate-100 dark:bg-slate-800",
            iconColor: "text-slate-700 dark:text-slate-300",
            badge: null,
          },
          {
            label: "Course Materials",
            value: "0",
            icon: Folder,
            iconBg: "bg-indigo-100 dark:bg-indigo-950/40",
            iconColor: "text-indigo-900 dark:text-indigo-400",
            badge: null,
          },
        ]);
        setDeadlinesList([]);
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

  return (
    <div className="px-8 py-8">
      <StatCards stats={statsList} />

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <EngagementChart data={engagementData} />
        <ContentLibraryCard data={contentLibraryData} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ClassroomsSection classrooms={classrooms} />
        <DeadlinesSection deadlines={deadlinesList} />
      </div>

      <AttendanceSnapshot rows={attendance} />
    </div>
  );
}