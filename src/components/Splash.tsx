"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { LOGO_D, LOGO_VIEW_W, LOGO_VIEW_H } from "@/lib/brandPath";

/**
 * The Underdawg splash — the wordmark as a liquid. A Gaussian blur fed through an
 * alpha threshold (the classic SVG "goo") lets the mark spread past the threshold
 * into nothing and then re-coalesce into the crisp logo — blank → logo, a few
 * times, settling on the logo.
 *
 * The blur magnitude rides one pure cosine (continuous, GPU-smooth — no shimmer,
 * no fade). To make each of the formations look different without any jump, the
 * blur *direction* changes per cycle (letters flow together horizontally, then
 * vertically, then evenly). The direction only swaps while the mark is fully blank
 * at the dissolve peak, so the change is invisible; the logo always resolves crisp
 * and identical. Fill is `var(--text)` → white on dark, ink on bone.
 */
const PULSE_MS = 820; // one blank → logo swing
const RESOLVES = 3; // how many times it settles into the logo
// [x, y] blur weights per cycle — different merge direction = different formation.
// Both axes stay ≥ 1.0 so the *smaller* axis at the peak is still BLUR_MAX, big
// enough that no residual band/line survives the threshold (truly blank).
const DIRS: [number, number][] = [[1.45, 1.0], [1.0, 1.45], [1.22, 1.22]];
const MORPH_MS = PULSE_MS * (RESOLVES - 0.5); // ends on a "logo" beat
const HOLD_MS = 380; // crisp logo holds before the overlay leaves
const BLUR_MIN = 0.5; // crisp logo
const BLUR_MAX = 100; // fully dissolved in both axes — nothing left on screen

export function Splash({
  onDone,
  visibleMs = MORPH_MS + HOLD_MS,
  className,
}: {
  onDone?: () => void;
  visibleMs?: number;
  className?: string;
}) {
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);

  useEffect(() => {
    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start;
      const cycle = Math.min(Math.floor(t / PULSE_MS), RESOLVES - 1);
      const [rx, ry] = DIRS[cycle];
      // 1 = dissolved/blank, 0 = logo. Starts blank; resolves every half-period;
      // freezes on the logo after the last resolve. Pure cosine → continuous.
      // At liquidity 0 both axes = BLUR_MIN, so the logo is always identical/crisp;
      // direction only shapes the dissolve/reform.
      const liquidity = t >= MORPH_MS ? 0 : 0.5 + 0.5 * Math.cos((2 * Math.PI * t) / PULSE_MS);
      const sx = BLUR_MIN + (BLUR_MAX * rx - BLUR_MIN) * liquidity;
      const sy = BLUR_MIN + (BLUR_MAX * ry - BLUR_MIN) * liquidity;
      blurRef.current?.setAttribute("stdDeviation", `${sx} ${sy}`);
      if (t < MORPH_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const done = onDone ? setTimeout(onDone, visibleMs) : undefined;
    return () => {
      cancelAnimationFrame(raf);
      if (done) clearTimeout(done);
    };
  }, [onDone, visibleMs]);

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center overflow-hidden bg-surface",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${LOGO_VIEW_W} ${LOGO_VIEW_H}`}
        className="w-[min(44vw,280px)]"
        aria-label="Underdawg"
        role="img"
      >
        <defs>
          {/* generous region so the wide blur never clips */}
          <filter id="ud-goo" x="-100%" y="-300%" width="300%" height="700%">
            <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation={BLUR_MAX} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            />
          </filter>
        </defs>
        <g filter="url(#ud-goo)">
          <path d={LOGO_D} fill="var(--text)" />
        </g>
      </svg>
    </div>
  );
}
