"use client";

import React, { useEffect, useState } from "react";
import { X, ShieldAlert, FileText, Lock, Eye } from "lucide-react";
import { LessonPlayer } from "@/components/teacher/detail-lesson/LessonPlayer.tsx";

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
  const [isProtected, setIsProtected] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Detect Screen Recording / Display Media Capture API
    if (navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices) {
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async (options) => {
        setIsProtected(true);
        throw new Error("Screen recording is blocked on protected university media.");
      };
    }

    // Clear clipboard on PrintScreen & intercept screenshot/recording key combinations (Win+Alt+R, Win+G, Win+Shift+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "p" || e.key === "s" || e.key === "u")) ||
        (e.metaKey && e.shiftKey && (e.key === "s" || e.key === "S")) ||
        (e.metaKey && e.altKey && (e.key === "r" || e.key === "R")) || // Game Bar Recording Shortcut
        e.key === "PrintScreen" ||
        e.key === "F12"
      ) {
        if (navigator.clipboard) {
          try { navigator.clipboard.writeText(""); } catch (err) {}
        }
        e.preventDefault();
        setIsProtected(true);
        setTimeout(() => setIsProtected(false), 3500);
      }
    };

    const handleBlur = () => {
      setIsProtected(true);
    };

    const handleFocus = () => {
      setIsProtected(false);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        setIsProtected(true);
      } else {
        setIsProtected(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", (e) => {
      if (e.key === "PrintScreen" && navigator.clipboard) {
        try { navigator.clipboard.writeText(""); } catch (err) {}
        setIsProtected(true);
        setTimeout(() => setIsProtected(false), 3500);
      }
    });
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isLocalhost = fileUrl.includes("localhost") || fileUrl.includes("127.0.0.1");
  const isPdf = fileName.toLowerCase().endsWith(".pdf") || fileUrl.toLowerCase().includes(".pdf");
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)/i.test(fileName) || /\.(jpg|jpeg|png|webp|gif|svg)/i.test(fileUrl);
  const isOffice = /\.(pptx|ppt|docx|doc|xlsx|xls)/i.test(fileName) || /\.(pptx|ppt|docx|doc|xlsx|xls)/i.test(fileUrl);

  const docViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen bg-slate-950 select-none protected-media transform-gpu translate-z-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900 text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Lock className="h-4 w-4" />
          </div>
          <h3 className="text-base font-bold truncate max-w-xl">{fileName}</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          title="Close Viewer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Full Screen Content Viewer Body */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center">
        {/* Subtle Security Watermark Overlay */}
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-8 opacity-25 select-none overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono text-white tracking-widest uppercase">
            <span>UMS PROTECTED CONTENT</span>
            <span>CONFIDENTIAL</span>
          </div>
          <div className="rotate-[-25deg] text-center text-white text-lg sm:text-2xl font-black tracking-widest uppercase opacity-40">
            UMS SECURE VIEWER • DO NOT SHARE
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-white tracking-widest uppercase">
            <span>NO COPY / DOWNLOAD</span>
            <span>{new Date().toISOString().split("T")[0]}</span>
          </div>
        </div>

        {/* Screen Protection Solid Black Overlay */}
        {isProtected && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-6 text-center select-none pointer-events-auto">
            <ShieldAlert className="h-16 w-16 text-rose-500 mb-3 animate-pulse" />
            <h3 className="text-2xl font-bold">Screen Capture Protected</h3>
            <p className="text-sm text-slate-400 max-w-sm mt-2">
              Downloading, printing, and screen recording are strictly disabled on this media.
            </p>
          </div>
        )}

        {/* Media Player or File Viewer */}
        {isVideo ? (
          <div className="w-full h-full p-4">
            <LessonPlayer thumbnailUrl="" videoUrl={fileUrl} watermarkText={fileName} />
          </div>
        ) : isPdf ? (
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            className="w-full h-full border-none transform-gpu"
            title={fileName}
          />
        ) : isImage ? (
          <img
            src={fileUrl}
            alt={fileName}
            onContextMenu={(e) => e.preventDefault()}
            className="max-h-full max-w-full object-contain pointer-events-none select-none transform-gpu"
          />
        ) : isOffice ? (
          isLocalhost ? (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <FileText className="h-10 w-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{fileName}</h4>
                <p className="text-xs text-orange-400 font-semibold mt-1">
                  PowerPoint Presentation (.pptx) • Protected Read-Only
                </p>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  In production deployment, Google Docs Viewer embeds the presentation slides live. Direct file downloading and printing are blocked for security.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 border border-slate-700">
                <Lock className="h-4 w-4 text-emerald-400" /> Content Security Active
              </div>
            </div>
          ) : (
            <iframe
              src={docViewerUrl}
              className="w-full h-full border-none transform-gpu"
              title={fileName}
            />
          )
        ) : (
          <iframe
            src={`${fileUrl}#toolbar=0`}
            className="w-full h-full border-none transform-gpu"
            title={fileName}
          />
        )}
      </div>
    </div>
  );
}
