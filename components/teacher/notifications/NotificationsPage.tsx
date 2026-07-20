
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
 
const typeStyles = {
  Submission: "bg-indigo-100 text-indigo-700",
  Comment: "bg-sky-100 text-sky-700",
  Grade: "bg-emerald-100 text-emerald-700",
  Announcement: "bg-orange-100 text-orange-700",
  Attendance: "bg-teal-100 text-teal-700",
};
 
const typeDot = {
  Submission: "bg-indigo-600",
  Comment: "bg-sky-500",
  Grade: "bg-emerald-500",
  Announcement: "bg-orange-500",
  Attendance: "bg-teal-500",
};
 
const initialNotifications = [
  {
    id: "1",
    actor: "Emma Chen",
    action: "submitted Portfolio Project",
    type: "Submission",
    context: "Web Development",
    time: "10m",
    initials: "EC",
    avatarColor: "bg-violet-100 text-violet-700",
    unread: true,
    group: "Today",
  },
  {
    id: "2",
    actor: "Liam Rai",
    action: "commented on SQL Injection Lab",
    type: "Comment",
    context: "Cybersecurity",
    time: "45m",
    initials: "LR",
    avatarColor: "bg-sky-100 text-sky-700",
    unread: true,
    group: "Today",
  },
  {
    id: "3",
    actor: "",
    action: "You released grades for Quiz 3",
    type: "Grade",
    context: "Database Systems",
    time: "2h",
    initials: "GR",
    avatarColor: "bg-emerald-100 text-emerald-700",
    unread: false,
    group: "Today",
  },
  {
    id: "4",
    actor: "Admin",
    action: "posted: Semester 2 schedule updated",
    type: "Announcement",
    context: "All classrooms",
    time: "Mon",
    initials: "AN",
    avatarColor: "bg-orange-100 text-orange-700",
    unread: true,
    group: "Earlier this week",
  },
  {
    id: "5",
    actor: "Noah Kim",
    action: "submitted Wireframe Task",
    type: "Submission",
    context: "UI/UX Design",
    time: "Mon",
    initials: "NK",
    avatarColor: "bg-violet-100 text-violet-700",
    unread: false,
    group: "Earlier this week",
  },
  {
    id: "6",
    actor: "",
    action: "Reminder: mark attendance for today's class",
    type: "Attendance",
    context: "Cybersecurity",
    time: "Sun",
    initials: "AT",
    avatarColor: "bg-teal-100 text-teal-700",
    unread: false,
    group: "Earlier this week",
  },
];
 
const typeCounts = [
  { type: "Submission", count: 12 },
  { type: "Comment", count: 8 },
  { type: "Grade", count: 3 },
  { type: "Announcement", count: 2 },
  { type: "Attendance", count: 4 },
];
 
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("All");
  const [settings, setSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    submissionAlerts: true,
    weeklyDigest: false,
  });
 
  const unreadCount = notifications.filter((n) => n.unread).length;
 
  const filters = [
    { key: "All", label: "All", count: notifications.length },
    { key: "Unread", label: "Unread", count: unreadCount },
    { key: "Submission", label: "Submission", count: notifications.filter((n) => n.type === "Submission").length },
    { key: "Comment", label: "Comment", count: notifications.filter((n) => n.type === "Comment").length },
    { key: "Grade", label: "Grade", count: notifications.filter((n) => n.type === "Grade").length },
    { key: "Announcement", label: "Announcement", count: notifications.filter((n) => n.type === "Announcement").length },
    { key: "Attendance", label: "Attendance", count: notifications.filter((n) => n.type === "Attendance").length },
  ];
 
  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    if (activeFilter === "Unread") return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);
 
  const grouped = useMemo(() => {
    const today = filtered.filter((n) => n.group === "Today");
    const earlier = filtered.filter((n) => n.group === "Earlier this week");
    return { today, earlier };
  }, [filtered]);
 
  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }
 
  function toggleSetting(key) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }
 
  function NotificationRow({ n }) {
    return (
      <div
        className={`flex items-center gap-3 px-5 py-3.5 ${n.unread ? "bg-indigo-50/50" : "bg-white"}`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${n.avatarColor}`}
        >
          {n.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-slate-800">
            {n.actor && <span className="font-semibold">{n.actor} </span>}
            {n.action}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeStyles[n.type]}`}>
              {n.type}
            </span>
            <span className="text-xs text-slate-400 font-mono">{n.context} · {n.time}</span>
          </div>
        </div>
        {n.unread ? (
          <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
        )}
      </div>
    );
  }
 
  function Toggle({ on, onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={on}
        className={`relative box-border inline-flex h-5 w-9 shrink-0 items-center rounded-full border-0 p-0 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1 ${
          on ? "bg-indigo-600" : "bg-slate-200"
        }`}
        style={{ appearance: "none", WebkitAppearance: "none" }}
      >
        <span
          className={`pointer-events-none absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            on ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    );
  }
 
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6 font-sans" style={{ fontSize: "18px" }}>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-400">
            From your notifications feed · {unreadCount} unread
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="rounded-lg border border-indigo-200 px-3.5 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
        >
          Mark all as read
        </button>
      </div>
 
      {/* Filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-700 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>
 
      <div className="grid grid-cols-3 gap-6">
        {/* Notification list */}
        <div className="col-span-2 min-w-0 space-y-5">
          {grouped.today.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <p className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Today
              </p>
              <div className="divide-y divide-slate-50">
                {grouped.today.map((n) => (
                  <NotificationRow key={n.id} n={n} />
                ))}
              </div>
            </div>
          )}
 
          {grouped.earlier.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <p className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Earlier this week
              </p>
              <div className="divide-y divide-slate-50">
                {grouped.earlier.map((n) => (
                  <NotificationRow key={n.id} n={n} />
                ))}
              </div>
            </div>
          )}
 
          {filtered.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">
              No notifications in this filter.
            </div>
          )}
        </div>
 
        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">This week · by type</h3>
            <div className="space-y-3">
              {typeCounts.map((t) => (
                <div key={t.type} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <span className={`h-2 w-2 rounded-full ${typeDot[t.type]}`} />
                    {t.type}
                  </span>
                  <span className="font-semibold text-slate-800 font-mono">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
 
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Notification settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Email alerts</span>
                <Toggle on={settings.emailAlerts} onClick={() => toggleSetting("emailAlerts")} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Push notifications</span>
                <Toggle on={settings.pushNotifications} onClick={() => toggleSetting("pushNotifications")} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Submission alerts</span>
                <Toggle on={settings.submissionAlerts} onClick={() => toggleSetting("submissionAlerts")} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Weekly digest</span>
                <Toggle on={settings.weeklyDigest} onClick={() => toggleSetting("weeklyDigest")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 