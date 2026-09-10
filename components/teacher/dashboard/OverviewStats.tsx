"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CalendarClock, ListChecks, type LucideIcon } from "lucide-react";

function GaugeCard({
  label,
  sublabel,
  value,
  color,
}: {
  label: string;
  sublabel: string;
  value: number | null;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, value ?? 0));
  const data = [
    { name: "value", amount: pct },
    { name: "rest", amount: 100 - pct },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground">
        {label.toUpperCase()}
      </p>
      <div className="relative mx-auto mt-1 h-37.5 w-47.5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              dataKey="amount"
              cx="50%"
              cy={86}
              startAngle={180}
              endAngle={0}
              innerRadius={58}
              outerRadius={78}
              cornerRadius={6}
              strokeWidth={0}
              isAnimationActive={false}
            >
              <Cell fill={value == null ? "var(--color-muted)" : color} />
              <Cell fill="var(--color-muted)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-x-0 top-15.5 flex flex-col items-center">
          <p className="text-2xl font-bold text-card-foreground">
            {value != null ? `${value.toFixed(0)}%` : "—"}
          </p>
        </div>
        <div className="absolute inset-x-0 top-24 flex flex-col items-center px-2">
          <p className="text-center text-[11px] leading-tight text-muted-foreground">{sublabel}</p>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  sublabel,
  sublabelClass,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  sublabel: string;
  sublabelClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={1.75} />
        </div>
      </div>
      <p className="text-xs font-semibold tracking-wide text-muted-foreground">
        {label.toUpperCase()}
      </p>
      <p className="mt-1 text-3xl font-bold text-card-foreground">{value}</p>
      <p className={`mt-1 text-xs ${sublabelClass ?? "text-muted-foreground"}`}>{sublabel}</p>
    </div>
  );
}

export default function OverviewStats({
  avgPerformancePercent,
  dueSoonCount,
  overdueCount,
  quizzesLiveCount,
}: {
  avgPerformancePercent: number | null;
  dueSoonCount: number;
  overdueCount: number;
  quizzesLiveCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <GaugeCard
        label="Average performance"
        sublabel="Across all graded work"
        value={avgPerformancePercent}
        color="#4f46e5"
      />
      <StatTile
        icon={CalendarClock}
        iconBg="bg-amber-100 dark:bg-amber-950/40"
        iconColor="text-amber-700 dark:text-amber-400"
        label="Due this week"
        value={dueSoonCount}
        sublabel={overdueCount > 0 ? `${overdueCount} overdue` : "Nothing overdue"}
        sublabelClass={
          overdueCount > 0
            ? "font-semibold text-rose-600 dark:text-rose-400"
            : "text-muted-foreground"
        }
      />
      <StatTile
        icon={ListChecks}
        iconBg="bg-emerald-100 dark:bg-emerald-950/40"
        iconColor="text-emerald-700 dark:text-emerald-400"
        label="Quizzes live"
        value={quizzesLiveCount}
        sublabel="Visible to students now"
      />
    </div>
  );
}
