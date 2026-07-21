"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function LessonPlayer({
  thumbnailUrl,
  videoUrl,
}: {
  thumbnailUrl: string;
  videoUrl: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted border border-border shadow-sm">
      {playing && videoUrl ? (
        <video src={videoUrl} controls autoPlay className="w-full h-full object-cover" />
      ) : (
        <>
          <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
          <button
            onClick={() => setPlaying(true)}
            aria-label="Play lesson video"
            className="absolute inset-0 flex items-center justify-center group"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-lg transition-transform group-hover:scale-105">
              <Play className="h-7 w-7 text-white fill-white ml-1" />
            </span>
          </button>
        </>
      )}
    </div>
  );
}