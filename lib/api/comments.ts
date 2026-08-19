import { API_BASE } from "./config";


export interface MentionUser {
  userId: string;
  fullName: string;
  nameKhmer?: string | null;
  email?: string | null;
  role: string;
  avatarUrl?: string | null;
}


export type CommentScope =
  | { kind: "classroom"; id: string }
  | { kind: "assignment"; id: string };

function scopePath(scope: CommentScope): string {
  return scope.kind === "classroom"
    ? `/classrooms/${scope.id}`
    : `/assignments/${scope.id}`;
}

export interface Comment {
  commentId: string;
  classroomId: string;
  assignmentId?: string | null;
  parentId?: string | null;
  body: string;
  edited: boolean;
  authorUserId: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl?: string | null;
  mentions: MentionUser[];
  replies: Comment[];
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCommentPayload {
  body: string;
  parentId?: string | null;
  mentionedUserIds?: string[];
}

export interface UpdateCommentPayload {
  body: string;
  mentionedUserIds?: string[];
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


export function fetchComments(scope: CommentScope): Promise<Comment[]> {
  return request<Comment[]>(
    `${scopePath(scope)}/comments`,
    { method: "GET", cache: "no-store" },
    "Could not load the discussion"
  );
}

export function createComment(
  scope: CommentScope,
  payload: CreateCommentPayload
): Promise<Comment> {
  return request<Comment>(
    `${scopePath(scope)}/comments`,
    { method: "POST", body: JSON.stringify(payload) },
    "Could not post your comment"
  );
}

export function updateComment(
  commentId: string,
  payload: UpdateCommentPayload
): Promise<Comment> {
  return request<Comment>(
    `/comments/${commentId}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    "Could not save your edit"
  );
}

export function deleteComment(commentId: string): Promise<void> {
  return request<void>(
    `/comments/${commentId}`,
    { method: "DELETE" },
    "Could not delete the comment"
  );
}

export function fetchMentionableMembers(
  scope: CommentScope,
  query = ""
): Promise<MentionUser[]> {
  const qs = query.trim() ? `?query=${encodeURIComponent(query.trim())}` : "";
  return request<MentionUser[]>(
    `${scopePath(scope)}/mentionable-members${qs}`,
    { method: "GET", cache: "no-store" },
    "Could not load classroom members"
  );
}