"use client";

import { useEffect, useState } from "react";

interface UseContentProtectionOptions {
  /** Set false to turn protection off without unmounting the wrapper (e.g. while a component is closed). */
  enabled?: boolean;
  /** How long a transient trigger (PrintScreen, a blocked shortcut) holds the blackout up, in ms. */
  transientHoldMs?: number;
}

/**
 * Telegram-style content protection: blocks the common screenshot/devtools/save
 * shortcuts, and raises a blackout flag whenever the tab loses focus/visibility,
 * devtools appears to be open, or a screenshot/recording shortcut fires — the
 * caller renders an opaque overlay over the protected content while it's up.
 *
 * This is a deterrent, not a guarantee: the OS can always screenshot below the
 * browser's event layer. It stops casual copying, not a determined attacker.
 */
export function useContentProtection({
  enabled = true,
  transientHoldMs = 3500,
}: UseContentProtectionOptions = {}) {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isDevtoolsOpen, setIsDevtoolsOpen] = useState(false);
  const [isTransient, setIsTransient] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let transientTimer: ReturnType<typeof setTimeout> | null = null;
    const triggerTransient = () => {
      setIsTransient(true);
      if (transientTimer) clearTimeout(transientTimer);
      transientTimer = setTimeout(() => setIsTransient(false), transientHoldMs);
    };

    // Form fields need normal select/copy/paste/right-click to remain editable.
    const isEditableTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    };

    // Shortcut coverage across Windows, macOS, and Linux. Note: OS-reserved global
    // hotkeys (PrintScreen, Win+Shift+S, Cmd+Shift+3/4/5, ...) are intercepted by the
    // OS before the browser gets a cancelable event — preventDefault() here can't
    // stop the capture itself, only trigger our blackout as fast as possible in
    // reaction to it.
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      const isDevTools =
        key === "f12" ||
        (ctrlOrCmd && e.shiftKey && ["i", "j", "c", "k"].includes(key)) || // Chrome/Firefox devtools (Win/Linux)
        (e.metaKey && e.altKey && ["i", "j", "c"].includes(key)); // Chrome/Firefox devtools (macOS)

      const isSaveOrViewSource =
        (ctrlOrCmd && ["s", "p", "u"].includes(key)) ||
        (e.metaKey && e.altKey && key === "u"); // macOS "View Page Source"

      const isScreenshotOrRecording =
        key === "printscreen" || // Windows/Linux PrtScn, any modifier (Alt/Shift/Ctrl/Win variants)
        (e.metaKey && e.shiftKey && ["s", "3", "4", "5", "6"].includes(key)) || // Win Snip & Sketch / macOS screenshot toolbar
        (e.metaKey && e.altKey && key === "r") || // Windows Xbox Game Bar recording
        (e.metaKey && key === "g"); // Windows Xbox Game Bar overlay

      const blockedCombo = isDevTools || isSaveOrViewSource || isScreenshotOrRecording || key === "escape";

      if (blockedCombo) {
        e.preventDefault();
        if (key !== "escape") triggerTransient();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "printscreen") {
        triggerTransient();
      }
    };

    const handleSelectStart = (e: Event) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    };
    const handleCopy = (e: ClipboardEvent) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    };
    const handleDragStart = (e: DragEvent) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    };

    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);
    const handleVisibility = () => setIsBlurred(document.hidden);

    // Block real screen-share/recording capture of this tab where the API exists.
    let originalGetDisplayMedia: typeof navigator.mediaDevices.getDisplayMedia | null = null;
    if (navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices) {
      originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async () => {
        triggerTransient();
        throw new Error("Screen recording is blocked on protected university content.");
      };
    }

    // Heuristic devtools-open detector (docked panels change the viewport/outer size gap).
    const DEVTOOLS_THRESHOLD = 160;
    const devtoolsInterval = setInterval(() => {
      const widthGap = window.outerWidth - window.innerWidth > DEVTOOLS_THRESHOLD;
      const heightGap = window.outerHeight - window.innerHeight > DEVTOOLS_THRESHOLD;
      setIsDevtoolsOpen(widthGap || heightGap);
    }, 1000);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("dragstart", handleDragStart);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(devtoolsInterval);
      if (transientTimer) clearTimeout(transientTimer);
      if (originalGetDisplayMedia && navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
    };
  }, [enabled, transientHoldMs]);

  return { isBlackout: enabled && (isBlurred || isDevtoolsOpen || isTransient) };
}
