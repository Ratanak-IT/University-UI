/**
 * Resolves the API base URL.
 * In the browser (`typeof window !== "undefined"`), requests route through the Next.js Route Handler Proxy (`/api/proxy`)
 * for security, hiding the backend origin and avoiding CORS issues.
 * On the server side, requests resolve directly to the backend origin.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/proxy";
  }

  const envValue =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env as Record<string, string | undefined>).NEXT_PUBLICE_BASE_API ||
    "";

  return envValue
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api\/v1$/i, "");
}

export const API_BASE = getApiBaseUrl();
