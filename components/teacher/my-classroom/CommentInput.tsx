"use client";

import { Send } from "lucide-react";

type CommentInputProps = {
  avatar: string;
};

export default function CommentInput({ avatar }: CommentInputProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <img
        src={avatar}
        alt="You"
        className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
      />
      <input
        type="text"
        placeholder="Add class comment..."
        className="flex-1 bg-transparent text-sm text-card-foreground placeholder-muted-foreground focus:outline-none"
      />
      <button className="text-muted-foreground hover:text-primary">
        <Send className="h-5 w-5" strokeWidth={1.75} />
      </button>
    </div>
  );
}