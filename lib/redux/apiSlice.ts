import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  StudentProfile,
  StudentAttendanceResponse,
  TimetableSlotResponse,
  CertificateRequestResponse,
  IssuedCertificateResponse,
  GradeResponse,
  GpaResponse,
  ClassroomResponse,
  ClassroomStudentResponse,
  ClassroomMemberResponse,
  LessonResponse,
  AssignmentResponse,
  StudentDashboardSummary,
  StudentAssignmentListItem,
  StudentAssignmentResponse,
  QuizResponse,
} from "@/lib/api/student";
import {
  TeacherProfile,
  ExamScoreResponse,
  SetExamScoresRequest,
  RecordAttendancePayload,
  TeacherDashboardSummary,
  StudentMetrics,
} from "@/lib/api/teacher";
import type { SubmissionResponse } from "@/lib/api/assignment";
import type {
  Comment,
  CommentScope,
  CreateCommentPayload,
  UpdateCommentPayload,
  MentionUser,
} from "@/lib/api/comments";
import type { PrivateComment } from "@/lib/api/privateComments";
import {
  toArray,
  toObject,
  pick,
  pickNum,
  str,
  num,
  type Dict,
} from "@/lib/api/normalize";
import type {
  AttendancePolicy,
  AttendanceStatus,
  AttendanceSummary,
  ClassSession,
  GenerateSessionsResult,
  OpenSessionResult,
  ScheduleSlot,
  SessionRegister,
  SessionStatus,
  SessionStudentMark,
  SessionType,
  Weekday,
} from "@/lib/types/attendance";

function getAuthHeaderToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || localStorage.getItem("access_token");
  }
  return null;
}

/** Mirrors the backend `QuestionType` enum. */
export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";

export interface QuizQuestionPayload {
  questionText: string;
  options: string[];
  /**
   * Zero-based index of the correct option — the source of truth for choice
   * questions. Sending the option's text instead meant that rewording an
   * option later silently invalidated every student's stored answer.
   */
  correctOptionIndex?: number;
  /** Required for SHORT_ANSWER; a fallback locator for choice questions. */
  correctAnswer?: string;
  /** Defaults to MULTIPLE_CHOICE on the server when omitted. */
  type?: QuestionType;
  score: number;
  questionOrder?: number;
}

export interface CreateQuizPayload {
  title: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  durationMinutes?: number;
  maxAttempts?: number;
  questions?: QuizQuestionPayload[];
}

export interface QuizClassroomResponse {
  assignmentId: string;
  classroomId: string;
  className: string;
  classCode: string;
  subjectName: string | null;
  availableFrom?: string | null;
  availableTo?: string | null;
}

export interface QuizManageResponse {
  quizId: string;
  classroomId?: string;
  className?: string;
  classrooms?: QuizClassroomResponse[];
  title: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  durationMinutes?: number;
  maxAttempts?: number;
  status: string;
  questions?: {
    questionId: string;
    questionText: string;
    options: string[];
    correctOptionIndex: number | null;
    correctAnswer: string;
    type: QuestionType;
    score: number;
    questionOrder: number;
  }[];
}

export interface QuizAttemptSummary {
  /** Null when the student has never started the quiz. */
  attemptId: string | null;
  studentId: string;
  studentCode: string | null;
  studentName: string | null;
  /** Which of the quiz's (possibly several) released classrooms this row belongs to. */
  classroomId: string;
  className: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";
  startedAt: string | null;
  submittedAt: string | null;
  earnedScore: number | null;
  totalScore: number | null;

  /**
   * How many times this student left the quiz screen — switched tab or window,
   * or dropped out of fullscreen.
   *
   * <p>Reported, never acted on. A browser cannot stop someone alt-tabbing, so
   * the honest thing is to say it happened and let the teacher judge: one blip
   * may be a notification, twenty is a different conversation.
   */
  focusLossCount: number;
  lastFocusLossAt: string | null;
}

import { API_BASE } from "../api/config";

/* ------------------------------------------------------------------ */
/* Attendance mappers                                                  */
/*                                                                     */
/* Each of these runs once per fetch inside `transformResponse`, so the */
/* cached result keeps a stable identity across renders. That is what   */
/* makes it safe for components to depend on the query data directly.   */
/* ------------------------------------------------------------------ */

function mapSession(row: Dict): ClassSession {
  return {
    sessionId: pick(row, ["sessionId"], ""),
    classroomId: pick(row, ["classroomId"], ""),
    sessionDate: pick(row, ["sessionDate"], ""),
    startTime: pick(row, ["startTime"], ""),
    endTime: str(row, "endTime"),
    type: pick(row, ["type"], "LECTURE") as SessionType,
    status: pick(row, ["status"], "SCHEDULED") as SessionStatus,
    topic: str(row, "topic"),
    cancellationReason: str(row, "cancellationReason"),
    takenAt: str(row, "takenAt"),
    rosterSize: pickNum(row, ["rosterSize"], 0),
    markedCount: pickNum(row, ["markedCount"], 0),
    presentCount: pickNum(row, ["presentCount"], 0),
    lateCount: pickNum(row, ["lateCount"], 0),
    absentCount: pickNum(row, ["absentCount"], 0),
    excusedCount: pickNum(row, ["excusedCount"], 0),
  };
}

function mapStudentMark(row: Dict): SessionStudentMark {
  const status = str(row, "status");
  return {
    studentId: pick(row, ["studentId"], ""),
    studentCode: pick(row, ["studentCode"], "—"),
    fullName: pick(row, ["fullName"], "—"),
    avatarUrl: str(row, "avatarUrl") ?? undefined,
    // Kept as null rather than defaulted to PRESENT: an unmarked student is
    // not a present one, and the register has to be able to show the gap.
    status: (status as AttendanceStatus) ?? null,
    minutesLate: num(row, "minutesLate"),
    remark: str(row, "remark"),
    excuseReference: str(row, "excuseReference"),
    attendancePercent: num(row, "attendancePercent"),
  };
}

function mapRegister(raw: unknown): SessionRegister {
  const d = toObject(raw);
  return {
    session: mapSession(toObject(d.session)),
    className: pick(d, ["className"], "—"),
    subjectName: str(d, "subjectName"),
    students: toArray(d.students).map(mapStudentMark),
  };
}

function mapSummary(row: Dict): AttendanceSummary {
  return {
    studentId: pick(row, ["studentId"], ""),
    studentCode: pick(row, ["studentCode"], "—"),
    fullName: pick(row, ["fullName"], "—"),
    avatarUrl: str(row, "avatarUrl") ?? undefined,
    sessionsHeld: pickNum(row, ["sessionsHeld"], 0),
    present: pickNum(row, ["present"], 0),
    late: pickNum(row, ["late"], 0),
    absent: pickNum(row, ["absent"], 0),
    excused: pickNum(row, ["excused"], 0),
    unmarked: pickNum(row, ["unmarked"], 0),
    attendancePercent: num(row, "attendancePercent"),
    eligibleForExam: row.eligibleForExam !== false,
    minPercentToSitExam: num(row, "minPercentToSitExam"),
  };
}

function mapSlot(row: Dict): ScheduleSlot {
  return {
    scheduleId: pick(row, ["scheduleId"], ""),
    dayOfWeek: pick(row, ["dayOfWeek"], "MONDAY") as Weekday,
    startTime: pick(row, ["startTime"], ""),
    endTime: str(row, "endTime"),
    type: pick(row, ["type"], "LECTURE") as SessionType,
    room: str(row, "room"),
  };
}

function mapPolicy(raw: unknown): AttendancePolicy {
  const d = toObject(raw);
  return {
    policyId: str(d, "policyId"),
    classroomId: pick(d, ["classroomId"], ""),
    lateCredit: pickNum(d, ["lateCredit"], 0.5),
    lateBecomesAbsentAfterMinutes: num(d, "lateBecomesAbsentAfterMinutes"),
    minPercentToSitExam: num(d, "minPercentToSitExam"),
    excusedAbsencesIgnored: d.excusedAbsencesIgnored !== false,
  };
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE}/api/v1`,
    prepareHeaders: (headers) => {
      const token = getAuthHeaderToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "StudentProfile",
    "StudentAttendance",
    "StudentTimetable",
    "StudentCertificates",
    "StudentGrades",
    "TeacherProfile",
    "TeacherClassrooms",
    "ClassroomStudents",
    "ClassroomTeachers",
    "TeacherAttendance",
    "ExamScores",
    "ClassroomDetail",
    "ClassroomLessons",
    "ClassroomAssignments",
    "TeacherQuizzes",
    "Notifications",
    "Auth",
    "SavedLessons",
    "SavedAssignments",
    "Submissions",
    "QuizAttempts",
    "AttendanceSessions",
    "AttendanceRegister",
    "AttendanceSummary",
    "AttendancePolicy",
    "ClassSchedule",
    "Comments",
    "PrivateComments",
    "TeacherDashboardSummary",
    "TeacherStudentMetrics",
    "StudentDashboardSummary",
    "StudentAssignmentsList",
  ],
  endpoints: (builder) => ({
    getClassroomById: builder.query<ClassroomResponse, string>({
      query: (id) => `/classrooms/${id}`,
      providesTags: ["ClassroomDetail"],
    }),

    getClassroomLessons: builder.query<LessonResponse[], string>({
      query: (classroomId) => `/classrooms/${classroomId}/lessons`,
      providesTags: ["ClassroomLessons"],
    }),

    getClassroomAssignments: builder.query<AssignmentResponse[], string>({
      query: (classroomId) => `/classrooms/${classroomId}/assignments`,
      providesTags: ["ClassroomAssignments"],
    }),

    getMyClassrooms: builder.query<ClassroomResponse[], void>({
      query: () => "/classrooms/my-classrooms",
      providesTags: ["TeacherClassrooms"],
    }),

    getStudentProfile: builder.query<StudentProfile, void>({
      query: () => "/students/me",
      providesTags: ["StudentProfile"],
    }),

    getStudentAttendance: builder.query<
      StudentAttendanceResponse[],
      { studentId: string; classroomId?: string }
    >({
      query: ({ studentId, classroomId }) =>
        `/students/${studentId}/attendance` +
        (classroomId ? `?classroomId=${classroomId}` : ""),
      providesTags: ["StudentAttendance"],
    }),

    getStudentTimetable: builder.query<TimetableSlotResponse[], string>({
      query: (studentId) => `/students/${studentId}/timetable`,
      providesTags: ["StudentTimetable"],
    }),

    getStudentCertificates: builder.query<CertificateRequestResponse[], string>({
      query: (studentId) => `/students/${studentId}/certificate-requests`,
      providesTags: ["StudentCertificates"],
    }),

    /**
     * Certificates the registrar has actually awarded.
     *
     * <p>Separate from the requests above: a request is the student asking, this
     * is what they have been granted. The list is empty until an award exists,
     * which is what stops an unapproved certificate being viewed or downloaded.
     */
    getIssuedCertificates: builder.query<IssuedCertificateResponse[], string>({
      query: (studentId) => `/students/${studentId}/certificates`,
      providesTags: ["StudentCertificates"],
    }),

    createCertificateRequest: builder.mutation<
      CertificateRequestResponse,
      {
        studentId: string;
        certificateType: "ENROLLMENT_CONFIRMATION" | "DEGREE" | "TRANSCRIPT" | "COMPLETION";
        reason: string;
      }
    >({
      query: ({ studentId, certificateType, reason }) => ({
        url: `/students/${studentId}/certificate-requests`,
        method: "POST",
        body: { certificateType, reason },
      }),
      invalidatesTags: ["StudentCertificates"],
    }),

    getStudentGrades: builder.query<GradeResponse[], string>({
      query: (studentId) => `/students/${studentId}/grades`,
      providesTags: ["StudentGrades"],
    }),

    getStudentGpa: builder.query<GpaResponse, string>({
      query: (studentId) => `/students/${studentId}/gpa`,
      providesTags: ["StudentGrades"],
    }),

    getTeacherProfile: builder.query<TeacherProfile, void>({
      query: () => "/teachers/me",
      providesTags: ["TeacherProfile"],
    }),

    getTeacherClassrooms: builder.query<ClassroomResponse[], void>({
      query: () => "/classrooms/my-classrooms",
      providesTags: ["TeacherClassrooms"],
    }),

    getClassroomStudents: builder.query<ClassroomStudentResponse[], string>({
      query: (classroomId) => `/classrooms/${classroomId}/students`,
      providesTags: ["ClassroomStudents"],
    }),

    getClassroomTeachers: builder.query<ClassroomMemberResponse[], string>({
      query: (classroomId) => `/classrooms/${classroomId}/teachers`,
      providesTags: ["ClassroomTeachers"],
    }),

    removeStudentFromClassroom: builder.mutation<void, { classroomId: string; studentId: string }>({
      query: ({ classroomId, studentId }) => ({
        url: `/classrooms/${classroomId}/students/${studentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClassroomStudents"],
    }),

    /**
     * @deprecated The backend has no `GET/POST /classrooms/{id}/attendance` —
     * only `/attendance/summary` and `/attendance/policy`. Both of these
     * return 404. Use the session endpoints below (`useOpenSessionMutation`,
     * `useGetRegisterQuery`, `useMarkAttendanceMutation`) instead.
     *
     * Kept only because `lib/api/teacher.ts` re-exports the hooks. Nothing
     * calls them.
     */
    getTeacherAttendance: builder.query<
      any[],
      { classroomId: string; date?: string }
    >({
      query: ({ classroomId, date }) =>
        `/classrooms/${classroomId}/attendance` + (date ? `?date=${date}` : ""),
      providesTags: ["TeacherAttendance"],
    }),

    recordTeacherAttendance: builder.mutation<
      any[],
      { classroomId: string; payload: RecordAttendancePayload }
    >({
      query: ({ classroomId, payload }) => ({
        url: `/classrooms/${classroomId}/attendance`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TeacherAttendance", "StudentAttendance"],
    }),

    getExamScores: builder.query<ExamScoreResponse[], string>({
      query: (classroomId) => `/classrooms/${classroomId}/scores`,
      providesTags: ["ExamScores"],
    }),

    saveExamScores: builder.mutation<
      ExamScoreResponse[],
      { classroomId: string; payload: SetExamScoresRequest }
    >({
      query: ({ classroomId, payload }) => ({
        url: `/classrooms/${classroomId}/scores`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ExamScores", "StudentGrades"],
    }),

    getTeacherQuizzes: builder.query<QuizManageResponse[], void>({
      query: () => "/quizzes/mine",
      providesTags: ["TeacherQuizzes"],
    }),

    createTeacherQuiz: builder.mutation<QuizManageResponse, CreateQuizPayload>({
      query: (payload) => ({
        url: "/quizzes",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TeacherQuizzes"],
    }),

    updateTeacherQuiz: builder.mutation<
      QuizManageResponse,
      { quizId: string; payload: CreateQuizPayload }
    >({
      query: ({ quizId, payload }) => ({
        url: `/quizzes/${quizId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["TeacherQuizzes"],
    }),

    /**
     * PUT /assign-classroom REPLACES the quiz's whole release list — that's
     * the backend's documented contract (`AssignQuizToClassroomRequest`), not
     * an "add one more" call. Sending only the single new classroomId (the
     * old shape) silently drops every other classroom the quiz was already
     * released to, and throws a 409 the moment one of those sections already
     * has student attempts. Callers must pass the FULL desired list —
     * existing releases plus whatever is being added/removed.
     */
    assignQuizToClassroom: builder.mutation<
      QuizManageResponse,
      { quizId: string; classrooms: { classroomId: string; availableFrom?: string | null; availableTo?: string | null }[] }
    >({
      query: ({ quizId, classrooms }) => ({
        url: `/quizzes/${quizId}/assign-classroom`,
        method: "PUT",
        body: { classrooms },
      }),
      invalidatesTags: ["TeacherQuizzes"],
    }),

    getQuizById: builder.query<QuizManageResponse, string>({
      query: (quizId) => `/quizzes/${quizId}`,
      providesTags: ["TeacherQuizzes"],
    }),

    deleteTeacherQuiz: builder.mutation<void, string>({
      query: (quizId) => ({
        url: `/quizzes/${quizId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TeacherQuizzes"],
    }),

    getQuizAttempts: builder.query<QuizAttemptSummary[], string>({
      query: (quizId) => `/quizzes/${quizId}/attempts`,
      providesTags: ["QuizAttempts"],
    }),

    getMyNotifications: builder.query<
      {
        id: string;
        userId: string;
        title: string;
        message: string;
        type:
          | "GRADE"
          | "ASSIGNMENT"
          | "CERTIFICATE"
          | "ANNOUNCEMENT"
          | "ATTENDANCE"
          | "MENTION"
          | "COMMENT_REPLY";
        context: string;
        actor: string;
        link: string | null;
        resourceType: string | null;
        resourceId: string | null;
        isRead: boolean;
        createdAt: string;
      }[],
      void
    >({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),

    markNotificationRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // --- Authentication ---
    loginUser: builder.mutation<
      { accessToken: string; refreshToken: string; tokenType: string; expiresIn: number; scope: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "StudentProfile", "TeacherProfile"],
    }),

    getUserProfile: builder.query<
      { id: string; keycloakId: string; email: string; fullName: string; role: "ADMIN" | "TEACHER" | "STUDENT"; isActive: boolean },
      void
    >({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),

    // --- Saved Lessons ---
    getSavedLessons: builder.query<any[], void>({
      query: () => "/lessons/saved",
      providesTags: ["SavedLessons"],
    }),

    // FormData, not JSON: the backend takes the lesson fields as a "lesson"
    // JSON blob part alongside "file" parts for attachments, so the caller
    // builds and passes the whole multipart body directly.
    createSavedLesson: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/lessons/saved",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["SavedLessons"],
    }),

    createLessonForClassroom: builder.mutation<any, { classroomId: string; formData: FormData }>({
      query: ({ classroomId, formData }) => ({
        url: `/classrooms/${classroomId}/lessons`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ClassroomLessons"],
    }),

    assignLessonToClassroom: builder.mutation<any, { lessonId: string; classroomId: string }>({
      query: ({ lessonId, classroomId }) => ({
        url: `/lessons/${lessonId}/assign/${classroomId}`,
        method: "POST",
      }),
      invalidatesTags: ["ClassroomLessons"],
    }),

    // --- Saved Assignments ---
    getSavedAssignments: builder.query<any[], void>({
      query: () => "/assignments/saved",
      providesTags: ["SavedAssignments"],
    }),

    // FormData, not JSON — same "JSON blob part + file parts" multipart shape
    // as createSavedLesson.
    createSavedAssignment: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/assignments/saved",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["SavedAssignments"],
    }),

    createAssignmentForClassroom: builder.mutation<any, { classroomId: string; formData: FormData }>({
      query: ({ classroomId, formData }) => ({
        url: `/classrooms/${classroomId}/assignments`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ClassroomAssignments"],
    }),

    updateAssignment: builder.mutation<any, { assignmentId: string; title: string; description?: string; maxScore?: number; dueDate?: string }>({
      query: ({ assignmentId, ...body }) => ({
        url: `/assignments/${assignmentId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SavedAssignments", "ClassroomAssignments"],
    }),

    deleteAssignment: builder.mutation<void, string>({
      query: (assignmentId) => ({
        url: `/assignments/${assignmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedAssignments", "ClassroomAssignments"],
    }),

    assignAssignmentToClassroom: builder.mutation<any, { assignmentId: string; classroomId: string; dueDate?: string }>({
      query: ({ assignmentId, classroomId, dueDate }) => ({
        url: `/assignments/${assignmentId}/assign/${classroomId}` + (dueDate ? `?dueDate=${encodeURIComponent(dueDate)}` : ""),
        method: "POST",
      }),
      invalidatesTags: ["ClassroomAssignments"],
    }),

    // --- Assignment Submissions & Grading ---
    getAssignmentDetail: builder.query<AssignmentResponse, string>({
      query: (id) => `/assignments/${id}`,
      providesTags: ["ClassroomAssignments"],
    }),

    getAssignmentSubmissions: builder.query<SubmissionResponse[], string>({
      query: (assignmentId) => `/assignments/${assignmentId}/submissions`,
      providesTags: ["Submissions"],
    }),

    /**
     * PATCH /submissions/{id}/grade
     *
     * The backend maps this with `@PatchMapping` and reads `score` off the
     * body. This mutation previously sent `POST` with a `grade` key, so every
     * call through it failed — the screen only worked because it bypassed RTK
     * and called `lib/api/assignment.ts` directly, losing cache invalidation.
     */
    gradeSubmission: builder.mutation<
      SubmissionResponse,
      { submissionId: string; score: number; feedback?: string }
    >({
      query: ({ submissionId, score, feedback }) => ({
        url: `/submissions/${submissionId}/grade`,
        method: "PATCH",
        body: { score, feedback },
      }),
      invalidatesTags: ["Submissions", "StudentGrades", "ClassroomAssignments"],
    }),

    /**
     * POST /assignments/{id}/submissions (multipart/form-data)
     *
     * The controller consumes `MULTIPART_FORM_DATA_VALUE` and reads a
     * `files` part. This previously posted JSON `{ fileUrl }`, which the
     * endpoint cannot accept — every call through it would have failed. The
     * student screen works because it calls `lib/api/student.ts` directly.
     *
     * Pass a FormData with one or more `files` entries; the browser sets the
     * multipart boundary, so no content-type header is set here.
     */
    submitAssignment: builder.mutation<
      SubmissionResponse,
      { assignmentId: string; files: FormData }
    >({
      query: ({ assignmentId, files }) => ({
        url: `/assignments/${assignmentId}/submissions`,
        method: "POST",
        body: files,
      }),
      invalidatesTags: ["Submissions", "ClassroomAssignments", "StudentGrades"],
    }),

    // --- Avatars ---
    uploadStudentAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: "/students/me/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["StudentProfile"],
    }),

    uploadTeacherAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: "/teachers/me/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["TeacherProfile"],
    }),

    // --- Quiz Attempts ---
    startQuizAttempt: builder.mutation<any, { studentId: string; quizId: string }>({
      query: ({ studentId, quizId }) => ({
        url: `/students/${studentId}/quizzes/${quizId}/attempts`,
        method: "POST",
      }),
      invalidatesTags: ["QuizAttempts"],
    }),

    submitQuizAttempt: builder.mutation<any, { studentId: string; quizId: string; attemptId: string; answers: any[] }>({
      query: ({ studentId, quizId, attemptId, answers }) => ({
        url: `/students/${studentId}/quizzes/${quizId}/attempts/${attemptId}`,
        method: "POST",
        body: { answers },
      }),
      invalidatesTags: ["QuizAttempts", "StudentGrades"],
    }),

    /* ---------------------------------------------------------------- */
    /* Session-based attendance                                          */
    /*                                                                   */
    /* Attendance is recorded against a session, not a bare date. The     */
    /* older flat `GET/POST /classrooms/{id}/attendance?date=` route this */
    /* screen used to call does not exist on the backend and returned 404 */
    /* on every render.                                                   */
    /* ---------------------------------------------------------------- */

    /** GET /classrooms/{id}/sessions */
    getSessions: builder.query<
      ClassSession[],
      { classroomId: string; from?: string; to?: string }
    >({
      query: ({ classroomId, from, to }) => ({
        url: `/classrooms/${classroomId}/sessions`,
        params: { ...(from ? { from } : {}), ...(to ? { to } : {}) },
      }),
      transformResponse: (raw: unknown) => toArray(raw).map(mapSession),
      providesTags: ["AttendanceSessions"],
    }),

    /** POST /classrooms/{id}/sessions */
    createSession: builder.mutation<
      ClassSession,
      {
        classroomId: string;
        sessionDate: string;
        startTime: string;
        endTime?: string;
        type?: SessionType;
        topic?: string;
      }
    >({
      query: ({ classroomId, ...body }) => ({
        url: `/classrooms/${classroomId}/sessions`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => mapSession(toObject(raw)),
      invalidatesTags: ["AttendanceSessions", "AttendanceRegister"],
    }),

    /**
     * POST /classrooms/{id}/sessions/open
     *
     * Opens (or reuses) the day's session and returns its register in one
     * call, so taking attendance is a single action rather than
     * create-then-load. `opened: false` is a normal answer for a day the
     * class does not meet.
     */
    openSession: builder.mutation<
      OpenSessionResult,
      { classroomId: string; date?: string }
    >({
      query: ({ classroomId, date }) => ({
        url: `/classrooms/${classroomId}/sessions/open`,
        method: "POST",
        params: date ? { date } : undefined,
      }),
      transformResponse: (raw: unknown): OpenSessionResult => {
        const d = toObject(raw);
        const opened = d.opened === true;
        return {
          opened,
          reason: str(d, "reason"),
          register: opened ? mapRegister(d.register) : null,
        };
      },
      invalidatesTags: ["AttendanceSessions"],
    }),

    /** GET /classrooms/{id}/sessions/{sessionId}/register */
    getRegister: builder.query<
      SessionRegister,
      { classroomId: string; sessionId: string }
    >({
      query: ({ classroomId, sessionId }) =>
        `/classrooms/${classroomId}/sessions/${sessionId}/register`,
      transformResponse: mapRegister,
      providesTags: ["AttendanceRegister"],
    }),

    /** POST /classrooms/{id}/sessions/{sessionId}/register */
    markAttendance: builder.mutation<
      SessionRegister,
      {
        classroomId: string;
        sessionId: string;
        marks: {
          studentId: string;
          status: AttendanceStatus;
          minutesLate?: number | null;
          remark?: string | null;
          excuseReference?: string | null;
        }[];
        markSessionHeld?: boolean;
      }
    >({
      query: ({ classroomId, sessionId, ...body }) => ({
        url: `/classrooms/${classroomId}/sessions/${sessionId}/register`,
        method: "POST",
        body,
      }),
      transformResponse: mapRegister,
      invalidatesTags: [
        "AttendanceSessions",
        "AttendanceRegister",
        "AttendanceSummary",
        "StudentAttendance",
      ],
    }),

    /** POST /classrooms/{id}/sessions/{sessionId}/cancel */
    cancelSession: builder.mutation<
      ClassSession,
      { classroomId: string; sessionId: string; reason: string }
    >({
      query: ({ classroomId, sessionId, reason }) => ({
        url: `/classrooms/${classroomId}/sessions/${sessionId}/cancel`,
        method: "POST",
        body: { reason },
      }),
      transformResponse: (raw: unknown) => mapSession(toObject(raw)),
      invalidatesTags: [
        "AttendanceSessions",
        "AttendanceRegister",
        "AttendanceSummary",
      ],
    }),

    /** DELETE /classrooms/{id}/sessions/{sessionId} */
    deleteSession: builder.mutation<
      void,
      { classroomId: string; sessionId: string }
    >({
      query: ({ classroomId, sessionId }) => ({
        url: `/classrooms/${classroomId}/sessions/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "AttendanceSessions",
        "AttendanceRegister",
        "AttendanceSummary",
      ],
    }),

    /** GET /classrooms/{id}/attendance/summary */
    getAttendanceSummary: builder.query<AttendanceSummary[], string>({
      query: (classroomId) => `/classrooms/${classroomId}/attendance/summary`,
      transformResponse: (raw: unknown) => toArray(raw).map(mapSummary),
      providesTags: ["AttendanceSummary"],
    }),

    /** GET /classrooms/{id}/attendance/policy */
    getAttendancePolicy: builder.query<AttendancePolicy, string>({
      query: (classroomId) => `/classrooms/${classroomId}/attendance/policy`,
      transformResponse: mapPolicy,
      providesTags: ["AttendancePolicy"],
    }),

    /** PUT /classrooms/{id}/attendance/policy */
    saveAttendancePolicy: builder.mutation<
      AttendancePolicy,
      {
        classroomId: string;
        lateCredit?: number;
        lateBecomesAbsentAfterMinutes?: number | null;
        minPercentToSitExam?: number | null;
        excusedAbsencesIgnored?: boolean;
      }
    >({
      query: ({ classroomId, ...body }) => ({
        url: `/classrooms/${classroomId}/attendance/policy`,
        method: "PUT",
        body,
      }),
      transformResponse: mapPolicy,
      invalidatesTags: ["AttendancePolicy", "AttendanceSummary"],
    }),

    /** GET /classrooms/{id}/schedule — the weekly timetable. */
    getSchedule: builder.query<ScheduleSlot[], string>({
      query: (classroomId) => `/classrooms/${classroomId}/schedule`,
      transformResponse: (raw: unknown) => toArray(raw).map(mapSlot),
      providesTags: ["ClassSchedule"],
    }),

    /** PUT /classrooms/{id}/schedule — replaces the whole weekly timetable. */
    saveSchedule: builder.mutation<
      ScheduleSlot[],
      {
        classroomId: string;
        slots: {
          dayOfWeek: Weekday;
          startTime: string;
          endTime?: string | null;
          type?: SessionType;
          room?: string | null;
        }[];
      }
    >({
      query: ({ classroomId, slots }) => ({
        url: `/classrooms/${classroomId}/schedule`,
        method: "PUT",
        body: { slots },
      }),
      transformResponse: (raw: unknown) => toArray(raw).map(mapSlot),
      invalidatesTags: ["ClassSchedule"],
    }),

    /**
     * POST /classrooms/{id}/schedule/generate-sessions
     *
     * Safe to run more than once: sessions that already exist are left
     * alone, so extending the range later never disturbs marks already taken.
     */
    generateSessions: builder.mutation<
      GenerateSessionsResult,
      { classroomId: string; from?: string; to?: string; skipDates?: string[] }
    >({
      query: ({ classroomId, ...body }) => ({
        url: `/classrooms/${classroomId}/schedule/generate-sessions`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => {
        const d = toObject(raw);
        return {
          created: pickNum(d, ["created"], 0),
          skippedExisting: pickNum(d, ["skippedExisting"], 0),
          skippedHolidays: pickNum(d, ["skippedHolidays"], 0),
          from: pick(d, ["from"], ""),
          to: pick(d, ["to"], ""),
        };
      },
      invalidatesTags: ["AttendanceSessions"],
    }),

    // --- Comments (classroom/assignment discussion threads) ---
    getComments: builder.query<Comment[], CommentScope>({
      query: (scope) => ({
        url: scope.kind === "classroom" ? `/classrooms/${scope.id}/comments` : `/assignments/${scope.id}/comments`,
      }),
      providesTags: (_r, _e, scope) => [{ type: "Comments", id: `${scope.kind}:${scope.id}` }],
    }),

    createComment: builder.mutation<Comment, { scope: CommentScope; payload: CreateCommentPayload }>({
      query: ({ scope, payload }) => ({
        url: scope.kind === "classroom" ? `/classrooms/${scope.id}/comments` : `/assignments/${scope.id}/comments`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { scope }) => [{ type: "Comments", id: `${scope.kind}:${scope.id}` }],
    }),

    updateComment: builder.mutation<Comment, { commentId: string; scope: CommentScope; payload: UpdateCommentPayload }>({
      query: ({ commentId, payload }) => ({
        url: `/comments/${commentId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { scope }) => [{ type: "Comments", id: `${scope.kind}:${scope.id}` }],
    }),

    deleteComment: builder.mutation<void, { commentId: string; scope: CommentScope }>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { scope }) => [{ type: "Comments", id: `${scope.kind}:${scope.id}` }],
    }),

    getMentionableMembers: builder.query<MentionUser[], { scope: CommentScope; query?: string }>({
      query: ({ scope, query }) => ({
        url: scope.kind === "classroom" ? `/classrooms/${scope.id}/mentionable-members` : `/assignments/${scope.id}/mentionable-members`,
        params: query ? { query } : undefined,
      }),
    }),

    // --- Private comments (student <-> teacher, per assignment) ---
    getMyPrivateComments: builder.query<PrivateComment[], string>({
      query: (assignmentId) => `/assignments/${assignmentId}/private-comments`,
      providesTags: (_r, _e, assignmentId) => [{ type: "PrivateComments", id: assignmentId }],
    }),

    postMyPrivateComment: builder.mutation<PrivateComment, { assignmentId: string; body: string }>({
      query: ({ assignmentId, body }) => ({
        url: `/assignments/${assignmentId}/private-comments`,
        method: "POST",
        body: { body },
      }),
      invalidatesTags: (_r, _e, { assignmentId }) => [{ type: "PrivateComments", id: assignmentId }],
    }),

    getStudentPrivateComments: builder.query<PrivateComment[], { assignmentId: string; studentId: string }>({
      query: ({ assignmentId, studentId }) => `/assignments/${assignmentId}/students/${studentId}/private-comments`,
      providesTags: (_r, _e, { assignmentId, studentId }) => [{ type: "PrivateComments", id: `${assignmentId}:${studentId}` }],
    }),

    postStudentPrivateComment: builder.mutation<PrivateComment, { assignmentId: string; studentId: string; body: string }>({
      query: ({ assignmentId, studentId, body }) => ({
        url: `/assignments/${assignmentId}/students/${studentId}/private-comments`,
        method: "POST",
        body: { body },
      }),
      invalidatesTags: (_r, _e, { assignmentId, studentId }) => [{ type: "PrivateComments", id: `${assignmentId}:${studentId}` }],
    }),

    // --- Dashboard summaries ---
    getTeacherDashboardSummary: builder.query<TeacherDashboardSummary, void>({
      query: () => "/teachers/me/dashboard-summary",
      providesTags: ["TeacherDashboardSummary"],
    }),

    getTeacherStudentMetrics: builder.query<StudentMetrics[], void>({
      query: () => "/teachers/me/student-metrics",
      providesTags: ["TeacherStudentMetrics"],
    }),

    getStudentDashboardSummary: builder.query<StudentDashboardSummary, string>({
      query: (studentId) => `/students/${studentId}/dashboard-summary`,
      providesTags: ["StudentDashboardSummary"],
    }),

    // --- Student assignments list/detail ---
    getStudentAssignmentsList: builder.query<StudentAssignmentListItem[], string>({
      query: (studentId) => `/students/${studentId}/assignments-list`,
      providesTags: ["StudentAssignmentsList"],
    }),

    /**
     * The roster page needs every student across every one of the teacher's
     * classrooms, deduped and tagged with which classroom they came from.
     * `query()` can only hit one URL, so this fans out to each classroom's
     * `/students` endpoint and merges — still one cache entry, keyed on the
     * classroom list, instead of the page re-running N fetches on every visit.
     */
    getStudentsForClassrooms: builder.query<
      { student: ClassroomStudentResponse; classroomId: string; className: string }[],
      { classroomId: string; className: string }[]
    >({
      async queryFn(classrooms, _api, _extra, baseQuery) {
        const results = await Promise.all(
          classrooms.map(async (c) => {
            const res = await baseQuery(`/classrooms/${c.classroomId}/students`);
            const list = (res.data as ClassroomStudentResponse[]) ?? [];
            return {
              error: res.error,
              data: list.map((s) => ({ student: s, classroomId: c.classroomId, className: c.className })),
            };
          })
        );
        const failed = results.find((r) => r.error);
        if (failed?.error) return { error: failed.error };
        const merged = results.flatMap((r) => r.data);
        return { data: merged };
      },
      providesTags: ["ClassroomStudents"],
    }),

    /** Every lesson across a set of classrooms, tagged with which one it came from — same fan-out pattern as getStudentsForClassrooms. */
    getLessonsForClassrooms: builder.query<
      (LessonResponse & { classCode: string; className: string })[],
      { classroomId: string; classCode: string; className: string }[]
    >({
      async queryFn(classrooms, _api, _extra, baseQuery) {
        const results = await Promise.all(
          classrooms.map(async (c) => {
            const res = await baseQuery(`/classrooms/${c.classroomId}/lessons`);
            const list = (res.data as LessonResponse[]) ?? [];
            return {
              error: res.error,
              data: list.map((l) => ({ ...l, classCode: c.classCode, className: c.className })),
            };
          })
        );
        const failed = results.find((r) => r.error);
        if (failed?.error) return { error: failed.error };
        return { data: results.flatMap((r) => r.data) };
      },
      providesTags: ["ClassroomLessons"],
    }),

    getStudentQuizzes: builder.query<QuizResponse[], string>({
      query: (studentId) => `/students/${studentId}/quizzes`,
      providesTags: ["StudentAssignmentsList"],
    }),

    getStudentAssignments: builder.query<
      { content: StudentAssignmentResponse[]; totalElements: number; totalPages: number; size: number; number: number },
      { studentId: string; page?: number; size?: number }
    >({
      query: ({ studentId, page = 0, size = 25 }) => ({
        url: `/students/${studentId}/assignments`,
        params: { page, size },
      }),
      providesTags: ["StudentAssignmentsList"],
    }),

    getStudentAssignmentDetail: builder.query<StudentAssignmentResponse, { studentId: string; assignmentId: string }>({
      query: ({ studentId, assignmentId }) => `/students/${studentId}/assignments/${assignmentId}`,
      providesTags: (_r, _e, { assignmentId }) => [{ type: "ClassroomAssignments", id: assignmentId }],
    }),

    // --- Saved lesson mutations (delete/update — create/assign already existed) ---
    deleteSavedLesson: builder.mutation<void, string>({
      query: (lessonId) => ({ url: `/lessons/${lessonId}`, method: "DELETE" }),
      invalidatesTags: ["SavedLessons", "ClassroomLessons"],
    }),

    updateSavedLesson: builder.mutation<any, { lessonId: string; title?: string; content?: string; videoLink?: string; allowDownload?: boolean }>({
      query: ({ lessonId, ...body }) => ({
        url: `/lessons/${lessonId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SavedLessons", "ClassroomLessons"],
    }),
  }),
});

export const {
  useGetClassroomByIdQuery,
  useGetClassroomLessonsQuery,
  useGetClassroomAssignmentsQuery,
  useGetMyClassroomsQuery,
  useGetStudentProfileQuery,
  useGetStudentAttendanceQuery,
  useGetStudentTimetableQuery,
  useGetStudentCertificatesQuery,
  useGetIssuedCertificatesQuery,
  useCreateCertificateRequestMutation,
  useGetStudentGradesQuery,
  useGetStudentGpaQuery,
  useGetTeacherProfileQuery,
  useGetTeacherClassroomsQuery,
  useGetClassroomStudentsQuery,
  useGetClassroomTeachersQuery,
  useRemoveStudentFromClassroomMutation,
  useGetTeacherAttendanceQuery,
  useRecordTeacherAttendanceMutation,
  useGetExamScoresQuery,
  useSaveExamScoresMutation,
  useGetTeacherQuizzesQuery,
  useCreateTeacherQuizMutation,
  useUpdateTeacherQuizMutation,
  useAssignQuizToClassroomMutation,
  useGetQuizByIdQuery,
  useDeleteTeacherQuizMutation,
  useGetQuizAttemptsQuery,
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useLoginUserMutation,
  useGetUserProfileQuery,
  useGetSavedLessonsQuery,
  useCreateSavedLessonMutation,
  useCreateLessonForClassroomMutation,
  useAssignLessonToClassroomMutation,
  useGetSavedAssignmentsQuery,
  useCreateSavedAssignmentMutation,
  useCreateAssignmentForClassroomMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useAssignAssignmentToClassroomMutation,
  useGetAssignmentDetailQuery,
  useGetAssignmentSubmissionsQuery,
  useGradeSubmissionMutation,
  useSubmitAssignmentMutation,
  useUploadStudentAvatarMutation,
  useUploadTeacherAvatarMutation,
  useStartQuizAttemptMutation,
  useSubmitQuizAttemptMutation,
  useGetSessionsQuery,
  useCreateSessionMutation,
  useOpenSessionMutation,
  useGetRegisterQuery,
  useMarkAttendanceMutation,
  useCancelSessionMutation,
  useDeleteSessionMutation,
  useGetAttendanceSummaryQuery,
  useGetAttendancePolicyQuery,
  useSaveAttendancePolicyMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetMentionableMembersQuery,
  useGetMyPrivateCommentsQuery,
  usePostMyPrivateCommentMutation,
  useGetStudentPrivateCommentsQuery,
  usePostStudentPrivateCommentMutation,
  useGetTeacherDashboardSummaryQuery,
  useGetTeacherStudentMetricsQuery,
  useGetStudentDashboardSummaryQuery,
  useGetStudentAssignmentsListQuery,
  useGetStudentAssignmentDetailQuery,
  useGetStudentAssignmentsQuery,
  useGetStudentQuizzesQuery,
  useGetStudentsForClassroomsQuery,
  useGetLessonsForClassroomsQuery,
  useDeleteSavedLessonMutation,
  useUpdateSavedLessonMutation,
  useGetScheduleQuery,
  useSaveScheduleMutation,
  useGenerateSessionsMutation,
} = apiSlice;
