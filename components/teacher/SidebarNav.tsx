"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
 * The single list of teacher routes, read by both the desktop rail and the
 * mobile drawer. One list means a route added here shows up in both places
 * automatically — the two are never able to drift apart the way they would
 * if each surface kept its own copy.
 */
export const navSections: NavSection[] = [
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

/** The UMS mark, always in its full (non-collapsed) form. */
export function SidebarBrand() {
  return (
    <Link href="/" className="flex items-center gap-3 bg-muted/60 px-6 py-5.5">
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
        <p className="text-xl font-black tracking-tight text-primary">UMS</p>
        <p className="text-xs font-medium text-muted-foreground">
          Teacher Portal
        </p>
      </div>
    </Link>
  );
}

/**
 * The nav list, always expanded — this is what the mobile drawer renders. The
 * desktop rail keeps its own collapse-aware version inline in `SideBar.tsx`,
 * since collapsing to icons-only is a rail-only affordance a full-width
 * overlay drawer has no use for.
 */
export function SidebarNavList({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6">
      {navSections.map((section, idx) => (
        <div key={section.title} className={idx === 0 ? "" : "mt-7"}>
          <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
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
                    className={`group flex items-center gap-3 rounded-xl py-2.5 px-3.5 text-sm font-medium transition-all ${
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
