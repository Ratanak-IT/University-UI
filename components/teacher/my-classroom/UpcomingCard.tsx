import { UpcomingItem } from "@/lib/data/classroom-data";

type UpcomingCardProps = {
  items: UpcomingItem[];
};

export default function UpcomingCard({ items }: UpcomingCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-bold text-card-foreground">Upcoming</h2>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No work due soon</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item.title}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-card-foreground/80">{item.title}</span>
              <span className="text-muted-foreground">{item.due}</span>
            </li>
          ))}
        </ul>
      )}

      <a
        href="#"
        className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
      >
        View all &gt;
      </a>
    </div>
  );
}