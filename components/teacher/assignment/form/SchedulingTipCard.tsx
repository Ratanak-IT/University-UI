// features/assignments/form/SchedulingTipCard.tsx

import { Info } from "lucide-react";

export function SchedulingTipCard() {
  return (
    <div className="flex gap-3 rounded-xl bg-primary/5 p-5">
      <Info className="h-5 w-5 shrink-0 text-primary" />
      <div>
        <p className="font-medium text-foreground">Scheduling Tip</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Assignments scheduled for later remain in Drafts. Students are
          notified upon posting.
        </p>
      </div>
    </div>
  );
}