"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const TABS = ["Description", "Resources", "Discussion"] as const;
type Tab = (typeof TABS)[number];

export function LessonTabs({
  description,
  objectives,
}: {
  description: string;
  objectives: string[];
}) {
  const [active, setActive] = useState<Tab>("Description");

  return (
    <div>
      <div className="flex gap-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3 text-sm font-medium transition-colors ${
              active === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Description" && (
        <div className="mt-5 rounded-xl border border-border bg-card p-6">
          <p className="text-card-foreground/90 leading-relaxed">{description}</p>

          <h3 className="mt-5 mb-3 font-semibold text-primary">
            Key Learning Objectives
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {objectives.map((obj) => (
              <li key={obj} className="flex items-start gap-2 text-sm text-card-foreground/90">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {active === "Resources" && (
        <div className="mt-5 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No resources added for this lesson yet.
        </div>
      )}

      {active === "Discussion" && (
        <div className="mt-5 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No discussion posts yet.
        </div>
      )}
    </div>
  );
}