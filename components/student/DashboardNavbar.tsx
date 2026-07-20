"use client";

import React from "react";
import { Search, Bell } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <header className="flex w-full items-center justify-between border-b border-gray-100 bg-white px-8 py-4">
      {/* Search Bar */}
      <div className="relative w-full max-w-xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-[#5c6f84]" />
        </div>
        <input
          type="text"
          placeholder="Search grades, courses, or documents..."
          className="w-full rounded-xl border border-[#cbd5e1] bg-[#f1f5f9]/60 py-2.5 pl-12 pr-4 text-sm text-gray-700 placeholder-[#64748b] transition-all focus:border-[#004071] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#004071]"
        />
      </div>

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
