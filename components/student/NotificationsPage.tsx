"use client";

import { useState } from "react";

type NotificationType =
  | "GRADE"
  | "ASSIGNMENT"
  | "COMMENT"
  | "ANNOUNCEMENT"
  | "ATTENDANCE";

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
  GRADE: "bg-emerald-100 text-emerald-700",
  ASSIGNMENT: "bg-indigo-100 text-indigo-700",
  COMMENT: "bg-sky-100 text-sky-700",
  ANNOUNCEMENT: "bg-orange-100 text-orange-700",
  ATTENDANCE: "bg-teal-100 text-teal-700",
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    initials: "DK",
    avatarClass: "bg-emerald-100 text-emerald-700",
    actor: "Dr. Dara Kim",
    action: "released your grade for Midterm Project",
    type: "GRADE",
    context: "Spring Boot",
    time: "10m",
    unread: true,
  },
  {
    id: "2",
    initials: "SR",
    avatarClass: "bg-sky-100 text-sky-700",
    actor: "Sokha Rin",
    action: "commented on your Linked List submission",
    type: "COMMENT",
    context: "Data Structure",
    time: "45m",
    unread: true,
  },
  {
    id: "3",
    initials: "MR",
    avatarClass: "bg-indigo-100 text-indigo-700",
    actor: "Marcus Reed",
    action: "posted a new assignment: Sprint Retrospective",
    type: "ASSIGNMENT",
    context: "Software Engineering",
    time: "2h",
    unread: true,
  },
  {
    id: "4",
    initials: "AN",
    avatarClass: "bg-orange-100 text-orange-700",
    actor: "Admin posted:",
    action: "Semester 2 schedule updated",
    type: "ANNOUNCEMENT",
    context: "All classes",
    time: "Mon",
    unread: false,
  },
  {
    id: "5",
    initials: "LP",
    avatarClass: "bg-teal-100 text-teal-700",
    actor: "Linda Park",
    action: "marked you present for today's class",
    type: "ATTENDANCE",
    context: "Operating System",
    time: "Mon",
    unread: false,
  },
  {
    id: "6",
    initials: "ER",
    avatarClass: "bg-indigo-100 text-indigo-700",
    actor: "Reminder:",
    action: "submit your Network Topology report by Friday",
    type: "ASSIGNMENT",
    context: "Computer Network",
    time: "Sun",
    unread: false,
  },
];

const byType = [
  { label: "GRADE", value: 3, dotClass: "bg-emerald-500" },
  { label: "ASSIGNMENT", value: 8, dotClass: "bg-indigo-500" },
  { label: "COMMENT", value: 5, dotClass: "bg-sky-500" },
  { label: "ANNOUNCEMENT", value: 2, dotClass: "bg-orange-500" },
  { label: "ATTENDANCE", value: 6, dotClass: "bg-teal-500" },
];

type TabValue = "ALL" | "UNREAD" | NotificationType;

function NotificationRow({
  item,
  onToggleRead,
}: {
  item: Notification;
  onToggleRead: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggleRead(item.id)}
      className="flex w-full items-center gap-4 rounded-xl border border-slate-100 bg-white px-5 py-4 text-left hover:bg-slate-50/60"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.avatarClass}`}
      >
        {item.initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-slate-800">
          <span className="font-semibold">{item.actor}</span> {item.action}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${typeBadgeClass[item.type]}`}
          >
            {item.type}
          </span>
          <span className="text-xs text-slate-400">{item.context}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-400">{item.time}</span>
        </div>
      </div>
      {item.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
    </button>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<TabValue>("ALL");
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    grade: true,
    weekly: false,
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const tabs: { label: string; value: TabValue; count: number }[] = [
    { label: "All", value: "ALL", count: notifications.length },
    { label: "Unread", value: "UNREAD", count: unreadCount },
    {
      label: "Grade",
      value: "GRADE",
      count: notifications.filter((n) => n.type === "GRADE").length,
    },
    {
      label: "Assignment",
      value: "ASSIGNMENT",
      count: notifications.filter((n) => n.type === "ASSIGNMENT").length,
    },
    {
      label: "Comment",
      value: "COMMENT",
      count: notifications.filter((n) => n.type === "COMMENT").length,
    },
    {
      label: "Announcement",
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

  const todayItems = filtered.filter((n) => ["1", "2", "3"].includes(n.id));
  const earlierItems = filtered.filter((n) => !["1", "2", "3"].includes(n.id));

  function toggleRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function toggleSetting(key: keyof typeof settings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const settingRows: { key: keyof typeof settings; label: string }[] = [
    { key: "email", label: "Email alerts" },
    { key: "push", label: "Push notifications" },
    { key: "grade", label: "Grade alerts" },
    { key: "weekly", label: "Weekly digest" },
  ];

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            From your notifications feed · {unreadCount} unread
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-5 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? "bg-indigo-700 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 text-xs font-semibold ${
                    activeTab === tab.value
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-200 px-5 py-8 text-center text-sm text-slate-400">
              No notifications in this category.
            </p>
          )}

          {todayItems.length > 0 && (
            <>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Today
              </p>
              <div className="space-y-2.5">
                {todayItems.map((item) => (
                  <NotificationRow key={item.id} item={item} onToggleRead={toggleRead} />
                ))}
              </div>
            </>
          )}

          {earlierItems.length > 0 && (
            <>
              <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
                Earlier this week
              </p>
              <div className="space-y-2.5">
                {earlierItems.map((item) => (
                  <NotificationRow key={item.id} item={item} onToggleRead={toggleRead} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-900">This week · by type</h2>
            <ul className="space-y-3">
              {byType.map((item) => (
                <li key={item.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.dotClass}`} />
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-900">Notification settings</h2>
            <ul className="space-y-4">
              {settingRows.map((row) => (
                <li key={row.key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{row.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings[row.key]}
                    onClick={() => toggleSetting(row.key)}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      flexShrink: 0,
                      height: "24px",
                      width: "44px",
                      borderRadius: "9999px",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      backgroundColor: settings[row.key] ? "#4f46e5" : "#e2e8f0",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "2px",
                        left: settings[row.key] ? "22px" : "2px",
                        height: "20px",
                        width: "20px",
                        borderRadius: "9999px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                        transition: "left 0.15s ease",
                      }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
