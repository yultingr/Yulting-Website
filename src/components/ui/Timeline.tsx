import React from "react";

export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-8">
      {/* Vertical line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
      <div className="space-y-8">{children}</div>
    </div>
  );
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
    <div className="relative pl-10">
      {/* Dot on the line */}
      <div className="absolute left-[9px] top-1.5 h-3 w-3 rounded-full border-2 border-foreground/30 bg-background" />
      {/* Year badge */}
      {year && (
        <span className="mb-2 inline-block rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground">
          {year}
        </span>
      )}
      {/* Card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}
