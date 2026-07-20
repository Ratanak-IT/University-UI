"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import FileUploadZone from "./FileUploadZone";
import LessonSettingsPanel from "./LessonSettingsPanel";
import { createLesson, saveLessonDraft } from "./api";
import {
  ENTRY_CATEGORY_LABELS,
  type CreateLessonPayload,
  type DRMProtectionLevel,
  type EntryCategory,
  type LessonAttachment,
  type LessonFormData,
} from "./types";

const INITIAL_FORM: LessonFormData = {
  title: "",
  category: "",
  description: "",
  attachments: [],
  allowDownload: false,
  drmProtectionLevel: "standard",
  releaseDate: "",
  timeLimitMinutes: null,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildPayload(
  form: LessonFormData,
  status: "draft" | "published"
): CreateLessonPayload {
  return {
    title: form.title,
    category: (form.category || "lecture") as EntryCategory,
    description: form.description,
    allowDownload: form.allowDownload,
    drmProtectionLevel: form.drmProtectionLevel,
    releaseDate: form.releaseDate || null,
    timeLimitMinutes: form.timeLimitMinutes,
    status,
  };
}

export default function NewLessonForm() {
  const [form, setForm] = useState<LessonFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedLabel, setLastSavedLabel] = useState<string | null>(null);

  const formId = useMemo(() => {
    const random = Math.random().toString(16).slice(2, 6).toUpperCase();
    return `#${random}-EF`;
  }, []);

  const updateField = <K extends keyof LessonFormData>(
    key: K,
    value: LessonFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleAddFiles = (files: FileList) => {
    const next: LessonAttachment[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      sizeLabel: formatFileSize(file.size),
    }));
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...next],
    }));
  };

  const handleRemoveFile = (id: string) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  };

  const handleSaveDraft = async () => {
    setError(null);
    setIsSavingDraft(true);
    try {
      await saveLessonDraft(
        buildPayload(form, "draft"),
        form.attachments.map((a) => a.file)
      );
      setLastSavedLabel(
        `Last draft saved at ${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save draft.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleCreateEntry = async () => {
    setError(null);
    if (!form.title.trim()) {
      setError("Record title is required.");
      return;
    }
    if (!form.category) {
      setError("Entry category is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createLesson(
        buildPayload(form, "published"),
        form.attachments.map((a) => a.file)
      );
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create lesson entry."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h1 className="text-xl font-semibold text-foreground">
            New lesson
          </h1>
          <span className="text-sm text-muted-foreground">
            Form ID: {formId}
          </span>
        </div>

        <div className="space-y-6 px-6 py-6">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-muted-foreground">
                RECORD TITLE
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Q3 Academic Performance Review"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-muted-foreground">
                ENTRY CATEGORY
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  updateField("category", e.target.value as EntryCategory)
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Select category...</option>
                {Object.entries(ENTRY_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide text-muted-foreground">
              DETAILED DESCRIPTION &amp; JUSTIFICATION
            </label>
            <RichTextEditor
              value={form.description}
              onChange={(html) => updateField("description", html)}
            />
          </div>

          <FileUploadZone
            attachments={form.attachments}
            onAdd={handleAddFiles}
            onRemove={handleRemoveFile}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isSubmitting}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
          >
            {isSavingDraft ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={handleCreateEntry}
            disabled={isSubmitting || isSavingDraft}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {isSubmitting ? "Creating..." : "Create Entry"}
          </button>
        </div>
      </div>

      <LessonSettingsPanel
        allowDownload={form.allowDownload}
        onAllowDownloadChange={(value) => updateField("allowDownload", value)}
        drmProtectionLevel={form.drmProtectionLevel}
        onDrmProtectionLevelChange={(value: DRMProtectionLevel) =>
          updateField("drmProtectionLevel", value)
        }
        releaseDate={form.releaseDate}
        onReleaseDateChange={(value) => updateField("releaseDate", value)}
        timeLimitMinutes={form.timeLimitMinutes}
        onTimeLimitMinutesChange={(value) =>
          updateField("timeLimitMinutes", value)
        }
        lastSavedLabel={lastSavedLabel}
      />
    </div>
  );
}