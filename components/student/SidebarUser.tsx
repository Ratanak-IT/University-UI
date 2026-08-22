"use client";

import { LogOut } from "lucide-react";
import { useGetStudentProfileQuery } from "@/lib/redux/apiSlice";

/**
 * Footer profile banner + sign-out, shared by the desktop rail and the
 * mobile drawer.
 *
 * The sign-out button here previously had no `onClick` at all — it rendered
 * and looked clickable but did nothing. Fixed while extracting this into a
 * shared component, matching the working sign-out already used on the
 * teacher side (clear local auth state, send the user to `/login`).
 */
export default function SidebarUser() {
  const { data: profile } = useGetStudentProfileQuery();

  const studentName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.username
    : "Student Portal";

  const studentInitials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() || "ST"
    : "ST";

  function signOut() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <div className="flex items-center gap-3 border-t border-border bg-muted/30 px-5 py-4">
      {profile?.avatarUrl ? (
        // Same plain <img> the rest of this codebase already uses for a
        // presigned MinIO avatar URL — see components/teacher/SideBar.tsx.
        <img
          src={profile.avatarUrl}
          alt={studentName}
          className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/20"
        />
      ) : (
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-200 bg-indigo-600 text-xs font-black text-white shadow-sm dark:border-indigo-800 dark:bg-indigo-700">
          {studentInitials}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {profile?.studentCode || "Enrolled Student"}
        </p>
        <p className="truncate text-sm font-extrabold text-foreground">{studentName}</p>
      </div>

      <button
        type="button"
        aria-label="Log out"
        onClick={signOut}
        className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
      >
        <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
      </button>
    </div>
  );
}
