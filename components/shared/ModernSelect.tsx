"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface ModernSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  disabled?: boolean;
}

export default function ModernSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  label,
  icon: Icon,
  className = "",
  disabled = false,
}: ModernSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block w-full text-left ${className}`} ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}

      {/* Select trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm font-semibold text-slate-800 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 ${
          isOpen
            ? "border-indigo-500 ring-2 ring-indigo-500/20 dark:border-indigo-500"
            : "hover:border-indigo-300 dark:hover:border-slate-700"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {Icon && (
            <Icon className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 transition-colors group-hover:text-indigo-700" />
          )}
          {selectedOption?.icon && (
            <selectedOption.icon className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </button>

      {/* Dropdown popover list */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
          {options.length === 0 ? (
            <div className="px-3 py-2.5 text-center text-xs font-medium text-slate-400">
              No options available
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              const OptIcon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                      : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {OptIcon && (
                      <OptIcon
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isSelected
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                    )}
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
