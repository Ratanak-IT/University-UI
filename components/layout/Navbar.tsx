"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  useGetUserProfileQuery,
  useGetStudentProfileQuery,
  useGetTeacherProfileQuery,
} from "@/lib/redux/apiSlice";
import PersonAvatar from "@/components/shared/PersonAvatar";
import Image from "next/image";
import { logout } from "@/lib/auth/logout";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "FQA", href: "/#fqa" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // Whether a session token exists is only knowable client-side (localStorage
  // isn't visible during SSR), so this starts false and is filled in on
  // mount — the same one-render delay `ThemeToggle` already accepts to avoid
  // a hydration mismatch, not a bug.
  const [isAuthed, setIsAuthed] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthed(!!(localStorage.getItem("token") || localStorage.getItem("access_token")));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: profile } = useGetUserProfileQuery(undefined, { skip: !isAuthed });
  const dashboardBase = profile?.role === "STUDENT" ? "/dashboard/student" : "/dashboard/teacher";

  // `/auth/me` (above) is role-agnostic and has no `avatarUrl` — the picture
  // only exists on the role-specific profile, so it's fetched separately
  // once the role is known.
  const { data: studentProfile } = useGetStudentProfileQuery(undefined, {
    skip: profile?.role !== "STUDENT",
  });
  const { data: teacherProfile } = useGetTeacherProfileQuery(undefined, {
    skip: profile?.role !== "TEACHER",
  });
  const avatarUrl = studentProfile?.avatarUrl ?? teacherProfile?.avatarUrl ?? null;

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground transition-colors duration-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10">
            <Image src="/logo-rm.png" alt="UMS Logo" width={100} height={100} className="h-6 w-6 object-contain" />
          </div>
          <span className="text-xl font-bold tracking-wide">UMS</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-10 text-sm font-medium md:flex">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={
                    isActive
                      ? "border-b-2 border-secondary pb-1 text-secondary"
                      : "text-primary-foreground/90 transition hover:text-secondary"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle variant="bar" />
          {isAuthed && profile ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-primary-foreground/10"
              >
                <PersonAvatar name={profile.fullName} avatarUrl={avatarUrl} size="sm" className="ring-1 ring-primary-foreground/20" />
                <span className="max-w-[140px] truncate text-sm font-semibold">{profile.fullName}</span>
                <ChevronDown
                  className={`h-4 w-4 text-primary-foreground/70 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card py-1.5 text-card-foreground shadow-xl">
                  <div className="border-b border-border px-4 py-2.5">
                    <p className="truncate text-sm font-bold">{profile.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                  <Link
                    href={`${dashboardBase}/profile`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="rounded-md bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground transition hover:brightness-95">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="p-2 text-primary-foreground focus:outline-none md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-card px-6 py-4 text-card-foreground md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={
                      isActive
                        ? "block border-l-4 border-secondary pl-3 text-secondary"
                        : "block pl-4 text-muted-foreground transition hover:text-foreground"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="flex items-center justify-between pl-4">
              <span className="text-muted-foreground">Theme</span>
              <ThemeToggle />
            </li>

            {isAuthed && profile ? (
              <>
                <li className="flex items-center gap-3 border-t border-border pt-4 pl-4">
                  <PersonAvatar name={profile.fullName} avatarUrl={avatarUrl} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{profile.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                </li>
                <li>
                  <Link
                    href={`${dashboardBase}/profile`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 pl-4 text-muted-foreground transition hover:text-foreground"
                  >
                    <UserCircle className="h-4 w-4" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2.5 pl-4 text-rose-600 transition hover:text-rose-700 dark:text-rose-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="mt-4 w-full rounded-md bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition hover:brightness-95">
                    Apply Now
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}