"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  GraduationCap,
  Users,
  Package,
  BookOpen,
  Trophy,
  UserCheck,
  Star,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
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
    items: [
      { label: "Dashboard", href: "/dashboard/teacher", icon: LayoutGrid },
    ],
  },
  {
    title: "My Teaching",
    items: [
      {
        label: "My Classrooms",
        href: "/dashboard/teacher/my-classroom",
        icon: GraduationCap,
      },
      {
        label: "My students",
        href: "/dashboard/teacher/my-student",
        icon: Users,
      },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Lessons", href: "/dashboard/teacher/lessons", icon: Package },
      {
        label: "Assignments",
        href: "/dashboard/teacher/assignments",
        icon: BookOpen,
      },
      { label: "Quizzes", href: "/dashboard/teacher/quiz", icon: Trophy },
    ],
  },
  {
    title: "Manage",
    items: [
      {
        label: "Attendance",
        href: "/dashboard/teacher/attendance",
        icon: UserCheck,
      },
      { label: "Grades", href: "/dashboard/teacher/grades", icon: Star },
    ],
  },
  {
    title: "Profile",
    items: [
      {
        label: "Notifications",
        href: "/dashboard/teacher/notifications",
        icon: Bell,
      },
      { label: "My Profile", href: "/dashboard/teacher/profile", icon: User },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-border bg-background transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-[260px]"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:text-primary dark:border-gray-700 dark:bg-slate-800 lg:flex"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Header */}
      <Link href="/">
        <div className="flex items-center gap-3 bg-muted/60 px-6 py-5.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
            <Image
              src="/logo-rm.png"
              alt="UMS Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 animate-in fade-in zoom-in-95 duration-300">
              <p className="text-xl font-black tracking-tight text-primary">
                UMS
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Teacher Portal
              </p>
            </div>
          )}
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6">
        {sections.map((section, idx) => (
          <div key={section.title} className={idx === 0 ? "" : "mt-7"}>
            {!isCollapsed && (
              <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl py-2.5 px-3.5 text-lg font-medium transition-all ${
                        isCollapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                      {!isCollapsed && <span>{item.label}</span>}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer User Profile Banner */}
      <div
        className={`flex items-center gap-3 border-t border-border bg-muted/50 px-5 py-4 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
          <Image
            src="/davin.jpg"
            alt="Chhay Davin profile"
            fill
            className="object-cover"
          />
        </div>

        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1 animate-in fade-in zoom-in-95 duration-300">
              <p className="truncate text-xs font-medium text-muted-foreground">
                Teacher
              </p>
              <p className="truncate text-lg font-semibold text-foreground">
                Chhay Davin
              </p>
            </div>
            <button
              type="button"
              aria-label="Log out"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-rose-600 dark:hover:text-rose-400"
            >
              <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
