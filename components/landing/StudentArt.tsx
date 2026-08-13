/**
 * StudentArt — cohesive flat-illustration people in the UML brand palette.
 * One visual language across the whole page so every section fits together.
 * No external images required.
 *
 * variants:
 *   "hero"    – standing student holding a tablet (right side of hero)
 *   "reading" – student with headphones holding an open book (About)
 *   "laptop"  – student sitting cross-legged with a laptop (How it works)
 *   "avatar"  – head-and-shoulders portrait (instructors / testimonial)
 */

type Variant = "hero" | "reading" | "laptop" | "avatar";

type Skin = "light" | "medium" | "tan" | "deep";
type Top = "orange" | "teal" | "blue" | "yellow";

const SKIN: Record<Skin, { base: string; shadow: string }> = {
  light: { base: "#f4c9a0", shadow: "#e6ad82" },
  medium: { base: "#e8b48a", shadow: "#d99a6b" },
  tan: { base: "#d89e73", shadow: "#c4855a" },
  deep: { base: "#a9744e", shadow: "#8f5e3d" },
};

const TOP: Record<Top, { base: string; shadow: string }> = {
  orange: { base: "#f47a3e", shadow: "#e15f2a" },
  teal: { base: "#2fb9a3", shadow: "#1f9d89" },
  blue: { base: "#3a5bd0", shadow: "#2c47ad" },
  yellow: { base: "#f0b52e", shadow: "#d99a17" },
};

const HAIR: Record<string, string> = {
  dark: "#2e2a28",
  brown: "#5a3b28",
  black: "#211d1c",
};

export default function StudentArt({
  variant,
  skin = "medium",
  top = "orange",
  hair = "dark",
  className = "",
}: {
  variant: Variant;
  skin?: Skin;
  top?: Top;
  hair?: keyof typeof HAIR;
  className?: string;
}) {
  const s = SKIN[skin];
  const t = TOP[top];
  const h = HAIR[hair];

  if (variant === "hero") {
    return (
      <svg viewBox="0 0 320 420" className={className} aria-hidden>
        {/* legs / jeans */}
        <path d="M116 300 h88 v96 a10 10 0 0 1-10 10 h-26 l-6-70-6 70h-24a10 10 0 0 1-10-10z" fill="#3a4a6b" />
        <rect x="120" y="392" width="34" height="14" rx="5" fill="#e9edf5" />
        <rect x="168" y="392" width="34" height="14" rx="5" fill="#e9edf5" />
        {/* torso / sweater */}
        <path d="M104 196 q56-24 112 0 l10 92 q-66 22-132 0z" fill={t.base} />
        <path d="M104 196 q56-24 112 0 l4 34 q-60 20-120 0z" fill={t.shadow} opacity="0.35" />
        {/* left arm holding tablet */}
        <path d="M110 206 q-26 30-18 74 q4 16 22 14 l14-6-6-30-8 6-4-58z" fill={t.base} />
        {/* right arm across */}
        <path d="M212 206 q28 26 20 62 q-4 14-22 14l-56-2v-24l50 2 4-10-14-34z" fill={t.shadow} />
        {/* hands */}
        <circle cx="126" cy="286" r="11" fill={s.base} />
        <circle cx="156" cy="292" r="11" fill={s.base} />
        {/* tablet */}
        <rect x="120" y="250" width="86" height="60" rx="8" fill="#eef3ff" transform="rotate(-8 163 280)" />
        <rect x="130" y="260" width="66" height="8" rx="4" fill={t.base} transform="rotate(-8 163 280)" />
        <rect x="130" y="274" width="52" height="6" rx="3" fill="#c7d2ea" transform="rotate(-8 163 280)" />
        <rect x="130" y="286" width="40" height="6" rx="3" fill="#c7d2ea" transform="rotate(-8 163 280)" />
        {/* neck */}
        <rect x="150" y="150" width="20" height="46" rx="9" fill={s.shadow} />
        {/* head */}
        <circle cx="160" cy="120" r="46" fill={s.base} />
        <path d="M160 166a46 46 0 0 0 30-11 46 46 0 0 1-60 0 46 46 0 0 0 30 11z" fill={s.shadow} opacity="0.4" />
        {/* hair */}
        <path d="M114 122q-6-52 46-54t46 54q-6-30-46-30t-46 30z" fill={h} />
        <path d="M112 120q2-16 10-24-2 26 6 40l-12 4z" fill={h} />
        {/* ears */}
        <circle cx="115" cy="122" r="7" fill={s.base} />
        <circle cx="205" cy="122" r="7" fill={s.base} />
        {/* face */}
        <circle cx="145" cy="120" r="4" fill="#2e2a28" />
        <circle cx="177" cy="120" r="4" fill="#2e2a28" />
        <path d="M150 138q10 8 20 0" fill="none" stroke="#b5623c" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="138" cy="132" rx="6" ry="4" fill="#f0a" opacity="0.12" />
        <ellipse cx="184" cy="132" rx="6" ry="4" fill="#f0a" opacity="0.12" />
      </svg>
    );
  }

  if (variant === "reading") {
    return (
      <svg viewBox="0 0 320 400" className={className} aria-hidden>
        {/* torso */}
        <path d="M96 190 q64-26 128 0 l14 150 q-78 26-156 0z" fill={t.base} />
        <path d="M96 190 q64-26 128 0 l5 40 q-68 22-138 0z" fill={t.shadow} opacity="0.35" />
        {/* arms holding open book */}
        <path d="M100 200 q-22 44-6 90 l30 10 6-28-20-8q-6-32 6-56z" fill={t.base} />
        <path d="M220 200 q22 44 6 90l-30 10-6-28 20-8q6-32-6-56z" fill={t.shadow} />
        <circle cx="126" cy="298" r="12" fill={s.base} />
        <circle cx="194" cy="298" r="12" fill={s.base} />
        {/* open book */}
        <path d="M118 286 l42-10 42 10-2 40-40-8-40 8z" fill="#ffffff" stroke="#dfe6f2" strokeWidth="2" />
        <path d="M160 276 v56" stroke="#c7d2ea" strokeWidth="3" />
        <path d="M128 296h24M128 306h22M172 296h24M172 306h22" stroke="#e35b8f" strokeWidth="3" strokeLinecap="round" />
        {/* neck + head */}
        <rect x="150" y="146" width="20" height="46" rx="9" fill={s.shadow} />
        <circle cx="160" cy="116" r="46" fill={s.base} />
        <path d="M114 118q-6-52 46-54t46 54q-6-30-46-30t-46 30z" fill={h} />
        {/* headphones */}
        <path d="M112 118a48 48 0 0 1 96 0" fill="none" stroke={TOP.teal.base} strokeWidth="8" strokeLinecap="round" />
        <rect x="104" y="112" width="18" height="30" rx="9" fill={TOP.teal.base} />
        <rect x="198" y="112" width="18" height="30" rx="9" fill={TOP.teal.shadow} />
        {/* face */}
        <circle cx="146" cy="118" r="4" fill="#2e2a28" />
        <circle cx="176" cy="118" r="4" fill="#2e2a28" />
        <path d="M150 134q10 7 20 0" fill="none" stroke="#b5623c" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "laptop") {
    return (
      <svg viewBox="0 0 340 340" className={className} aria-hidden>
        {/* crossed legs */}
        <path d="M60 250 q40-28 110-28t110 28q10 40-40 46H100q-50-6-40-46z" fill="#39496a" />
        <path d="M96 252 q74-18 148 0-8 24-74 24t-74-24z" fill="#2f3c58" opacity="0.6" />
        {/* shoes */}
        <ellipse cx="96" cy="288" rx="20" ry="12" fill="#f1f4f9" />
        <ellipse cx="244" cy="288" rx="20" ry="12" fill="#f1f4f9" />
        {/* torso */}
        <path d="M108 150 q62-24 124 0l10 92q-72 22-144 0z" fill={t.base} />
        <path d="M108 150 q62-24 124 0l4 34q-64 20-132 0z" fill={t.shadow} opacity="0.35" />
        {/* arms pointing */}
        <path d="M112 158 q-34 20-40 54 6 12 20 8l26-16-8-20-10 6q6-20 20-30z" fill={t.base} />
        <circle cx="94" cy="214" r="11" fill={s.base} />
        {/* laptop on lap */}
        <rect x="120" y="236" width="100" height="20" rx="4" fill="#dbe2ef" />
        <rect x="128" y="196" width="84" height="44" rx="5" fill="#eef3ff" stroke="#cdd8ec" strokeWidth="2" />
        <rect x="128" y="196" width="84" height="44" rx="5" fill="#fff" opacity="0.15" />
        <circle cx="170" cy="218" r="8" fill={TOP.teal.base} opacity="0.7" />
        {/* neck + head */}
        <rect x="160" y="108" width="20" height="46" rx="9" fill={s.shadow} />
        <circle cx="170" cy="78" r="44" fill={s.base} />
        {/* curly hair */}
        <path d="M126 80q-4-46 44-48t44 48q4-18-8-30 6 14-2 22 8-20-8-32 4 14-6 22 6-22-14-30 6 16-4 24-2-20-16-24 2 16-8 22 0-16-16-14 12 8 8 24-6-10-14-6q10 6 8 22z" fill={h} />
        {/* glasses */}
        <circle cx="156" cy="80" r="12" fill="none" stroke="#2e2a28" strokeWidth="3" />
        <circle cx="186" cy="80" r="12" fill="none" stroke="#2e2a28" strokeWidth="3" />
        <path d="M168 80h6" stroke="#2e2a28" strokeWidth="3" />
        <circle cx="156" cy="80" r="3" fill="#2e2a28" />
        <circle cx="186" cy="80" r="3" fill="#2e2a28" />
        <path d="M160 96q10 7 20 0" fill="none" stroke="#b5623c" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  // avatar (portrait)
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {/* shoulders */}
      <path d="M28 200 q10-58 72-58t72 58z" fill={t.base} />
      <path d="M28 200 q10-58 72-58 t72 58 h-20 q-8-40-52-40t-52 40z" fill={t.shadow} opacity="0.4" />
      {/* collar */}
      <path d="M84 150 l16 14 16-14-6-10h-20z" fill="#ffffff" opacity="0.9" />
      {/* neck */}
      <rect x="90" y="118" width="20" height="34" rx="9" fill={s.shadow} />
      {/* head */}
      <circle cx="100" cy="90" r="40" fill={s.base} />
      <path d="M60 92q-4-46 40-48t40 48q-6-26-40-26t-40 26z" fill={h} />
      {/* ears */}
      <circle cx="61" cy="92" r="6" fill={s.base} />
      <circle cx="139" cy="92" r="6" fill={s.base} />
      {/* face */}
      <circle cx="86" cy="90" r="3.5" fill="#2e2a28" />
      <circle cx="114" cy="90" r="3.5" fill="#2e2a28" />
      <path d="M90 106q10 7 20 0" fill="none" stroke="#b5623c" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="80" cy="101" rx="5" ry="3" fill="#f0a" opacity="0.12" />
      <ellipse cx="120" cy="101" rx="5" ry="3" fill="#f0a" opacity="0.12" />
    </svg>
  );
}
