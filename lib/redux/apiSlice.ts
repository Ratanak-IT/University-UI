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

function getAuthHeaderToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || localStorage.getItem("access_token");
  }
  return null;
}

export interface QuizQuestionPayload {
  questionText: string;
  options: string[];
  correctAnswer: string;
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
    correctAnswer: string;
    score: number;
    questionOrder: number;
  }[];
}

import { API_BASE } from "../api/config";

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
    getAssignmentDetail: builder.query<any, string>({
      query: (id) => `/assignments/${id}`,
      providesTags: ["ClassroomAssignments"],
    }),

    getAssignmentSubmissions: builder.query<any[], string>({
      query: (assignmentId) => `/assignments/${assignmentId}/submissions`,
      providesTags: ["Submissions"],
    }),

    gradeSubmission: builder.mutation<any, { submissionId: string; grade: number; feedback?: string }>({
      query: ({ submissionId, grade, feedback }) => ({
        url: `/submissions/${submissionId}/grade`,
        method: "POST",
        body: { grade, feedback },
      }),
      invalidatesTags: ["Submissions", "StudentGrades"],
    }),

    submitAssignment: builder.mutation<any, { assignmentId: string; fileUrl: string }>({
      query: ({ assignmentId, fileUrl }) => ({
        url: `/assignments/${assignmentId}/submissions`,
        method: "POST",
        body: { fileUrl },
      }),
      invalidatesTags: ["Submissions", "ClassroomAssignments"],
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
} = apiSlice;
