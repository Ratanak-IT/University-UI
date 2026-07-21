"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import type { LessonAttachment } from "./types";

interface FileUploadZoneProps {
  attachments: LessonAttachment[];
  onAdd: (files: FileList) => void;
  onRemove: (id: string) => void;
}

export default function FileUploadZone({
  attachments,
  onAdd,
  onRemove,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length) onAdd(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDraggingOver
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30"
        }`}
      >
        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-foreground">
          Drag and drop supporting documentation or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-medium text-primary underline underline-offset-2"
          >
            browse files
          </button>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF, DOCX, or PPTX up to 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.pptx"
          className="hidden"
          onChange={(e) => e.target.files && onAdd(e.target.files)}
        />
      </div>

      {attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 text-foreground">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                {attachment.name}
                <span className="text-xs text-muted-foreground">
                  ({attachment.sizeLabel})
                </span>
              </span>
              <button
                type="button"
                aria-label={`Remove ${attachment.name}`}
                onClick={() => onRemove(attachment.id)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}