/**
 * Response normalizers.
 *
 * The backend returns bare arrays on some routes and `{ data: ... }` /
 * `{ content: ... }` envelopes on others. Normalizing at the API boundary keeps
 * that inconsistency out of the components.
 *
 * These also matter for render stability: every mapper here returns a freshly
 * built value that RTK Query then caches, so `data` keeps a *stable reference*
 * between renders. Components can therefore put query data straight into
 * `useMemo`/`useEffect` dependency arrays without re-running every render.
 */

export type Dict = Record<string, unknown>;

const isObj = (v: unknown): v is Dict =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Pull the array of rows out of whichever shape the backend returned. */
export function toArray(payload: unknown): Dict[] {
  if (Array.isArray(payload)) return payload as Dict[];
  if (!isObj(payload)) return [];

  for (const key of ["content", "data", "items", "results", "records"]) {
    const v = payload[key];
    if (Array.isArray(v)) return v as Dict[];
    // Some routes nest one level deeper: { data: { content: [...] } }
    if (isObj(v)) {
      for (const inner of ["content", "items", "results"]) {
        if (Array.isArray(v[inner])) return v[inner] as Dict[];
      }
    }
  }
  return [];
}

/** Unwrap a single object out of a `{ data: {...} }` envelope. */
export function toObject(payload: unknown): Dict {
  if (!isObj(payload)) return {};
  const data = payload.data;
  if (isObj(data)) return data;
  return payload;
}

/** First present, non-empty value among the given keys. */
export function pick<T = string>(row: Dict, keys: string[], fallback: T): T {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && v !== "") return v as T;
  }
  return fallback;
}

export function pickNum(row: Dict, keys: string[], fallback = 0): number {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
      return Number(v);
    }
  }
  return fallback;
}

/** A string field, or null — never the empty string. */
export function str(row: Dict, key: string): string | null {
  return typeof row[key] === "string" && row[key] ? (row[key] as string) : null;
}

/** A number field, or null — `0` is preserved, unlike with `pickNum`. */
export function num(row: Dict, key: string): number | null {
  return typeof row[key] === "number" ? (row[key] as number) : null;
}
