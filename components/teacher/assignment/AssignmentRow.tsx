// card hover effect
import { AssignmentItem } from "@/lib/types/AssignmentGroup ";
import { AssignmentIcon,AssignmentMetaBadge } from "./AssignmentIcon";

export default function AssignmentRow({ item }: { item: AssignmentItem }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-muted"
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
    </button>
  );
}