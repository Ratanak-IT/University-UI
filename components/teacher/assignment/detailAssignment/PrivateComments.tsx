// features/assignments/detail/PrivateComments.tsx

"use client";

import { useState } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { toast } from "@/components/shared/Toast";

interface PrivateCommentsProps {
  studentName: string;
  onSubmit?: (body: string) => void;
}

export function PrivateComments({
  studentName,
  onSubmit,
}: PrivateCommentsProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit() {
    const body = draft.trim();
    if (!body) return;
    onSubmit?.(body);
    setDraft("");
    toast.success(`Private comment sent to ${studentName}!`, "Comment Sent");
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-foreground">
        <User className="h-4 w-4" />
        <span className="font-medium">Private comments</span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={`Add comment to ${studentName}`}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          aria-label="Send private comment"
          className="text-muted-foreground hover:text-primary"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}