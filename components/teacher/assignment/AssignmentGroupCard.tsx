// card component for each assignment group
import { AssignmentGroup } from "@/lib/types/AssignmentGroup";
import { MoreVertical } from "lucide-react";
import AssignmentRow from "./AssignmentRow";


export default function AssignmentGroupCard({
  group,
  onAssign,
}: {
  group: AssignmentGroup;
  onAssign?: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">{group.title}</h2>
        <button
          type="button"
          aria-label={`More options for ${group.title}`}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {group.items.map((item, idx) => (
          <div key={item.id} className={idx !== 0 ? "border-t border-border" : ""}>
            <AssignmentRow
              item={item}
              onAssign={group.title === "Saved Templates" ? onAssign : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
}