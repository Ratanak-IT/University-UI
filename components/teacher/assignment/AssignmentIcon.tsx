import { AssignmentMeta, IconKind } from "@/lib/types/AssignmentGroup";
import {
  ClipboardList,
  BookOpen,
  HelpCircle,
  BarChart3,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";


const ICON_STYLES: Record<
  IconKind,
  { Icon: LucideIcon; bg: string; fg: string }
> = {
  assignment: { Icon: ClipboardList, bg: "bg-blue-800", fg: "text-white" },
  slides: { Icon: BookOpen, bg: "bg-blue-100", fg: "text-blue-800" },
  question: { Icon: HelpCircle, bg: "bg-amber-500", fg: "text-white" },
  chart: { Icon: BarChart3, bg: "bg-blue-100", fg: "text-blue-800" },
  alert: { Icon: AlertTriangle, bg: "bg-red-100", fg: "text-red-600" },
};

export function AssignmentIcon({ kind }: { kind: IconKind }) {
  const { Icon, bg, fg } = ICON_STYLES[kind];
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bg}`}
    >
      <Icon className={`h-5 w-5 ${fg}`} strokeWidth={2} />
    </span>
  );
}

export function AssignmentMetaBadge({ meta }: { meta?: AssignmentMeta }) {
  if (!meta) {
    return <span className="text-sm text-slate-400">—</span>;
  }
  if (meta.variant === "overdue") {
    return (
      <span className="text-sm font-semibold text-red-600">{meta.label}</span>
    );
  }
  return <span className="text-sm text-slate-500">{meta.label}</span>;
}