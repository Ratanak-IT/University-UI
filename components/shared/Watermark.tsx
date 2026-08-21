"use client";

import { useGetUserProfileQuery } from "@/lib/redux/apiSlice";

interface WatermarkProps {
  /** Extra context to weave into the tiled text, e.g. the file or lesson name. */
  label?: string;
  className?: string;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Screenshots/recordings can't be blocked by a web page (that happens below the
 * browser, at the OS level). This is the realistic mitigation instead: tile the
 * viewer's identity across the whole surface so any leaked capture is traceable
 * back to whoever took it. Tiled (not a single corner label) so it can't be
 * cropped out.
 */
export function Watermark({ label, className = "" }: WatermarkProps) {
  const { data: profile } = useGetUserProfileQuery();

  const identity = profile ? `${profile.fullName} · ${profile.email}` : "UMS Protected Viewer";
  const timestamp = new Date().toLocaleString();
  const text = escapeXml([identity, label, timestamp].filter(Boolean).join("   •   "));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240">
    <text x="-40" y="80" transform="rotate(-28 240 120)" font-family="monospace" font-size="14" fill="rgba(255,255,255,0.16)">${text}</text>
    <text x="-40" y="190" transform="rotate(-28 240 120)" font-family="monospace" font-size="14" fill="rgba(255,255,255,0.16)">${text}</text>
  </svg>`;

  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none absolute inset-0 z-30 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
