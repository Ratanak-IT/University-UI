"use client";

import { ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { EngagementPoint } from "@/lib/types/dashboard";

export default function EngagementChart({ data }: { data: EngagementPoint[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-card-foreground">
          Student Engagement Trends
        </h2>
        <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted">
          Last 30 Days
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="day" hide />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--card-foreground)",
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "var(--primary)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}