"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const TOOLBAR_BUTTONS = [
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "underline", icon: Underline, label: "Underline" },
] as const;

const LIST_BUTTONS = [
  { command: "insertUnorderedList", icon: List, label: "Bulleted list" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
] as const;

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing lesson content...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showCodeView, setShowCodeView] = useState(false);
  const [isEmpty, setIsEmpty] = useState(value.length === 0);

  const exec = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command);
    handleInput();
  };

  const handleInput = () => {
    const html = editorRef.current?.innerHTML ?? "";
    setIsEmpty(editorRef.current?.textContent?.trim().length === 0);
    onChange(html);
  };

  const handleInsertLink = () => {
    const url = window.prompt("Enter URL");
    if (url) exec("createLink");
    if (url) document.execCommand("createLink", false, url);
    handleInput();
  };

  const handleInsertImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editorRef.current?.focus();
      document.execCommand("insertImage", false, url);
      handleInput();
    }
  };

  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
        {TOOLBAR_BUTTONS.map(({ command, icon: Icon, label }) => (
          <button
            key={command}
            type="button"
            aria-label={label}
            onClick={() => exec(command)}
            className="rounded p-1.5 text-foreground hover:bg-muted"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <div className="mx-1 h-5 w-px bg-border" />
        {LIST_BUTTONS.map(({ command, icon: Icon, label }) => (
          <button
            key={command}
            type="button"
            aria-label={label}
            onClick={() => exec(command)}
            className="rounded p-1.5 text-foreground hover:bg-muted"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <div className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          aria-label="Insert link"
          onClick={handleInsertLink}
          className="rounded p-1.5 text-foreground hover:bg-muted"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Insert image"
          onClick={handleInsertImage}
          className="rounded p-1.5 text-foreground hover:bg-muted"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Toggle code view"
          onClick={() => setShowCodeView((prev) => !prev)}
          className={`ml-auto rounded p-1.5 hover:bg-muted ${
            showCodeView ? "bg-muted text-primary" : "text-foreground"
          }`}
        >
          <Code2 className="h-4 w-4" />
        </button>
      </div>

      <div className="relative min-h-[280px]">
        {isEmpty && !showCodeView && (
          <span className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground">
            {placeholder}
          </span>
        )}
        {showCodeView ? (
          <textarea
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsEmpty(e.target.value.trim().length === 0);
            }}
            className="min-h-[280px] w-full resize-none bg-background p-4 font-mono text-sm text-foreground outline-none"
            spellCheck={false}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className="min-h-[280px] w-full p-4 text-sm text-foreground outline-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        )}
      </div>
    </div>
  );
}