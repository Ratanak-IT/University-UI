"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function NavbarStudent() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="flex w-full items-center justify-between border-b border-gray-100 bg-white px-8 py-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-[#004071] dark:text-sky-400">
          Dashboard
        </h1>
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
          Academic Year 2024–2025 <span className="mx-1">•</span> Semester 2
        </p>
      </div>

      <div className="relative w-full max-w-xl mx-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-[#5c6f84] dark:text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search students, classes, or files..."
          className="w-full rounded-xl border border-[#cbd5e1] bg-[#f1f5f9]/60 py-2.5 pl-12 pr-4 text-sm text-gray-700 placeholder-[#64748b] transition-all focus:border-[#004071] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#004071] dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-800 dark:focus:ring-sky-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/dashboard/teacher/notifications"
          aria-label="Notifications"
          className="relative rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Bell className="h-6 w-6 stroke-[1.75]" />
        </Link>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-6 w-6 stroke-[1.75]" />
          ) : (
            <Moon className="h-6 w-6 stroke-[1.75]" />
          )}
        </button>

        <button className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 ring-2 ring-transparent transition-all hover:ring-gray-300 dark:border-slate-700 dark:hover:ring-slate-600">
          <Image
            src="/davin.jpg"
            alt="User profile"
            fill
            className="object-cover"
          />
        </button>
      </div>
    </header>
  );
}
