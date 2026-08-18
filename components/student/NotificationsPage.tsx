"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Megaphone,
  Star,
  UserCheck,
  Bell,
} from "lucide-react";

type NotificationType =
  | "GRADE"
  | "ASSIGNMENT"
  | "CERTIFICATE"
  | "ANNOUNCEMENT"
  | "ATTENDANCE";

type TabValue = "ALL" | "UNREAD" | NotificationType;

type Notification = {
  id: string;
  initials: string;
  avatarClass: string;
  actor: string;
  action: string;
  type: NotificationType;
  context: string;
  time: string;
  unread: boolean;
};

const typeBadgeClass: Record<NotificationType, string> = {
  GRADE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  ASSIGNMENT: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
  CERTIFICATE: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  ANNOUNCEMENT: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
  ATTENDANCE: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
};

const typeIconMap: Record<NotificationType, React.ElementType> = {
  GRADE: Star,
  ASSIGNMENT: BookOpen,
  CERTIFICATE: Award,
  ANNOUNCEMENT: Megaphone,
  ATTENDANCE: UserCheck,
};

function NotificationRow({
  item,
  onToggleRead,
}: {
  item: Notification;
  onToggleRead: (id: string) => void;
}) {
  const IconComponent = typeIconMap[item.type];

  return (
    <button
      type="button"
      onClick={() => onToggleRead(item.id)}
      className={`flex w-full items-start gap-4 rounded-2xl border p-4.5 text-left transition-all ${
        item.unread
          ? "border-indigo-200/80 bg-indigo-50/40 dark:border-indigo-900/50 dark:bg-indigo-950/20"
          : "border-border bg-card text-card-foreground hover:bg-muted/40"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-sm ${item.avatarClass}`}
      >
        {item.initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground leading-snug">
          <strong className="font-extrabold text-foreground">{item.actor}</strong> {item.action}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${typeBadgeClass[item.type]}`}
          >
            <IconComponent className="h-3 w-3" />
            {item.type}
          </span>
          <span className="font-semibold text-muted-foreground">{item.context}</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-muted-foreground">{item.time}</span>
        </div>
      </div>

      {item.unread && (
        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-sm" />
      )}
    </button>
  );
}

import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/lib/redux/apiSlice";
import { Loader2 } from "lucide-react";
import { TableRowsSkeleton } from "@/components/shared/Skeletons";

export default function NotificationsPage() {
  const { data: apiNotifications = [], isLoading } = useGetMyNotificationsQuery();
  const [markSingleRead] = useMarkNotificationReadMutation();
  const [markAllReadApi] = useMarkAllNotificationsReadMutation();

  const [activeTab, setActiveTab] = useState<TabValue>("ALL");

  const notifications: Notification[] = apiNotifications.map((n: any) => ({
    id: n.id || n.notificationId,
    initials: n.actor ? n.actor.substring(0, 2).toUpperCase() : "UM",
    avatarClass: typeBadgeClass[n.type as NotificationType] || "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
    actor: n.actor || n.title || "System",
    action: n.message || n.title,
    type: (n.type as NotificationType) || "ANNOUNCEMENT",
    context: n.context || "Notification",
    time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now",
    unread: !n.isRead,
  }));

  const unreadCount = notifications.filter((n) => n.unread).length;

  const tabs: { label: string; value: TabValue; count: number }[] = [
    { label: "All Feed", value: "ALL", count: notifications.length },
    { label: "Unread", value: "UNREAD", count: unreadCount },
    {
      label: "Grades",
      value: "GRADE",
      count: notifications.filter((n) => n.type === "GRADE").length,
    },
    {
      label: "Assignments & Quizzes",
      value: "ASSIGNMENT",
      count: notifications.filter((n) => n.type === "ASSIGNMENT").length,
    },
    {
      label: "Certificates",
      value: "CERTIFICATE",
      count: notifications.filter((n) => n.type === "CERTIFICATE").length,
    },
    {
      label: "Announcements",
      value: "ANNOUNCEMENT",
      count: notifications.filter((n) => n.type === "ANNOUNCEMENT").length,
    },
    {
      label: "Attendance",
      value: "ATTENDANCE",
      count: notifications.filter((n) => n.type === "ATTENDANCE").length,
    },
  ];

  const filtered = notifications.filter((n) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "UNREAD") return n.unread;
    return n.type === activeTab;
  });

  async function toggleRead(id: string) {
    try {
      await markSingleRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  }

  async function markAllRead() {
    try {
      await markAllReadApi().unwrap();
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="h-16 w-1/3 animate-pulse rounded-xl bg-muted" />
        <TableRowsSkeleton rows={6} cols={3} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Bell className="h-4 w-4" />
            University Notifications Center
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Academic Feed & Alerts
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Live updates on grades, quiz releases, certificate approvals, and university announcements.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Mark all as read
        </button>
      </div>

      <div className="space-y-5">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === tab.value
                  ? "bg-indigo-600 text-white shadow-md dark:bg-indigo-600"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  activeTab === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Feed List */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            <Bell className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-bold text-foreground">No notifications found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You are all caught up for this category.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <NotificationRow key={item.id} item={item} onToggleRead={toggleRead} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}