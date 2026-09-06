import { Student } from "@/lib/data/students";


const statusClasses: Record<Student["gradStatus"], string> = {
  "In Progress": "bg-primary/10 text-primary dark:text-gray-200",
  Completed: "bg-emerald-50 text-emerald-600",
  "At Risk": "bg-rose-50 text-rose-600",
};

export default function GradStatusBadge({ status }: { status: Student["gradStatus"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}