// features/assignments/form/AssignmentFormHeader.tsx

import { ClipboardList, X } from "lucide-react";

interface AssignmentFormHeaderProps {
  onClose?: () => void;
  onSaveAsDraft?: () => void;
  onAssign?: () => void;
  assignDisabled?: boolean;
}

export function AssignmentFormHeader({
  onClose,
  onSaveAsDraft,
  onAssign,
  assignDisabled,
}: AssignmentFormHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <ClipboardList className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold text-foreground">Assignment</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSaveAsDraft}
          className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={onAssign}
          disabled={assignDisabled}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Assign
        </button>
      </div>
    </div>
  );
}