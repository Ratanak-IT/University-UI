// features/assignments/detail/AssignmentHeader.tsx

import { AssignmentDetail } from "@/lib/types/AssignmentDetail";
import { ClipboardList, MoreVertical } from "lucide-react";


interface AssignmentHeaderProps {
  assignment: AssignmentDetail;
}

export function AssignmentHeader({ assignment }: AssignmentHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary">
          <ClipboardList className="h-6 w-6 text-primary-foreground" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {assignment.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {assignment.authorName} · {assignment.postedOn}
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">
            {assignment.points} points
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-label="More options"
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  );
}