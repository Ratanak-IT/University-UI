// features/assignments/detail/AddOrCreateMenu.tsx

"use client";

import { useRef, useState } from "react";
import { Link2, Plus, Upload, X } from "lucide-react";

interface AddOrCreateMenuProps {
  onAddFiles: (files: File[]) => void;
  onAddLink: (url: string, label?: string) => void;
}

export function AddOrCreateMenu({
  onAddFiles,
  onAddLink,
}: AddOrCreateMenuProps) {
  const [open, setOpen] = useState(false);
  const [linkFormOpen, setLinkFormOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileButtonClick() {
    setOpen(false);
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAddFiles(files);
    e.target.value = ""; // allow re-selecting the same file later
  }

  function handleLinkSubmit() {
    const url = linkValue.trim();
    if (!url) return;
    onAddLink(url);
    setLinkValue("");
    setLinkFormOpen(false);
    setOpen(false);
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setLinkFormOpen(false);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted"
      >
        <Plus className="h-4 w-4" />
        Add or create
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-10 mt-2 rounded-lg border border-border bg-card p-1.5 shadow-lg">
          {!linkFormOpen ? (
            <>
              <MenuItem
                icon={<Upload className="h-4 w-4" />}
                label="File"
                onClick={handleFileButtonClick}
              />
              <MenuItem
                icon={<Link2 className="h-4 w-4" />}
                label="Link"
                onClick={() => setLinkFormOpen(true)}
              />
            </>
          ) : (
            <div className="p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Add link
                </span>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setLinkFormOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                autoFocus
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLinkSubmit()}
                placeholder="Paste a link"
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={handleLinkSubmit}
                className="mt-2 w-full rounded-md bg-primary py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </button>
  );
}