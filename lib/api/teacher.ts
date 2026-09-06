import { API_BASE } from "./config";
import { ClassroomResponse } from "./student";
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


export interface TeacherDashboardSummary {
  activeClasses: number;
  totalStudents: number;
  courseMaterials: number;
  toGrade: number;
  attendanceToday: number;
  avgAttendancePercent: number | null;
  avgPerformancePercent: number | null;
}

export async function fetchTeacherDashboardSummary(): Promise<TeacherDashboardSummary | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/teachers/me/dashboard-summary`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (!res.ok) {
      console.warn(`fetchTeacherDashboardSummary → ${res.status}`);
      return null;
    }
    return (await res.json()) as TeacherDashboardSummary;
  } catch (err) {
    console.error("fetchTeacherDashboardSummary:", err);
    return null;
  }
}

export interface StudentMetrics {
  studentId: string;
  attendancePercent: number | null;
  performancePercent: number | null;
}

/** Per-student attendance/performance across this teacher's own classrooms, for the roster's filterable stat cards. */
export async function fetchTeacherStudentMetrics(): Promise<StudentMetrics[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/teachers/me/student-metrics`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (!res.ok) {
      console.warn(`fetchTeacherStudentMetrics → ${res.status}`);
      return [];
    }
    return (await res.json()) as StudentMetrics[];
  } catch (err) {
    console.error("fetchTeacherStudentMetrics:", err);
    return [];
  }
}

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

export type ExamType = "MIDTERM" | "FINAL" | "ASSIGNMENT" | "QUIZ" | "ATTENDANCE" | "OTHER";

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
    code: item.classCode || "Not set",
    track: item.subjectName || "General",
    initials,
    year: yearText,
    room: item.room ? `Room ${item.room}` : "Not set",
    classCode: item.classCode || "",
    headerClass: color.header,
    initialsTextClass: color.text,
    badgeClass: color.badge,
  };
}
