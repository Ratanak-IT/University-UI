import type { CreateLessonPayload, CreateLessonResponse } from "./types";

import { API_BASE } from "@/lib/api/config";


function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("access_token") ?? "";
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message ?? body?.detail ?? message;
    } catch {
      // response had no JSON body — keep default message
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function createLesson(
  payload: CreateLessonPayload,
  attachments: File[]
): Promise<CreateLessonResponse> {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append(
    "lesson",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  );
  attachments.forEach((file) => formData.append("file", file));

  const classroomId = payload.classroomId;

  const res = await fetch(
    `${API_BASE}/api/v1/classrooms/${classroomId}/lessons`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return handleResponse<CreateLessonResponse>(res);
}

export async function saveLessonDraft(
  payload: CreateLessonPayload,
  attachments: File[]
): Promise<CreateLessonResponse> {
  // Draft saving uses the same create endpoint with a draft status
  const draftPayload: CreateLessonPayload = { ...payload, status: "draft" };
  return createLesson(draftPayload, attachments);
}