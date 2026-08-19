import { API_BASE } from "./config";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  context?: string | null;
  actor?: string | null;

  link?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  isRead: boolean;
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

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function fetchNotifications(): Promise<AppNotification[]> {
  return request<AppNotification[]>("/notifications", {
    method: "GET",
    cache: "no-store",
  });
}

export function fetchUnreadCount(): Promise<{ unreadCount: number }> {
  return request<{ unreadCount: number }>("/notifications/unread-count", {
    method: "GET",
    cache: "no-store",
  });
}

export function markNotificationRead(id: string): Promise<AppNotification> {
  return request<AppNotification>(`/notifications/${id}/read`, { method: "PUT" });
}

export function markAllNotificationsRead(): Promise<{ message: string }> {
  return request<{ message: string }>("/notifications/read-all", { method: "PUT" });
}


export function notificationHref(
  n: AppNotification,
  isStudent: boolean
): string | null {
  if (n.link) return n.link;

  if (n.resourceType === "CLASSROOM" && n.resourceId) {
    return isStudent
      ? `/dashboard/student/my-classes/${n.resourceId}`
      : `/dashboard/teacher/my-classroom/${n.resourceId}`;
  }
  return null;
}
