import { API_BASE } from "./config";

export interface PrivateComment {
  commentId: string;
  assignmentId: string;
  studentId: string;
  authorUserId: string;
  authorName: string;
  /** "STUDENT" or "TEACHER" — the only two parties a private thread can have. */
  authorRole: "STUDENT" | "TEACHER";
  authorAvatarUrl?: string | null;
  body: string;
  createdAt: string;
}

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return data?.detail || data?.message || data?.title || fallback;
  } catch {
    return `${fallback} (${res.status})`;
  }
}

async function request<T>(
  path: string,
  init: RequestInit,
  fallbackError: string
): Promise<T> {
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) throw new Error(await readError(res, fallbackError));
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** A student reading their own private thread for one assignment. */
export function fetchMyPrivateComments(assignmentId: string): Promise<PrivateComment[]> {
  return request<PrivateComment[]>(
    `/assignments/${assignmentId}/private-comments`,
    { method: "GET", cache: "no-store" },
    "Could not load private comments"
  );
}

/** A student posting to their own private thread. */
export function postMyPrivateComment(
  assignmentId: string,
  body: string
): Promise<PrivateComment> {
  return request<PrivateComment>(
    `/assignments/${assignmentId}/private-comments`,
    { method: "POST", body: JSON.stringify({ body }) },
    "Could not send your comment"
  );
}

/** A teacher (or admin) reading one specific student's private thread. */
export function fetchStudentPrivateComments(
  assignmentId: string,
  studentId: string
): Promise<PrivateComment[]> {
  return request<PrivateComment[]>(
    `/assignments/${assignmentId}/students/${studentId}/private-comments`,
    { method: "GET", cache: "no-store" },
    "Could not load private comments"
  );
}

/** A teacher (or admin) posting to one specific student's private thread. */
export function postStudentPrivateComment(
  assignmentId: string,
  studentId: string,
  body: string
): Promise<PrivateComment> {
  return request<PrivateComment>(
    `/assignments/${assignmentId}/students/${studentId}/private-comments`,
    { method: "POST", body: JSON.stringify({ body }) },
    "Could not send your comment"
  );
}
