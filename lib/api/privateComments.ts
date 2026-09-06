export interface PrivateComment {
  commentId: string;
  assignmentId: string;
  studentId: string;
  authorUserId: string;
  authorName: string;
  /** "STUDENT" or "TEACHER" — the only two parties a private thread can have. */
  authorRole: "STUDENT" | "TEACHER";
  authorAvatarUrl?: string | null;
  body: string;
  createdAt: string;
}

