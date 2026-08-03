// ─── Centralized Student API Service ─────────────────────────────────
// All fetch calls for the student dashboard go through here.
// Backend base: Spring Boot at /api/v1

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";

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

// ─── Response Types (mirrors backend records) ────────────────────────

export interface StudentProfile {
  id: string;
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

export interface GradeResponse {
  classroomId: string;
  className: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credit: number;
  academicYear: string;
  semester: number;
  gradedAssignments: number;
  totalAssignments: number;
  scorePercent: number;
  letterGrade: string;
  gradePoint: number;
}

export interface GpaResponse {
  studentId: string;
  studentCode: string;
  cumulativeGpa: number;
  totalCredits: number;
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

export interface ClassroomMemberResponse {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
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

export interface AttendanceResponse {
  attendanceId: string;
  classroomId: string;
  className: string;
  subjectName: string;
  attendanceDate: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remark: string | null;
}

/** GET /api/v1/students/{id}/attendance */
export function fetchStudentAttendance(studentId: string, classroomId?: string) {
  const url = `/api/v1/students/${studentId}/attendance` + (classroomId ? `?classroomId=${classroomId}` : "");
  return apiFetch<AttendanceResponse[]>(url);
}
