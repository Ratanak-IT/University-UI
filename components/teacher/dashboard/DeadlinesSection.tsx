import { Deadline } from "@/lib/types/dashboard";

export default function DeadlinesSection({ deadlines }: { deadlines: Deadline[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-card-foreground">
          Upcoming deadlines
        </h2>
        <a
          href="#"
          className="text-xs font-semibold tracking-wide text-primary hover:underline"
        >
          VIEW ALL
        </a>
      </div>
      <ul className="space-y-3">
        {deadlines.map((item) => (
          <li
            key={item.title}
            className="rounded-xl border border-border p-4"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-card-foreground">
                {item.title}
              </p>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.badgeClass}`}
              >
                {item.due}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{item.classCode}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}