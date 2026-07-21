"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BookOpen,
  Star,
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
    items: [
      { label: "Dashboard", href: "/dashboard/student", icon: LayoutGrid },
      { label: "My Courses", href: "/dashboard/student/my-courses", icon: BookOpen },
      { label: "Grades", href: "/dashboard/student/grades", icon: Star },
      { label: "Notifications", href: "/dashboard/student/notifications", icon: Bell },
      { label: "My Profile", href: "/dashboard/student/profile", icon: User },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-slate-100 bg-white">
      {/* Logo Header */}
      <div className="flex items-center gap-3 bg-indigo-50/60 px-6 py-5.5">
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
          <p className="text-xl font-black tracking-tight text-indigo-950">
            UMS
          </p>
          <p className="text-xs font-medium text-slate-500">Student Portal</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
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
                      className={`flex items-center gap-3 rounded-xl py-2.5 px-3.5 text-sm font-medium transition-all group ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/40"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 transition-colors ${
                          isActive
                            ? "text-indigo-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                        strokeWidth={isActive ? 2 : 1.75}
                      />;
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
      <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-indigo-600 text-sm font-bold text-white">
          M
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-400">Student</p>
          <p className="truncate text-sm font-semibold text-slate-800">
            Sok Maly
          </p>
        </div>
        <button
          type="button"
          aria-label="Log out"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600"
        >
          <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
