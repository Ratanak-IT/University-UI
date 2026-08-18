"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BookOpen,
  Star,
  UserCheck,
  Award,
  Bell,
  User,
  LogOut,
} from "lucide-react";
import { useGetStudentProfileQuery } from "@/lib/redux/apiSlice";

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
      { label: "Dashboard", href: "/dashboard/student", icon: LayoutGrid },
      { label: "My Courses", href: "/dashboard/student/courses", icon: BookOpen },
      { label: "Grades", href: "/dashboard/student/grades", icon: Star },
      { label: "Attendance", href: "/dashboard/student/attendance", icon: UserCheck },
      { label: "Certificates", href: "/dashboard/student/certificates", icon: Award },
      { label: "Notifications", href: "/dashboard/student/notifications", icon: Bell },
      { label: "My Profile", href: "/dashboard/student/profile", icon: User },
    ],
  },
];

export default function SidebarStudent() {
  const pathname = usePathname();
  const { data: profile } = useGetStudentProfileQuery();

  const studentName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.username
    : "Student Portal";

  const studentInitials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() || "ST"
    : "ST";

  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-border bg-card text-card-foreground transition-colors">
      {/* Logo Header */}
      <div className="flex items-center gap-3 bg-indigo-50/60 dark:bg-indigo-950/40 px-6 py-5.5 border-b border-border/50">
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
          <p className="text-xl font-black tracking-tight text-indigo-950 dark:text-indigo-200">
            UMS
          </p>
          <p className="text-xs font-semibold text-muted-foreground">Student Portal</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar space-y-6">
        {sections.map((section, idx) => (
          <div key={section.title} className={idx === 0 ? "" : "mt-7"}>
            <p className="mb-2.5 px-3 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
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
                      className={`flex items-center gap-3 rounded-xl py-2.5 px-3.5 text-sm font-semibold transition-all group ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-950/70 dark:text-indigo-300"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 transition-colors ${
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-muted-foreground/70 group-hover:text-foreground"
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

      {/* Footer User Profile Banner */}
      <div className="flex items-center gap-3 border-t border-border bg-muted/30 px-5 py-4">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={studentName}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
        ) : (
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-200 bg-indigo-600 text-xs font-black text-white dark:border-indigo-800 dark:bg-indigo-700 shadow-sm">
            {studentInitials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {profile?.studentCode || "Enrolled Student"}
          </p>
          <p className="truncate text-sm font-extrabold text-foreground">
            {studentName}
          </p>
        </div>

        <button
          type="button"
          aria-label="Log out"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
        >
          <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}