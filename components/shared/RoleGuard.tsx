"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { fetchUserProfile, UserProfileResponse } from "@/lib/api/auth";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  allowedRoles: Array<"TEACHER" | "STUDENT" | "ADMIN">;
  children: ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("access_token")
          : null;

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const profile: UserProfileResponse | null = await fetchUserProfile(token);
        if (profile && allowedRoles.includes(profile.role)) {
          setAuthorized(true);
        } else {
          // Redirect to appropriate dashboard based on actual role
          if (profile?.role === "TEACHER") {
            router.replace("/dashboard/teacher");
          } else if (profile?.role === "STUDENT") {
            router.replace("/dashboard/student");
          } else {
            router.replace("/login");
          }
        }
      } catch (err) {
        console.error("RoleGuard authentication check failed:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
