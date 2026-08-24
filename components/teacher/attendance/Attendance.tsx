"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  History,
  Loader2,
  Plus,
  Users,
} from "lucide-react";
import { toast } from "@/components/shared/Toast";
import { apiErrorMessage } from "@/lib/api/errors";
import {
  useCancelSessionMutation,
  useCreateSessionMutation,
  useGetRegisterQuery,
  useGetTeacherClassroomsQuery,
  useMarkAttendanceMutation,
  useOpenSessionMutation,
} from "@/lib/redux/apiSlice";
import type { ClassroomResponse } from "@/lib/api/student";
import type { ClassSession } from "@/lib/types/attendance";
import { formatSessionDate, localToday } from "./attendanceDisplay";
import SessionRegister, { type MarkDrafts } from "./SessionRegister";
import SessionHistory from "./SessionHistory";
import AttendanceOverview from "./AttendanceOverview";

/**
 * A module-level constant, not a `= []` default inside the component.
 *
 * A fresh `[]` literal per render is a different reference every time, which
 * makes any dependency array holding it look changed on every render. That is
 * what previously drove this screen into an unbreakable render loop.
 */
const NO_CLASSROOMS: ClassroomResponse[] = [];

const TABS = [
  { id: "take", label: "Take attendance", icon: ClipboardList },
  { id: "sessions", label: "Sessions", icon: History },
  { id: "overview", label: "Overview", icon: BarChart3 },
] as const;

type Tab = (typeof TABS)[number]["id"];

function shiftDate(iso: string, delta: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + delta);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

/**
 * ISO dates (`YYYY-MM-DD`) compare correctly as plain strings, so the term
 * bounds need no Date parsing.
 */
function clampDate(iso: string, min: string | undefined, max: string): string {
  if (iso > max) iso = max;
  if (min && iso < min) iso = min;
  return iso;
}

export default function Attendance() {
  const { data: classroomData, isLoading: loadingClassrooms } =
    useGetTeacherClassroomsQuery();
  const classrooms = classroomData ?? NO_CLASSROOMS;

  const [pickedClassroomId, setPickedClassroomId] = useState("");
  const [classroomOpen, setClassroomOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("take");
  /** Null until the teacher picks one, so the default can follow the term. */
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState("");
  /** Why the chosen day has no register — shown instead of one. */
  const [noSessionReason, setNoSessionReason] = useState<string | null>(null);
  /** Why opening the register *failed*, as the server explained it. */
  const [openError, setOpenError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<MarkDrafts>({});
  /** Which `classroom|date` pair we have already opened, so we open it once. */
  const [openedFor, setOpenedFor] = useState<string | null>(null);

  // Derived rather than synced through an effect: falling back to the first
  // classroom needs no state of its own, and state that mirrors a query is
  // exactly the setState-in-an-effect shape that caused the freeze.
  const classroomId = pickedClassroomId || classrooms[0]?.classroomId || "";
  const selectedClassroom =
    classrooms.find((c) => c.classroomId === classroomId) ?? null;

  // The backend refuses any date outside the classroom's term, so the picker
  // is bounded by it rather than by today. A class that finished in May must
  // open on its last teaching day, not on a date three months past the end.
  const today = localToday();
  const termStart = selectedClassroom?.startDate;
  const termEnd = selectedClassroom?.endDate;
  const maxDate = termEnd && termEnd < today ? termEnd : today;
  /** True when the term has not begun — there is no legal date to open yet. */
  const termNotStarted = Boolean(termStart && termStart > maxDate);
  const termEnded = Boolean(termEnd && termEnd < today);

  // Derived, never synced through an effect: the clamp has to survive a
  // classroom change without a setState that feeds back into a dependency.
  const date = clampDate(pickedDate ?? maxDate, termStart, maxDate);

  const [openSession, { isLoading: isOpening }] = useOpenSessionMutation();
  const [markAttendance, { isLoading: isSaving }] = useMarkAttendanceMutation();
  const [cancelSession] = useCancelSessionMutation();
  const [createSession, { isLoading: isCreating }] = useCreateSessionMutation();

  const registerQuery = useGetRegisterQuery(
    { classroomId, sessionId },
    { skip: !classroomId || !sessionId }
  );
  const register = registerQuery.data;

  const openKey = `${classroomId}|${date}`;

  // Every dependency here is a primitive or an RTK-stable function, so this
  // effect runs on a real change of classroom/date/tab and not on every render.
  useEffect(() => {
    if (!classroomId || tab !== "take" || openedFor === openKey) return;
    // No date inside the term exists yet, so there is nothing legal to open.
    if (termNotStarted) return;

    let cancelled = false;
    openSession({ classroomId, date })
      .unwrap()
      .then((result) => {
        if (cancelled) return;
        setOpenedFor(openKey);
        setDrafts({});
        setOpenError(null);
        // "Nothing here" is a normal answer for a day the class doesn't meet.
        setSessionId(result.register?.session.sessionId ?? "");
        setNoSessionReason(result.opened ? null : result.reason);
      })
      .catch((err) => {
        if (cancelled) return;
        // Mark the key as attempted so a failure doesn't retry forever.
        setOpenedFor(openKey);
        setSessionId("");
        // Surfaced on the page, not only in a toast: the server's reason is
        // the whole diagnosis, and a toast that disappears takes it with it.
        const message = apiErrorMessage(err, "Could not open the register.");
        setOpenError(message);
        toast.error(message);
      });

    return () => {
      cancelled = true;
    };
  }, [classroomId, date, tab, openKey, openedFor, openSession, termNotStarted]);

  const resetForNewTarget = useCallback(() => {
    // Back to the term-aware default; the new classroom sets its own bounds.
    setPickedDate(null);
    setSessionId("");
    setOpenedFor(null);
    setNoSessionReason(null);
    setOpenError(null);
    setDrafts({});
  }, []);

  /** One way in, so every date change is clamped and clears the stale view. */
  function changeDate(next: string) {
    setPickedDate(clampDate(next, termStart, maxDate));
    setNoSessionReason(null);
    setOpenError(null);
    setDrafts({});
  }

  const handleDraftChange = useCallback(
    (studentId: string, draft: MarkDrafts[string] | undefined) =>
      setDrafts((current) => {
        const next = { ...current };
        if (draft === undefined) delete next[studentId];
        else next[studentId] = draft;
        return next;
      }),
    []
  );

  async function handleSave() {
    if (!register || Object.keys(drafts).length === 0) return;

    try {
      await markAttendance({
        classroomId,
        sessionId: register.session.sessionId,
        marks: Object.entries(drafts).map(([studentId, draft]) => ({
          studentId,
          status: draft.status,
          minutesLate: draft.status === "LATE" ? (draft.minutesLate ?? null) : null,
          excuseReference: draft.status === "EXCUSED" ? (draft.note ?? null) : null,
        })),
      }).unwrap();

      setDrafts({});
      toast.success("Attendance saved. This session now counts towards attendance.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save attendance."));
    }
  }

  async function handleAddSession() {
    const time = window
      .prompt("What time did the class start? (HH:MM)", "08:00")
      ?.trim();
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      if (time) toast.error("Invalid time. Use 24-hour HH:MM, for example 14:30.");
      return;
    }

    try {
      const session = await createSession({
        classroomId,
        sessionDate: date,
        startTime: `${time}:00`,
      }).unwrap();

      setSessionId(session.sessionId);
      setNoSessionReason(null);
      setOpenedFor(openKey);
      toast.success("Session added. You can mark the register now.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not add the session."));
    }
  }

  async function handleCancelSession() {
    if (!register) return;
    const reason = window.prompt("Why is this class cancelled?")?.trim();
    if (!reason) return;

    try {
      await cancelSession({
        classroomId,
        sessionId: register.session.sessionId,
        reason,
      }).unwrap();
      setDrafts({});
      toast.success("Session cancelled. It will not count towards attendance.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not cancel the session."));
    }
  }

  function handleOpenFromHistory(session: ClassSession) {
    // A stored session is always inside the term, so the clamp is a no-op —
    // but the key must be built from the clamped value either way, or it
    // would never match the `openKey` the effect compares against.
    const target = clampDate(session.sessionDate, termStart, maxDate);
    setSessionId(session.sessionId);
    setPickedDate(target);
    setOpenedFor(`${classroomId}|${target}`);
    setNoSessionReason(null);
    setOpenError(null);
    setDrafts({});
    setTab("take");
  }

  if (loadingClassrooms) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            <Users className="h-4 w-4" />
            Classroom Attendance
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
            Daily Attendance Sheet
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Attendance is recorded against a session — one meeting of one class —
            so a course that meets twice a day keeps both.
          </p>
        </div>
      </div>

      {/* Filters: classroom + date */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <button
            type="button"
            onClick={() => setClassroomOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <span>
              {selectedClassroom ? selectedClassroom.className : "Select Classroom"}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
          {classroomOpen && (
            <div className="absolute left-0 z-20 mt-1.5 w-64 rounded-xl border border-slate-100 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {classrooms.map((c) => (
                <button
                  key={c.classroomId}
                  type="button"
                  onClick={() => {
                    setPickedClassroomId(c.classroomId);
                    setClassroomOpen(false);
                    resetForNewTarget();
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    classroomId === c.classroomId
                      ? "bg-indigo-50 font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {c.className} ({c.classCode})
                </button>
              ))}
              {classrooms.length === 0 && (
                <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                  You have no classrooms yet.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Date belongs to the register, so it only shows while marking one. */}
        {tab === "take" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeDate(shiftDate(date, -1))}
              disabled={Boolean(termStart) && date <= termStart!}
              title={termStart ? `Class starts ${termStart}` : undefined}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <CalendarCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>{formatSessionDate(date)}</span>
              <input
                type="date"
                value={date}
                min={termStart}
                max={maxDate}
                onChange={(e) => {
                  if (!e.target.value) return;
                  changeDate(e.target.value);
                }}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
            <button
              type="button"
              onClick={() => changeDate(shiftDate(date, 1))}
              disabled={date >= maxDate}
              title={termEnded ? `Class ended ${termEnd}` : "Cannot open a future date"}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {!classroomId ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CalendarCheck className="h-8 w-8 text-slate-400" />
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Pick a classroom to take attendance
          </p>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            You are not assigned to any classroom yet, or none has loaded.
          </p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800/50">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {tab === "take" && (
            <>
              {/* Without this the clamped date looks like a bug rather than a
                  rule: the picker simply refuses to sit on today. */}
              {termEnded && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/40">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    This class ended on{" "}
                    <span className="font-bold">{formatSessionDate(termEnd!)}</span>.
                    Attendance cannot be opened after that date, so the picker is
                    showing the last teaching day instead of today.
                  </p>
                </div>
              )}

              {termNotStarted && (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <CalendarCheck className="h-8 w-8 text-slate-400" />
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    This class has not started yet
                  </p>
                  <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                    It begins on {formatSessionDate(termStart!)}. Attendance opens
                    from that date.
                  </p>
                </div>
              )}

              {!termNotStarted &&
                (isOpening || registerQuery.isLoading) &&
                !register &&
                !noSessionReason &&
                !openError && (
                  <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    Opening the register…
                  </p>
                )}

              {openError && !register && (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-14 text-center dark:border-rose-900 dark:bg-rose-950/40">
                  <AlertTriangle className="h-8 w-8 text-rose-500" />
                  <p className="text-base font-semibold text-rose-800 dark:text-rose-200">
                    Could not open the register
                  </p>
                  <p className="max-w-lg text-sm text-rose-700 dark:text-rose-300">
                    {openError}
                  </p>
                  {/* The two rules that reject this call are worth naming, so
                      the message is something a teacher can act on. */}
                  <p className="max-w-lg text-xs text-rose-600/80 dark:text-rose-400/80">
                    Attendance can only be opened by the teacher assigned to the
                    classroom, on a date inside the class&apos;s start and end
                    dates. Being listed as a co-teacher is not enough.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenError(null);
                      setOpenedFor(null);
                    }}
                    className="mt-1 rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950"
                  >
                    Try again
                  </button>
                </div>
              )}

              {noSessionReason && !register && (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <CalendarCheck className="h-8 w-8 text-slate-400" />
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    No class on this date
                  </p>
                  <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                    {noSessionReason}
                  </p>
                  <button
                    type="button"
                    onClick={handleAddSession}
                    disabled={isCreating}
                    className="mt-1 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    <Plus className="h-4 w-4" />
                    {isCreating ? "Adding…" : "Add a session for this date"}
                  </button>
                </div>
              )}

              {register && (
                <SessionRegister
                  register={register}
                  drafts={drafts}
                  onDraftChange={handleDraftChange}
                  onSave={handleSave}
                  onCancelSession={handleCancelSession}
                  isSaving={isSaving}
                />
              )}
            </>
          )}

          {tab === "sessions" && (
            <SessionHistory
              classroomId={classroomId}
              onOpen={handleOpenFromHistory}
            />
          )}

          {tab === "overview" && <AttendanceOverview classroomId={classroomId} />}
        </>
      )}
    </div>
  );
}
