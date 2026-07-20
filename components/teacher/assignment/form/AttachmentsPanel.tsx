// features/assignments/form/AttachmentsPanel.tsx

"use client";

import { useRef, useState } from "react";
import { FilePlus2, FolderPlus, Link2, Upload } from "lucide-react";

import { FormAttachment } from "@/lib/types/AssignmentFormValues";
import { SubmissionAttachmentRow } from "./SubmissionAttachmentRow";


interface AttachmentsPanelProps {
  attachments: FormAttachment[];
  onChange: (attachments: FormAttachment[]) => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentsPanel({
  attachments,
  onChange,
}: AttachmentsPanelProps) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [linkFormOpen, setLinkFormOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: File[]) {
    const next: FormAttachment[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      kind: "file",
      name: file.name,
      file,
      url: URL.createObjectURL(file),
      sizeLabel: formatSize(file.size),
    }));
    onChange([...attachments, ...next]);
  }

  function addLink() {
    const url = linkValue.trim();
    if (!url) return;
    onChange([
      ...attachments,
      {
        id: `${url}-${Date.now()}`,
        kind: "link",
        name: url.replace(/^https?:\/\//, ""),
        url,
      },
    ]);
    setLinkValue("");
    setLinkFormOpen(false);
    setAddMenuOpen(false);
  }

  function createBlank(type: "Doc" | "Quiz" | "Slides") {
    onChange([
      ...attachments,
      {
        id: `${type}-${Date.now()}`,
        kind: "created",
        name: `Blank ${type}`,
      },
    ]);
    setCreateMenuOpen(false);
  }

  function removeAttachment(id: string) {
    onChange(attachments.filter((a) => a.id !== id));
  }

  return (
    <div className="rounded-xl border border-border p-6">
      <span className="text-xs font-medium tracking-wide text-muted-foreground">
        ATTACHMENTS
      </span>

      {attachments.length > 0 && (
        <div className="mt-3 space-y-2">
          {attachments.map((attachment) => (
            <SubmissionAttachmentRow
              key={attachment.id}
              attachment={attachment}
              onRemove={removeAttachment}
            />
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) addFiles(files);
            e.target.value = "";
          }}
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAddMenuOpen((v) => !v);
              setCreateMenuOpen(false);
              setLinkFormOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50"
          >
            <FilePlus2 className="h-4 w-4 text-primary" />
            Add attachment
          </button>

          {addMenuOpen && (
            <div className="absolute left-0 z-10 mt-1 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg">
              {!linkFormOpen ? (
                <>
                  <MenuItem
                    icon={<Upload className="h-4 w-4" />}
                    label="Upload file"
                    onClick={() => {
                      setAddMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                  />
                  <MenuItem
                    icon={<Link2 className="h-4 w-4" />}
                    label="Add link"
                    onClick={() => setLinkFormOpen(true)}
                  />
                </>
              ) : (
                <div className="p-2">
                  <input
                    autoFocus
                    value={linkValue}
                    onChange={(e) => setLinkValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLink()}
                    placeholder="Paste a link"
                    className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    className="mt-2 w-full rounded-md bg-primary py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setCreateMenuOpen((v) => !v);
              setAddMenuOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50"
          >
            <FolderPlus className="h-4 w-4 text-emerald-500" />
            Create new
          </button>

          {createMenuOpen && (
            <div className="absolute left-0 z-10 mt-1 w-44 rounded-xl border border-border bg-card p-1.5 shadow-lg">
              <MenuItem label="Doc" onClick={() => createBlank("Doc")} />
              <MenuItem label="Quiz" onClick={() => createBlank("Quiz")} />
              <MenuItem label="Slides" onClick={() => createBlank("Slides")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
    >
      {icon && <span className="text-muted-foreground">{icon}</span>}
      {label}
    </button>
  );
}