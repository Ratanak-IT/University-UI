"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { clearSignedOutReason, readSignedOutReason } from "@/lib/auth/accountBlocked";

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
 *
 * <p>The one time it does not bounce is when the app has just signed someone
 * out because their account was suspended or withdrawn. Sending them onwards
 * would replace the explanation with Keycloak's own screen before they could
 * read it — and, for an account that is disabled, land them straight back here
 * again with nothing to show for the trip.
 */
export default function LoginPage() {
  // Read during render, so the first paint already knows whether it is an
  // explanation screen or a redirect. Cleared in the effect below, because
  // writing to storage while rendering is the sort of hidden mutation that
  // makes a component behave differently on a replay.
  const [blockedReason] = useState(readSignedOutReason);

  useEffect(() => {
    if (blockedReason) {
      clearSignedOutReason();
      return;
    }
    goToKeycloak();
  }, [blockedReason]);

  function goToKeycloak() {
    const backendOrigin = (process.env.NEXT_PUBLIC_API_BASE_URL || "")
      .trim()
      .replace(/\/+$/, "");

    /*
      Asks the API to finish login back here rather than at its own default.

      Only sent when this page is genuinely being served from somewhere other
      than the API's own idea of the front end — in practice, a developer
      running the site locally against the deployed API. The server ignores
      anything not on its allow-list, so this cannot be used to point login at
      an arbitrary site; the parameter is a request, not an instruction.
    */
    const returnTo = encodeURIComponent(window.location.origin);
    window.location.href = `${backendOrigin}/api/v1/auth/login?returnTo=${returnTo}`;
  }

  if (blockedReason) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>

          <h1 className="mt-4 text-lg font-bold text-slate-900">
            You have been signed out
          </h1>
          <p className="mt-2 text-sm text-slate-600">{blockedReason}</p>

          {/*
            Said plainly, because the first fear on seeing this screen is that
            the work is gone. Suspension hides nothing and deletes nothing.
          */}
          <p className="mt-4 text-xs text-slate-500">
            Nothing has been deleted — your attendance, marks and certificates
            are all still on your record. Signing in will work again once the
            registrar restores your access.
          </p>

          <button
            type="button"
            onClick={goToKeycloak}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Try signing in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Redirecting to login...</p>
      </div>
    </div>
  );
}
