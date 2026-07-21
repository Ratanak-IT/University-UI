"use client";

import { fetchQuizPreview, finishPreview, saveAnswer, toggleFlag } from "@/lib/api/fetchQuizPreview";
import { QuizMeta, QuizQuestion } from "@/lib/types/QuizAnswerOption";
import { useEffect, useState, useCallback } from "react";
import { QuizPreviewHeader } from "./QuizPreviewHeader";
import { QuestionPanel } from "./QuestionPanel";
import { QuizActionBar } from "./QuizActionBar";
import { TimeLeftCard } from "./TimeLeftCard";
import { QuizNavigationGrid } from "./QuizNavigationGrid";
import { PreviewNotice } from "./PreviewNotice";

interface QuizPreviewPageProps {
  quizId: string;
}

export function QuizPreviewPage({ quizId }: QuizPreviewPageProps) {
  const [meta, setMeta] = useState<QuizMeta| null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Load quiz — swap fetchQuizPreview's internals in api.ts for a real endpoint.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchQuizPreview(quizId).then(({ meta, questions }) => {
      if (cancelled) return;
      setMeta(meta);
      setQuestions(questions);
      setSecondsLeft(meta.durationSeconds);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  // Countdown timer
  useEffect(() => {
    if (isLoading || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoading, secondsLeft]);

  const currentQuestion = questions.find((q) => q.index === currentIndex) ?? null;

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
      saveAnswer(quizId, currentQuestion.id, optionId);
    },
    [currentQuestion, quizId]
  );

  const handleClearAnswer = useCallback(() => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: null }));
    saveAnswer(quizId, currentQuestion.id, null);
  }, [currentQuestion, quizId]);

  const handleToggleFlag = useCallback(() => {
    if (!currentQuestion) return;
    const next = !flagged[currentQuestion.id];
    setFlagged((prev) => ({ ...prev, [currentQuestion.id]: next }));
    toggleFlag(quizId, currentQuestion.id, next);
  }, [currentQuestion, flagged, quizId]);

  function handleNavigate(index: number) {
    setCurrentIndex(index);
  }

  function handlePrevious() {
    setCurrentIndex((i) => Math.max(1, i - 1));
  }

  function handleSaveAndNext() {
    setCurrentIndex((i) => Math.min(questions.length, i + 1));
  }

  function handleFinishPreview() {
    finishPreview(quizId);
    // Replace with real navigation once wired to routing, e.g. router.push("/quizzes")
    console.log("Finish preview", quizId);
  }

  if (isLoading || !meta || !currentQuestion) {
    return <div className="p-6 text-sm text-muted-foreground">Loading quiz preview...</div>;
  }

  const answeredIndices = new Set(
    questions.filter((q) => Boolean(answers[q.id])).map((q) => q.index)
  );

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <QuizPreviewHeader
          courseName={meta.courseName}
          title={meta.title}
          description={meta.description}
        />

        <QuestionPanel
          question={currentQuestion}
          totalQuestions={meta.totalQuestions}
          selectedOptionId={answers[currentQuestion.id] ?? null}
          onSelectOption={handleSelectOption}
          isFlagged={Boolean(flagged[currentQuestion.id])}
          onToggleFlag={handleToggleFlag}
        />

        <QuizActionBar
          onPrevious={handlePrevious}
          onClearAnswer={handleClearAnswer}
          onSaveAndNext={handleSaveAndNext}
          canGoPrevious={currentIndex > 1}
          isLastQuestion={currentIndex === questions.length}
        />
      </div>

      <div className="space-y-6">
        <TimeLeftCard secondsLeft={secondsLeft} totalSeconds={meta.durationSeconds} />
        <QuizNavigationGrid
          totalQuestions={meta.totalQuestions}
          currentIndex={currentIndex}
          answeredIndices={answeredIndices}
          onNavigate={handleNavigate}
        />
        <PreviewNotice onFinishPreview={handleFinishPreview} />
      </div>
    </div>
  );
}