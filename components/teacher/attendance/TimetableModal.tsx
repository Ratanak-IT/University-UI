"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, Plus, Trash2, X } from "lucide-react";
import { toast } from "@/components/shared/Toast";
import { apiErrorMessage } from "@/lib/api/errors";
import {
  useGenerateSessionsMutation,
  useGetScheduleQuery,
  useSaveScheduleMutation,
} from "@/lib/redux/apiSlice";
import type { SessionType, Weekday } from "@/lib/types/attendance";

const DAYS: { value: Weekday; label: string }[] = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

const TYPES: SessionType[] = ["LECTURE", "LAB", "TUTORIAL", "SEMINAR", "EXAM", "OTHER"];

interface Draft {
  dayOfWeek: Weekday;
  startTime: string;
  endTime: string;
  type: SessionType;
}

/**
 * The weekly timetable, and the button that lays it out across the term.
 *
 * <p>Without this, a teacher creates a session by hand for every meeting of
 * every week. With it they describe the pattern once — "Mondays 08:00,
 * Wednesdays 13:00" — and the whole term's registers appear, ready to mark.
 */
export default function TimetableModal({
  open,
  onClose,
  classroomId,
}: {
  open: boolean;
  onClose: () => void;
  classroomId: string;
}) {
  const { data } = useGetScheduleQuery(classroomId, { skip: !classroomId || !open });
  const [saveSchedule, { isLoading: isSaving }] = useSaveScheduleMutation();
  const [generate, { isLoading: isGenerating }] = useGenerateSessionsMutation();

  const [slots, setSlots] = useState<Draft[]>([]);
  const [holidays, setHolidays] = useState("");

  // Loaded during render so the rows are filled on the first paint.
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  if (open && data && loadedFor !== classroomId) {
    setLoadedFor(classroomId);
    setSlots(
      data.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime.slice(0, 5),
        endTime: s.endTime?.slice(0, 5) ?? "",
        type: s.type,
      }))
    );
  }

  const close = () => {
    setLoadedFor(null);
    setHolidays("");
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const update = (index: number, patch: Partial<Draft>) =>
    setSlots((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const handleSave = async () => {
    try {
      await saveSchedule({
        classroomId,
        slots: slots.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          startTime: `${s.startTime}:00`,
          endTime: s.endTime ? `${s.endTime}:00` : null,
          type: s.type,
        })),
      }).unwrap();
      toast.success("Timetable saved. Generate sessions to lay it out across the term.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save the timetable. Please try again."));
    }
  };

  const handleGenerate = async () => {
    try {
      const skipDates = holidays
        .split(/[,\s]+/)
        .map((d) => d.trim())
        .filter(Boolean);

      const result = await generate({ classroomId, skipDates }).unwrap();

      toast.success(
        `${result.created} session${result.created === 1 ? "" : "s"} created` +
          (result.skippedExisting > 0
            ? ` · ${result.skippedExisting} already existed and were left untouched.`
            : ` · from ${result.from} to ${result.to}.`)
      );
      close();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not generate sessions. Please try again."));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="timetable-modal-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 id="timetable-modal-title" className="text-xl font-bold text-card-foreground">
              Weekly timetable
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              When this class meets. Sessions are generated from these slots across the term.
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="text-muted-foreground hover:text-card-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
          {slots.map((slot, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_90px_90px_120px_40px] items-end gap-2 rounded-xl border border-border p-3"
            >
              <Labelled label="Day">
                <select
                  value={slot.dayOfWeek}
                  onChange={(e) => update(index, { dayOfWeek: e.target.value as Weekday })}
                  className={controlClass}
                >
                  {DAYS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </Labelled>

              <Labelled label="Starts">
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => update(index, { startTime: e.target.value })}
                  className={controlClass}
                />
              </Labelled>

              <Labelled label="Ends">
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => update(index, { endTime: e.target.value })}
                  className={controlClass}
                />
              </Labelled>

              <Labelled label="Type">
                <select
                  value={slot.type}
                  onChange={(e) => update(index, { type: e.target.value as SessionType })}
                  className={controlClass}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0) + t.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </Labelled>

              <button
                type="button"
                onClick={() => setSlots((rows) => rows.filter((_, i) => i !== index))}
                title="Remove slot"
                className="mb-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setSlots((rows) => [
                ...rows,
                { dayOfWeek: "MONDAY", startTime: "08:00", endTime: "10:00", type: "LECTURE" },
              ])
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
            Add a slot
          </button>

          <div className="flex flex-col gap-1.5 rounded-xl border border-border p-3">
            <label className="text-xs font-semibold text-muted-foreground">
              Skip these dates
            </label>
            <input
              value={holidays}
              onChange={(e) => setHolidays(e.target.value)}
              placeholder="2026-04-14, 2026-04-15"
              className={controlClass}
            />
            <span className="text-xs text-muted-foreground/80">
              Public holidays and exam weeks. Comma-separated, YYYY-MM-DD.
            </span>
          </div>

          <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            Generating is safe to repeat — sessions that already exist are left
            exactly as they are, so marks already taken are never disturbed.
            Sessions start out as <span className="font-semibold text-foreground">Not taken</span> and
            only count towards attendance once someone marks the register.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4">
          <button
            onClick={close}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save timetable"}
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || slots.length === 0}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <CalendarPlus className="h-4 w-4" />
            {isGenerating ? "Generating…" : "Generate sessions"}
          </button>
        </div>
      </div>
    </div>
  );
}

const controlClass =
  "h-[42px] w-full rounded-lg border border-border bg-background px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
