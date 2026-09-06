import { Timer } from "lucide-react";

interface TimeLeftCardProps {
  secondsLeft: number;
  totalSeconds: number;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TimeLeftCard({ secondsLeft, totalSeconds }: TimeLeftCardProps) {
  const percentLeft = totalSeconds > 0 ? Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100)) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5 text-center">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground">TIME LEFT</p>
      <div className="mt-2 flex items-center justify-center gap-2 text-2xl font-bold text-primary dark:text-gray-200">
        <Timer className="h-6 w-6" />
        {formatTime(secondsLeft)}
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentLeft}%` }}
        />
      </div>
    </div>
  );
}