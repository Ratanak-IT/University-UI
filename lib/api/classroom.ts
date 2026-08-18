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

export interface StudentCourseCard {
  id: string | number;
  name: string;
  code: string;
  initials: string;
  students: number;
  year: string;
  meta: string;
  toGrade: number;
  color: "indigo" | "amber" | "rose" | "emerald";
  classCode: string;
  room: string;
}

import { API_BASE } from "./config";
export {
  useGetClassroomByIdQuery,
  useGetMyClassroomsQuery,
} from "@/lib/redux/apiSlice";



function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

export async function fetchMyClassrooms(): Promise<ClassroomResponse[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/classrooms/my-classrooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!res.ok) {
      console.warn(`Failed to fetch my-classrooms (status ${res.status})`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching my-classrooms:", error);
    return [];
  }
}

export async function fetchClassroomById(classroomId: string): Promise<ClassroomResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/classrooms/${classroomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!res.ok) {
      console.warn(`Failed to fetch classroom ${classroomId} (status ${res.status})`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching classroom ${classroomId}:`, error);
    return null;
  }
}

export function mapClassroomToCourseCard(
  item: ClassroomResponse,
  index: number
): StudentCourseCard {
  const colors: Array<"indigo" | "amber" | "rose" | "emerald"> = [
    "indigo",
    "amber",
    "rose",
    "emerald",
  ];
  const color = colors[index % colors.length];

  const initials = item.className
    ? item.className
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "CS";

  const yearText = item.yearLevel && item.semester
    ? `Year ${item.yearLevel} . Sem ${item.semester}`
    : item.academicYear ?? "Year 3 . Sem 2";

  const roomText = item.room ? `Room ${item.room}` : "Room 204";
  const codeText = item.inviteCode ? `Code ${item.inviteCode}` : `Code ${item.classCode}`;

  return {
    id: item.classroomId,
    name: item.className || "Classroom",
    code: `${item.classCode || "CS-101"} . ${item.subjectName || "General"}`,
    initials,
    students: 30, // default or calculated count
    year: yearText,
    meta: `${roomText} . ${codeText}`,
    toGrade: 0,
    color,
    classCode: item.classCode,
    room: roomText,
  };
}
