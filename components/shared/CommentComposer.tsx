"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import {
  CommentScope,
  fetchMentionableMembers,
  MentionUser,
} from "@/lib/api/comments";
import { toast } from "@/components/shared/Toast";

interface CommentComposerProps {
  scope: CommentScope;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  initialBody?: string;
  initialMentions?: MentionUser[];
  onSubmit: (body: string, mentionedUserIds: string[]) => Promise<void>;
  onCancel?: () => void;
  compact?: boolean;
}


export default function CommentComposer({
  scope,
  placeholder = "Write something to the class…",
  submitLabel = "Post",
  autoFocus = false,
  initialBody = "",
  initialMentions = [],
  onSubmit,
  onCancel,
  compact = false,
}: CommentComposerProps) {
  const [body, setBody] = useState(initialBody);
  const [mentioned, setMentioned] = useState<MentionUser[]>(initialMentions);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [candidates, setCandidates] = useState<MentionUser[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [tokenStart, setTokenStart] = useState(-1);
  const [tokenQuery, setTokenQuery] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  function syncMentionToken(value: string, caret: number) {
    const upToCaret = value.slice(0, caret);
    const at = upToCaret.lastIndexOf("@");

    if (at === -1 || /\s/.test(upToCaret.slice(at + 1))) {
      setPickerOpen(false);
      setTokenStart(-1);
      return;
    }
    if (at > 0 && !/\s/.test(value[at - 1])) {
      setPickerOpen(false);
      setTokenStart(-1);
      return;
    }

    setTokenStart(at);
    setTokenQuery(upToCaret.slice(at + 1));
    setPickerOpen(true);
    setHighlighted(0);
  }

  useEffect(() => {
    if (!pickerOpen) return;

    let cancelled = false;
    setLoadingCandidates(true);

    const timer = setTimeout(async () => {
      try {
        const members = await fetchMentionableMembers(scope, tokenQuery);
        if (!cancelled) setCandidates(members.slice(0, 8));
      } catch {
        if (!cancelled) setCandidates([]);
      } finally {
        if (!cancelled) setLoadingCandidates(false);
      }
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pickerOpen, tokenQuery, scope]);

  function choose(user: MentionUser) {
    if (tokenStart < 0) return;

    const caret = textareaRef.current?.selectionStart ?? body.length;
    const next =
      body.slice(0, tokenStart) + `@${user.fullName} ` + body.slice(caret);

    setBody(next);
    setMentioned((prev) =>
      prev.some((m) => m.userId === user.userId) ? prev : [...prev, user]
    );
    setPickerOpen(false);
    setTokenStart(-1);
    toast.info(`Mentioned @${user.fullName}`, "User Mentioned");

    requestAnimationFrame(() => {
      const pos = tokenStart + user.fullName.length + 2;
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(pos, pos);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (pickerOpen && candidates.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((h) => (h + 1) % candidates.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((h) => (h - 1 + candidates.length) % candidates.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        choose(candidates[highlighted]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setPickerOpen(false);
        return;
      }
    }

    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void submit();
    }
  }

  async function submit() {
    const trimmed = body.trim();
    if (!trimmed || submitting) return;

    const stillReferenced = mentioned.filter((m) =>
      trimmed.includes(`@${m.fullName}`)
    );

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(trimmed, stillReferenced.map((m) => m.userId));
      setBody("");
      setMentioned([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg, "Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={body}
        rows={compact ? 2 : 3}
        placeholder={placeholder}
        onChange={(e) => {
          setBody(e.target.value);
          syncMentionToken(e.target.value, e.target.selectionStart);
        }}
        onClick={(e) =>
          syncMentionToken(body, (e.target as HTMLTextAreaElement).selectionStart)
        }
        onKeyDown={handleKeyDown}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />

      {pickerOpen && (
        <div className="absolute left-3 top-full z-30 mt-1 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {loadingCandidates ? (
            <div className="flex items-center gap-2 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Searching members…
            </div>
          ) : candidates.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
              No matching classmates
            </div>
          ) : (
            candidates.map((user, i) => (
              <button
                key={user.userId}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(user);
                }}
                onMouseEnter={() => setHighlighted(i)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                  i === highlighted ? "bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                    {user.fullName}
                  </span>
                  {user.nameKhmer && (
                    <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {user.nameKhmer}
                    </span>
                  )}
                </span>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                  {user.role}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {mentioned.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {mentioned.map((m) => (
            <span
              key={m.userId}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
            >
              @{m.fullName}
              <button
                type="button"
                aria-label={`Remove mention of ${m.fullName}`}
                onClick={() =>
                  setMentioned((prev) =>
                    prev.filter((x) => x.userId !== m.userId)
                  )
                }
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Type <span className="font-semibold">@</span> to mention · Ctrl+Enter to send
        </p>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!body.trim() || submitting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
