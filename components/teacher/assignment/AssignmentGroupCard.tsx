// card component for each assignment group
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { AssignmentGroup, AssignmentItem } from "@/lib/types/AssignmentGroup";
import AssignmentRow from "./AssignmentRow";


export default function AssignmentGroupCard({
  group,
  expanded = true,
  loadingItems = false,
  onToggle,
  onAssign,
  onEdit,
  onDelete,
}: {
  group: AssignmentGroup;
  expanded?: boolean;
  loadingItems?: boolean;
  onToggle?: () => void;
  onAssign?: (id: string) => void;
  onEdit?: (item: AssignmentItem) => void;
  onDelete?: (id: string) => void;
}) {
  const collapsible = !!onToggle;

  return (
    <section>
      <div
        className={`mb-3 flex items-center justify-between ${collapsible ? "cursor-pointer select-none" : ""}`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {collapsible &&
            (expanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            ))}
          <h2 className="text-2xl font-bold text-primary">{group.title}</h2>
        </div>
      </div>

      {expanded && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {loadingItems ? (
            <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading assignments...
            </div>
          ) : group.items.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No assignments in this classroom yet.
            </div>
          ) : (
            group.items.map((item, idx) => (
              <div key={item.id} className={idx !== 0 ? "border-t border-border" : ""}>
                <AssignmentRow
                  item={item}
                  onAssign={group.title === "Saved Templates" ? onAssign : undefined}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
