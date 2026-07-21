import { LessonStatus, ThumbnailKind } from "@/lib/types/Lesson";
import {
  Database,
  ShieldCheck,
  GitBranch,
  BarChart3,
  ScanEye,
  Code2,
  type LucideIcon,
} from "lucide-react";


const THUMBNAIL_STYLES: Record<
  ThumbnailKind,
  { Icon: LucideIcon; gradient: string }
> = {
  database: {
    Icon: Database,
    gradient: "from-slate-200 via-slate-100 to-white",
  },
  network: {
    Icon: ShieldCheck,
    gradient: "from-slate-900 via-slate-800 to-emerald-900",
  },
  structures: {
    Icon: GitBranch,
    gradient: "from-slate-800 via-slate-700 to-slate-500",
  },
  analytics: {
    Icon: BarChart3,
    gradient: "from-sky-100 via-blue-50 to-white",
  },
  hci: {
    Icon: ScanEye,
    gradient: "from-cyan-950 via-sky-900 to-cyan-800",
  },
  algorithms: {
    Icon: Code2,
    gradient: "from-emerald-950 via-slate-900 to-emerald-900",
  },
};

export function LessonThumbnail({ kind }: { kind: ThumbnailKind }) {
  const { Icon, gradient } = THUMBNAIL_STYLES[kind];
  const isLight = kind === "database" || kind === "analytics";
  return (
    <div
      className={`flex h-40 w-full items-center justify-center bg-gradient-to-br ${gradient}`}
    >
      <Icon
        className={`h-12 w-12 ${isLight ? "text-slate-400" : "text-white/70"}`}
        strokeWidth={1.5}
      />
    </div>
  );
}

export function StatusBadge({ status }: { status: LessonStatus }) {
  const isPublished = status === "published";
  return (
    <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPublished ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {isPublished ? "PUBLISHED" : "DRAFT"}
    </span>
  );
}