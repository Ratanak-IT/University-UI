"use client";

import { Calendar, Info } from "lucide-react";

interface ScheduleSidebarProps {
  openingDate: string;
  onOpeningDateChange: (value: string) => void;
  timeLimitMinutes: string;
  onTimeLimitMinutesChange: (value: string) => void;
}

export function ScheduleSidebar({
  openingDate,
  onOpeningDateChange,
  timeLimitMinutes,
  onTimeLimitMinutesChange,
}: ScheduleSidebarProps) {
  return (
    <aside className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-foreground" />
        <h2 className="text-sm font-semibold tracking-wide text-foreground">SCHEDULE</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-foreground">Opening Date</label>
          <input
            type="date"
            value={openingDate}
            onChange={(e) => onOpeningDateChange(e.target.value)}
            placeholder="mm/dd/yyyy"
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-foreground">Time Limit (Minutes)</label>
          <input
            type="number"
            value={timeLimitMinutes}
            onChange={(e) => onTimeLimitMinutesChange(e.target.value)}
            placeholder="e.g. 60"
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-start gap-2 rounded-md bg-primary/10 px-3 py-3 text-sm text-primary">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Scheduling defaults to your current classroom timezone (ICT).</span>
        </div>
      </div>
    </aside>
  );
}