"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "./FileDropzone";
import { RichTextEditor } from "./RichTextEditor";
import { createSavedLesson, createLessonForClassroom } from "@/lib/api/lesson";
import { useSearchParams } from "next/navigation";
import {
  ENTRY_CATEGORIES,
  initialLessonFormData,
  type LessonFormData,
} from "@/lib/types/initialLessonFormData";

const FORM_ID = "#8821-EF";

export function NewLessonForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classroomId = searchParams?.get("classroomId");

  const [form, setForm] = useState<LessonFormData>(initialLessonFormData);
  const [videoLink, setVideoLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof LessonFormData>(key: K, value: LessonFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSaveDraft() {
    await submitLesson();
  }

  async function handleCreateEntry() {
    await submitLesson();
  }

  async function submitLesson() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    setSaving(true);

    const payload = {
      title: form.title,
      content: form.description,
      videoLink: videoLink,
      allowDownload: form.allowDownload,
    };

    let res;
    if (classroomId) {
      res = await createLessonForClassroom(classroomId, payload, form.attachments);
    } else {
      res = await createSavedLesson(payload, form.attachments);
    }
    
    setSaving(false);

    if (res) {
      if (classroomId) {
        router.push(`/dashboard/teacher/my-classroom/${classroomId}`);
      } else {
        router.push("/dashboard/teacher/lessons");
      }
    } else {
      setError("Failed to create lesson. Please try again.");
    }
  }

  return (
    <div className="w-full">
      {/* Main form card */}
      <div className="w-full rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h1 className="text-xl font-semibold text-foreground">New lesson</h1>
          <span className="text-sm text-muted-foreground">Form ID: {FORM_ID}</span>
        </div>

        <div className="space-y-6 px-6 py-6">
          {error && (
            <div className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              {error}
            </div>
          )}

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
                VIDEO URL (OPTIONAL)
              </label>
              <input
                type="text"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="e.g. https://youtube.com/embed/..."
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
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
            disabled={saving}
            onClick={handleSaveDraft}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-55"
          >
            Save template
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleCreateEntry}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-55"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Lesson
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}