// features/assignments/detail/ClassComments.tsx

"use client";

import { useState } from "react";
import { Send, Users } from "lucide-react";
import { CommentAuthor,Comment } from "@/lib/types/AssignmentDetail";
import { toast } from "@/components/shared/Toast";

interface ClassCommentsProps {
  comments: Comment[];
  currentUser: CommentAuthor;
  onSubmit?: (body: string) => void;
}

export function ClassComments({
  comments,
  currentUser,
  onSubmit,
}: ClassCommentsProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit() {
    const body = draft.trim();
    if (!body) return;
    onSubmit?.(body);
    setDraft("");
    toast.success("Class comment posted successfully!", "Comment Added");
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="flex items-center gap-2 text-foreground">
        <Users className="h-5 w-5" />
        <span className="font-medium">Class comments</span>
      </div>

      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <Avatar initials={comment.author.initials} />
            <div>
              <p className="text-sm">
                <span className="font-medium text-foreground">
                  {comment.author.name}
                </span>{" "}
                <span className="text-muted-foreground">
                  · {comment.postedAt}
                </span>
              </p>
              <p className="text-sm text-foreground">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Avatar initials={currentUser.initials} />
        <div className="flex flex-1 items-center rounded-full border border-border bg-background px-4 py-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Add class comment..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSubmit}
            aria-label="Post comment"
            className="text-muted-foreground hover:text-primary"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
      {initials}
    </div>
  );
}