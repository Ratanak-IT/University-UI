/**
 * Session-based attendance, mirroring the backend's
 * `/classrooms/{id}/sessions` + `/classrooms/{id}/attendance` contracts.
 *
 * Attendance hangs off a *session* — one meeting of one class — rather than off
 * a plain date, so a course that meets twice in a day keeps both registers.
 */

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";
export type SessionStatus = "SCHEDULED" | "HELD" | "CANCELLED";
export type SessionType = "LECTURE" | "LAB" | "TUTORIAL" | "SEMINAR" | "EXAM" | "OTHER";
export type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface ClassSession {
  sessionId: string;
  classroomId: string;
  sessionDate: string;
  startTime: string;
  endTime: string | null;
  type: SessionType;
  status: SessionStatus;
  topic: string | null;
  cancellationReason: string | null;
  takenAt: string | null;
  rosterSize: number;
  markedCount: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
}

export interface SessionStudentMark {
  studentId: string;
  studentCode: string;
  fullName: string;
  avatarUrl?: string;
  /** Null when this student has not been marked yet — not the same as absent. */
  status: AttendanceStatus | null;
  minutesLate: number | null;
  remark: string | null;
  excuseReference: string | null;
  attendancePercent: number | null;
}

export interface SessionRegister {
  session: ClassSession;
  className: string;
  subjectName: string | null;
  students: SessionStudentMark[];
}

export interface OpenSessionResult {
  opened: boolean;
  /** Why nothing was opened. Null when `opened` is true. */
  reason: string | null;
  register: SessionRegister | null;
}

export interface AttendanceSummary {
  studentId: string;
  studentCode: string;
  fullName: string;
  avatarUrl?: string;
  sessionsHeld: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
  unmarked: number;
  attendancePercent: number | null;
  eligibleForExam: boolean;
  minPercentToSitExam: number | null;
}

export interface AttendancePolicy {
  policyId: string | null;
  classroomId: string;
  lateCredit: number;
  lateBecomesAbsentAfterMinutes: number | null;
  minPercentToSitExam: number | null;
  excusedAbsencesIgnored: boolean;
}

/**
 * A recurring weekly slot — "Mondays, 08:00–10:00" — not a single meeting.
 * Sessions for the whole term are generated from these.
 */
export interface ScheduleSlot {
  scheduleId: string;
  dayOfWeek: Weekday;
  startTime: string;
  endTime: string | null;
  type: SessionType;
  room: string | null;
}

export interface GenerateSessionsResult {
  created: number;
  skippedExisting: number;
  skippedHolidays: number;
  from: string;
  to: string;
}
