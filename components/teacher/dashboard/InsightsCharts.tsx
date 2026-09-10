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
import { BarChart3, FileCheck2 } from "lucide-react";
import type { StudentMetrics } from "@/lib/api/teacher";

export type SubmissionRow = {
  id: string;
  title: string;
  classCode: string;
  submitted: number;
  total: number;
};

type Band = { label: string; min: number; max: number };

const PERFORMANCE_BANDS: Band[] = [
  { label: "90–100", min: 90, max: 101 },
  { label: "80–89", min: 80, max: 90 },
  { label: "70–79", min: 70, max: 80 },
  { label: "60–69", min: 60, max: 70 },
  { label: "Below 60", min: 0, max: 60 },
];

function bucketize(values: number[], bands: Band[]) {
  return bands.map((b) => ({
    label: b.label,
    count: values.filter((v) => v >= b.min && v < b.max).length,
  }));
}

/** Completion-rate color: healthy (emerald) → falling behind (rose), so a low bar reads as urgent without relying on the number alone. */
function submissionColor(pct: number) {
  if (pct >= 90) return "#10b981";
  if (pct >= 60) return "#0ea5e9";
  if (pct >= 30) return "#f59e0b";
  return "#f43f5e";
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

function SubmissionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { title: string; classCode: string; submitted: number; total: number; pct: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const { title, classCode, submitted, total, pct } = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-card-foreground">{title}</p>
      <p className="text-muted-foreground">
        {classCode} · {submitted}/{total} submitted ({pct}%)
      </p>
    </div>
  );
}

function EmptyState({ text, hint }: { text: string; hint: string }) {
  return (
    <div className="flex h-55 flex-col items-center justify-center gap-1 text-center">
      <p className="text-sm font-medium text-card-foreground">{text}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
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

export default function InsightsCharts({
  studentMetrics,
  submissionRows,
  submissionsLoading,
}: {
  studentMetrics: StudentMetrics[];
  submissionRows: SubmissionRow[];
  submissionsLoading?: boolean;
}) {
  const performanceData = useMemo(() => {
    const values = studentMetrics
      .map((s) => s.performancePercent)
      .filter((v): v is number => v != null);
    return { values, buckets: bucketize(values, PERFORMANCE_BANDS) };
  }, [studentMetrics]);

  const submissionData = useMemo(
    () =>
      submissionRows.map((r) => {
        const pct = r.total > 0 ? Math.round((r.submitted / r.total) * 100) : 0;
        const label = r.title.length > 24 ? `${r.title.slice(0, 23)}…` : r.title;
        return {
          label: `${label} · ${r.classCode}`,
          title: r.title,
          classCode: r.classCode,
          submitted: r.submitted,
          total: r.total,
          pct,
          color: submissionColor(pct),
        };
      }),
    [submissionRows]
  );

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <ChartCard
        icon={BarChart3}
        title="Performance distribution"
        subtitle="Students by graded-work score band"
      >
        {performanceData.values.length === 0 ? (
          <EmptyState text="No graded scores yet" hint="Check back once grades are recorded." />
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
        icon={FileCheck2}
        title="Submission progress"
        subtitle="Assignments due soon, by % of roster submitted"
      >
        {submissionsLoading ? (
          <div className="h-55 animate-pulse rounded-xl bg-muted" />
        ) : submissionData.length === 0 ? (
          <EmptyState text="No assignments due soon" hint="Rows appear once an assignment has a due date." />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={submissionData}
              layout="vertical"
              margin={{ top: 0, right: 44, bottom: 0, left: 0 }}
              barCategoryGap={14}
            >
              <CartesianGrid horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="label"
                width={150}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              />
              <Tooltip content={<SubmissionTooltip />} cursor={{ fill: "var(--color-muted)" }} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {submissionData.map((entry) => (
                  <Cell key={entry.title + entry.classCode} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="pct"
                  position="right"
                  content={(props: { x?: string | number; y?: string | number; width?: string | number; height?: string | number; index?: number }) => {
                    const row = props.index != null ? submissionData[props.index] : undefined;
                    if (!row) return null;
                    const x = Number(props.x ?? 0) + Number(props.width ?? 0) + 8;
                    const y = Number(props.y ?? 0) + Number(props.height ?? 0) / 2;
                    return (
                      <text
                        x={x}
                        y={y}
                        dy={4}
                        fontSize={12}
                        fontWeight={600}
                        fill="var(--color-muted-foreground)"
                      >
                        {row.submitted}/{row.total}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
