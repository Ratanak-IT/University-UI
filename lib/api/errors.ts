/**
 * Turns an RTK Query error into a message worth showing a user.
 *
 * The backend answers failures with a Spring `ProblemDetail`:
 *   { type, title, status, detail, instance, code }
 * and older handlers use `{ message }` or `{ errors: [...] }` instead, so we
 * probe each shape rather than printing "[object Object]".
 *
 * The server's own `detail` is preferred over a generic status message even for
 * 401/403, because that string is the only thing that says *which* rule
 * rejected the call — "You are not the teacher of classroom: <id>" is
 * actionable where "Forbidden" is not.
 */

type Dict = Record<string, unknown>;

const isObj = (v: unknown): v is Dict =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function fromFieldErrors(data: Dict): string | null {
  for (const key of ["errors", "violations", "fieldErrors", "details"]) {
    const list = data[key];
    if (Array.isArray(list) && list.length) {
      const parts = list
        .map((e) => {
          if (typeof e === "string") return e;
          if (!isObj(e)) return null;
          const field = e.field ?? e.property ?? e.name;
          const msg =
            e.defaultMessage ?? e.message ?? e.error ?? e.reason ?? "is invalid";
          return field ? `${field}: ${msg}` : String(msg);
        })
        .filter(Boolean);
      if (parts.length) return parts.join(" · ");
    }
  }
  return null;
}

export function apiErrorMessage(err: unknown, fallback: string): string {
  const e = err as { status?: number | string; data?: unknown; error?: string };
  const status = e?.status;

  if (status === "FETCH_ERROR" || status === 0) {
    return "Cannot reach the API. Check that the backend is running on port 8081.";
  }

  const data = e?.data;

  if (typeof data === "string" && data.trim()) {
    // Some servers return a bare string or a whole HTML error page.
    return data.length > 300 ? `Request failed (${status}).` : data;
  }

  if (isObj(data)) {
    const fields = fromFieldErrors(data);
    if (fields) return fields;

    // `detail` first — that is where ProblemDetail puts the specific reason.
    for (const key of ["detail", "message", "error_description", "error"]) {
      const v = data[key];
      if (typeof v === "string" && v.trim()) return v;
    }

    const title = data.title;
    if (typeof title === "string" && title.trim()) return title;
  }

  // Nothing specific came back, so fall back to what the status implies.
  if (status === 401) return "Your session expired. Please sign in again.";
  if (status === 403) return "You do not have permission to do this.";
  if (status === 404) return "That endpoint does not exist on the backend.";

  return fallback;
}
