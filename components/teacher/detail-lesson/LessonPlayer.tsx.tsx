"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldAlert, Lock, Play } from "lucide-react";
import { Watermark } from "@/components/shared/Watermark";
import { useContentProtection } from "@/lib/hooks/useContentProtection";

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLIFrameElement,
        options: { events: { onStateChange: (e: { data: number }) => void } }
      ) => YTPlayer;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youTubeApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (youTubeApiPromise) return youTubeApiPromise;

  youTubeApiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };
    if (!document.getElementById("youtube-iframe-api")) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });
  return youTubeApiPromise;
}

export function LessonPlayer({
  thumbnailUrl,
  videoUrl,
  watermarkText = "UMS Protected Content • Do Not Share",
  className = "w-full aspect-video",
}: {
  thumbnailUrl: string;
  videoUrl: string;
  watermarkText?: string;
  /** Overrides the default width-bound sizing (e.g. to bound by height instead inside a fixed-height modal). */
  className?: string;
}) {
  const { isBlackout } = useContentProtection();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  // Clear a stale error state when a different video is passed in — done during
  // render (React's "adjusting state when a prop changes" pattern) rather than
  // in an effect, so it applies within the same render pass.
  const [lastVideoUrl, setLastVideoUrl] = useState(videoUrl);
  if (videoUrl !== lastVideoUrl) {
    setLastVideoUrl(videoUrl);
    setVideoFailed(false);
  }

  // Extract a YouTube video ID from either watch or short-link URL forms.
  const getYouTubeVideoId = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.split("v=")[1]?.split("&")[0] ?? "";
    }
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1]?.split("?")[0] ?? "";
    }
    return "";
  };

  const isYouTube = videoUrl?.includes("youtube") || videoUrl?.includes("youtu.be");
  const youTubeVideoId = isYouTube ? getYouTubeVideoId(videoUrl) : "";
  // Placeholder/demo links (e.g. "watch?v=example") resolve to no real video —
  // treat anything shorter than a real 11-char YouTube ID as unplayable.
  const isValidYouTubeId = youTubeVideoId.length >= 8 && youTubeVideoId !== "example";
  const embedUrl = isValidYouTubeId
    ? `https://www.youtube.com/embed/${youTubeVideoId}?rel=0&modestbranding=1&enablejsapi=1`
    : "";

  // A YouTube iframe is foreign content (different origin) — right-click and
  // double-click inside it open YouTube's/Chrome's own menus that no amount of
  // JS on this page can intercept. The click-shield below stops any pointer
  // event from ever reaching the iframe; the IFrame Player API gives back a
  // minimal play/pause control since direct interaction with the embed is gone.
  useEffect(() => {
    if (!isValidYouTubeId) return;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !iframeRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (e) => setIsPlaying(e.data === window.YT!.PlayerState.PLAYING),
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [isValidYouTubeId, embedUrl]);

  const toggleYouTubePlayback = () => {
    const player = playerRef.current;
    if (!player) return;
    if (player.getPlayerState() === window.YT?.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDoubleClick={(e) => e.preventDefault()}
      className={`relative rounded-2xl overflow-hidden bg-black border border-border shadow-sm select-none protected-media ${className}`}
      style={{ isolation: "isolate" }}
    >
      {isValidYouTubeId ? (
        <>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="relative z-0 w-full h-full border-none"
            allow="accelerometer; autoplay; encrypted-media; gyroscope"
            allowFullScreen={false}
            title="Lesson Video"
          />
          {/* Click shield: blocks all direct mouse interaction with the foreign iframe */}
          <button
            type="button"
            onClick={toggleYouTubePlayback}
            onContextMenu={(e) => e.preventDefault()}
            onDoubleClick={(e) => e.preventDefault()}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="absolute inset-0 z-20 flex items-center justify-center bg-transparent cursor-pointer"
          >
            {!isPlaying && (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                <Play className="h-7 w-7 ml-1" />
              </span>
            )}
          </button>
        </>
      ) : videoUrl && !isYouTube && !videoFailed ? (
        <video
          src={videoUrl}
          poster={thumbnailUrl || undefined}
          controls
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          onDoubleClick={(e) => e.preventDefault()}
          onError={() => setVideoFailed(true)}
          className="relative z-0 w-full h-full object-cover"
        />
      ) : videoUrl ? (
        <div className="relative z-0 w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center">
          <ShieldAlert className="h-10 w-10 text-amber-500 mb-2" />
          <p className="text-sm font-semibold text-slate-300">Video Unavailable</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {isYouTube
              ? "This video link doesn't point to a valid YouTube video."
              : "The video file couldn't be loaded. It may have been moved or removed."}
          </p>
        </div>
      ) : (
        <div className="relative z-0 w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center">
          <Lock className="h-10 w-10 text-slate-500 mb-2" />
          <p className="text-sm font-semibold text-slate-300">No Video Stream Available</p>
          <p className="text-xs text-slate-500 mt-1">This lesson does not have a video attached.</p>
        </div>
      )}

      {/* Traceable identity watermark — tiled so it can't be cropped out of a leaked screenshot/recording */}
      <Watermark label={watermarkText} />

      {/* Screen Recording / Capture Solid Pitch-Black Overlay */}
      {isBlackout && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-6 text-center animate-in fade-in duration-200">
          <ShieldAlert className="h-12 w-12 text-rose-500 mb-3 animate-pulse" />
          <h3 className="text-lg font-bold">Video Content Protected</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Screen capturing, saving, and downloading are disabled on this university video.
          </p>
        </div>
      )}
    </div>
  );
}
