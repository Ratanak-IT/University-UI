"use client";

import { useMemo } from "react";
import { BookMarked, Users, Folder, ClipboardCheck } from "lucide-react";
import StatCards from "@/components/teacher/dashboard/StatCards";
import DashboardSkeleton from "@/components/teacher/dashboard/DashboardSkeleton";
import ClassroomsSection from "@/components/teacher/dashboard/ClassroomsSection";
import PerformanceGauges from "@/components/teacher/dashboard/PerformanceGauges";
import InsightsCharts from "@/components/teacher/dashboard/InsightsCharts";
import { mapClassroomToTeacherCard } from "@/lib/api/teacher";
import {
  useGetTeacherProfileQuery,
  useGetTeacherClassroomsQuery,
  useGetTeacherDashboardSummaryQuery,
  useGetTeacherStudentMetricsQuery,
} from "@/lib/redux/apiSlice";
import { StatCard } from "@/lib/types/dashboard";

export default function DashboardPage() {
  const { isLoading: loadingProfile } = useGetTeacherProfileQuery();
  // Only fetch the lightweight classroom list — enough to render cards.
  // Per-classroom detail (students, assignments, submissions) is fetched
  // on demand when the user opens a specific classroom. The aggregate
  // stats below come from one dedicated summary endpoint (COUNT queries
  // on the backend) instead of looping over every classroom's detail.
  const { data: classData = [], isLoading: loadingClassrooms } = useGetTeacherClassroomsQuery();
  const { data: summary, isLoading: loadingSummary } = useGetTeacherDashboardSummaryQuery();
  const { data: studentMetrics = [], isLoading: loadingMetrics } = useGetTeacherStudentMetricsQuery();

  const loading = loadingProfile || loadingClassrooms || loadingSummary || loadingMetrics;

  const classrooms = useMemo(
    () => classData.map((c, i) => mapClassroomToTeacherCard(c, i)),
    [classData]
  );

  const statsList = useMemo<StatCard[]>(
    () => [
      {
        label: "Active Classes",
        value: (summary?.activeClasses ?? classData.length).toString(),
        icon: BookMarked,
        iconBg: "bg-slate-100 dark:bg-slate-800",
        iconColor: "text-slate-700 dark:text-slate-300",
        badge: null,
      },
      {
        label: "Total Enrolled",
        value: (summary?.totalStudents ?? 0).toLocaleString(),
        icon: Users,
        iconBg: "bg-violet-100 dark:bg-violet-950/40",
        iconColor: "text-indigo-700 dark:text-indigo-400",
        badge: null,
      },
      {
        label: "Course Materials",
        value: (summary?.courseMaterials ?? 0).toString(),
        icon: Folder,
        iconBg: "bg-indigo-100 dark:bg-indigo-950/40",
        iconColor: "text-indigo-900 dark:text-indigo-400",
        badge: null,
      },
      {
        label: "To Grade",
        value: (summary?.toGrade ?? 0).toString(),
        icon: ClipboardCheck,
        iconBg: "bg-orange-100 dark:bg-orange-950/40",
        iconColor: "text-orange-700 dark:text-orange-400",
        badge: null,
      },
    ],
    [summary, classData.length]
  );

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="px-8 py-8">
      <StatCards stats={statsList} />

      <div className="mt-6">
        <PerformanceGauges
          avgAttendancePercent={summary?.avgAttendancePercent ?? null}
          avgPerformancePercent={summary?.avgPerformancePercent ?? null}
        />
      </div>

      <div className="mt-6">
        <InsightsCharts studentMetrics={studentMetrics} />
      </div>

      <div className="mt-6">
        <ClassroomsSection classrooms={classrooms} />
      </div>
    </div>
  );
}
