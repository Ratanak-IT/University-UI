"use client";

import { useState } from "react";

import type { SubmissionAttachment, WorkStatus } from "@/lib/types/AssignmentDetail";
import { SubmissionAttachmentRow } from "./SubmissionAttachmentRow";
import { AddOrCreateMenu } from "./AddOrCreateMenu";

interface YourWorkPanelProps {
  initialStatus?: WorkStatus;
  onSubmit?: (attachments: SubmissionAttachment[]) => void;
  onUnsubmit?: () => void;
  onMarkAsDone?: () => void;
}

const statusLabel: Record<WorkStatus, string> = {
  assigned: "Assigned",
  "turned-in": "Turned in",
  graded: "Graded",
  missing: "Missing",
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function YourWorkPanel({
  initialStatus = "assigned",
  onSubmit,
  onUnsubmit,
  onMarkAsDone,
}: YourWorkPanelProps) {
  const [status, setStatus] = useState<WorkStatus>(initialStatus);
  const [attachments, setAttachments] = useState<SubmissionAttachment[]>([]);

  const isTurnedIn = status === "turned-in" || status === "graded";
  const hasWork = attachments.length > 0;

  function addFiles(files: File[]) {
    const next: SubmissionAttachment[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      kind: "file",
      name: file.name,
      file,
      url: URL.createObjectURL(file),
      sizeLabel: formatSize(file.size),
    }));
    setAttachments((prev) => [...prev, ...next]);
  }

  function addLink(url: string) {
    setAttachments((prev) => [
      ...prev,
      {
        id: `${url}-${Date.now()}`,
        kind: "link",
        name: url.replace(/^https?:\/\//, ""),
        url,
      },
    ]);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  function handleTurnIn() {
    setStatus("turned-in");
    onSubmit?.(attachments);
  }

  function handleUnsubmit() {
    setStatus("assigned");
    onUnsubmit?.();
  }

  function handleMarkAsDone() {
    setStatus("turned-in");
    onMarkAsDone?.();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground">Your work</span>
        <span className="text-xs font-medium tracking-wide text-muted-foreground">
          {statusLabel[status].toUpperCase()}
        </span>
      </div>

      {attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          {attachments.map((attachment) => (
            <SubmissionAttachmentRow
              key={attachment.id}
              attachment={attachment}
              onRemove={removeAttachment}
              removable={!isTurnedIn}
            />
          ))}
        </div>
      )}

      {!isTurnedIn && (
        <div className="mt-4">
          <AddOrCreateMenu onAddFiles={addFiles} onAddLink={addLink} />
        </div>
      )}

      {!isTurnedIn ? (
        <button
          type="button"
          onClick={hasWork ? handleTurnIn : handleMarkAsDone}
          className="mt-3 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {hasWork ? "Turn in" : "Mark as done"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleUnsubmit}
          className="mt-3 w-full rounded-lg border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
        >
          Unsubmit
        </button>
      )}
    </div>
  );
}