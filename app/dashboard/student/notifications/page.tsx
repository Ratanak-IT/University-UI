import type { Metadata } from "next";
import { Bell, FileText, Star, CalendarDays } from "lucide-react";

export const metadata: Metadata = { title: "Notifications" };

const items = [
  { title: "Final Exam Schedule Published", body: "Check your timetable for exam dates and rooms.", time: "2 days ago", icon: CalendarDays, tone: "bg-indigo-100 text-indigo-700", unread: true },
  { title: "Grade posted: Wireframe Set", body: "You scored 18/20 in UX Fundamentals.", time: "3 days ago", icon: Star, tone: "bg-emerald-100 text-emerald-700", unread: true },
  { title: "New assignment: Threat Model Report", body: "Due Friday, 11:59 PM in CS-SEC401.", time: "4 days ago", icon: FileText, tone: "bg-amber-100 text-amber-700", unread: false },
  { title: "Room change for CS-DB301", body: "Thursday's class moves to Lab 2.", time: "1 week ago", icon: Bell, tone: "bg-slate-100 text-slate-600", unread: false },
  { title: "Attendance warning: CS-DS210", body: "You're at 78% — below the 80% requirement.", time: "1 week ago", icon: Bell, tone: "bg-rose-100 text-rose-700", unread: false },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-indigo-950">Notifications</h2>
          <p className="mt-1 text-sm text-slate-500">
            {items.filter((i) => i.unread).length} unread
          </p>
        </div>
        <button className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50">
          Mark all read
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <ul className="divide-y divide-slate-100">
          {items.map((n) => {
            const Icon = n.icon;
            return (
              <li
                key={n.title}
                className={`flex items-start gap-4 p-5 transition-colors hover:bg-slate-50 ${n.unread ? "bg-indigo-50/30" : ""}`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${n.tone}`}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-bold text-indigo-950">
                    {n.title}
                    {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{n.body}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{n.time}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
