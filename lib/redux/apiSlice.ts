import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  StudentProfile,
  AttendanceResponse,
  CertificateRequestResponse,
  GradeResponse,
  GpaResponse,
  ClassroomResponse,
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

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`
      : "https://api.careerpatch.site/api/v1",
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
    "TeacherAttendance",
    "ExamScores",
    "ClassroomDetail",
    "ClassroomLessons",
    "ClassroomAssignments",
    "TeacherQuizzes",
    "Notifications",
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

    getClassroomStudents: builder.query<any[], string>({
      query: (classroomId) => `/classrooms/${classroomId}/students`,
      providesTags: ["ClassroomStudents"],
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
} = apiSlice;
