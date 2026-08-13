"use client";

import { QUESTION_TYPES, QuizOption, QuizQuestion } from "@/lib/types/createEmptyQuestion";
import { Trash2, GripVertical, Plus } from "lucide-react";


interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  onChange: (question: QuizQuestion) => void;
  onDelete: () => void;
  canDelete: boolean;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export function QuestionCard({ question, index, onChange, onDelete, canDelete }: QuestionCardProps) {
  function updateOption(optionId: string, text: string) {
    onChange({
      ...question,
      options: question.options.map((o) => (o.id === optionId ? { ...o, text } : o)),
    });
  }

  function addOption() {
    onChange({
      ...question,
      options: [...question.options, { id: makeId(), text: "" } as QuizOption],
    });
  }

  function removeOption(optionId: string) {
    onChange({
      ...question,
      options: question.options.filter((o) => o.id !== optionId),
      correctOptionId: question.correctOptionId === optionId ? null : question.correctOptionId,
    });
  }

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
          Question {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onDelete}
            disabled={!canDelete}
            aria-label="Delete question"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Reorder question"
            className="cursor-grab rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Question Content
          </label>
          <input
            type="text"
            value={question.content}
            onChange={(e) => onChange({ ...question, content: e.target.value })}
            placeholder="Start typing your question here..."
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Question Type
            </label>
            <select
              value={question.type}
              onChange={(e) => {
                const nextType = e.target.value as QuizQuestion["type"];
                let newOptions = question.options;
                let newCorrectId = question.correctOptionId;

                if (nextType === "true_false") {
                  newOptions = [
                    { id: "true", text: "True" },
                    { id: "false", text: "False" },
                  ];
                  newCorrectId = "true";
                } else if (nextType === "short_answer") {
                  const firstText = question.options[0]?.text || "";
                  newOptions = [{ id: "short_1", text: firstText }];
                  newCorrectId = "short_1";
                } else if (nextType === "multiple_choice" && question.options.length < 2) {
                  newOptions = [
                    { id: makeId(), text: "" },
                    { id: makeId(), text: "" },
                  ];
                }

                onChange({
                  ...question,
                  type: nextType,
                  options: newOptions,
                  correctOptionId: newCorrectId,
                });
              }}
              className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Points</label>
            <input
              type="number"
              value={question.points}
              onChange={(e) => onChange({ ...question, points: Number(e.target.value) })}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Multiple Choice Options */}
        {question.type === "multiple_choice" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Options (Select radio button for correct answer)
            </label>
            <div className="space-y-2.5">
              {question.options.map((option, optionIndex) => (
                <div key={option.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onChange({ ...question, correctOptionId: option.id })}
                    aria-label={`Mark option ${optionIndex + 1} as correct`}
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                      question.correctOptionId === option.id
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Enter option ${String.fromCharCode(65 + optionIndex)}...`}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      aria-label="Remove option"
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-2.5 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
            >
              <Plus className="h-3.5 w-3.5" />
              Add more options
            </button>
          </div>
        )}

        {/* True / False Selection */}
        {question.type === "true_false" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Select Correct Answer
            </label>
            <div className="flex items-center gap-6">
              {[
                { id: "true", label: "True" },
                { id: "false", label: "False" },
              ].map((opt) => {
                const isSelected = (question.correctOptionId || "true") === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`tf_${question.id}`}
                      checked={isSelected}
                      onChange={() =>
                        onChange({
                          ...question,
                          options: [
                            { id: "true", text: "True" },
                            { id: "false", text: "False" },
                          ],
                          correctOptionId: opt.id,
                        })
                      }
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Short Answer Input */}
        {question.type === "short_answer" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Expected Correct Answer Key
            </label>
            <input
              type="text"
              value={question.options[0]?.text || ""}
              onChange={(e) => {
                const val = e.target.value;
                onChange({
                  ...question,
                  options: [{ id: "short_1", text: val }],
                  correctOptionId: "short_1",
                });
              }}
              placeholder="Type the exact expected correct answer..."
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}
      </div>
    </div>
  );
}