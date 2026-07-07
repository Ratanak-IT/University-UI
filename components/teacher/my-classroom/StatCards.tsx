import { StatItem } from "@/lib/types/dashboard";


export default function StatCards({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div
            className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${stat.dotBgClass}`}
          >
            <span className={`h-3 w-3 rounded-full ${stat.dotClass}`} />
          </div>
          <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
          <p className="mt-1 text-sm font-medium text-card-foreground/80">
            {stat.label}
          </p>
          <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
        </div>
      ))}
    </div>
  );
}