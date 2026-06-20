"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LOGO_D, LOGO_VIEW_W, LOGO_VIEW_H } from "@/lib/brandPath";

/**
 * The mobile-app splash, rebuilt for the web: a liquid wordmark that morphs through
 * a sequence of phrases (set in Inter) and resolves on the Underdawg logo. Each
 * frame is rendered through the SVG "goo" (a Gaussian blur + alpha threshold). The
 * blur eases up to a molten-blob state — never fully blank — and back, swapping the
 * phrase at the blob peak so one melts into the next.
 *
 * The final frame (the logo) is special: it forms once and then holds, crisp and
 * still — it does not dissolve again or loop.
 */
export type Frame = { text: string } | { logo: true };

const PULSE_MS = 1150; // one blob → phrase → blob (slow + smooth)
const BLUR_MIN = 0.5; // crisp
// Dissolve fully at the swap so differing phrase widths never read as a left/right
// shift — each word/logo goos in from blank and back out, always centered.
const BLUR_MAX = 100;
const VIEW_H = 400;

export function SequenceSplash({
  frames,
  className,
  font = "var(--font-inter), system-ui, sans-serif",
  fontWeight = 800,
}: {
  frames: Frame[];
  className?: string;
  font?: string;
  fontWeight?: number;
}) {
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const [idx, setIdx] = useState(0);
  const last = frames.length - 1;

  useEffect(() => {
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start;
      const frame = Math.min(Math.floor(t / PULSE_MS), last);
      const tl = t - frame * PULSE_MS; // time within this frame
      // Words pulse blob↔phrase↔blob. The last frame forms once over the first
      // half-pulse, then holds crisp (no dissolve, no loop).
      const liquidity =
        frame >= last
          ? 0.5 + 0.5 * Math.cos(Math.PI * Math.min(tl / (PULSE_MS / 2), 1))
          : 0.5 + 0.5 * Math.cos((2 * Math.PI * tl) / PULSE_MS);
      blurRef.current?.setAttribute("stdDeviation", String(BLUR_MIN + (BLUR_MAX - BLUR_MIN) * liquidity));
      setIdx((cur) => (cur === frame ? cur : frame));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [last]);

  const frame = frames[idx];

  return (
    <div className={cn("flex w-full items-center justify-center", className)}>
      <svg
        viewBox={`0 0 ${LOGO_VIEW_W} ${VIEW_H}`}
        className="w-[min(56vw,360px)]"
        aria-label="Underdawg"
        role="img"
      >
        <defs>
          <filter id="ud-seq-goo" x="-100%" y="-300%" width="300%" height="700%">
            <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation={BLUR_MAX} result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" />
          </filter>
        </defs>
        <g filter="url(#ud-seq-goo)">
          {"logo" in frame ? (
            <g transform={`translate(0, ${(VIEW_H - LOGO_VIEW_H) / 2})`}>
              <path d={LOGO_D} fill="var(--text)" />
            </g>
          ) : (
            <text
              x={LOGO_VIEW_W / 2}
              y={VIEW_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--text)"
              style={{ fontFamily: font, fontWeight, fontSize: 190 }}
            >
              {frame.text}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
