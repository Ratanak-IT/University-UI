// card component for each assignment group
import { AssignmentGroup, AssignmentItem } from "@/lib/types/AssignmentGroup";
import AssignmentRow from "./AssignmentRow";


export default function AssignmentGroupCard({
  group,
  onAssign,
  onEdit,
  onDelete,
}: {
  group: AssignmentGroup;
  onAssign?: (id: string) => void;
  onEdit?: (item: AssignmentItem) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">{group.title}</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {group.items.map((item, idx) => (
          <div key={item.id} className={idx !== 0 ? "border-t border-border" : ""}>
            <AssignmentRow
              item={item}
              onAssign={group.title === "Saved Templates" ? onAssign : undefined}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </section>
  );
}