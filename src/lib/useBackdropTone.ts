"use client";

import { useEffect, useState } from "react";

// Adaptive-header helper: figures out whether the background sitting *behind* a
// fixed/sticky bar is dark or light, by sampling the real painted element just
// below the bar and measuring its luminance. Works on any page with no tagging —
// dark hero bands report "dark", bone sections report "light".

function parseRGB(s: string): [number, number, number, number] | null {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[,/]/).map((x) => parseFloat(x.trim()));
  return [p[0], p[1], p[2], isNaN(p[3]) ? 1 : p[3]];
}

function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function useBackdropTone(offset = 72): "dark" | "light" {
  // Marketing pages all open on a dark hero, so "dark" is the right first paint.
  const [tone, setTone] = useState<"dark" | "light">("dark");

  useEffect(() => {
    let raf = 0;
    const sample = () => {
      raf = 0;
      const x = Math.round(window.innerWidth / 2);
      let el = document.elementFromPoint(x, offset) as HTMLElement | null;
      while (el) {
        const c = parseRGB(getComputedStyle(el).backgroundColor);
        if (c && c[3] > 0.1) {
          setTone(luminance(c[0], c[1], c[2]) < 0.5 ? "dark" : "light");
          return;
        }
        el = el.parentElement;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sample);
    };
    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [offset]);

  return tone;
}
