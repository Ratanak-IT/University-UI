import type { CreateLessonPayload, CreateLessonResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message ?? message;
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
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  attachments.forEach((file) => formData.append("attachments", file));

  const res = await fetch(`${API_BASE}/api/lessons`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<CreateLessonResponse>(res);
}

export async function saveLessonDraft(
  payload: CreateLessonPayload,
  attachments: File[]
): Promise<CreateLessonResponse> {
  const formData = new FormData();
  formData.append("data", JSON.stringify({ ...payload, status: "draft" }));
  attachments.forEach((file) => formData.append("attachments", file));

  const res = await fetch(`${API_BASE}/api/lessons/draft`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<CreateLessonResponse>(res);
}