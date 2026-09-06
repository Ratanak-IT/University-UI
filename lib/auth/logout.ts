/**
 * Signs the user out for real.
 *
 * <p>Clearing localStorage on its own is not a logout. It forgets the tokens on
 * this device, but the Keycloak SSO cookie lives on the Keycloak domain and is
 * untouched — so the next login request is answered silently from that session
 * and the user is signed straight back in without ever seeing a form. That is
 * the behaviour this replaces.
 *
 * <p>Three things have to end, in this order:
 *
 * <ol>
 *   <li>the refresh token, revoked at Keycloak while we still hold it;</li>
 *   <li>the tokens stored in this browser;</li>
 *   <li>the Keycloak session itself, which only Keycloak can end.</li>
 * </ol>
 *
 * <p>The last step is a full page navigation rather than a fetch: ending the
 * session means Keycloak clearing its own cookie, and it can only do that for a
 * request the browser makes on its own behalf. Keycloak then returns the user
 * to the homepage.
 */
export async function logout(): Promise<void> {
  const backendOrigin = (process.env.NEXT_PUBLIC_API_BASE_URL || "")
    .replace(/\/+$/, "");

  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

  // Revoked through a POST body, never a query string: a token in a URL is
  // written to server access logs, browser history and any proxy in between.
  if (refreshToken) {
    try {
      await fetch(`${backendOrigin}/api/v1/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Best effort. The redirect below still ends the Keycloak session, and
      // failing to reach the API is no reason to leave the user signed in.
    }
  }

  localStorage.clear();
  sessionStorage.clear();

  window.location.href = `${backendOrigin}/api/v1/auth/logout`;
}
