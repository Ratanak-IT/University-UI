export interface MentionUser {
  userId: string;
  fullName: string;
  nameKhmer?: string | null;
  email?: string | null;
  role: string;
  avatarUrl?: string | null;
}


export type CommentScope =
  | { kind: "classroom"; id: string }
  | { kind: "assignment"; id: string };

export interface Comment {
  commentId: string;
  classroomId: string;
  assignmentId?: string | null;
  parentId?: string | null;
  body: string;
  edited: boolean;
  authorUserId: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl?: string | null;
  mentions: MentionUser[];
  replies: Comment[];
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCommentPayload {
  body: string;
  parentId?: string | null;
  mentionedUserIds?: string[];
}

export interface UpdateCommentPayload {
  body: string;
  mentionedUserIds?: string[];
}


