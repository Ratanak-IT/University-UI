"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle, Clock, MoreVertical, Trash2, Pencil, Send, ClipboardList } from "lucide-react";

import StatusBadge from "./StatusBadge";
import { Quiz } from "@/lib/types/quiz";

interface QuizCardProps {
  quiz: Quiz;
  onPreview?: (quiz: Quiz) => void;
  onEdit?: (quiz: Quiz) => void;
  onAssign?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
  onViewResults?: (quiz: Quiz) => void;
}

export default function QuizCard({
  quiz,
  onPreview,
  onEdit,
  onAssign,
  onDelete,
  onViewResults,
}: QuizCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header row: status + menu */}
      <div className="mb-4 flex items-start justify-between">
        <StatusBadge status={quiz.status} />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-card-foreground"
            aria-label="Quiz options"
            aria-expanded={menuOpen}
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-48 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onAssign?.(quiz);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
              >
                <Send size={14} /> Assign to Classroom
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.(quiz);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-muted"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onViewResults?.(quiz);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-muted"
              >
                <ClipboardList size={14} /> View Results
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.(quiz);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title + description */}
      <h3 className="text-xl font-bold text-card-foreground">{quiz.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {quiz.description}
      </p>

      {/* Meta row */}
      <div className="mt-4 flex items-center gap-4 border-b border-border pb-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <HelpCircle size={16} className="text-muted-foreground" />
          {quiz.questionCount} Questions
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={16} className="text-muted-foreground" />
          {quiz.durationMinutes} Mins
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onAssign?.(quiz)}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-700 shadow-sm"
        >
          <Send size={13} /> Assign
        </button>
        <button
          type="button"
          onClick={() => onPreview?.(quiz)}
          className="flex-1 rounded-lg border border-border px-3 py-2.5 text-xs font-semibold text-card-foreground transition-colors hover:bg-muted"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => onEdit?.(quiz)}
          className="flex-1 rounded-lg border border-border px-3 py-2.5 text-xs font-semibold text-card-foreground transition-colors hover:bg-muted"
        >
          Edit
        </button>
      </div>
    </div>
  );
}