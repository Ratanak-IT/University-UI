"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { navSections } from "./SidebarNav";
import { useGetTeacherProfileQuery } from "@/lib/redux/apiSlice";

/**
 * The permanent rail, from `lg` up. Below that the same navigation is served
 * by {@link MobileNav} as a drawer, so a phone gets the whole screen width
 * for content instead of losing 260px (or 80px collapsed) of it.
 *
 * `navSections` is imported rather than declared here so the rail and the
 * drawer read the same list — a route added to one can no longer be
 * forgotten in the other.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: profile } = useGetTeacherProfileQuery();

  return (
    <aside
  className={`relative z-40 hidden h-screen shrink-0 flex-col border-r border-border bg-background transition-all duration-300 lg:flex ${
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
        {navSections.map((section, idx) => (
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
      <Link
        href="/dashboard/teacher/profile"
        className={`flex items-center gap-3 border-t border-border bg-muted/50 px-5 py-4 transition-colors hover:bg-muted ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
          {profile?.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs">
              {profile?.firstName?.[0] || "T"}{profile?.lastName?.[0] || ""}
            </div>
          )}
        </div>

        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1 animate-in fade-in zoom-in-95 duration-300">
              <p className="truncate text-xs font-medium text-muted-foreground">
                Teacher
              </p>
              <p className="truncate text-sm font-semibold text-foreground">
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
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-rose-600 dark:hover:text-rose-400"
            >
              <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
            </button>
          </>
        )}
      </Link>
    </aside>
  );
}
