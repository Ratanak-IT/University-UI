"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ContentLibrarySlice } from "@/lib/types/dashboard";

export default function ContentLibraryCard({ data }: { data: ContentLibrarySlice[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-card-foreground">
        Content Library
      </h2>
      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={85}
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute flex flex-col items-center">
          <p className="text-2xl font-bold text-card-foreground">10</p>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            SUBJECTS
          </p>
        </div>
      </div>
      <ul className="mt-2 space-y-3">
        {data.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-semibold text-card-foreground">
              {item.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}