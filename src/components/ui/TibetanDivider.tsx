/**
 * Decorative Tibetan-inspired section dividers.
 *
 * "cloud"  — Tibetan cloud scrollwork motif
 * "knot"   — Simplified Endless Knot motif
 * "simple" — Elegant line with diamond centre
 */

type Variant = "cloud" | "knot" | "simple";

export function TibetanDivider({ variant = "cloud" }: { variant?: Variant }) {
  return (
    <div className="tibetan-divider" aria-hidden="true">
      {variant === "cloud" && <CloudMotif />}
      {variant === "knot" && <KnotMotif />}
      {variant === "simple" && <DiamondMotif />}
    </div>
  );
}

/* -----------------------------------------------------------
   Tibetan Cloud Scroll
   ----------------------------------------------------------- */
function CloudMotif() {
  return (
    <svg
      width="80"
      height="24"
      viewBox="0 0 80 24"
      fill="none"
      className="text-accent/40 shrink-0"
    >
      <path
        d="M4 16c4-8 8-8 12 0s8 8 12 0 8-8 12 0 8 8 12 0 8-8 12 0 8 8 12 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 12c4-6 8-6 12 0s8 6 12 0 8-6 12 0 8 6 12 0 8-6 12 0 8 6 12 0"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/* -----------------------------------------------------------
   Simplified Endless Knot
   ----------------------------------------------------------- */
function KnotMotif() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="text-accent/50 shrink-0"
    >
      {/* Two interlaced rounded loops on the diagonals */}
      <rect
        x="22"
        y="4.5"
        width="17.7"
        height="17.7"
        rx="6"
        transform="rotate(45 22 4.5)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="22"
        y="11.5"
        width="7.8"
        height="7.8"
        rx="2.5"
        transform="rotate(45 22 11.5)"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.6"
      />
      {/* Weave dots at the crossings */}
      <circle cx="22" cy="8" r="1.2" fill="currentColor" opacity="0.7" />
      <circle cx="22" cy="36" r="1.2" fill="currentColor" opacity="0.7" />
      <circle cx="8" cy="22" r="1.2" fill="currentColor" opacity="0.7" />
      <circle cx="36" cy="22" r="1.2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/* -----------------------------------------------------------
   Diamond centre — simple elegant variant
   ----------------------------------------------------------- */
function DiamondMotif() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="text-accent/40 shrink-0"
    >
      <rect
        x="10"
        y="2"
        width="11.3"
        height="11.3"
        rx="1.5"
        transform="rotate(45 10 2)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="10"
        y="5"
        width="7"
        height="7"
        rx="0.5"
        transform="rotate(45 10 5)"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
}
