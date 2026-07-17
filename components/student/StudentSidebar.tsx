"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  GraduationCap,
  CalendarDays,
  BookOpen,
  FileText,
  Trophy,
  Star,
  UserCheck,
  Bell,
  User,
  LogOut,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard/student", icon: LayoutGrid }],
  },
  {
    title: "My Learning",
    items: [
      { label: "My Classes", href: "/dashboard/student/my-classes", icon: GraduationCap },
      { label: "Timetable", href: "/dashboard/student/timetable", icon: CalendarDays },
    ],
  },
  {
    title: "Coursework",
    items: [
      { label: "Lessons", href: "/dashboard/student/lessons", icon: BookOpen },
      { label: "Assignments", href: "/dashboard/student/assignments", icon: FileText },
      { label: "Quizzes", href: "/dashboard/student/quizzes", icon: Trophy },
    ],
  },
  {
    title: "Progress",
    items: [
      { label: "Grades", href: "/dashboard/student/grades", icon: Star },
      { label: "Attendance", href: "/dashboard/student/attendance", icon: UserCheck },
    ],
  },
  {
    title: "Profile",
    items: [
      { label: "Notifications", href: "/dashboard/student/notifications", icon: Bell },
      { label: "My Profile", href: "/dashboard/student/profile", icon: User },
    ],
  },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col border-r border-slate-100 bg-white">
      {/* Logo header */}
      <div className="flex items-center gap-3 bg-indigo-50/60 px-6 py-5">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          <Image
            src="/logo-rm.png"
            alt="UMS Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xl font-black tracking-tight text-indigo-950">UMS</p>
          <p className="text-xs font-medium text-slate-500">Student Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6">
        {sections.map((section, idx) => (
          <div key={section.title} className={idx === 0 ? "" : "mt-7"}>
            <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/40"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        className={`h-[18px] w-[18px] transition-colors ${
                          isActive
                            ? "text-indigo-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer profile */}
      <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-xs font-bold text-white">
          SD
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-400">Student</p>
          <p className="truncate text-sm font-semibold text-slate-800">Sok Dara</p>
        </div>
        <button
          type="button"
          aria-label="Log out"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
