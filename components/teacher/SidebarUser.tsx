"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useGetTeacherProfileQuery } from "@/lib/redux/apiSlice";

/**
 * Footer profile banner + sign-out, shared by the desktop rail and the
 * mobile drawer.
 *
 * Reads through RTK Query rather than a one-off `fetch` so that mounting this
 * in two places (rail + drawer) at once shares a single request instead of
 * firing it twice — the previous ad-hoc `fetchTeacherProfile()` call had no
 * such dedup, so splitting it across two components would have doubled the
 * network call on every page load.
 */
export default function SidebarUser({ onNavigate }: { onNavigate?: () => void }) {
  const { data: profile } = useGetTeacherProfileQuery();

  function signOut() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <Link
      href="/dashboard/teacher/profile"
      onClick={onNavigate}
      className="flex items-center gap-3 border-t border-border bg-muted/50 px-5 py-4 transition-colors hover:bg-muted"
    >
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
        {profile?.avatarUrl ? (
          <Image src={profile.avatarUrl} alt="Profile" fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {profile?.firstName?.[0] || "T"}
            {profile?.lastName?.[0] || ""}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-muted-foreground">Teacher</p>
        <p className="truncate text-sm font-semibold text-foreground">
          {profile ? `${profile.firstName} ${profile.lastName}` : "My Profile"}
        </p>
      </div>

      <button
        type="button"
        aria-label="Log out"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          signOut();
        }}
        className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-rose-600 dark:hover:text-rose-400"
      >
        <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
      </button>
    </Link>
  );
}
