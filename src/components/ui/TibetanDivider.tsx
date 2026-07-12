/**
 * Decorative section divider built around the site's single mark:
 * a simplified endless knot. One mark, used consistently, reads
 * as identity.
 */

export function TibetanDivider() {
  return (
    <div className="tibetan-divider print:hidden" aria-hidden="true">
      <KnotSeal className="text-accent/50" size={36} />
    </div>
  );
}

/**
 * The endless-knot mark on its own — used as the divider centre,
 * as a seal at the end of writings, and (in saffron) as the favicon.
 */
export function KnotSeal({
  className = "text-accent/50",
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
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
