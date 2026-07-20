export type DRMProtectionLevel = "none" | "standard" | "high";

export interface LessonFormData {
  title: string;
  category: string;
  description: string;
  attachments: File[];
  allowDownload: boolean;
  drmProtectionLevel: DRMProtectionLevel;
  releaseDate: string | null;
  timeLimit: string | null;
}

export const ENTRY_CATEGORIES = [
  "Lecture Notes",
  "Reading Material",
  "Video Lesson",
  "Practical Exercise",
  "Supplementary Resource",
] as const;

export const DRM_PROTECTION_LEVELS: { value: DRMProtectionLevel; label: string }[] = [
  { value: "none", label: "No Protection" },
  { value: "standard", label: "Standard Encryption" },
  { value: "high", label: "High Security" },
];

export const initialLessonFormData: LessonFormData = {
  title: "",
  category: "",
  description: "",
  attachments: [],
  allowDownload: false,
  drmProtectionLevel: "standard",
  releaseDate: null,
  timeLimit: null,
};