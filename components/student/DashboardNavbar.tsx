"use client";

import { Bell } from "lucide-react";
import HeaderGlobalSearch from "@/components/shared/HeaderGlobalSearch";

export default function DashboardNavbar() {
  return (
    <header className="flex w-full items-center justify-between border-b border-gray-100 bg-white px-8 py-4">
      {/* Search Bar */}
      <HeaderGlobalSearch placeholder="Search grades, courses, or documents..." />

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <Bell className="h-6 w-6 stroke-[1.75]" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        {/* Status label */}
        <div className="text-right leading-tight">
          <p className="text-sm font-semibold text-slate-800">Student</p>
          <p className="text-xs font-medium text-emerald-600">Active</p>
        </div>

        {/* User Profile Avatar */}
        <button className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-sm font-bold text-white ring-2 ring-transparent transition-all hover:ring-indigo-200">
          M
        </button>
      </div>
    </header>
  );
}
