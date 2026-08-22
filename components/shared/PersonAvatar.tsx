"use client";

import Image from "next/image";
import { useState } from "react";

const SIZES = {
  sm: { box: "h-9 w-9", text: "text-xs", px: 36 },
  md: { box: "h-10 w-10", text: "text-sm", px: 40 },
  lg: { box: "h-14 w-14", text: "text-base", px: 56 },
} as const;

/** First letters of the first and last word — "Sok Dara" becomes "SD". */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * A person's picture, falling back to their initials.
 *
 * The URLs are presigned MinIO links: they carry their credentials in the query
 * string and expire, so they are rendered `unoptimized`. Running them through
 * the image optimizer would cache a URL that later stops working, and the Next
 * docs call this out for any `src` that requires authentication.
 *
 * An expired or deleted object therefore has to degrade quietly, which is what
 * `onError` is for — a missing picture is normal, not an error state.
 */
export default function PersonAvatar({
  name,
  avatarUrl,
  size = "sm",
  className = "",
}: {
  name: string;
  avatarUrl?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  // Which URL failed, not merely *that* one did. A recycled table row gets a
  // new student's URL while the component stays mounted, and a boolean would
  // carry the previous student's failure across. Storing the URL makes the
  // comparison self-resetting, so no effect is needed to clear it — an effect
  // here would be a setState-in-effect, which is precisely the pattern that
  // froze the attendance page.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const { box, text, px } = SIZES[size];

  const showImage = Boolean(avatarUrl) && failedUrl !== avatarUrl;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ${box} ${className}`}
    >
      {showImage ? (
        <Image
          src={avatarUrl as string}
          alt={name}
          width={px}
          height={px}
          unoptimized
          onError={() => setFailedUrl(avatarUrl as string)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className={`flex h-full w-full items-center justify-center bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 ${text}`}
        >
          {initialsOf(name)}
        </div>
      )}
    </div>
  );
}
