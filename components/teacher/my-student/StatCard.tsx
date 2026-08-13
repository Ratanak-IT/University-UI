import { StatCardData } from "@/lib/data/students";


const badgeToneClasses: Record<StatCardData["badgeTone"], string> = {
  positive: "bg-emerald-50 text-emerald-600",
  info: "bg-sky-50 text-sky-600",
  neutral: "bg-violet-50 text-violet-600",
};

export default function StatCard({ data }: { data: StatCardData }) {
  const { icon: Icon, iconBg, iconColor, badge, badgeTone, label, value, helperText } = data;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeToneClasses[badgeTone]}`}
        >
          {badge}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
    </div>
  );
}