// features/assignments/form/AssignmentSettingsPanel.tsx

"use client";

import { AssignmentFormValues } from "@/lib/types/AssignmentFormValues";
import { Calendar, Clock } from "lucide-react";


interface AssignmentSettingsPanelProps {
  values: AssignmentFormValues;
  onChange: <K extends keyof AssignmentFormValues>(
    key: K,
    value: AssignmentFormValues[K],
  ) => void;
}

export function AssignmentSettingsPanel({
  values,
  onChange,
}: AssignmentSettingsPanelProps) {
  return (
    <div className="rounded-xl border border-border p-6">
      <Field label="POINTS">
        <input
          type="number"
          min={0}
          value={values.points}
          onChange={(e) =>
            onChange(
              "points",
              e.target.value === "" ? "" : Number(e.target.value),
            )
          }
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none"
        />
      </Field>

      <Field label="DUE" className="mt-6">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="date"
            value={values.dueDate}
            onChange={(e) => onChange("dueDate", e.target.value)}
            className="w-full bg-transparent text-sm text-foreground focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="time"
            value={values.dueTime}
            onChange={(e) => onChange("dueTime", e.target.value)}
            className="w-full bg-transparent text-sm text-foreground focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </Field>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      {label && (
        <span className="mb-2 block text-xs font-medium tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
