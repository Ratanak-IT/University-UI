import { CheckCircle2, Circle, PlayCircle, HelpCircle, ClipboardList } from "lucide-react";
import type { ModuleItem } from "@/lib/api/lessons";

function ItemIcon({ item, active }: { item: ModuleItem; active: boolean }) {
  if (item.status === "completed")
    return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
  if (item.status === "in-progress")
    return (
      <PlayCircle
        className={`h-5 w-5 shrink-0 ${active ? "text-primary-foreground" : "text-primary"}`}
      />
    );
  if (item.type === "quiz")
    return <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0" />;
  if (item.type === "assignment")
    return <ClipboardList className="h-5 w-5 text-muted-foreground shrink-0" />;
  return <Circle className="h-5 w-5 text-muted-foreground/50 shrink-0" />;
}

export function ModuleNavigation({
  progress,
  items,
}: {
  progress: number;
  items: ModuleItem[];
}) {
  return (
    <aside className="rounded-2xl border border-border bg-card p-5 h-fit">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-card-foreground">Module Navigation</h3>
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {progress}% Complete
        </span>
      </div>

      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.status === "in-progress";
          return (
            <li key={item.id}>
              <button
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-card-foreground"
                }`}
              >
                <ItemIcon item={item} active={active} />
                <span className="min-w-0">
                  <span className="block text-sm font-medium truncate">
                    {item.title}
                  </span>
                  <span
                    className={`block text-xs truncate ${
                      active ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {item.meta}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}