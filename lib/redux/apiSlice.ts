import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  StudentProfile,
  AttendanceResponse,
  CertificateRequestResponse,
  GradeResponse,
  GpaResponse,
  ClassroomResponse,
  ClassroomStudentResponse,
  ClassroomMemberResponse,
  LessonResponse,
  AssignmentResponse,
} from "@/lib/api/student";
import {
  TeacherProfile,
  ExamScoreResponse,
  SetExamScoresRequest,
  RecordAttendancePayload,
} from "@/lib/api/teacher";
import type { SubmissionResponse } from "@/lib/api/assignment";
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
  OpenSessionResult,
  SessionRegister,
  SessionStatus,
  SessionStudentMark,
  SessionType,
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

export interface QuizManageResponse {
  quizId: string;
  classroomId?: string;
  className?: string;
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
      AttendanceResponse[],
      { studentId: string; classroomId?: string }
    >({
      query: ({ studentId, classroomId }) =>
        `/students/${studentId}/attendance` +
        (classroomId ? `?classroomId=${classroomId}` : ""),
      providesTags: ["StudentAttendance"],
    }),

    getStudentCertificates: builder.query<CertificateRequestResponse[], string>({
      query: (studentId) => `/students/${studentId}/certificate-requests`,
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

    assignQuizToClassroom: builder.mutation<
      QuizManageResponse,
      { quizId: string; classroomId: string }
    >({
      query: ({ quizId, classroomId }) => ({
        url: `/quizzes/${quizId}/assign-classroom`,
        method: "PUT",
        body: { classroomId },
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

    getMyNotifications: builder.query<
      {
        id: string;
        userId: string;
        title: string;
        message: string;
        type: "GRADE" | "ASSIGNMENT" | "CERTIFICATE" | "ANNOUNCEMENT" | "ATTENDANCE";
        context: string;
        actor: string;
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

    createSavedLesson: builder.mutation<any, { title: string; contentType: string; contentUrl?: string; description?: string }>({
      query: (payload) => ({
        url: "/lessons/saved",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SavedLessons"],
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

    createSavedAssignment: builder.mutation<any, { title: string; description?: string; maxScore?: number; fileUrl?: string }>({
      query: (payload) => ({
        url: "/assignments/saved",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SavedAssignments"],
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
  }),
});

export const {
  useGetClassroomByIdQuery,
  useGetClassroomLessonsQuery,
  useGetClassroomAssignmentsQuery,
  useGetMyClassroomsQuery,
  useGetStudentProfileQuery,
  useGetStudentAttendanceQuery,
  useGetStudentCertificatesQuery,
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
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useLoginUserMutation,
  useGetUserProfileQuery,
  useGetSavedLessonsQuery,
  useCreateSavedLessonMutation,
  useAssignLessonToClassroomMutation,
  useGetSavedAssignmentsQuery,
  useCreateSavedAssignmentMutation,
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
  // Session-based attendance
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
} = apiSlice;
