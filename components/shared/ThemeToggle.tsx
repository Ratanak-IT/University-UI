"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type ThemeChoice = "light" | "dark" | "system";

const OPTIONS: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Match system", icon: Monitor },
];

/**
 * Three-way theme control — Light / Dark / Match system — shared by the
 * teacher and student portals so both read the same control the admin app
 * already has, instead of the plain light↔dark flip each had before.
 *
 * A segmented control on a wide header; a single button that cycles through
 * the three on a narrow one, where a three-way switch would not fit next to
 * the rest of the icon cluster.
 *
 * `next-themes`'s `theme` is undefined until mount (the server cannot know
 * what was in localStorage), so this renders a neutral placeholder until
 * then rather than guessing — guessing is what causes a hydration mismatch.
 */
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = (mounted ? (theme as ThemeChoice) : undefined) ?? "light";
  const next: ThemeChoice =
    current === "light" ? "dark" : current === "dark" ? "system" : "light";
  const CycleIcon =
    current === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <>
      <button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={`Theme: ${current}. Switch to ${next}.`}
        title={`Theme: ${current}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <CycleIcon className="h-4.5 w-4.5" />
      </button>

      <div
        role="radiogroup"
        aria-label="Colour theme"
        className="hidden items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5 sm:flex dark:border-slate-700 dark:bg-slate-800"
      >
        {OPTIONS.map((option) => {
          const active = current === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={option.label}
              title={option.label}
              onClick={() => setTheme(option.value)}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                active
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
                  : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
              }`}
            >
              <option.icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </>
  );
}
