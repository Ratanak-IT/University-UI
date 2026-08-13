"use client";

import { SquarePen, RefreshCcw } from "lucide-react";

type AnnouncementComposerProps = {
  initials: string;
};

export default function AnnouncementComposer({
  initials,
}: AnnouncementComposerProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
        {initials}
      </div>
      <input
        type="text"
        placeholder="Announce something to your class..."
        className="flex-1 rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground placeholder-muted-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <button className="text-primary hover:opacity-80">
        <SquarePen className="h-5 w-5" strokeWidth={1.75} />
      </button>
      <button className="text-primary hover:opacity-80">
        <RefreshCcw className="h-5 w-5" strokeWidth={1.75} />
      </button>
    </div>
  );
}