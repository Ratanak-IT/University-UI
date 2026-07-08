import { FeedItem } from "@/lib/data/classroom-data";
import { FileText, Download, MoreVertical } from "lucide-react";

type FeedPostProps = {
  item: FeedItem;
};

export default function FeedPost({ item }: FeedPostProps) {
  if (item.type === "activity") {
    const Icon = item.icon;
    return (
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-start gap-4 p-5">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
          >
            <Icon className={`h-5 w-5 ${item.iconColor}`} strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">
              {item.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{item.date}</p>
          </div>
          <button className="text-muted-foreground hover:text-card-foreground">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        <div className="border-t border-border px-5 py-3">
          <a
            href="#"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View details &gt;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <img
          src={item.avatar}
          alt={item.author}
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-card-foreground">
            {item.author}
          </p>
          <p className="text-sm text-muted-foreground">{item.date}</p>
        </div>
        <button className="text-muted-foreground hover:text-card-foreground">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3 text-sm text-card-foreground/80">
        {item.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {item.attachment && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border px-4 py-3">
          <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">
              {item.attachment.name}
            </p>
            <p className="text-xs text-muted-foreground">{item.attachment.kind}</p>
          </div>
          <button className="text-muted-foreground hover:text-card-foreground">
            <Download className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}