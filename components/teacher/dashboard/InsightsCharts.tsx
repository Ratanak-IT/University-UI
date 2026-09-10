"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, ShieldAlert } from "lucide-react";
import type { StudentMetrics } from "@/lib/api/teacher";

type Band = { label: string; min: number; max: number; color?: string };

const PERFORMANCE_BANDS: Band[] = [
  { label: "90–100", min: 90, max: 101 },
  { label: "80–89", min: 80, max: 90 },
  { label: "70–79", min: 70, max: 80 },
  { label: "60–69", min: 60, max: 70 },
  { label: "Below 60", min: 0, max: 60 },
];

const ATTENDANCE_BANDS: Band[] = [
  { label: "Excellent · 95%+", min: 95, max: 101, color: "#10b981" },
  { label: "Good · 85–94%", min: 85, max: 95, color: "#0ea5e9" },
  { label: "At risk · 70–84%", min: 70, max: 85, color: "#f59e0b" },
  { label: "Critical · under 70%", min: 0, max: 70, color: "#f43f5e" },
];

function bucketize(values: number[], bands: Band[]) {
  return bands.map((b) => ({
    label: b.label,
    count: values.filter((v) => v >= b.min && v < b.max).length,
    color: b.color,
  }));
}

function CountTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { label: string; count: number } }> }) {
  if (!active || !payload?.length) return null;
  const { label, count } = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-card-foreground">{label}</p>
      <p className="text-muted-foreground">
        {count} {count === 1 ? "student" : "students"}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center gap-1 text-center">
      <p className="text-sm font-medium text-card-foreground">{text}</p>
      <p className="text-xs text-muted-foreground">Check back once grades or attendance are recorded.</p>
    </div>
  );
}

function ChartCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof BarChart3;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
        <div>
          <h3 className="text-sm font-bold text-card-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function InsightsCharts({ studentMetrics }: { studentMetrics: StudentMetrics[] }) {
  const performanceData = useMemo(() => {
    const values = studentMetrics
      .map((s) => s.performancePercent)
      .filter((v): v is number => v != null);
    return { values, buckets: bucketize(values, PERFORMANCE_BANDS) };
  }, [studentMetrics]);

  const attendanceData = useMemo(() => {
    const values = studentMetrics
      .map((s) => s.attendancePercent)
      .filter((v): v is number => v != null);
    return { values, buckets: bucketize(values, ATTENDANCE_BANDS) };
  }, [studentMetrics]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <ChartCard
        icon={BarChart3}
        title="Performance distribution"
        subtitle="Students by graded-work score band"
      >
        {performanceData.values.length === 0 ? (
          <EmptyState text="No graded scores yet" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={performanceData.buckets}
              layout="vertical"
              margin={{ top: 0, right: 28, bottom: 0, left: 0 }}
              barCategoryGap={14}
            >
              <CartesianGrid horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="label"
                width={80}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <Tooltip content={<CountTooltip />} cursor={{ fill: "var(--color-muted)" }} />
              <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} maxBarSize={22}>
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        icon={ShieldAlert}
        title="Attendance health"
        subtitle="Students by overall attendance rate"
      >
        {attendanceData.values.length === 0 ? (
          <EmptyState text="No attendance recorded yet" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={attendanceData.buckets}
              layout="vertical"
              margin={{ top: 0, right: 28, bottom: 0, left: 0 }}
              barCategoryGap={14}
            >
              <CartesianGrid horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="label"
                width={118}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <Tooltip content={<CountTooltip />} cursor={{ fill: "var(--color-muted)" }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {attendanceData.buckets.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
