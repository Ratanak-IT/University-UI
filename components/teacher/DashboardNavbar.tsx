'use client';

import React from 'react';
import { Search, Bell, Moon } from 'lucide-react';
import Image from 'next/image';

export default function DashboardNavbar() {
  return (
    <header className="flex w-full items-center justify-between border-b border-gray-100 bg-white px-8 py-4">
      {/* Left Section: Title & Academic Period */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-[#004071]">Dashboard</h1>
        <p className="text-sm font-medium text-gray-500">
          Academic Year 2024–2025 <span className="mx-1">•</span> Semester 2
        </p>
      </div>

      {/* Middle Section: Search Bar */}
      <div className="relative w-full max-w-xl mx-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-[#5c6f84]" />
        </div>
        <input
          type="text"
          placeholder="Search students, classes, or files..."
          className="w-full rounded-xl border border-[#cbd5e1] bg-[#f1f5f9]/60 py-2.5 pl-12 pr-4 text-sm text-gray-700 placeholder-[#64748b] transition-all focus:border-[#004071] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#004071]"
        />
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <Bell className="h-6 w-6 stroke-[1.75]" />
        </button>

        {/* Dark Mode Toggle */}
        <button className="rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <Moon className="h-6 w-6 stroke-[1.75]" />
        </button>

        {/* User Profile Avatar */}
        <button className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 ring-2 ring-transparent transition-all hover:ring-gray-300">
          <Image
            src="/davin.jpg" // Replace with your actual image path in /public
            alt="User profile"
            fill
            className="object-cover"
          />
        </button>
      </div>
    </header>
  );
}