import { QUESTION_TYPE_LABELS, QuizQuestion } from "@/lib/types/QuizAnswerOption";
import { Flag } from "lucide-react";
// import { QUESTION_TYPE_LABELS, type QuizQuestion } from "../types";

interface QuestionPanelProps {
  question: QuizQuestion;
  totalQuestions: number;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
}

export function QuestionPanel({
  question,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  isFlagged,
  onToggleFlag,
}: QuestionPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
            Question {question.index} of {totalQuestions}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {QUESTION_TYPE_LABELS[question.type]}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleFlag}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            isFlagged ? "text-amber-500" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Flag className={`h-4 w-4 ${isFlagged ? "fill-amber-500" : ""}`} />
          {isFlagged ? "Flagged" : "Flag for review"}
        </button>
      </div>

      <p className="mt-5 text-lg font-medium text-foreground">{question.content}</p>

      <div className="mt-5 space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/50"
              }`}
            >
              <span
                className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                  isSelected ? "border-primary bg-primary" : "border-border"
                }`}
              />
              <span className="text-sm font-medium text-foreground">
                <span className="font-semibold">{option.label}. </span>
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}