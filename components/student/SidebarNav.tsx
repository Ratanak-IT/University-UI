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

/**
 * The single list of student routes, read by both the desktop rail and the
 * mobile drawer. One list means a route added here shows up in both places
 * automatically — the two are never able to drift apart the way they would
 * if each surface kept its own copy.
 */
export const navSections: NavSection[] = [
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

/** The UMS mark. */
export function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 border-b border-border/50 bg-indigo-50/60 px-6 py-5.5 dark:bg-indigo-950/40">
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
  );
}

/**
 * The nav list, read by both the desktop rail and the mobile drawer.
 */
export function SidebarNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-4 py-6">
      {navSections.map((section, idx) => (
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
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
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
  );
}
