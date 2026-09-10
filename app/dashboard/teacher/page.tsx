"use client";

import { useCallback, useMemo, useState } from "react";
import { BookMarked, Users, Folder, ClipboardCheck } from "lucide-react";
import StatCards from "@/components/teacher/dashboard/StatCards";
import DashboardSkeleton from "@/components/teacher/dashboard/DashboardSkeleton";
import ClassroomsSection from "@/components/teacher/dashboard/ClassroomsSection";
import OverviewStats from "@/components/teacher/dashboard/OverviewStats";
import DeadlinesSection from "@/components/teacher/dashboard/DeadlinesSection";
import InsightsCharts, { type SubmissionRow } from "@/components/teacher/dashboard/InsightsCharts";
import AssignmentFetcher from "@/components/teacher/dashboard/AssignmentFetcher";
import { mapClassroomToTeacherCard } from "@/lib/api/teacher";
import { formatDue, badgeClassFor, daysUntil } from "@/lib/utils/deadline";
import {
  useGetTeacherProfileQuery,
  useGetTeacherClassroomsQuery,
  useGetTeacherDashboardSummaryQuery,
  useGetTeacherStudentMetricsQuery,
  useGetTeacherQuizzesQuery,
} from "@/lib/redux/apiSlice";
import { StatCard, Deadline } from "@/lib/types/dashboard";
import type { AssignmentResponse } from "@/lib/api/student";

const UPCOMING_WINDOW_DAYS = 14;
const DUE_SOON_WINDOW_DAYS = 7;

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
  const { data: teacherQuizzes = [] } = useGetTeacherQuizzesQuery();

  const loading = loadingProfile || loadingClassrooms || loadingSummary || loadingMetrics;

  const classrooms = useMemo(
    () => classData.map((c, i) => mapClassroomToTeacherCard(c, i)),
    [classData]
  );

  const classroomMeta = useMemo(
    () => classData.map((c) => ({ id: c.classroomId, classCode: c.classCode || c.className || "Classroom" })),
    [classData]
  );

  // Assignment due dates/submission counts aren't on the dashboard summary,
  // so each classroom's own assignments list is fetched (the same endpoint
  // the Assignments page already uses) and merged here — no new backend work.
  const [assignmentsByClassroom, setAssignmentsByClassroom] = useState<Record<string, AssignmentResponse[]>>({});
  const handleAssignmentsLoaded = useCallback((classroomId: string, items: AssignmentResponse[]) => {
    setAssignmentsByClassroom((prev) => (prev[classroomId] === items ? prev : { ...prev, [classroomId]: items }));
  }, []);

  const assignmentsLoading =
    classroomMeta.length > 0 && classroomMeta.some((c) => assignmentsByClassroom[c.id] === undefined);

  const allAssignments = useMemo(() => {
    const classCodeById = new Map(classroomMeta.map((c) => [c.id, c.classCode]));
    return Object.entries(assignmentsByClassroom).flatMap(([classroomId, items]) =>
      items
        .filter((a) => a.dueDate)
        .map((a) => ({
          id: a.assignmentId,
          title: a.title,
          classCode: classCodeById.get(classroomId) ?? "",
          dueTs: new Date(a.dueDate as string).getTime(),
          submitted: a.submittedCount ?? 0,
          total: a.totalStudents ?? 0,
        }))
    ).filter((a) => !Number.isNaN(a.dueTs));
  }, [assignmentsByClassroom, classroomMeta]);

  const { dueSoonCount, overdueCount } = useMemo(() => {
    const now = Date.now();
    let dueSoon = 0;
    let overdue = 0;
    for (const a of allAssignments) {
      const diffDays = daysUntil(a.dueTs, now);
      if (diffDays < 0) {
        if (a.submitted < a.total) overdue++;
      } else if (diffDays <= DUE_SOON_WINDOW_DAYS) {
        dueSoon++;
      }
    }
    return { dueSoonCount: dueSoon, overdueCount: overdue };
  }, [allAssignments]);

  const quizzesLiveCount = useMemo(
    () => teacherQuizzes.filter((q) => q.status?.toLowerCase() === "published").length,
    [teacherQuizzes]
  );

  const deadlines: Deadline[] = useMemo(() => {
    const now = Date.now();
    const items: Array<Deadline & { dueTs: number }> = [];

    for (const a of allAssignments) {
      const diffDays = daysUntil(a.dueTs, now);
      if (diffDays > UPCOMING_WINDOW_DAYS) continue;
      items.push({
        id: a.id,
        title: a.title,
        classCode: a.classCode,
        due: formatDue(diffDays),
        badgeClass: badgeClassFor(diffDays),
        kind: "assignment",
        dueTs: a.dueTs,
      });
    }

    for (const q of teacherQuizzes) {
      const status = q.status?.toLowerCase();
      if (status !== "published" && status !== "scheduled") continue;
      if (!q.endAt) continue;
      const ts = new Date(q.endAt).getTime();
      if (Number.isNaN(ts)) continue;
      const diffDays = daysUntil(ts, now);
      if (diffDays > UPCOMING_WINDOW_DAYS) continue;
      items.push({
        id: `quiz-${q.quizId}`,
        title: q.title,
        classCode: q.className || "Classroom",
        due: formatDue(diffDays),
        badgeClass: badgeClassFor(diffDays),
        kind: "quiz",
        dueTs: ts,
      });
    }

    items.sort((a, b) => a.dueTs - b.dueTs);
    return items.slice(0, 6);
  }, [allAssignments, teacherQuizzes]);

  const submissionRows: SubmissionRow[] = useMemo(() => {
    const now = Date.now();
    return allAssignments
      .filter((a) => a.total > 0 && a.dueTs >= now - 3 * 86400000 && a.dueTs <= now + UPCOMING_WINDOW_DAYS * 86400000)
      .sort((a, b) => a.dueTs - b.dueTs)
      .slice(0, 5)
      .map((a) => ({ id: a.id, title: a.title, classCode: a.classCode, submitted: a.submitted, total: a.total }));
  }, [allAssignments]);

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
      {classroomMeta.map((c) => (
        <AssignmentFetcher key={c.id} classroomId={c.id} onLoaded={handleAssignmentsLoaded} />
      ))}

      <StatCards stats={statsList} />

      <div className="mt-6">
        <OverviewStats
          avgPerformancePercent={summary?.avgPerformancePercent ?? null}
          dueSoonCount={dueSoonCount}
          overdueCount={overdueCount}
          quizzesLiveCount={quizzesLiveCount}
        />
      </div>

      <div className="mt-6">
        <DeadlinesSection deadlines={deadlines} loading={assignmentsLoading} />
      </div>

      <div className="mt-6">
        <InsightsCharts
          studentMetrics={studentMetrics}
          submissionRows={submissionRows}
          submissionsLoading={assignmentsLoading}
        />
      </div>

      <div className="mt-6">
        <ClassroomsSection classrooms={classrooms} />
      </div>
    </div>
  );
}
