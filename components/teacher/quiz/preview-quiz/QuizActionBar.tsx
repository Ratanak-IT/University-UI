import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuizActionBarProps {
  onPrevious: () => void;
  onClearAnswer: () => void;
  onSaveAndNext: () => void;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

export function QuizActionBar({
  onPrevious,
  onClearAnswer,
  onSaveAndNext,
  canGoPrevious,
  isLastQuestion,
}: QuizActionBarProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </button>

      <button
        type="button"
        onClick={onClearAnswer}
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Clear Answer
      </button>

      <button
        type="button"
        onClick={onSaveAndNext}
        className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {isLastQuestion ? "Save & Finish" : "Save & Next"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}