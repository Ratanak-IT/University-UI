"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface SecurePdfViewerProps {
  fileUrl: string;
  className?: string;
}

/**
 * Renders a PDF as plain <canvas> pages inside our own DOM instead of handing the
 * raw file to Chrome's built-in PDF viewer. That native viewer runs as a browser
 * plugin, not a web page — its right-click menu ("Save as", "Print", "Inspect")
 * can't be intercepted by any JS on the embedding page. Canvas output is ordinary
 * DOM content, so our contextmenu block and watermark overlay actually apply to it.
 */
export function SecurePdfViewer({ fileUrl, className = "" }: SecurePdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const pdf = await pdfjsLib.getDocument({ url: fileUrl }).promise;
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          if (cancelled) return;

          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "w-full h-auto max-w-3xl rounded-lg shadow-sm bg-white";

          await page.render({ canvas, viewport }).promise;
          if (cancelled) return;
          containerRef.current?.appendChild(canvas);
        }

        if (!cancelled) setStatus("ready");
      } catch {
        // Most likely the file host doesn't send CORS headers for a direct browser
        // fetch. Fall back to Google's viewer rather than the native plugin viewer.
        if (!cancelled) setStatus("fallback");
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  if (status === "fallback") {
    const docViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    return (
      <iframe
        src={docViewerUrl}
        className={`relative z-0 w-full h-full border-none ${className}`}
        title="Document"
      />
    );
  }

  return (
    <div className={`relative h-full w-full overflow-y-auto ${className}`}>
      {status === "loading" && (
        <div className="flex h-full items-center justify-center gap-2 text-slate-400 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading document…
        </div>
      )}
      <div ref={containerRef} className="flex flex-col items-center gap-3 p-4" />
    </div>
  );
}
