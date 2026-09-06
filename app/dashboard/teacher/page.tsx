"use client";

import { useEffect, useState } from "react";
import { BookMarked, Users, Folder, ClipboardCheck } from "lucide-react";
import StatCards from "@/components/teacher/dashboard/StatCards";
import DashboardSkeleton from "@/components/teacher/dashboard/DashboardSkeleton";
import {
  engagementData,
  contentLibraryData,
} from "../../../lib/data/dashboardData";
import EngagementChart from "@/components/teacher/dashboard/EngagementChart";
import ContentLibraryCard from "@/components/teacher/dashboard/ContentLibraryCard";
import ClassroomsSection from "@/components/teacher/dashboard/ClassroomsSection";
import {
  fetchTeacherProfile,
  fetchTeacherClassrooms,
  fetchTeacherDashboardSummary,
  mapClassroomToTeacherCard,
  TeacherProfile,
} from "@/lib/api/teacher";
import { Classroom, StatCard } from "@/lib/types/dashboard";

export default function DashboardPage() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [statsList, setStatsList] = useState<StatCard[]>([]);
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
      ]);

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="px-8 py-8">
      <StatCards stats={statsList} />

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <EngagementChart data={engagementData} />
        <ContentLibraryCard data={contentLibraryData} />
      </div>

      <div className="mt-6">
        <ClassroomsSection classrooms={classrooms} />
      </div>
    </div>
  );
}
