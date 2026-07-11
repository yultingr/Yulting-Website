"use client";

import { useEffect, useRef, useState } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Scroll-reveal that is visible by default: server HTML and anything already
 * in the viewport render immediately. Only content still below the fold when
 * JS runs is hidden and revealed on scroll, so a failed hydration or disabled
 * JS never leaves the page blank.
 */
export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Only animate elements the user hasn't seen yet
    if (el.getBoundingClientRect().top < window.innerHeight - 40) {
      return;
    }

    setHidden(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setHidden(false), delay);
          } else {
            setHidden(false);
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        hidden ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
