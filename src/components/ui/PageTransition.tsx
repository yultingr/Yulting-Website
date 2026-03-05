"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      return;
    }

    // Start the transition on next frame to ensure initial state is painted
    requestAnimationFrame(() => {
      el.style.transition =
        "opacity 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <div
      ref={ref}
      style={{ opacity: 0, transform: "translateY(8px)" }}
    >
      {children}
    </div>
  );
}
