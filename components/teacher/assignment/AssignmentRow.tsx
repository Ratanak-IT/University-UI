"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AssignmentItem } from "@/lib/types/AssignmentGroup";
import { AssignmentIcon, AssignmentMetaBadge } from "./AssignmentIcon";
import { MoreVertical, Pencil, Send, Trash2 } from "lucide-react";

export default function AssignmentRow({
  item,
  onAssign,
  onEdit,
  onDelete,
}: {
  item: AssignmentItem;
  onAssign?: (id: string) => void;
  onEdit?: (item: AssignmentItem) => void;
  onDelete?: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const hasActions = onAssign || onEdit || onDelete;

  return (
    <div className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-muted">
      <Link
        href={`/dashboard/teacher/assignments/${item.id}`}
        className="flex flex-1 items-center gap-4"
      >
        <AssignmentIcon kind={item.icon} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-card-foreground">
            {item.title}
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {item.postedDate}
          </span>
        </span>
        <AssignmentMetaBadge meta={item.meta} />
      </Link>

      {/* Desktop/tablet: actions inline. */}
      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        {onAssign && (
          <button
            type="button"
            onClick={() => onAssign(item.id)}
            className="mr-1 rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400"
          >
            Assign
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(item)}
            title="Edit assignment"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            title="Delete assignment"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Mobile: a single menu button instead of three cramped icons. */}
      {hasActions && (
        <div className="relative shrink-0 sm:hidden" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Assignment options"
            aria-expanded={menuOpen}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg">
              {onAssign && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onAssign(item.id);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                >
                  <Send size={14} /> Assign
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(item);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-muted"
                >
                  <Pencil size={14} /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(item.id);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <Trash2 size={14} /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}