import { QuestionNavStatus } from "@/lib/types/QuizAnswerOption";


interface QuizNavigationGridProps {
  totalQuestions: number;
  currentIndex: number;
  answeredIndices: Set<number>;
  onNavigate: (index: number) => void;
}

function getStatus(
  index: number,
  currentIndex: number,
  answeredIndices: Set<number>
): QuestionNavStatus {
  if (index === currentIndex) return "current";
  if (answeredIndices.has(index)) return "answered";
  return "unvisited";
}

const statusStyles: Record<QuestionNavStatus, string> = {
  current: "bg-primary text-primary-foreground border-primary",
  answered: "bg-primary/15 text-foreground border-transparent",
  unvisited: "bg-background text-foreground border-border",
};

export function QuizNavigationGrid({
  totalQuestions,
  currentIndex,
  answeredIndices,
  onNavigate,
}: QuizNavigationGridProps) {
  const indices = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-base font-semibold text-foreground">Quiz Navigation</h2>

      <div className="grid grid-cols-5 gap-2">
        {indices.map((index) => {
          const status = getStatus(index, currentIndex, answeredIndices);
          return (
            <button
              key={index}
              type="button"
              onClick={() => onNavigate(index)}
              className={`flex h-10 items-center justify-center rounded-md border text-sm font-medium transition-colors ${statusStyles[status]}`}
            >
              {index}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
        <LegendRow colorClass="bg-primary" label="Current question" />
        <LegendRow colorClass="bg-primary/15" label="Answered" />
        <LegendRow colorClass="bg-background border border-border" label="Unvisited" />
      </div>
    </div>
  );
}

function LegendRow({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3.5 w-3.5 rounded-full ${colorClass}`} />
      {label}
    </div>
  );
}