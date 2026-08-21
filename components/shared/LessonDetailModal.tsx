"use client";

import { useState } from "react";
import { X, ShieldAlert, Lock, Video, FileText, BookOpen } from "lucide-react";
import type { LessonResponse } from "@/lib/api/student";
import { Watermark } from "@/components/shared/Watermark";
import { ProtectedMediaViewer } from "@/components/shared/ProtectedMediaViewer";
import { useContentProtection } from "@/lib/hooks/useContentProtection";

interface LessonDetailModalProps {
  lesson: LessonResponse | null;
  onClose: () => void;
}

interface MediaTab {
  key: string;
  label: string;
  url: string;
  isVideo: boolean;
}

/**
 * The lesson "detail" popup opened from a classroom lesson card. Unlike the raw
 * SecureFileViewerModal (one file at a time), this combines the lesson's video and
 * every attached file into one protected viewer with a switcher, plus the lesson
 * description alongside — so a teacher/student doesn't have to hunt for separate
 * "Watch Video" / file links.
 */
export function LessonDetailModal({ lesson, onClose }: LessonDetailModalProps) {
  const isOpen = !!lesson;
  const { isBlackout } = useContentProtection({ enabled: isOpen });

  const tabs: MediaTab[] = lesson
    ? [
        ...(lesson.videoLink ? [{ key: "video", label: "Video", url: lesson.videoLink, isVideo: true }] : []),
        ...(lesson.files ?? []).map((f) => ({
          key: f.fileId,
          label: f.fileOriginalName,
          url: f.previewUrl,
          isVideo: false,
        })),
      ]
    : [];

  const [activeKey, setActiveKey] = useState<string | null>(null);
  // Reset the active attachment whenever a different lesson opens. Done during
  // render (React's documented "adjusting state when a prop changes" pattern)
  // rather than in an effect, so the switch happens in the same render pass.
  const [lastLessonId, setLastLessonId] = useState(lesson?.lessonId);
  if (lesson?.lessonId !== lastLessonId) {
    setLastLessonId(lesson?.lessonId);
    setActiveKey(tabs[0]?.key ?? null);
  }

  if (!isOpen || !lesson) return null;

  const active = tabs.find((t) => t.key === activeKey) ?? tabs[0] ?? null;

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen bg-slate-950 select-none protected-media transform-gpu translate-z-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-800 bg-slate-900 text-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Lock className="h-4 w-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold truncate">{lesson.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer shrink-0"
          title="Close Lesson"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Body: scrolls as one column on mobile so nothing gets clipped; fixed two-pane
          layout on lg+ where the video is height-bound and the sidebar scrolls on its own. */}
      <div className="relative flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row" style={{ isolation: "isolate" }}>
        {/* Main viewer */}
        <div className="relative z-0 min-h-0 lg:flex-1 flex justify-center bg-slate-950 p-3 sm:p-4">
          {active ? (
            <ProtectedMediaViewer fileName={active.label} fileUrl={active.url} isVideo={active.isVideo} />
          ) : (
            <div className="self-center flex flex-col items-center gap-2 text-center text-slate-400 p-6">
              <BookOpen className="h-10 w-10 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No video or files attached</p>
              <p className="text-xs text-slate-500 max-w-xs">This lesson only has the description below.</p>
            </div>
          )}
        </div>

        {/* Sidebar: description + attachments */}
        <aside className="relative z-10 w-full lg:w-80 shrink-0 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 p-4 sm:p-5 text-sm">
          {lesson.content && (
            <div className="mb-5">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Description</h4>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{lesson.content}</p>
            </div>
          )}

          {tabs.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Attachments</h4>
              <div className="space-y-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveKey(tab.key)}
                    className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors ${
                      tab.key === active?.key
                        ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                        : "border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {tab.isVideo ? <Video className="h-3.5 w-3.5 shrink-0" /> : <FileText className="h-3.5 w-3.5 shrink-0" />}
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mt-5 text-xs text-slate-500">
            Posted by {lesson.createdBy} · {new Date(lesson.createdAt).toLocaleDateString()}
          </p>
        </aside>

        {/* Traceable identity watermark — tiled so it can't be cropped out of a leaked screenshot */}
        <Watermark label={lesson.title} />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-between items-center px-3 sm:px-8 py-2 sm:py-4 text-[9px] sm:text-xs font-mono text-white/70 tracking-wide sm:tracking-widest uppercase">
          <span>UMS PROTECTED CONTENT</span>
          <span>NO COPY / DOWNLOAD</span>
        </div>

        {/* Screen Protection Solid Black Overlay */}
        {isBlackout && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-6 text-center select-none pointer-events-auto">
            <ShieldAlert className="h-16 w-16 text-rose-500 mb-3 animate-pulse" />
            <h3 className="text-2xl font-bold">Screen Capture Protected</h3>
            <p className="text-sm text-slate-400 max-w-sm mt-2">
              Downloading, printing, and screen recording are strictly disabled on this media.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
