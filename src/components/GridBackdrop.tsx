"use client";

import { useEffect, useRef } from "react";

/**
 * Animated infinite grid backdrop with a cursor-reveal layer. A faint grid scrolls
 * forever; a brighter grid is masked to a soft radial spotlight that follows the
 * pointer, so the grid "lights up" on hover. Pure CSS + one rAF-free listener — no deps.
 */
export function GridBackdrop() {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      raf = 0;
      if (!pending) return;
      const m = `radial-gradient(280px circle at ${pending.x}px ${pending.y}px, #000 0%, transparent 70%)`;
      el.style.setProperty("-webkit-mask-image", m);
      el.style.setProperty("mask-image", m);
    };
    const onMove = (e: MouseEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* faint always-on grid */}
      <div className="ud-grid absolute inset-0 opacity-[0.05]" />

      {/* brighter grid revealed under the cursor */}
      <div
        ref={revealRef}
        className="ud-grid absolute inset-0 opacity-30"
        style={{
          maskImage: "radial-gradient(280px circle at 50% 0%, #000 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(280px circle at 50% 0%, #000 0%, transparent 70%)",
        }}
      />

      {/* soft on-brand glows */}
      <div className="absolute -right-[15%] -top-[15%] h-[45%] w-[45%] rounded-full bg-brand/[0.06] blur-[120px]" />
      <div className="absolute -bottom-[20%] -left-[12%] h-[45%] w-[45%] rounded-full bg-brand/[0.05] blur-[120px]" />
    </div>
  );
}
