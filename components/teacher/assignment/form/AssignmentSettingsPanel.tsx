// features/assignments/form/AssignmentSettingsPanel.tsx

"use client";

import { AssignmentFormValues } from "@/lib/types/AssignmentFormValues";
import { Calendar, Clock } from "lucide-react";
import { LabeledDropdown } from "./LabeledDropdown";
import { courseOptions, recipientOptions } from "@/lib/data/defaultAssignmentForm";


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
      <Field label="FOR">
        <LabeledDropdown
          options={courseOptions.map((c) => ({
            id: c.id,
            label: c.name,
            subtitle: c.subtitle,
          }))}
          selectedId={values.courseId}
          onChange={(id) => onChange("courseId", id)}
        />
      </Field>

      <Field label="" className="mt-3">
        <LabeledDropdown
          options={recipientOptions.map((r) => ({
            id: r.id,
            label: r.label,
            subtitle: r.subtitle,
          }))}
          selectedId={values.recipientId}
          onChange={(id) => onChange("recipientId", id)}
        />
      </Field>

      <Field label="POINTS" className="mt-6">
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

      <Field label="TOPIC" className="mt-6">
        <input
          type="text"
          value={values.topic}
          onChange={(e) => onChange("topic", e.target.value)}
          placeholder="e.g. Ecosystems"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </Field>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <span className="text-sm text-foreground">Check plagiarism</span>
        <Toggle
          checked={values.checkPlagiarism}
          onChange={(checked) => onChange("checkPlagiarism", checked)}
        />
      </div>
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

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}