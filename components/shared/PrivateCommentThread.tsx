"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Lock, Send } from "lucide-react";
import {
  useGetMyPrivateCommentsQuery,
  usePostMyPrivateCommentMutation,
  useGetStudentPrivateCommentsQuery,
  usePostStudentPrivateCommentMutation,
} from "@/lib/redux/apiSlice";
import { apiErrorMessage } from "@/lib/api/errors";
import { toast } from "@/components/shared/Toast";
import PersonAvatar from "@/components/shared/PersonAvatar";

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

type Target =
  | { role: "student" }
  | { role: "teacher"; studentId: string };

interface PrivateCommentThreadProps {
  assignmentId: string;
  target: Target;
  /** The name shown in the composer placeholder — "Add comment to Sok Dara". */
  otherPartyName?: string;
}

/**
 * A private, two-party thread about one assignment — the teacher of the
 * classroom and one student, closed to everyone else. Shared by both
 * portals: which endpoints it calls is the only thing that differs between
 * a student viewing their own thread and a teacher viewing one student's.
 */
export default function PrivateCommentThread({
  assignmentId,
  target,
  otherPartyName,
}: PrivateCommentThreadProps) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isStudent = target.role === "student";
  const {
    data: myComments = [],
    isLoading: loadingMine,
    isError: myError,
    error: myQueryError,
  } = useGetMyPrivateCommentsQuery(assignmentId, { skip: !isStudent });
  const {
    data: studentComments = [],
    isLoading: loadingStudent,
    isError: studentError,
    error: studentQueryError,
  } = useGetStudentPrivateCommentsQuery(
    { assignmentId, studentId: target.role === "teacher" ? target.studentId : "" },
    { skip: isStudent }
  );

  const comments = isStudent ? myComments : studentComments;
  const loading = isStudent ? loadingMine : loadingStudent;
  const error = isStudent
    ? myError ? apiErrorMessage(myQueryError, "Could not load private comments") : null
    : studentError ? apiErrorMessage(studentQueryError, "Could not load private comments") : null;

  const [postMyPrivateComment, { isLoading: sendingMine }] = usePostMyPrivateCommentMutation();
  const [postStudentPrivateComment, { isLoading: sendingStudent }] = usePostStudentPrivateCommentMutation();
  const sending = isStudent ? sendingMine : sendingStudent;

  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [comments.length, loading]);

  async function handleSend() {
    const body = draft.trim();
    if (!body || sending) return;
    try {
      if (target.role === "student") {
        await postMyPrivateComment({ assignmentId, body }).unwrap();
      } else {
        await postStudentPrivateComment({ assignmentId, studentId: target.studentId, body }).unwrap();
      }
      setDraft("");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not send your comment"), "Send Failed");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center gap-2">
        <Lock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Private comments</p>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Only you {target.role === "student" ? "and your teacher" : "and this student"} can see this
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      ) : (
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
              No private comments yet.
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.commentId} className="flex items-start gap-2.5">
                <PersonAvatar name={c.authorName} avatarUrl={c.authorAvatarUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {c.authorName}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {timeAgo(c.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 whitespace-pre-wrap break-words rounded-xl rounded-tl-sm bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {c.body}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={sending}
          placeholder={
            otherPartyName ? `Message ${otherPartyName}…` : "Write a private comment…"
          }
          className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 dark:text-slate-100"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          aria-label="Send private comment"
          className="text-slate-400 transition-colors hover:text-indigo-600 disabled:opacity-40 dark:hover:text-indigo-400"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
