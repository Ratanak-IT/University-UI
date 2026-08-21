"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { useContentProtection } from "@/lib/hooks/useContentProtection";

interface GlobalContentProtectionProps {
  children: React.ReactNode;
}

/**
 * Site-wide wrapper: blocks right-click, text selection, copy/drag, and the
 * common DevTools/save/print/screenshot shortcuts on every page, and raises a
 * full-screen blackout whenever the tab loses focus, DevTools appears open,
 * or a screenshot/recording shortcut fires. See useContentProtection for the
 * deterrent-not-guarantee caveat.
 */
export function GlobalContentProtection({ children }: GlobalContentProtectionProps) {
  const { isBlackout } = useContentProtection({ enabled: true });

  return (
    <div onContextMenu={(e) => e.preventDefault()} className="protected-media min-h-full">
      {children}

      {isBlackout && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white p-6 text-center select-none pointer-events-auto">
          <ShieldAlert className="h-16 w-16 text-rose-500 mb-3 animate-pulse" />
          <h3 className="text-2xl font-bold">Screen Capture Protected</h3>
          <p className="text-sm text-slate-400 max-w-sm mt-2">
            Downloading, printing, and screen recording are strictly disabled on this platform.
          </p>
        </div>
      )}
    </div>
  );
}
