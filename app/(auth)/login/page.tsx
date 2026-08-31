"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * No password form here anymore — login happens on Keycloak's own hosted
 * page. This route exists only as the entry point every "please log in"
 * redirect in the app already points at (RoleGuard, sidebars, etc.); it
 * immediately bounces the browser to the backend's PKCE login endpoint,
 * which itself redirects to Keycloak. `AuthController#callback` sends the
 * browser back to `/auth/callback` once Keycloak hands back tokens.
 *
 * This must be a real top-level navigation to the backend's own origin
 * (not through the `/api/proxy` route used by every other API call) — the
 * backend needs to set a session cookie the browser carries through the
 * whole Keycloak round trip, which a server-side proxied fetch can't do.
 */
export default function LoginPage() {
  useEffect(() => {
    const backendOrigin = (process.env.NEXT_PUBLIC_API_BASE_URL || "")
      .trim()
      .replace(/\/+$/, "");
    window.location.href = `${backendOrigin}/api/v1/auth/login`;
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Redirecting to login...</p>
      </div>
    </div>
  );
}
