"use client";

import { Bold, Italic, Underline, List, ListOrdered, Link2, ImageIcon, Code2 } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const toolbarButtons = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
] as const;

const listButtons = [
  { icon: List, label: "Bullet list" },
  { icon: ListOrdered, label: "Numbered list" },
] as const;

const insertButtons = [
  { icon: Link2, label: "Insert link" },
  { icon: ImageIcon, label: "Insert image" },
] as const;

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-1 border-b border-border px-3 py-2">
        {toolbarButtons.map(({ icon: Icon, label }) => (
          <ToolbarButton key={label} icon={Icon} label={label} />
        ))}
        <Divider />
        {listButtons.map(({ icon: Icon, label }) => (
          <ToolbarButton key={label} icon={Icon} label={label} />
        ))}
        <Divider />
        {insertButtons.map(({ icon: Icon, label }) => (
          <ToolbarButton key={label} icon={Icon} label={label} />
        ))}
        <div className="ml-auto">
          <ToolbarButton icon={Code2} label="View source" />
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Start typing lesson content..."}
        rows={12}
        className="w-full resize-none bg-transparent px-4 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-border" />;
}

function ToolbarButton({
  icon: Icon,
  label,
}: {
  icon: typeof Bold;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}