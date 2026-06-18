"use client";

import { useStore } from "@/lib/store";

/**
 * Concrete brand color for contexts that can't use the `brand` Tailwind class
 * (e.g. recharts strokes, Avatar accent props). Strictly monochrome:
 * white in dark mode, black in light mode.
 */
export function useBrandColor() {
  const theme = useStore((s) => s.theme);
  return theme === "dark" ? "#FFFFFF" : "#0A0A0A";
}
