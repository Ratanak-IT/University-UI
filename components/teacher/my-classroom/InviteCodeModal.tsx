"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, RotateCw } from "lucide-react";

type InviteCodeModalProps = {
  code: string;
  isOpen: boolean;
  onClose: () => void;
  onReset?: () => void;
};

export default function InviteCodeModal({
  code,
  isOpen,
  onClose,
  onReset,
}: InviteCodeModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape + lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset the "copied" state whenever the modal is reopened
  useEffect(() => {
    if (isOpen) setCopied(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-code-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2
            id="invite-code-title"
            className="text-xl font-bold text-card-foreground"
          >
            Classroom Invite Code
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-card-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Share this unique code with your students to give them instant
            access to this classroom.
          </p>

          <div className="mt-6 rounded-2xl bg-primary/5 p-8">
            <p className="font-mono text-3xl font-bold tracking-[0.25em] text-primary dark:text-gray-200">
              {code}
            </p>
            <button
              onClick={handleCopy}
              className="mx-auto mt-5 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Code
                </>
              )}
            </button>
          </div>

          {onReset && (
            <button
              onClick={onReset}
              className="mx-auto mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground"
            >
              <RotateCw className="h-4 w-4" />
              Reset Code for security
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border bg-muted/30 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}