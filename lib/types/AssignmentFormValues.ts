// features/assignments/form/types.ts

export interface CourseOption {
  id: string;
  name: string;
  subtitle: string; // e.g. "Primary Course"
}

export interface RecipientOption {
  id: string;
  label: string; // e.g. "All students"
  subtitle: string; // e.g. "24 recipients"
}

export type FormAttachmentKind = "file" | "link" | "created";

export interface FormAttachment {
  id: string;
  kind: FormAttachmentKind;
  name: string;
  file?: File;
  url?: string;
  sizeLabel?: string;
}

export interface AssignmentFormValues {
  title: string;
  instructionsHtml: string;
  courseId: string;
  recipientId: string;
  points: number | "";
  dueDate: string; // yyyy-mm-dd
  dueTime: string; // HH:mm
  topic: string;
  checkPlagiarism: boolean;
  attachments: FormAttachment[];
}