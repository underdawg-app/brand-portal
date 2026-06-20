"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName,
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;
    let raf = 0;

    const setMorph = (fraction: number) => {
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
        fraction = 1 - fraction;
        text1Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text1Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      }
    };

    const doCooldown = () => {
      morph = 0;
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = "";
        text2Ref.current.style.opacity = "100%";
        text1Ref.current.style.filter = "";
        text1Ref.current.style.opacity = "0%";
      }
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;
      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }
      setMorph(fraction);
    };

    function animate() {
      raf = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;
      cooldown -= dt;
      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.textContent = texts[textIndex % texts.length];
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={cn("relative", className)}>
      <GooeyFilter />
      <div className="flex items-center justify-center" style={{ filter: "url(#threshold)" }}>
        <span ref={text1Ref} className={cn("absolute inline-block select-none text-center text-6xl md:text-[60pt]", "text-text", textClassName)} />
        <span ref={text2Ref} className={cn("absolute inline-block select-none text-center text-6xl md:text-[60pt]", "text-text", textClassName)} />
      </div>
    </div>
  );
}

/**
 * One-shot variant: morphs through `texts` in order, holds on the last one (use the
 * logo wordmark there), then calls `onComplete`. Same gooey blur+threshold technique.
 */
export function GooeyTextSequence({
  texts,
  morphTime = 0.9,
  holdTime = 1,
  font = "var(--font-anton), system-ui, sans-serif",
  onComplete,
  className,
  textClassName,
}: {
  texts: string[];
  morphTime?: number;
  holdTime?: number;
  font?: string;
  onComplete?: () => void;
  className?: string;
  textClassName?: string;
}) {
  const aRef = React.useRef<HTMLSpanElement>(null);
  const bRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    let raf = 0;
    let start = 0;
    let done = false;
    if (aRef.current) aRef.current.textContent = texts[0] ?? "";
    if (bRef.current) bRef.current.textContent = texts[1] ?? texts[0] ?? "";

    const frame = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000;
      const seg = Math.floor(elapsed / morphTime);

      if (seg >= texts.length - 1) {
        // hold crisp on the final frame (the logo wordmark)
        if (aRef.current && bRef.current) {
          bRef.current.textContent = texts[texts.length - 1];
          bRef.current.style.filter = "";
          bRef.current.style.opacity = "100%";
          aRef.current.style.opacity = "0%";
        }
        if (!done) {
          done = true;
          setTimeout(() => onComplete?.(), holdTime * 1000);
        }
        raf = requestAnimationFrame(frame);
        return;
      }

      const f = (elapsed - seg * morphTime) / morphTime; // 0..1
      const from = texts[seg];
      const to = texts[seg + 1];
      if (aRef.current && bRef.current) {
        if (aRef.current.textContent !== from) aRef.current.textContent = from;
        if (bRef.current.textContent !== to) bRef.current.textContent = to;
        bRef.current.style.filter = `blur(${Math.min(8 / f - 8, 100)}px)`;
        bRef.current.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
        const inv = 1 - f;
        aRef.current.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
        aRef.current.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [texts, morphTime, holdTime, onComplete]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <GooeyFilter />
      <div className="flex items-center justify-center" style={{ filter: "url(#threshold)" }}>
        <span ref={aRef} style={{ fontFamily: font }} className={cn("absolute inline-block select-none whitespace-nowrap text-center text-5xl text-text sm:text-6xl md:text-7xl", textClassName)} />
        <span ref={bRef} style={{ fontFamily: font }} className={cn("absolute inline-block select-none whitespace-nowrap text-center text-5xl text-text sm:text-6xl md:text-7xl", textClassName)} />
      </div>
    </div>
  );
}

function GooeyFilter() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="threshold">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 255 -140"
          />
        </filter>
      </defs>
    </svg>
  );
}
