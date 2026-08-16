// ─── Centralized Assignment API Service ──────────────────────────────

import { API_BASE } from "./config";
export {
  useGetSavedAssignmentsQuery,
  useCreateSavedAssignmentMutation,
  useAssignAssignmentToClassroomMutation,
  useGetClassroomAssignmentsQuery,
  useGetAssignmentDetailQuery,
  useGetAssignmentSubmissionsQuery,
  useGradeSubmissionMutation,
  useSubmitAssignmentMutation,
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

export interface FileResponse {
  fileId: string;
  fileOriginalName: string;
  filePreviewUrl: string;
}

export interface AssignmentResponse {
  assignmentId: string;
  classroomId: string | null;
  title: string;
  description: string;
  dueDate: string | null;
  maxScore: number;
  weight: number;
  files: FileResponse[];
  createdAt: string;
  createdBy: string;
}

/** GET /api/v1/assignments/saved - Retrieve saved assignment templates */
export async function fetchSavedAssignments(): Promise<AssignmentResponse[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/assignments/saved`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      console.warn(`fetchSavedAssignments → ${res.status}`);
      return [];
    }
    return (await res.json()) as AssignmentResponse[];
  } catch (err) {
    console.error("fetchSavedAssignments:", err);
    return [];
  }
}

/** POST /api/v1/assignments/saved - Create a stand-alone saved assignment template */
export async function createSavedAssignment(
  payload: {
    title: string;
    description: string;
    maxScore: number;
    weight: number;
  },
  files: File[]
): Promise<AssignmentResponse | null> {
  try {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("access_token")
      : "";
      
    const formData = new FormData();
    formData.append(
      "assignment",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    files.forEach((file) => formData.append("files", file));

    const res = await fetch(`${API_BASE}/api/v1/assignments/saved`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      console.warn(`createSavedAssignment → ${res.status}`);
      return null;
    }
    return (await res.json()) as AssignmentResponse;
  } catch (err) {
    console.error("createSavedAssignment:", err);
    return null;
  }
}

/** POST /api/v1/assignments/{assignmentId}/assign/{classroomId} - Assign saved assignment template to a classroom */
export async function assignSavedAssignment(
  assignmentId: string,
  classroomId: string,
  dueDate: string
): Promise<AssignmentResponse | null> {
  try {
    // Format to ISO 8601 without seconds, e.g. "2026-08-04T12:00:00"
    const formattedDueDate = new Date(dueDate).toISOString().slice(0, 19);
    
    const res = await fetch(
      `${API_BASE}/api/v1/assignments/${assignmentId}/assign/${classroomId}?dueDate=${formattedDueDate}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );
    if (!res.ok) {
      console.warn(`assignSavedAssignment → ${res.status}`);
      return null;
    }
    return (await res.json()) as AssignmentResponse;
  } catch (err) {
    console.error("assignSavedAssignment:", err);
    return null;
  }
}

/** POST /api/v1/classrooms/{classroomId}/assignments - Create assignment directly in classroom */
export async function createAssignmentForClassroom(
  classroomId: string,
  payload: {
    title: string;
    description: string;
    dueDate: string;
    maxScore: number;
    weight: number;
  },
  files: File[]
): Promise<AssignmentResponse | null> {
  try {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("access_token")
      : "";
      
    // Format to ISO 8601 without seconds, e.g. "2026-08-04T12:00:00"
    const formattedDueDate = new Date(payload.dueDate).toISOString().slice(0, 19);
    const bodyPayload = { ...payload, dueDate: formattedDueDate };

    const formData = new FormData();
    formData.append(
      "assignment",
      new Blob([JSON.stringify(bodyPayload)], { type: "application/json" })
    );
    files.forEach((file) => formData.append("files", file));

    const res = await fetch(`${API_BASE}/api/v1/classrooms/${classroomId}/assignments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      console.warn(`createAssignmentForClassroom → ${res.status}`);
      return null;
    }
    return (await res.json()) as AssignmentResponse;
  } catch (err) {
    console.error("createAssignmentForClassroom:", err);
    return null;
  }
}

export interface SubmissionResponse {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  files: FileResponse[];
  submittedAt: string;
  status: "SUBMITTED" | "LATE" | "GRADED";
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
}

/** GET /api/v1/assignments/{assignmentId} - Fetch details for a specific assignment */
export async function fetchAssignmentById(
  assignmentId: string
): Promise<AssignmentResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/assignments/${assignmentId}`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      console.warn(`fetchAssignmentById → ${res.status}`);
      return null;
    }
    return (await res.json()) as AssignmentResponse;
  } catch (err) {
    console.error("fetchAssignmentById:", err);
    return null;
  }
}

/** GET /api/v1/assignments/{assignmentId}/submissions - Retrieve all submissions for grading */
export async function fetchAssignmentSubmissions(
  assignmentId: string
): Promise<SubmissionResponse[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/assignments/${assignmentId}/submissions`,
      {
        headers: { ...getAuthHeader() },
      }
    );
    if (!res.ok) {
      console.warn(`fetchAssignmentSubmissions → ${res.status}`);
      return [];
    }
    return (await res.json()) as SubmissionResponse[];
  } catch (err) {
    console.error("fetchAssignmentSubmissions:", err);
    return [];
  }
}

/** PATCH /api/v1/submissions/{submissionId}/grade - Grade a student submission */
export async function gradeSubmission(
  submissionId: string,
  score: number,
  feedback: string
): Promise<SubmissionResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/submissions/${submissionId}/grade`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ score, feedback }),
      }
    );
    if (!res.ok) {
      console.warn(`gradeSubmission → ${res.status}`);
      return null;
    }
    return (await res.json()) as SubmissionResponse;
  } catch (err) {
    console.error("gradeSubmission:", err);
    return null;
  }
}
