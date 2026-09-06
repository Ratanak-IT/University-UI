"use client";

import { DRM_PROTECTION_LEVELS, DRMProtectionLevel } from "@/lib/types/initialLessonFormData";
import { Settings2, ShieldCheck, Calendar, Timer, CheckCircle2 } from "lucide-react";
import { Switch } from "./Switch";
Settings2

interface LessonSettingsPanelProps {
  allowDownload: boolean;
  onAllowDownloadChange: (value: boolean) => void;
  drmProtectionLevel: DRMProtectionLevel;
  onDrmProtectionLevelChange: (value: DRMProtectionLevel) => void;
  releaseDate: string | null;
  onReleaseDateChange: (value: string | null) => void;
  timeLimit: string | null;
}

export function LessonSettingsPanel({
  allowDownload,
  onAllowDownloadChange,
  drmProtectionLevel,
  onDrmProtectionLevelChange,
  releaseDate,
  onReleaseDateChange,
  timeLimit,
}: LessonSettingsPanelProps) {
  return (
    <aside className="w-full max-w-sm shrink-0 rounded-xl border border-border bg-card p-5">
      <div className="mb-5 flex items-center gap-2">
        <Settings2 className="h-4 w-4 text-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Lesson Settings</h2>
      </div>

      {/* DRM & Security */}
      <section className="border-t border-border pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground">
            DRM &amp; SECURITY
          </h3>
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-foreground">Allow Download</span>
          <Switch
            checked={allowDownload}
            onCheckedChange={onAllowDownloadChange}
            label="Allow Download"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            DRM Protection Level
          </label>
          <div className="relative">
            <select
              value={drmProtectionLevel}
              onChange={(e) => onDrmProtectionLevelChange(e.target.value as DRMProtectionLevel)}
              className="w-full appearance-none rounded-md border border-border bg-background py-2 pl-3 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {DRM_PROTECTION_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <ShieldCheck className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Availability */}
      <section className="mt-5 border-t border-border pt-4">
        <h3 className="mb-4 text-xs font-semibold tracking-wide text-muted-foreground">
          AVAILABILITY
        </h3>

        <button
          type="button"
          onClick={() => onReleaseDateChange(releaseDate)}
          className="mb-3 flex w-full items-center gap-3 rounded-md border border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
        >
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            <span className="block text-xs text-muted-foreground">Release Date</span>
            <span className="block text-sm font-medium text-foreground">
              {releaseDate ?? "Pick date & time..."}
            </span>
          </span>
        </button>

        <div className="flex w-full items-center gap-3 rounded-md border border-border px-3 py-2.5">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span>
            <span className="block text-xs text-muted-foreground">Time Limit</span>
            <span className="block text-sm font-medium text-foreground">
              {timeLimit ?? "No Limit"}
            </span>
          </span>
        </div>
      </section>

      {/* Auto-save notice */}
      <div className="mt-5 flex items-start gap-2 rounded-md bg-primary/10 px-3 py-3 text-sm text-primary dark:text-gray-200">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Auto-save active. Last draft saved just now.</span>
      </div>
    </aside>
  );
}