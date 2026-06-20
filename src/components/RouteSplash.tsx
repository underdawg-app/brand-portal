"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Splash } from "@/components/Splash";

/**
 * Plays the liquid logo splash on first load and on every route change. When the
 * splash finishes it fades the overlay out (rather than cutting), then unmounts —
 * so the hand-off to the page is smooth, not a flash.
 */
export function RouteSplash() {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [exiting, setExiting] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    // The initial mount already starts visible; only re-trigger on navigation.
    if (first.current) {
      first.current = false;
      return;
    }
    setExiting(false);
    setShow(true);
  }, [pathname]);

  if (!show) return null;

  const finish = () => {
    setExiting(true);
    setTimeout(() => setShow(false), 360);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-surface transition-opacity duration-300 ${exiting ? "opacity-0" : "opacity-100"}`}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      <Splash onDone={finish} />
    </div>
  );
}
