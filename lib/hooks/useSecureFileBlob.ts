"use client";

import { useEffect, useState } from "react";

export type BlobStatus = "idle" | "loading" | "ready" | "error";

type BlobState = {
  blobUrl: string | null;
  status: BlobStatus;
};

/** What finished loading, tagged with the URL it belongs to. */
type Loaded = {
  url: string;
  blobUrl: string | null;
  status: "ready" | "error";
};

/**
 * Loads a file into memory and hands back a `blob:` URL to render from.
 *
 * The point is to keep the storage URL out of the page. Previously the
 * presigned MinIO link was written straight into `<img src>` / `<iframe src>`,
 * so anyone could copy it out of the DOM and hand it to someone with no account
 * at all — the link carries its own credentials and needs no session.
 *
 * A `blob:` URL is scoped to this document and dies when the page unloads, so
 * copying it out gets you nothing.
 *
 * What this does NOT do — and cannot, in a browser:
 *   - stop screenshots or screen recording; both are handled by the OS, below
 *     anything JavaScript is able to observe
 *   - stop DevTools — the bytes are still visible in the Network tab
 *   - stop a phone camera pointed at the screen
 *
 * It closes the shareable-link hole. It does not make a file unreadable to
 * someone already allowed to read it, and nothing in a browser can.
 */
export function useSecureFileBlob(fileUrl: string | null | undefined): BlobState {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    if (!fileUrl) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    (async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") ||
              localStorage.getItem("access_token")
            : null;

        const res = await fetch(fileUrl, {
          // A presigned URL carries its own credentials, but an authenticated
          // endpoint will want the bearer token — sending it when we have one
          // keeps this working if the backend moves to streaming files itself.
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error(`file fetch failed: ${res.status}`);

        const blob = await res.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setLoaded({ url: fileUrl, blobUrl: objectUrl, status: "ready" });
      } catch {
        if (!cancelled) {
          setLoaded({ url: fileUrl, blobUrl: null, status: "error" });
        }
      }
    })();

    return () => {
      cancelled = true;
      // Releasing it stops the bytes lingering for the rest of the session.
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileUrl]);

  // Derived rather than written back through the effect: tagging the result
  // with its URL makes "still loading the new file" fall out of a comparison,
  // so no setState is needed to reset between files.
  if (!fileUrl) return { blobUrl: null, status: "idle" };
  if (loaded?.url !== fileUrl) return { blobUrl: null, status: "loading" };
  return { blobUrl: loaded.blobUrl, status: loaded.status };
}
