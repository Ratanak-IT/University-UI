"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MessageSquare, Pencil, Reply, Trash2 } from "lucide-react";
import { Comment, CommentScope, MentionUser } from "@/lib/api/comments";
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/lib/redux/apiSlice";
import { apiErrorMessage } from "@/lib/api/errors";
import { toast } from "@/components/shared/Toast";
import PersonAvatar from "@/components/shared/PersonAvatar";
import CommentComposer from "./CommentComposer";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

const ROLE_BADGE: Record<string, string> = {
  TEACHER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  ADMIN: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  STUDENT: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};


function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}


function renderBody(body: string, mentions: MentionUser[]): React.ReactNode {
  if (mentions.length === 0) return body;

  const names = mentions.map((m) => m.fullName).sort((a, b) => b.length - a.length);

  const nodes: React.ReactNode[] = [];
  let rest = body;
  let key = 0;

  while (rest.length > 0) {
    const hit = names
      .map((n) => ({ n, i: rest.indexOf(`@${n}`) }))
      .filter((x) => x.i !== -1)
      .sort((a, b) => a.i - b.i)[0];

    if (!hit) {
      nodes.push(rest);
      break;
    }
    if (hit.i > 0) nodes.push(rest.slice(0, hit.i));
    nodes.push(
      <span
        key={`m-${key++}`}
        className="rounded bg-primary/10 px-1 font-medium text-primary"
      >
        @{hit.n}
      </span>
    );
    rest = rest.slice(hit.i + hit.n.length + 1);
  }
  return nodes;
}


interface CommentCardProps {
  comment: Comment;
  scope: CommentScope;
  isReply?: boolean;
  focusCommentId?: string | null;
  focusRef: React.RefObject<HTMLDivElement | null>;
  replyingTo: string | null;
  editing: string | null;
  onStartReply: (id: string | null) => void;
  onStartEdit: (id: string | null) => void;
  onCreate: (body: string, mentionedUserIds: string[], parentId?: string) => Promise<void>;
  onUpdate: (commentId: string, body: string, mentionedUserIds: string[]) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}


function CommentCard({
  comment,
  scope,
  isReply = false,
  focusCommentId,
  focusRef,
  replyingTo,
  editing,
  onStartReply,
  onStartEdit,
  onCreate,
  onUpdate,
  onDelete,
}: CommentCardProps) {
  const isFocused = focusCommentId === comment.commentId;

  return (
    <div
      ref={isFocused ? focusRef : undefined}
      className={`rounded-2xl border bg-white p-4 transition dark:bg-slate-900 ${
        isFocused ? "border-primary ring-2 ring-primary/25" : "border-slate-200 dark:border-slate-800"
      } ${isReply ? "shadow-none" : "shadow-sm"}`}
    >
      <div className="flex items-start gap-3">
        <PersonAvatar name={comment.authorName} avatarUrl={comment.authorAvatarUrl} size="sm" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {comment.authorName}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                ROLE_BADGE[comment.authorRole] ?? ROLE_BADGE.STUDENT
              }`}
            >
              {comment.authorRole}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {timeAgo(comment.createdAt)}
              {comment.edited && " · edited"}
            </span>
          </div>

          {editing === comment.commentId ? (
            <div className="mt-3">
              <CommentComposer
                scope={scope}
                compact
                autoFocus
                submitLabel="Save"
                initialBody={comment.body}
                initialMentions={comment.mentions}
                onSubmit={(body, ids) => onUpdate(comment.commentId, body, ids)}
                onCancel={() => onStartEdit(null)}
              />
            </div>
          ) : (
            <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {renderBody(comment.body, comment.mentions)}
            </p>
          )}

          {editing !== comment.commentId && (
            <div className="mt-2.5 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onStartReply(
                    replyingTo === comment.commentId ? null : comment.commentId
                  )
                }
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 transition hover:text-primary dark:text-slate-400"
              >
                <Reply className="h-3.5 w-3.5" />
                Reply
              </button>
              {comment.canEdit && (
                <button
                  type="button"
                  onClick={() => onStartEdit(comment.commentId)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 transition hover:text-primary dark:text-slate-400"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
              {comment.canDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(comment.commentId)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 transition hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {replyingTo === comment.commentId && (
        <div className="mt-3 border-l-2 border-slate-100 pl-4 dark:border-slate-800">
          <CommentComposer
            scope={scope}
            compact
            autoFocus
            submitLabel="Reply"
            placeholder={`Reply to ${comment.authorName}…`}
            onSubmit={(body, ids) => onCreate(body, ids, comment.commentId)}
            onCancel={() => onStartReply(null)}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-2.5 border-l-2 border-slate-100 pl-4 dark:border-slate-800">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.commentId}
              comment={reply}
              scope={scope}
              isReply
              focusCommentId={focusCommentId}
              focusRef={focusRef}
              replyingTo={replyingTo}
              editing={editing}
              onStartReply={onStartReply}
              onStartEdit={onStartEdit}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentThreadProps {

  scope: CommentScope;
 
  focusCommentId?: string | null;
  title?: string;
  emptyHint?: string;
}

export default function CommentThread({
  scope,
  focusCommentId,
  title = "Class discussion",
  emptyHint = "Start the conversation — mention a classmate with @",
}: CommentThreadProps) {
  const { data: comments = [], isLoading: loading, isError, error: queryError } = useGetCommentsQuery(scope);
  const error = isError ? apiErrorMessage(queryError, "Could not load discussion") : null;

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const focusRef = useRef<HTMLDivElement | null>(null);

  const [createCommentMutation] = useCreateCommentMutation();
  const [updateCommentMutation] = useUpdateCommentMutation();
  const [deleteCommentMutation] = useDeleteCommentMutation();

  // Arriving from a notification: bring the referenced comment into view once
  // the thread has actually rendered.
  useEffect(() => {
    if (!focusCommentId || loading) return;
    focusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusCommentId, loading, comments.length]);

  const handleCreate = useCallback(
    async (body: string, mentionedUserIds: string[], parentId?: string) => {
      try {
        await createCommentMutation({ scope, payload: { body, parentId, mentionedUserIds } }).unwrap();
        setReplyingTo(null);
        if (mentionedUserIds.length > 0) {
          toast.success(
            `Comment posted with ${mentionedUserIds.length} user(s) mentioned!`,
            "Mention Sent"
          );
        } else if (parentId) {
          toast.success("Reply posted successfully!", "Reply Added");
        } else {
          toast.success("Comment posted successfully!", "Comment Added");
        }
      } catch (err) {
        toast.error(apiErrorMessage(err, "Could not post comment"), "Post Failed");
      }
    },
    [scope, createCommentMutation]
  );

  const handleUpdate = useCallback(
    async (commentId: string, body: string, mentionedUserIds: string[]) => {
      try {
        await updateCommentMutation({ commentId, scope, payload: { body, mentionedUserIds } }).unwrap();
        setEditing(null);
        if (mentionedUserIds.length > 0) {
          toast.success(
            `Comment updated with ${mentionedUserIds.length} user(s) mentioned!`,
            "Comment Updated"
          );
        } else {
          toast.success("Comment updated successfully!", "Comment Updated");
        }
      } catch (err) {
        toast.error(apiErrorMessage(err, "Could not update comment"), "Update Failed");
      }
    },
    [scope, updateCommentMutation]
  );

  // Deletes are permanent and cascade, so the confirmation wording has to
  // say so — "are you sure?" doesn't tell someone they're about to wipe a thread.
  const handleDelete = useCallback(async (commentId: string) => {
    setPendingDeleteId(commentId);
  }, []);

  const confirmDeleteComment = useCallback(async () => {
    if (!pendingDeleteId) return;
    const commentId = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await deleteCommentMutation({ commentId, scope }).unwrap();
      toast.success("Comment deleted successfully!", "Comment Deleted");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not delete comment"), "Delete Failed");
    }
  }, [scope, deleteCommentMutation, pendingDeleteId]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
        <CommentComposer
          scope={scope}
          onSubmit={(body, ids) => handleCreate(body, ids)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading discussion…
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No posts yet</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{emptyHint}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <CommentCard
              key={c.commentId}
              comment={c}
              scope={scope}
              focusCommentId={focusCommentId}
              focusRef={focusRef}
              replyingTo={replyingTo}
              editing={editing}
              onStartReply={setReplyingTo}
              onStartEdit={setEditing}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete comment"
        message="Delete this comment permanently? Any replies to it will be deleted too."
        onConfirm={confirmDeleteComment}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}