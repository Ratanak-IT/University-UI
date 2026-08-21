"use client";

import React from "react";
import { X, ShieldAlert, Lock } from "lucide-react";
import { Watermark } from "@/components/shared/Watermark";
import { ProtectedMediaViewer } from "@/components/shared/ProtectedMediaViewer";
import { useContentProtection } from "@/lib/hooks/useContentProtection";

interface SecureFileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string;
  isVideo?: boolean;
}

export function SecureFileViewerModal({
  isOpen,
  onClose,
  fileName,
  fileUrl,
  isVideo = false,
}: SecureFileViewerModalProps) {
  const { isBlackout } = useContentProtection({ enabled: isOpen });

  if (!isOpen) return null;

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
          <h3 className="text-sm sm:text-base font-bold truncate">{fileName}</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer shrink-0"
          title="Close Viewer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Full Screen Content Viewer Body */}
      <div
        className="relative flex-1 min-h-0 bg-slate-950 overflow-hidden flex justify-center p-3 sm:p-4"
        style={{ isolation: "isolate" }}
      >
        <ProtectedMediaViewer fileName={fileName} fileUrl={fileUrl} isVideo={isVideo} />

        {/* Traceable identity watermark — tiled so it can't be cropped out of a leaked screenshot */}
        <Watermark label={fileName} />

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
