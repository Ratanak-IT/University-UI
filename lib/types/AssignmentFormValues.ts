// features/assignments/form/types.ts

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
  points: number | "";
  dueDate: string; // yyyy-mm-dd
  dueTime: string; // HH:mm
  attachments: FormAttachment[];
}