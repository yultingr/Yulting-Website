import React from "react";

/**
 * A chronology set like the back matter of a biography: years in
 * small caps in the margin, entries separated by hairline rules.
 */
export function Timeline({ children }: { children: React.ReactNode }) {
  return <div className="mt-8 border-t border-border">{children}</div>;
}

interface TimelineItemProps {
  year?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function TimelineItem({
  year,
  title,
  subtitle,
  children,
}: TimelineItemProps) {
  return (
    <div className="grid gap-2 border-b border-border py-6 sm:grid-cols-[6rem_1fr] sm:gap-6">
      <div>
        {year && (
          <span className="font-serif small-caps text-base text-accent">
            {year}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-serif text-lg text-foreground">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}
