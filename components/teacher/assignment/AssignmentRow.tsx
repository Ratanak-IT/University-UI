import Link from "next/link";
import { AssignmentItem } from "@/lib/types/AssignmentGroup";
import { AssignmentIcon, AssignmentMetaBadge } from "./AssignmentIcon";

export default function AssignmentRow({
  item,
  onAssign,
}: {
  item: AssignmentItem;
  onAssign?: (id: string) => void;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-muted">
      <Link
        href={`/dashboard/teacher/assignments/${item.id}`}
        className="flex flex-1 items-center gap-4"
      >
        <AssignmentIcon kind={item.icon} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-card-foreground">
            {item.title}
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {item.postedDate}
          </span>
        </span>
        <AssignmentMetaBadge meta={item.meta} />
      </Link>
      
      {onAssign && (
        <button
          type="button"
          onClick={() => onAssign(item.id)}
          className="ml-3 rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400"
        >
          Assign
        </button>
      )}
    </div>
  );
}