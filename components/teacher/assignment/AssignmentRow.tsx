import Link from "next/link";
import { AssignmentItem } from "@/lib/types/AssignmentGroup";
import { AssignmentIcon, AssignmentMetaBadge } from "./AssignmentIcon";
import { Pencil, Trash2 } from "lucide-react";

export default function AssignmentRow({
  item,
  onAssign,
  onEdit,
  onDelete,
}: {
  item: AssignmentItem;
  onAssign?: (id: string) => void;
  onEdit?: (item: AssignmentItem) => void;
  onDelete?: (id: string) => void;
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
      
      <div className="flex items-center gap-1.5 shrink-0">
        {onAssign && (
          <button
            type="button"
            onClick={() => onAssign(item.id)}
            className="mr-1 rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400"
          >
            Assign
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(item)}
            title="Edit assignment"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            title="Delete assignment"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}