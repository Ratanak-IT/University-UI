// features/assignments/form/LabeledDropdown.tsx

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  id: string;
  label: string;
  subtitle: string;
}

interface LabeledDropdownProps {
  options: DropdownOption[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function LabeledDropdown({
  options,
  selectedId,
  onChange,
}: LabeledDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === selectedId) ?? options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-left hover:bg-muted/50"
      >
        <span>
          <span className="block text-sm font-medium text-foreground">
            {selected.label}
          </span>
          <span className="block text-xs text-muted-foreground">
            {selected.subtitle}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-10 mt-1 max-h-64 overflow-auto rounded-xl border border-border bg-card p-1.5 shadow-lg">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left hover:bg-muted"
            >
              <span className="text-sm font-medium text-foreground">
                {option.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {option.subtitle}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}