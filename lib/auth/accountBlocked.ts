/**
 * What to do when the server says this account may no longer be used.
 *
 * <p>Suspending or withdrawing someone disables their Keycloak account and ends
 * their sessions, so nothing new is issued and the browser's session cookie is
 * gone. What that does not do is tell the person sitting in front of an already
 * loaded page. Left alone they get a screen where every panel fails for no
 * stated reason, which reads as the site being broken rather than as a decision
 * somebody made about their account.
 *
 * <p>So the first refusal that names a blocked account ends the session here
 * and says why on the way out.
 */

/** Where the reason is handed to the login screen. */
const REASON_KEY = "ums.signed_out_reason";

/**
 * Recognises the guards' wording.
 *
 * <p>Matched on the message rather than the status code because a 403 is also
 * the ordinary answer to "you asked for someone else's data", and signing
 * somebody out for opening the wrong page would be far worse than the problem
 * being solved.
 */
export function isAccountBlockedMessage(message: string | undefined | null): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes("has been withdrawn") ||
    m.includes("this account is suspended") ||
    m.includes("this account is inactive") ||
    m.includes("this teaching account is")
  );
}

/** Pulls the human message out of whatever shape the error arrived in. */
export function messageFromError(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const data = (error as { data?: unknown }).data;

  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    for (const key of ["detail", "message", "error"]) {
      const v = (data as Record<string, unknown>)[key];
      if (typeof v === "string" && v.trim()) return v;
    }
  }
  return undefined;
}

/**
 * Signs the user out and sends them to the login screen with the reason.
 *
 * <p>A full page navigation, not a router push: every cached query, every open
 * subscription and every piece of component state belongs to a session that has
 * just ended, and the simplest way to be sure none of it survives is to start
 * the page again.
 */
export function signOutAsBlocked(reason: string) {
  if (typeof window === "undefined") return;

  // Read on the login screen once, then cleared — it describes this sign-out,
  // not a permanent property of the browser.
  window.sessionStorage.setItem(REASON_KEY, reason);

  localStorage.clear();

  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

/**
 * Reads the reason recorded by {@link signOutAsBlocked}, without clearing it.
 *
 * <p>Split from the clearing so a component can read it while rendering — which
 * is where it is needed — and drop it in an effect, which is where a side
 * effect belongs. Doing both at once meant either mutating storage during a
 * render, or a first paint that did not know yet what it was about to say.
 */
export function readSignedOutReason(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(REASON_KEY);
}

/** Forgets the reason, so a later visit to the login page is an ordinary one. */
export function clearSignedOutReason() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(REASON_KEY);
}
