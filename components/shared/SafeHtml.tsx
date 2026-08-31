import DOMPurify from "isomorphic-dompurify";

/**
 * Renders HTML produced by the TipTap instructions editor — assignment and
 * lesson descriptions are stored as real markup (`<p>`, `<strong>`, lists,
 * links, images), not plain text, so a plain `{text}` render shows the raw
 * tags instead of the formatting a teacher actually wrote.
 *
 * <p>Sanitized rather than rendered as-is: the same field is reachable
 * through the API directly, not only through this editor's UI, so nothing
 * here can assume the markup was actually produced by TipTap.
 */
export default function SafeHtml({
  html,
  className,
}: {
  html: string | null | undefined;
  className?: string;
}) {
  if (!html) return null;

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s",
      "ul", "ol", "li",
      "a", "img",
      "h1", "h2", "h3", "h4",
      "blockquote", "code", "pre",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "class", "style"],
  });

  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}

/**
 * Plain-text preview of the same HTML — for a card summary (`line-clamp-2`
 * and similar), where the content is a snippet, not the formatted document.
 * Tags stripped rather than rendered, since a clamp only truncates the text
 * flow of one element and has no idea how to cut off nested block markup.
 */
export function htmlToPreviewText(html: string | null | undefined): string {
  if (!html) return "";
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  return clean.replace(/\s+/g, " ").trim();
}
