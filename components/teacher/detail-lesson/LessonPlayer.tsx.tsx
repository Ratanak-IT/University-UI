"use client";

import { useState, useEffect } from "react";
import { Play, ShieldAlert, Lock } from "lucide-react";

export function LessonPlayer({
  thumbnailUrl,
  videoUrl,
  watermarkText = "UMS Protected Content • Do Not Share",
}: {
  thumbnailUrl: string;
  videoUrl: string;
  watermarkText?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [isProtected, setIsProtected] = useState(false);

  useEffect(() => {
    // Block keyboard shortcuts (Ctrl+P, Ctrl+S, PrintScreen, Win+Alt+R, F12)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "p" || e.key === "s" || e.key === "u")) ||
        (e.metaKey && e.shiftKey && (e.key === "s" || e.key === "S")) ||
        (e.metaKey && e.altKey && (e.key === "r" || e.key === "R")) ||
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

    const handleVisibility = () => {
      if (document.hidden) setIsProtected(true);
      else setIsProtected(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", (e) => {
      if (e.key === "PrintScreen" && navigator.clipboard) {
        try { navigator.clipboard.writeText(""); } catch (err) {}
        setIsProtected(true);
        setTimeout(() => setIsProtected(false), 3500);
      }
    });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Format YouTube URLs if needed
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    return url;
  };

  const isYouTube = videoUrl?.includes("youtube") || videoUrl?.includes("youtu.be");
  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-sm select-none protected-media"
    >
      {/* Dynamic Security Watermark Overlay */}
      <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 opacity-40 select-none overflow-hidden">
        <div className="flex justify-between items-center text-[10px] font-mono text-white/80 tracking-widest uppercase">
          <span>{watermarkText}</span>
          <span>{new Date().toISOString().split("T")[0]}</span>
        </div>
        <div className="rotate-[-20deg] text-center text-white/30 text-xs sm:text-sm font-black tracking-widest uppercase">
          {watermarkText}
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-white/80 tracking-widest uppercase">
          <span>CONFIDENTIAL MATERIAL</span>
          <span>UMS SECURE PLAYER</span>
        </div>
      </div>

      {/* Screen Recording / Capture Solid Pitch-Black Overlay */}
      {isProtected && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-6 text-center animate-in fade-in duration-200">
          <ShieldAlert className="h-12 w-12 text-rose-500 mb-3 animate-pulse" />
          <h3 className="text-lg font-bold">Video Content Protected</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Screen capturing, saving, and downloading are disabled on this university video.
          </p>
        </div>
      )}

      {isYouTube ? (
        <iframe
          src={embedUrl}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={false}
          title="Lesson Video"
        />
      ) : videoUrl ? (
        <video
          src={videoUrl}
          poster={thumbnailUrl || undefined}
          controls
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center">
          <Lock className="h-10 w-10 text-slate-500 mb-2" />
          <p className="text-sm font-semibold text-slate-300">No Video Stream Available</p>
          <p className="text-xs text-slate-500 mt-1">This lesson does not have a video attached.</p>
        </div>
      )}
    </div>
  );
}