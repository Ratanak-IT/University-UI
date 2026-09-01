"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Watches whether a student stays on the quiz screen.
 *
 * <p>What this can honestly do is narrow. A web page cannot stop someone
 * pressing Alt+Tab, closing the tab, photographing the screen or simply opening
 * the textbook beside them. Anything claiming otherwise needs software
 * installed on the machine, which this is not.
 *
 * <p>So it does not pretend to lock anything down. It asks for fullscreen,
 * notices when the quiz stops being the thing on screen, and reports that so a
 * teacher can weigh it up. The student is told plainly that this is happening —
 * a count they can see is a deterrent; a count they cannot is a trap.
 */

/** Fullscreen lives in the DOM, not in React, so it is read rather than mirrored. */
function subscribeToFullscreen(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
}

const isDocumentFullscreen = () => Boolean(document.fullscreenElement);

export function useQuizProctor({
  active,
  onFocusLoss,
}: {
  /** True only while an attempt is genuinely open. */
  active: boolean;
  /** Called once per departure. Should not throw. */
  onFocusLoss: () => void;
}) {
  const [count, setCount] = useState(0);

  const isFullscreen = useSyncExternalStore(
    subscribeToFullscreen,
    isDocumentFullscreen,
    () => false // never fullscreen while server-rendering
  );

  /**
   * Switching tab fires blur *and* visibilitychange, and switching app while
   * fullscreen fires all three. Without this window one departure would be
   * recorded as two or three, and a student who glanced at a notification would
   * look like a serial offender.
   */
  const lastReport = useRef(0);

  // Held in a ref so the listeners below never need re-binding when the callback
  // identity changes, and written in an effect because a ref must not be
  // touched during render.
  const onFocusLossRef = useRef(onFocusLoss);
  useEffect(() => {
    onFocusLossRef.current = onFocusLoss;
  });

  const report = useCallback(() => {
    const now = Date.now();
    if (now - lastReport.current < 1500) return;
    lastReport.current = now;

    setCount((n) => n + 1);
    onFocusLossRef.current();
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Refused unless triggered by a gesture, and unsupported on most mobile
      // browsers. The quiz still runs; only the fullscreen prompt is lost, and
      // the tab-switch detection below is unaffected.
    }
  }, []);

  // Counting restarts with each attempt. Adjusted during render rather than in
  // an effect: an effect would leave one paint showing the previous student's
  // tally on a fresh quiz.
  const [wasActive, setWasActive] = useState(active);
  if (wasActive !== active) {
    setWasActive(active);
    if (!active) {
      setCount(0);
    }
  }

  useEffect(() => {
    if (!active) return;

    const onVisibility = () => {
      if (document.visibilityState === "hidden") report();
    };
    const onBlur = () => report();
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) report();
    };
    // The browser writes its own wording here and ignores ours; returning a
    // value is what makes it ask at all.
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [active, report]);

  // Leaving fullscreen behind after the quiz ends would strand the student in a
  // chromeless window with no obvious way out.
  useEffect(() => {
    if (active) return;

    // Refs are written here rather than during the render-time reset above,
    // because touching one mid-render is exactly the sort of hidden mutation
    // that makes a component render differently on a replay.
    lastReport.current = 0;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    }
  }, [active]);

  return { count, isFullscreen, enterFullscreen };
}
