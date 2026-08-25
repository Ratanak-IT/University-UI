"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { navSections } from "./SidebarNav";
import { useGetStudentProfileQuery } from "@/lib/redux/apiSlice";
import PersonAvatar from "@/components/shared/PersonAvatar";

/**
 * The permanent rail, from `lg` up. Below that the same navigation is served
 * by {@link MobileNav} as a drawer, so a phone gets the whole screen width
 * for content instead of losing 260px (or 80px collapsed) of it.
 *
 * `navSections` is imported rather than declared here so the rail and the
 * drawer read the same list — a route added to one can no longer be
 * forgotten in the other. Structured the same way as the teacher rail
 * (collapse toggle, inline profile footer) for the same reason: a student
 * on a small laptop gets the same screen-space tradeoff a teacher already
 * has.
 */
export default function SidebarStudent() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: profile } = useGetStudentProfileQuery();

  return (
    <aside
      className={`relative z-40 hidden h-screen shrink-0 flex-col border-r border-border bg-card text-card-foreground transition-all duration-300 lg:flex ${
        isCollapsed ? "w-20" : "w-65"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-10 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-indigo-600 dark:hover:text-indigo-400 lg:flex"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Header */}
      <Link
        href="/"
        className="flex items-center gap-3 border-b border-border/50 bg-indigo-50/60 px-6 py-5.5 dark:bg-indigo-950/40"
      >
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
            <p className="text-xl font-black tracking-tight text-indigo-950 dark:text-indigo-200">
              UMS
            </p>
            <p className="text-xs font-semibold text-muted-foreground">Student Portal</p>
          </div>
        )}
      </Link>

      {/* Navigation Links */}
      <nav className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-4 py-6">
        {navSections.map((section, idx) => (
          <div key={section.title} className={idx === 0 ? "" : "mt-7"}>
            {!isCollapsed && (
              <p className="mb-2.5 px-3 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
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
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                        isCollapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-950/70 dark:text-indigo-300"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-muted-foreground/70 group-hover:text-foreground"
                        }`}
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                      {!isCollapsed && <span>{item.label}</span>}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
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
      <Link
        href="/dashboard/student/profile"
        className={`flex items-center gap-3 border-t border-border bg-muted/30 px-5 py-4 transition-colors hover:bg-muted ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <PersonAvatar
          name={profile ? `${profile.firstName} ${profile.lastName}` : "Student"}
          avatarUrl={profile?.avatarUrl}
          size="sm"
          className="border border-indigo-200 dark:border-indigo-800"
        />

        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1 animate-in fade-in zoom-in-95 duration-300">
              <p className="truncate text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {profile?.studentCode || "Enrolled Student"}
              </p>
              <p className="truncate text-sm font-extrabold text-foreground">
                {profile ? `${profile.firstName} ${profile.lastName}` : "My Profile"}
              </p>
            </div>
            <button
              type="button"
              aria-label="Log out"
              onClick={(e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            >
              <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
            </button>
          </>
        )}
      </Link>
    </aside>
  );
}
