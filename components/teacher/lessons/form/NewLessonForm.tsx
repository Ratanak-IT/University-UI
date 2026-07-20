"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FileDropzone } from "./FileDropzone";
import { RichTextEditor } from "./RichTextEditor";
import { LessonSettingsPanel } from "./LessonSettingsPanel";
import {
  ENTRY_CATEGORIES,
  initialLessonFormData,
  type LessonFormData,
} from "@/lib/types/initialLessonFormData";

const FORM_ID = "#8821-EF";

export function NewLessonForm() {
  const [form, setForm] = useState<LessonFormData>(initialLessonFormData);

  function update<K extends keyof LessonFormData>(key: K, value: LessonFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveDraft() {
    console.log("Save as draft", form);
  }

  function handleCreateEntry() {
    console.log("Create entry", form);
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Main form card */}
      <div className="flex-1 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h1 className="text-xl font-semibold text-foreground">New lesson</h1>
          <span className="text-sm text-muted-foreground">Form ID: {FORM_ID}</span>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground">
                RECORD TITLE
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Q3 Academic Performance Review"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground">
                ENTRY CATEGORY
              </label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>
                  Select category...
                </option>
                {ENTRY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground">
              DETAILED DESCRIPTION &amp; JUSTIFICATION
            </label>
            <RichTextEditor
  value={form.description}
  onChange={(value) => update("description", value)}
/>
          </div>

          <FileDropzone
            files={form.attachments}
            onFilesChange={(files) => update("attachments", files)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handleCreateEntry}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Entry
          </button>
        </div>
      </div>

      {/* Settings sidebar */}
      <LessonSettingsPanel
        allowDownload={form.allowDownload}
        onAllowDownloadChange={(value) => update("allowDownload", value)}
        drmProtectionLevel={form.drmProtectionLevel}
        onDrmProtectionLevelChange={(value) => update("drmProtectionLevel", value)}
        releaseDate={form.releaseDate}
        onReleaseDateChange={(value) => update("releaseDate", value)}
        timeLimit={form.timeLimit}
      />
    </div>
  );
}