export type EntryCategory =
  | "lecture"
  | "reading"
  | "exercise"
  | "reference"
  | "assessment-prep";

export type DRMProtectionLevel = "none" | "standard" | "strict";

export interface LessonAttachment {
  id: string;
  file: File;
  name: string;
  sizeLabel: string;
}

export interface LessonFormData {
  title: string;
  category: EntryCategory | "";
  description: string;
  attachments: LessonAttachment[];
  allowDownload: boolean;
  drmProtectionLevel: DRMProtectionLevel;
  releaseDate: string; // ISO datetime-local value
  timeLimitMinutes: number | null; // null = no limit
}

export interface CreateLessonPayload {
  title: string;
  category: EntryCategory;
  description: string;
  allowDownload: boolean;
  drmProtectionLevel: DRMProtectionLevel;
  releaseDate: string | null;
  timeLimitMinutes: number | null;
  status: "draft" | "published";
}

export interface CreateLessonResponse {
  id: string;
  formId: string;
  status: "draft" | "published";
  createdAt: string;
}

export const ENTRY_CATEGORY_LABELS: Record<EntryCategory, string> = {
  lecture: "Lecture",
  reading: "Reading",
  exercise: "Exercise",
  reference: "Reference",
  "assessment-prep": "Assessment Prep",
};