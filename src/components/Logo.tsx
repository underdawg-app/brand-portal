"use client";

import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

/**
 * The real Underdawg wordmark — bundled from the app (src/objects/brand-wordmark-*.png),
 * same lockup the app uses in the Explore header. Ships in black + white variants
 * (the brand name is baked into the image in the brand font), so we pick by theme —
 * no separate text, no CSS invert.
 *
 * `mark` swaps the wide wordmark for the squarer stacked lockup (tight spots).
 * `variant` forces black/white when the background is fixed (e.g. a dark panel).
 */
export function Logo({
  height = 30,
  mark = false,
  variant = "auto",
  className,
}: {
  height?: number;
  mark?: boolean;
  variant?: "auto" | "black" | "white";
  className?: string;
}) {
  const theme = useStore((s) => s.theme);
  const tone =
    variant === "auto" ? (theme === "dark" ? "white" : "black") : variant;
  const kind = mark ? "brand-mark" : "brand-wordmark";
  const ratio = mark ? 1041 / 343 : 1370 / 292;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/${kind}-${tone}.png`}
      alt="Underdawg"
      className={cn("select-none", className)}
      style={{ height, width: height * ratio }}
    />
  );
}
