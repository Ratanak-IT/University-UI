import { StatCard } from "@/lib/types/dashboard";

export default function StatCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <Icon className={`h-5 w-5 ${stat.iconColor}`} strokeWidth={1.75} />
              </div>
              {stat.badge && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              {stat.label.toUpperCase()}
            </p>
            <p className="mt-1 text-3xl font-bold text-card-foreground">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}