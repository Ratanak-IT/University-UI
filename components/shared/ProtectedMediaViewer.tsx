"use client";

import { FileText, Lock } from "lucide-react";
import { LessonPlayer } from "@/components/teacher/detail-lesson/LessonPlayer.tsx";
import { SecurePdfViewer } from "@/components/shared/SecurePdfViewer";
import { useSecureFileBlob } from "@/lib/hooks/useSecureFileBlob";

interface ProtectedMediaViewerProps {
  fileName: string;
  fileUrl: string;
  isVideo?: boolean;
  className?: string;
}

/**
 * Renders the right viewer for a single lesson/assignment attachment based on its
 * extension — video, PDF, image, Office doc, or a generic iframe fallback. Pulled
 * out of SecureFileViewerModal so a lesson detail popup can swap this in-place
 * between attachments without re-mounting the surrounding modal chrome.
 */
export function ProtectedMediaViewer({
  fileName,
  fileUrl,
  isVideo = false,
  className = "",
}: ProtectedMediaViewerProps) {
  const isLocalhost = fileUrl.includes("localhost") || fileUrl.includes("127.0.0.1");
  const isPdf = fileName.toLowerCase().endsWith(".pdf") || fileUrl.toLowerCase().includes(".pdf");
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)/i.test(fileName) || /\.(jpg|jpeg|png|webp|gif|svg)/i.test(fileUrl);
  const isOffice = /\.(pptx|ppt|docx|doc|xlsx|xls)/i.test(fileName) || /\.(pptx|ppt|docx|doc|xlsx|xls)/i.test(fileUrl);

  if (isVideo) {
    return (
      <div className={`relative z-0 flex h-full w-full justify-center ${className}`}>
        <LessonPlayer
          thumbnailUrl=""
          videoUrl={fileUrl}
          watermarkText={fileName}
          className="w-full aspect-video lg:h-full lg:w-auto lg:max-w-full"
        />
      </div>
    );
  }

  if (!fileUrl) {
    return (
      <div className={`relative z-0 flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-900 p-6 text-center text-slate-400 ${className}`}>
        <Lock className="h-8 w-8 text-slate-600" />
        <p className="text-sm font-semibold text-slate-300">No file available</p>
      </div>
    );
  }

  if (isPdf) {
    return <SecurePdfViewer key={fileUrl} fileUrl={fileUrl} className={`relative z-0 ${className}`} />;
  }

  if (isImage) {
    return (
      <SecureImage fileName={fileName} fileUrl={fileUrl} className={className} />
    );
  }

  if (isOffice) {
    if (isLocalhost) {
      return (
        <div className={`relative z-0 self-center flex flex-col items-center justify-center p-8 text-center max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-4 ${className}`}>
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <FileText className="h-10 w-10" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">{fileName}</h4>
            <p className="text-xs text-orange-400 font-semibold mt-1">Office Document • Protected Read-Only</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              In production deployment, Google Docs Viewer embeds the document live. Direct file downloading and printing are blocked for security.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 border border-slate-700">
            <Lock className="h-4 w-4 text-emerald-400" /> Content Security Active
          </div>
        </div>
      );
    }
    return <UnsupportedPreview fileName={fileName} kind="Office document" className={className} />;
  }

  // Anything else: no native plugin viewer, which would come with its own
  // download and print buttons that no script on this page can intercept.
  return <UnsupportedPreview fileName={fileName} kind="File" className={className} />;
}

function SecureImage({
  fileName,
  fileUrl,
  className,
}: {
  fileName: string;
  fileUrl: string;
  className: string;
}) {
  const { blobUrl, status } = useSecureFileBlob(fileUrl);

  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
        Loading…
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element --
       a blob: URL only exists in this browser tab, so next/image cannot fetch
       it server-side to optimise. A plain <img> is the correct element here. */
    <img
      src={blobUrl ?? ""}
      alt={fileName}
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      className={`relative z-0 max-h-full max-w-full object-contain pointer-events-none select-none ${className}`}
    />
  );
}

/**
 * Shown instead of shipping the file somewhere else to be rendered.
 *
 * The previous fallback embedded `docs.google.com/viewer?url=<presigned url>`,
 * which sent the document's address to Google so Google could fetch and render
 * it. For a file the platform is trying to keep private, that is the leak — not
 * a preview feature.
 */
function UnsupportedPreview({
  fileName,
  kind,
  className,
}: {
  fileName: string;
  kind: string;
  className: string;
}) {
  return (
    <div
      className={`relative z-0 flex flex-col items-center justify-center gap-3 self-center rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-slate-400">
        <FileText className="h-8 w-8" />
      </div>
      <div>
        <h4 className="font-bold text-white">{fileName}</h4>
        <p className="mt-1 text-xs font-semibold text-slate-400">
          {kind} · preview not available
        </p>
        <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500">
          This format cannot be rendered inside the secure viewer, and it is not
          sent to any outside service to be displayed. Ask your teacher to
          upload it as a PDF.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300">
        <Lock className="h-4 w-4 text-emerald-400" /> Content stays on this server
      </div>
    </div>
  );
}
