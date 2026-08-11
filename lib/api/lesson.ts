// ─── Centralized Lesson API Service ───────────────────────────────────

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

export interface LessonFileResponse {
  fileId: string;
  fileOriginalName: string;
  filePreviewUrl: string;
}

export interface LessonResponse {
  lessonId: string;
  classroomId: string | null;
  title: string;
  content: string;
  files: LessonFileResponse[];
  videoLink: string;
  allowDownload: boolean;
  createdAt: string;
  createdBy: string;
}

/** GET /api/v1/lessons/saved - Retrieve saved library templates */
export async function fetchSavedLessons(): Promise<LessonResponse[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/lessons/saved`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      console.warn(`fetchSavedLessons → ${res.status}`);
      return [];
    }
    return (await res.json()) as LessonResponse[];
  } catch (err) {
    console.error("fetchSavedLessons:", err);
    return [];
  }
}

/** POST /api/v1/lessons/saved - Create a stand-alone saved lesson template */
export async function createSavedLesson(
  payload: {
    title: string;
    content: string;
    videoLink?: string;
    allowDownload?: boolean;
  },
  files: File[]
): Promise<LessonResponse | null> {
  try {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("access_token")
      : "";
      
    const formData = new FormData();
    formData.append(
      "lesson",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    files.forEach((file) => formData.append("file", file));

    const res = await fetch(`${API_BASE}/api/v1/lessons/saved`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      console.warn(`createSavedLesson → ${res.status}`);
      return null;
    }
    return (await res.json()) as LessonResponse;
  } catch (err) {
    console.error("createSavedLesson:", err);
    return null;
  }
}

/** POST /api/v1/lessons/{lessonId}/assign/{classroomId} - Assign saved lesson template to a classroom */
export async function assignSavedLesson(
  lessonId: string,
  classroomId: string
): Promise<LessonResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/lessons/${lessonId}/assign/${classroomId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );
    if (!res.ok) {
      console.warn(`assignSavedLesson → ${res.status}`);
      return null;
    }
    return (await res.json()) as LessonResponse;
  } catch (err) {
    console.error("assignSavedLesson:", err);
    return null;
  }
}

/** POST /api/v1/classrooms/{classroomId}/lessons - Create a lesson directly in a classroom */
export async function createLessonForClassroom(
  classroomId: string,
  payload: {
    title: string;
    content: string;
    videoLink?: string;
    allowDownload?: boolean;
  },
  files: File[]
): Promise<LessonResponse | null> {
  try {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("access_token")
      : "";
      
    const formData = new FormData();
    formData.append(
      "lesson",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    files.forEach((file) => formData.append("file", file));

    const res = await fetch(`${API_BASE}/api/v1/classrooms/${classroomId}/lessons`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      console.warn(`createLessonForClassroom → ${res.status}`);
      return null;
    }
    return (await res.json()) as LessonResponse;
  } catch (err) {
    console.error("createLessonForClassroom:", err);
    return null;
  }
}
