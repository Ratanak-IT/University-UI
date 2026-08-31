"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { fetchUserProfile } from "@/lib/api/auth";

/**
 * Where Keycloak login lands after `AuthController#callback` hands off the
 * tokens. They arrive in the URL fragment (`#access_token=...`), never sent
 * to any server — this page's only job is to read that fragment once, store
 * the tokens the same way the old password-form login used to, and route
 * the user into the dashboard that matches their role.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    async function finishLogin() {
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      // Strip the fragment immediately — it holds a live access token and
      // has no business staying in browser history or the address bar.
      window.history.replaceState(null, "", window.location.pathname);

      if (!accessToken || !refreshToken) {
        setError("Login failed — no tokens received. Please try again.");
        return;
      }

      localStorage.setItem("token", accessToken);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      try {
        const profile = await fetchUserProfile(accessToken);
        if (profile.role === "TEACHER") {
          router.replace("/dashboard/teacher");
        } else if (profile.role === "STUDENT") {
          router.replace("/dashboard/student");
        } else if (profile.role === "ADMIN") {
          router.replace("/dashboard/teacher");
        } else {
          setError(`Unauthorized role: ${profile.role}`);
        }
      } catch (err) {
        console.error("Failed to fetch profile after Keycloak login:", err);
        setError("Failed to fetch user profile. Contact system administrator.");
      }
    }

    finishLogin();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3">
        {error ? (
          <>
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <a href="/login" className="text-sm font-bold text-indigo-600 hover:underline">
              Back to login
            </a>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-sm font-medium text-slate-500">Signing you in...</p>
          </>
        )}
      </div>
    </div>
  );
}
