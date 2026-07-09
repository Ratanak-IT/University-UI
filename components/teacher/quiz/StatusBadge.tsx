import { QuizStatus } from "../../../lib/data/quiz";

const STATUS_STYLES: Record<QuizStatus, { label: string; className: string }> = {
  published: {
    label: "Published",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  },
  draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  },
};

export default function StatusBadge({ status }: { status: QuizStatus }) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide ${style.className}`}
    >
      {style.label.toUpperCase()}
    </span>
  );
}
