"use client";

import { Settings, ShieldCheck, Calendar, Timer, CloudCheck } from "lucide-react";
import type { DRMProtectionLevel } from "./types";

interface LessonSettingsPanelProps {
  allowDownload: boolean;
  onAllowDownloadChange: (value: boolean) => void;
  drmProtectionLevel: DRMProtectionLevel;
  onDrmProtectionLevelChange: (value: DRMProtectionLevel) => void;
  releaseDate: string;
  onReleaseDateChange: (value: string) => void;
  timeLimitMinutes: number | null;
  onTimeLimitMinutesChange: (value: number | null) => void;
  lastSavedLabel: string | null;
}

const DRM_LEVEL_LABELS: Record<DRMProtectionLevel, string> = {
  none: "No Protection",
  standard: "Standard Encryption",
  strict: "Strict (No Copy/Print)",
};

export default function LessonSettingsPanel({
  allowDownload,
  onAllowDownloadChange,
  drmProtectionLevel,
  onDrmProtectionLevelChange,
  releaseDate,
  onReleaseDateChange,
  timeLimitMinutes,
  onTimeLimitMinutesChange,
  lastSavedLabel,
}: LessonSettingsPanelProps) {
  return (
    <aside className="w-full space-y-6 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          Lesson Settings
        </h2>
      </div>

      <section className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground">
            DRM &amp; SECURITY
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Allow Download</span>
          <button
            type="button"
            role="switch"
            aria-checked={allowDownload}
            onClick={() => onAllowDownloadChange(!allowDownload)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              allowDownload ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
                allowDownload ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            DRM Protection Level
          </label>
          <select
            value={drmProtectionLevel}
            onChange={(e) =>
              onDrmProtectionLevelChange(e.target.value as DRMProtectionLevel)
            }
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          >
            {Object.entries(DRM_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground">
          AVAILABILITY
        </h3>

        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1 space-y-1">
            <label className="text-sm text-foreground">Release Date</label>
            <input
              type="datetime-local"
              value={releaseDate}
              onChange={(e) => onReleaseDateChange(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Timer className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1 space-y-1">
            <label className="text-sm text-foreground">Time Limit</label>
            <select
              value={timeLimitMinutes ?? "none"}
              onChange={(e) =>
                onTimeLimitMinutesChange(
                  e.target.value === "none" ? null : Number(e.target.value)
                )
              }
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="none">No Limit</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex items-start gap-2 rounded-lg bg-primary/10 p-3">
        <CloudCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs text-foreground">
          Auto-save active. {lastSavedLabel ?? "Last draft saved just now."}
        </p>
      </div>
    </aside>
  );
}