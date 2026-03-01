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
      className="text-foreground/30 dark:text-foreground/40 shrink-0"
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
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      className="text-foreground/30 dark:text-foreground/40 shrink-0"
    >
      {/* Outer loops */}
      <path
        d="M10 8 L30 8 Q34 8 34 12 L34 28 Q34 32 30 32 L10 32 Q6 32 6 28 L6 12 Q6 8 10 8 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner cross weave */}
      <path
        d="M14 8 L14 32 M26 8 L26 32 M6 16 L34 16 M6 24 L34 24"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Interlocking corners */}
      <circle cx="14" cy="16" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="26" cy="16" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="14" cy="24" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="26" cy="24" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
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
      className="text-foreground/30 dark:text-foreground/40 shrink-0"
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
