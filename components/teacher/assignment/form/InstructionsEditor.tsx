// features/assignments/form/InstructionsEditor.tsx

"use client";

interface InstructionsEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function InstructionsEditor({ value, onChange }: InstructionsEditorProps) {
  return (
    <div>
      <span className="text-xs font-medium tracking-wide text-muted-foreground">
        INSTRUCTIONS (OPTIONAL)
      </span>

      <div className="mt-2 rounded-xl border border-border bg-background">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Share more details about the assignment..."
          rows={12}
          className="min-h-[280px] w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
    </div>
  );
}
