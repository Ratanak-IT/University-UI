"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type GaugeCardProps = {
  label: string;
  sublabel: string;
  value: number | null;
  color: string;
};

function GaugeCard({ label, sublabel, value, color }: GaugeCardProps) {
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

export default function PerformanceGauges({
  avgAttendancePercent,
  avgPerformancePercent,
}: {
  avgAttendancePercent: number | null;
  avgPerformancePercent: number | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <GaugeCard
        label="Average attendance"
        sublabel="Across all your classrooms"
        value={avgAttendancePercent}
        color="#10b981"
      />
      <GaugeCard
        label="Average performance"
        sublabel="Across all graded work"
        value={avgPerformancePercent}
        color="#4f46e5"
      />
    </div>
  );
}
