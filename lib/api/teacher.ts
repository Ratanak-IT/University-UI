import { API_BASE } from "./config";
import { ClassroomResponse } from "./classroom";
import { Classroom } from "../types/dashboard";

export {
  useGetTeacherProfileQuery,
  useGetTeacherClassroomsQuery,
  useGetClassroomStudentsQuery,
  useGetTeacherAttendanceQuery,
  useRecordTeacherAttendanceMutation,
  useGetExamScoresQuery,
  useSaveExamScoresMutation,
  useUploadTeacherAvatarMutation,
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

export interface TeacherDepartment {
  departmentId: string;
  name: string;
  code: string;
}

export interface TeacherProfile {
  id: string;
  teacherId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  roles: string[];
  teacherCode: string;
  departments: TeacherDepartment[];
  position: string;
  specialization: string;
  hireDate: string;
  employmentStatus: string;
  avatarUrl?: string | null;
}

/** GET /api/v1/teachers/me */
export async function fetchTeacherProfile(): Promise<TeacherProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/teachers/me`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (!res.ok) {
      console.warn(`fetchTeacherProfile → ${res.status}`);
      return null;
    }
    return (await res.json()) as TeacherProfile;
  } catch (err) {
    console.error("fetchTeacherProfile:", err);
    return null;
  }
}

/** POST /api/v1/teachers/me/avatar */
export async function uploadTeacherAvatar(file: File): Promise<TeacherProfile | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const headers = getAuthHeader();
    const res = await fetch(`${API_BASE}/api/v1/teachers/me/avatar`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      console.warn(`uploadTeacherAvatar → ${res.status}`);
      return null;
    }
    return (await res.json()) as TeacherProfile;
  } catch (err) {
    console.error("uploadTeacherAvatar:", err);
    return null;
  }
}

/** GET /api/v1/classrooms/my-classrooms */
export async function fetchTeacherClassrooms(): Promise<ClassroomResponse[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/classrooms/my-classrooms`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (!res.ok) {
      console.warn(`fetchTeacherClassrooms → ${res.status}`);
      return [];
    }
    return (await res.json()) as ClassroomResponse[];
  } catch (err) {
    console.error("fetchTeacherClassrooms:", err);
    return [];
  }
}

/** GET /api/v1/classrooms/{classroomId}/students */
export async function fetchClassroomStudents(classroomId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/classrooms/${classroomId}/students`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("fetchClassroomStudents:", err);
    return [];
  }
}

/** GET /api/v1/classrooms/{classroomId}/assignments */
export async function fetchClassroomAssignments(classroomId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/classrooms/${classroomId}/assignments`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("fetchClassroomAssignments:", err);
    return [];
  }
}

/** GET /api/v1/assignments/{assignmentId}/submissions */
export async function fetchAssignmentSubmissions(assignmentId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/assignments/${assignmentId}/submissions`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("fetchAssignmentSubmissions:", err);
    return [];
  }
}export type ExamType = "MIDTERM" | "FINAL" | "ASSIGNMENT" | "QUIZ" | "ATTENDANCE" | "OTHER";

export interface ExamScoreResponse {
  examScoreId: string;
  studentId: string;
  studentCode: string;
  studentName?: string | null;
  studentFullName?: string;
  classroomId: string;
  examType: ExamType;
  score: number;
  maxScore: number;
}

export interface SetExamScoreItem {
  studentId: string;
  score: number;
}

export interface SetExamScoresRequest {
  examType: ExamType;
  maxScore: number;
  scores: SetExamScoreItem[];
}

/** GET /api/v1/classrooms/{classroomId}/scores */
export async function fetchClassroomExamScores(classroomId: string): Promise<ExamScoreResponse[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/classrooms/${classroomId}/scores`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("fetchClassroomExamScores:", err);
    return [];
  }
}

/** POST /api/v1/classrooms/{classroomId}/scores */
export async function saveClassroomExamScores(
  classroomId: string,
  payload: SetExamScoresRequest
): Promise<ExamScoreResponse[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/classrooms/${classroomId}/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("saveClassroomExamScores:", err);
    return [];
  }
}

export interface AttendanceItemPayload {
  studentId: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remark?: string;
}

export interface RecordAttendancePayload {
  attendanceDate: string; // YYYY-MM-DD
  items: AttendanceItemPayload[];
}

export interface TeacherAttendanceRecord {
  studentId: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remark?: string | null;
}

/** POST /api/v1/classrooms/{classroomId}/attendance */
export async function recordTeacherAttendance(
  classroomId: string,
  payload: RecordAttendancePayload
): Promise<TeacherAttendanceRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/classrooms/${classroomId}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("recordTeacherAttendance:", err);
    return [];
  }
}

/** GET /api/v1/classrooms/{classroomId}/attendance */
export async function fetchTeacherAttendanceByDate(
  classroomId: string,
  date?: string
): Promise<TeacherAttendanceRecord[]> {
  try {
    const url = `${API_BASE}/api/v1/classrooms/${classroomId}/attendance` + (date ? `?date=${date}` : "");
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("fetchTeacherAttendanceByDate:", err);
    return [];
  }
}


/** Helper to map ClassroomResponse to Classroom card structure for Teacher Dashboard */
export function mapClassroomToTeacherCard(
  item: ClassroomResponse,
  index: number
): Classroom {
  const colors = [
    { header: "bg-indigo-700", text: "text-indigo-700", badge: "bg-violet-100 text-violet-700" },
    { header: "bg-amber-500", text: "text-amber-600", badge: "bg-sky-100 text-sky-700" },
    { header: "bg-rose-500", text: "text-rose-600", badge: "bg-emerald-100 text-emerald-700" },
    { header: "bg-emerald-600", text: "text-emerald-700", badge: "bg-orange-100 text-orange-700" },
  ];
  const color = colors[index % colors.length];

  const initials = item.className
    ? item.className
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "CS";

  const yearText = item.yearLevel && item.semester
    ? `Year ${item.yearLevel} · Sem ${item.semester}`
    : item.academicYear ?? "Year 3 · Sem 2";

  return {
    id: item.classroomId,
    title: item.className || "Classroom",
    code: item.classCode || "CS-101",
    track: item.subjectName || "General",
    initials,
    students: 30,
    year: yearText,
    room: item.room ? `Room ${item.room}` : "Room 204",
    classCode: item.classCode || "",
    toGrade: 0,
    headerClass: color.header,
    initialsTextClass: color.text,
    badgeClass: color.badge,
  };
}
