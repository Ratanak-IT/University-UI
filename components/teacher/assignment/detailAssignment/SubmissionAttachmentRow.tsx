// features/assignments/detail/SubmissionAttachmentRow.tsx

import { File as FileIcon, Link2, X } from "lucide-react";
import type { SubmissionAttachment } from "@/lib/types/AssignmentDetail";

interface SubmissionAttachmentRowProps {
  attachment: SubmissionAttachment;
  onRemove: (id: string) => void;
  removable?: boolean;
}

export function SubmissionAttachmentRow({
  attachment,
  onRemove,
  removable = true,
}: SubmissionAttachmentRowProps) {
  const content = (
    <div className="flex flex-1 items-center gap-2 overflow-hidden">
      {attachment.kind === "file" ? (
        <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
      ) : (
        <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <span className="truncate text-sm text-foreground">
        {attachment.name}
      </span>
      {attachment.sizeLabel && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {attachment.sizeLabel}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
      {attachment.url ? (
        <a
          href={attachment.url}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center gap-2 overflow-hidden hover:underline"
        >
          {content}
        </a>
      ) : (
        content
      )}

      {removable && (
        <button
          type="button"
          aria-label={`Remove ${attachment.name}`}
          onClick={() => onRemove(attachment.id)}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}