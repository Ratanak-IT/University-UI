// features/assignments/detail/types.ts

export type WorkStatus = "assigned" | "turned-in" | "graded" | "missing";

export interface AssignmentAttachment {
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl?: string;
  href: string;
}

export interface AssignmentDetail {
  id: string;
  title: string;
  authorName: string;
  postedOn: string; // e.g. "Jun 23"
  points: number;
  description?: string;
  attachments: AssignmentAttachment[];
}

export interface CommentAuthor {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  body: string;
  postedAt: string;
}

export type SubmissionAttachmentKind = "file" | "link";

export interface SubmissionAttachment {
  id: string;
  kind: SubmissionAttachmentKind;
  name: string;
  url?: string; // link href, or object URL for local preview
  file?: File; // present for kind "file", not serialized to a backend as-is
  sizeLabel?: string; // e.g. "240 KB"
}