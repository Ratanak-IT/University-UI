"use client";


import StatCards from "@/components/teacher/dashboard/StatCards";
import {
  statCards,
  engagementData,
  contentLibraryData,
  classrooms,
  deadlines,
  attendance,
} from "../../../lib/data/dashboardData";
import EngagementChart from "@/components/teacher/dashboard/EngagementChart";
import ContentLibraryCard from "@/components/teacher/dashboard/ContentLibraryCard";
import ClassroomsSection from "@/components/teacher/dashboard/ClassroomsSection";
import DeadlinesSection from "@/components/teacher/dashboard/DeadlinesSection";
import AttendanceSnapshot from "@/components/teacher/dashboard/AttendanceSnapshot";

export default function DashboardPage() {
  return (
    <div className="px-8 py-8">
      <StatCards stats={statCards} />

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <EngagementChart data={engagementData} />
        <ContentLibraryCard data={contentLibraryData} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ClassroomsSection classrooms={classrooms} />
        <DeadlinesSection deadlines={deadlines} />
      </div>

      <AttendanceSnapshot rows={attendance} />
    </div>
  );
}