
import { API_BASE } from "./config";
export {
  useGetStudentProfileQuery,
  useGetStudentAttendanceQuery,
  useGetStudentCertificatesQuery,
  useCreateCertificateRequestMutation,
  useGetStudentGradesQuery,
  useGetStudentGpaQuery,
  useUploadStudentAvatarMutation,
  useStartQuizAttemptMutation,
  useSubmitQuizAttemptMutation,
} from "@/lib/redux/apiSlice";



function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (!res.ok) {
      console.warn(`API ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`API ${path}:`, err);
    return null;
  }
}


export interface StudentProfile {
  id: string;
  studentId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  roles: string[];
  studentCode: string;
  academicYear: string;
  yearLevel: number;
  semester: number;
  dob: string;
  gender: string;
  avatarUrl: string | null;
  graduationStatus: string;
  major?: string;
  department?: string;
}

export interface ClassroomResponse {
  classroomId: string;
  className: string;
  classCode: string;
  teacherId?: string;
  teacherName?: string;
  subjectId?: string;
  subjectName?: string;
  programId?: string;
  programName?: string;
  academicYear?: string;
  semester?: number;
  yearLevel?: number;
  inviteCode?: string;
  room?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ClassroomStudentResponse {
  studentId: string;
  studentCode: string;
  fullName: string;
  email: string;
  yearLevel: number;
  semester: number;
  joinedAt: string;
  /** Presigned MinIO URL. Absent when the student has no avatar. */
  avatarUrl?: string;
}

export interface FileResponse {
  fileId: string;
  fileOriginalName: string;
  previewUrl: string;
}

export interface AssignmentResponse {
  assignmentId: string;
  classroomId: string;
  title: string;
  description: string;
  dueDate: string | null;
  maxScore: number;
  weight: number;
  files: FileResponse[];
  createdAt: string;
  createdBy: string;
  /** How many students have submitted. Only populated by the classroom assignments list. */
  submittedCount?: number | null;
  /** Classroom roster size. Only populated by the classroom assignments list. */
  totalStudents?: number | null;
}

export interface StudentAssignmentResponse {
  assignmentId: string;
  classroomId: string;
  className: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string | null;
  maxScore: number;
  weight: number;
  assignmentFiles: FileResponse[];
  submissionId: string | null;
  submissionStatus: string | null; // SUBMITTED | GRADED | null
  submittedAt: string | null;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
  submissionFiles: FileResponse[];
}


export interface GradeComponentBreakdown {
  componentId: string;
  name: string;
  source: "MANUAL" | "ASSIGNMENT" | "QUIZ" | "ATTENDANCE";
  weightPercent: number;
  percent: number | null;
  earnedPoints: number;
  possiblePoints: number;
  gradedItems: number;
  totalItems: number;
}


export interface GradeResponse {
  courseGradeId: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  classroomId: string;
  className: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credit: number;
  academicYear: string;
  semester: number;
  scorePercent: number | null;
  letterGrade: string | null;
  gradePoint: number | null;
  creditsEarned: number | null;
  completenessPercent: number | null;
  /** IN_PROGRESS while the teacher is still marking; POSTED is the only status a transcript reads. */
  status: "IN_PROGRESS" | "SUBMITTED" | "POSTED";
  countsInGpa: boolean;
  postedAt: string | null;
  remark: string | null;
  breakdown: GradeComponentBreakdown[];
}

export interface GpaResponse {
  studentId: string;
  studentCode: string;
  /** Official GPA — posted grades only. Null until a course is posted. */
  cumulativeGpa: number | null;
  /** Includes courses still being marked. Null until a course is posted. */
  currentGpa: number | null;
  creditsEarned: number | null;
  creditsAttempted: number | null;
  subjects: GradeResponse[];
}

export interface QuizResponse {
  quizId: string;
  classroomId: string;
  className: string;
  subjectName: string;
  title: string;
  description: string;
  startAt: string | null;
  endAt: string | null;
  durationMinutes: number;
  maxAttempts: number;
  attemptsUsed: number;
  bestScore: number | null;
}

export interface LessonResponse {
  lessonId: string;
  classroomId: string;
  title: string;
  content: string;
  files: LessonFileResponse[];
  videoLink: string | null;
  allowDownload: boolean;
  createdAt: string;
  createdBy: string;
}

export interface LessonFileResponse {
  fileId: string;
  fileOriginalName: string;
  previewUrl: string;
}

/**
 * Mirrors the backend `ClassroomMemberResponse` record exactly.
 *
 * Note `fullname` is lower-case "n" on the wire. The previous declaration here
 * claimed `id`, `userId` and `fullName` — none of which the API sends — so the
 * teacher panel rendered a blank name and an undefined React key.
 */
export interface ClassroomMemberResponse {
  teacherId: string;
  fullname: string;
  email: string;
  role: string;
  joinedAt?: string;
  status: string;
  /** Presigned MinIO URL. Absent when the teacher has no avatar. */
  avatarUrl?: string;
}

// Spring Page wrapper
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ─── API Functions ───────────────────────────────────────────────────

/** GET /api/v1/students/me */
export function fetchMyProfile() {
  return apiFetch<StudentProfile>("/api/v1/students/me");
}

/** POST /api/v1/students/me/avatar (multipart/form-data → MinIO) */
export async function uploadAvatar(file: File): Promise<StudentProfile | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/api/v1/students/me/avatar`, {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: formData,
    });
    if (!res.ok) {
      console.warn(`uploadAvatar → ${res.status}`);
      return null;
    }
    return (await res.json()) as StudentProfile;
  } catch (err) {
    console.error("uploadAvatar:", err);
    return null;
  }
}

/** GET /api/v1/classrooms/my-classrooms */
export function fetchMyClassrooms() {
  return apiFetch<ClassroomResponse[]>("/api/v1/classrooms/my-classrooms");
}

/** GET /api/v1/classrooms/{id} */
export function fetchClassroomById(id: string) {
  return apiFetch<ClassroomResponse>(`/api/v1/classrooms/${id}`);
}

/** GET /api/v1/classrooms/{id}/students */
export function fetchClassroomStudents(classroomId: string) {
  return apiFetch<ClassroomStudentResponse[]>(
    `/api/v1/classrooms/${classroomId}/students`
  );
}

/** GET /api/v1/classrooms/{id}/teachers */
export function fetchClassroomTeachers(classroomId: string) {
  return apiFetch<ClassroomMemberResponse[]>(
    `/api/v1/classrooms/${classroomId}/teachers`
  );
}

/** GET /api/v1/classrooms/{id}/lessons */
export function fetchClassroomLessons(classroomId: string) {
  return apiFetch<LessonResponse[]>(
    `/api/v1/classrooms/${classroomId}/lessons`
  );
}

/** GET /api/v1/classrooms/{id}/assignments */
export function fetchClassroomAssignments(classroomId: string) {
  return apiFetch<AssignmentResponse[]>(
    `/api/v1/classrooms/${classroomId}/assignments`
  );
}

/** GET /api/v1/students/{id}/assignments?page=&size= */
export function fetchStudentAssignments(
  studentId: string,
  page = 0,
  size = 25
) {
  return apiFetch<PageResponse<StudentAssignmentResponse>>(
    `/api/v1/students/${studentId}/assignments?page=${page}&size=${size}`
  );
}

/** GET /api/v1/students/{id}/assignments/{assignmentId} */
export function fetchStudentAssignmentDetail(
  studentId: string,
  assignmentId: string
) {
  return apiFetch<StudentAssignmentResponse>(
    `/api/v1/students/${studentId}/assignments/${assignmentId}`
  );
}

/** GET /api/v1/students/{id}/grades */
export function fetchStudentGrades(studentId: string) {
  return apiFetch<GradeResponse[]>(`/api/v1/students/${studentId}/grades`);
}

/** GET /api/v1/students/{id}/gpa */
export function fetchStudentGpa(studentId: string) {
  return apiFetch<GpaResponse>(`/api/v1/students/${studentId}/gpa`);
}

/** GET /api/v1/students/{id}/quizzes */
export function fetchStudentQuizzes(studentId: string) {
  return apiFetch<QuizResponse[]>(`/api/v1/students/${studentId}/quizzes`);
}

/** GET /api/v1/students/{id}/subjects */
export function fetchStudentSubjects(studentId: string) {
  return apiFetch<{ subjectId: string; subjectName: string; subjectCode: string }[]>(
    `/api/v1/students/${studentId}/subjects`
  );
}

/** POST /api/v1/assignments/{id}/submissions (multipart) */
export async function submitAssignment(assignmentId: string, files: File[]) {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/assignments/${assignmentId}/submissions`,
      { method: "POST", headers: { ...getAuthHeader() }, body: formData }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("submitAssignment:", err);
    return null;
  }
}
// ─── Quiz Attempt Types ──────────────────────────────────────────────

/** Mirrors the backend `QuestionType` enum. */
export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";

export interface QuizQuestionItem {
  questionId: string;
  questionText: string;
  options: string[];
  /**
   * How to render the input. Safe to receive: it never reveals the answer —
   * neither the correct option nor its index is ever sent to a student.
   */
  type: QuestionType;
  score: number;
  questionOrder: number;
}

export interface AnswerResultItem {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  earnedScore: number;
}

export interface QuizAttemptResponse {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  status: "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  earnedScore: number | null;
  totalScore: number | null;
  questions: QuizQuestionItem[];
  answers: AnswerResultItem[] | null;
}

/** POST /api/v1/students/{id}/quizzes/{quizId}/attempts */
export async function startQuizAttempt(
  studentId: string,
  quizId: string
): Promise<QuizAttemptResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/students/${studentId}/quizzes/${quizId}/attempts`,
      { method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeader() } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("startQuizAttempt:", err);
    return null;
  }
}

/** PUT /api/v1/students/{id}/quizzes/{quizId}/attempts/{attemptId} */
export async function submitQuizAttempt(
  studentId: string,
  quizId: string,
  attemptId: string,
  /**
   * `selectedOptionIndex` is the source of truth for choice questions —
   * sending the option's text let a later reword of that option silently
   * invalidate every stored answer, because grading compared text to text.
   * `answer` is required for SHORT_ANSWER and optional elsewhere as a
   * fallback the server can still resolve.
   */
  answers: { questionId: string; selectedOptionIndex?: number; answer?: string }[]
): Promise<QuizAttemptResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/students/${studentId}/quizzes/${quizId}/attempts/${attemptId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ answers }),
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("submitQuizAttempt:", err);
    return null;
  }
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

/** One mark, as returned inside a `StudentAttendanceResponse.records` list. */
export interface AttendanceRecordResponse {
  recordId: string;
  sessionId: string;
  classroomId: string;
  className: string;
  subjectName: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  attendanceDate: string;
  startTime: string | null;
  endTime: string | null;
  sessionType: "LECTURE" | "LAB" | "TUTORIAL" | "SEMINAR" | "EXAM" | "OTHER";
  topic: string | null;
  status: AttendanceStatus;
  minutesLate: number | null;
  remark: string | null;
  excuseReference: string | null;
}

/**
 * A student's attendance for one classroom — `GET /students/{id}/attendance`
 * returns one of these per enrolled classroom, not a flat list of marks.
 * The percentage and exam eligibility are computed server-side against that
 * classroom's own policy, so the frontend must not re-derive or hard-code a
 * minimum — different classrooms can require different thresholds.
 */
export interface StudentAttendanceResponse {
  classroomId: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  academicYear: string;
  semester: number;
  sessionsHeld: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
  unmarked: number;
  attendancePercent: number | null;
  eligibleForExam: boolean;
  minPercentToSitExam: number | null;
  records: AttendanceRecordResponse[];
}

/** GET /api/v1/students/{id}/attendance */
export function fetchStudentAttendance(studentId: string, classroomId?: string) {
  const url = `/api/v1/students/${studentId}/attendance` + (classroomId ? `?classroomId=${classroomId}` : "");
  return apiFetch<StudentAttendanceResponse[]>(url);
}

export type Weekday = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

/**
 * One weekly class slot, across every classroom the student is enrolled in.
 * The weekly pattern a teacher sets up in the admin app — not a snapshot of
 * one week, so there is no date here, only day-of-week and time.
 */
export interface TimetableSlotResponse {
  scheduleId: string;
  classroomId: string;
  className: string;
  classCode: string;
  subjectCode: string | null;
  subjectName: string | null;
  teacherName: string | null;
  dayOfWeek: Weekday;
  startTime: string;
  endTime: string | null;
  type: "LECTURE" | "LAB" | "TUTORIAL" | "SEMINAR" | "EXAM" | "OTHER";
  room: string | null;
}

/** GET /api/v1/students/{id}/timetable */
export function fetchStudentTimetable(studentId: string) {
  return apiFetch<TimetableSlotResponse[]>(`/api/v1/students/${studentId}/timetable`);
}

export interface CertificateRequestResponse {
  requestId: string;
  certificateType: "ATTENDANCE" | "ENROLLMENT" | "GRADUATION";
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason: string | null;
  createdAt: string;
  processedAt: string | null;
  downloadAvailable: boolean;
}

export interface CertificateDownloadResponse {
  requestId: string;
  fileName: string;
  downloadUrl: string;
}


/* ---------------- Issued certificates ---------------- */

export type IssuedCertificateType =
  | "ENROLLMENT_CONFIRMATION" | "TRANSCRIPT" | "DEGREE" | "COMPLETION";

/**
 * A certificate the registrar has actually awarded.
 *
 * <p>Nothing appears here until it is issued — an approval that has not
 * happened yet has no record, so there is nothing for the student to see or
 * download before then.
 */
export interface IssuedCertificateResponse {
  issuedId: string;
  studentId: string;
  studentCode: string | null;
  fullName: string | null;
  certificateType: IssuedCertificateType;
  certificateNumber: string;
  verificationCode: string;
  programId: string | null;
  programName: string | null;
  yearLevel: number | null;
  academicYear: string | null;
  status: "ISSUED" | "REVOKED";
  issuedAt: string;
  issuedBy: string | null;
  revokedAt: string | null;
  revokeReason: string | null;
  /** True when a file is attached — a scanned original, or a generated PDF. */
  hasFile: boolean;
  /**
   * True when there is a rendered document to display in the browser.
   *
   * <p>A certificate produced from an uploaded design is a PDF, so there is
   * nothing to show inline and the download is the only way to open it.
   */
  hasDocument: boolean;
}

/** GET /api/v1/students/{id}/certificates/{issuedId}/document — returns HTML. */
export async function fetchIssuedCertificateDocument(
  studentId: string,
  issuedId: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/students/${studentId}/certificates/${issuedId}/document`,
      { headers: { ...getAuthHeader() } }
    );
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.error("fetchIssuedCertificateDocument:", err);
    return null;
  }
}

/** GET /api/v1/students/{id}/certificates/{issuedId}/download */
export async function downloadIssuedCertificate(
  studentId: string,
  issuedId: string
): Promise<CertificateDownloadResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/students/${studentId}/certificates/${issuedId}/download`,
      { headers: { ...getAuthHeader() } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("downloadIssuedCertificate:", err);
    return null;
  }
}

/** GET /api/v1/students/{id}/certificates/{issuedId}/preview — same file as download, opened inline. */
export async function previewIssuedCertificate(
  studentId: string,
  issuedId: string
): Promise<CertificateDownloadResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/students/${studentId}/certificates/${issuedId}/preview`,
      { headers: { ...getAuthHeader() } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("previewIssuedCertificate:", err);
    return null;
  }
}

/** GET /api/v1/students/{id}/certificate-requests */
export function fetchStudentCertificateRequests(studentId: string) {
  return apiFetch<CertificateRequestResponse[]>(`/api/v1/students/${studentId}/certificate-requests`);
}

/** POST /api/v1/students/{id}/certificate-requests */
export async function createStudentCertificateRequest(
  studentId: string,
  certificateType: "ENROLLMENT_CONFIRMATION" | "DEGREE" | "TRANSCRIPT" | "COMPLETION",
  reason: string
): Promise<CertificateRequestResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/students/${studentId}/certificate-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ certificateType, reason }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("createStudentCertificateRequest:", err);
    return null;
  }
}

/** GET /api/v1/students/{id}/certificate-requests/{requestId}/download */
export function downloadStudentCertificate(studentId: string, requestId: string) {
  return apiFetch<CertificateDownloadResponse>(
    `/api/v1/students/${studentId}/certificate-requests/${requestId}/download`
  );
}

