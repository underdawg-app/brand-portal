"use client";

import { cn } from "@/lib/cn";

/**
 * Infinite horizontal marquee. Duplicates its children so the loop is seamless.
 * `reverse` scrolls right-to-left; `speed` is the seconds per loop.
 */
export function Marquee({
  children,
  speed = 28,
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative flex w-full overflow-hidden", className)}>
      <div
        className="flex shrink-0 items-center"
        style={{
          animation: `ud-marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
