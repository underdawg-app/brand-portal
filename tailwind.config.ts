import type { Config } from "tailwindcss";

/**
 * Underdawg Brand & Agency Portal — design tokens.
 * Mirrors the creator app's `src/theme/colors.ts` so the two read as one product.
 * Raw palette = constant hex. Semantic tokens (surface/text/hairline) flip
 * light/dark via CSS variables defined in globals.css.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- raw palette (constant across themes) ----
        ink: "#0A0A0A",
        inkSoft: "#141414",
        inkMuted: "#1E1E1E",
        bone: "#F2EFE6",
        boneSoft: "#E7E2D4",
        boneMuted: "#E0DCCC",
        paper: "#FFFFFF",
        acid: "#9CA3AF", // app primary
        blush: "#FF6BB5",
        ember: "#FF5A1F", // warning / destructive
        mute: "#9C988A",
        // ---- brand accent, theme-aware: white in dark, #8B0F0E in light ----
        brand: "rgb(var(--brand-rgb) / <alpha-value>)",
        brandFg: "var(--brand-fg)", // contrasting text on a brand-filled surface
        // ---- semantic, role-aware (CSS vars) ----
        surface: "var(--surface)",
        surfaceSoft: "var(--surface-soft)",
        surfaceMuted: "var(--surface-muted)",
        surfaceElevated: "var(--surface-elevated)",
        text: "var(--text)",
        textSoft: "var(--text-soft)",
        textMuted: "var(--text-muted)",
        hairline: "var(--hairline)",
        hairlineStrong: "var(--hairline-strong)",
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"], // stacked hero
        heavy: ["var(--font-cabinet)", "var(--font-space)", "sans-serif"], // black/extrabold heads
        body: ["var(--font-space)", "ui-sans-serif", "sans-serif"], // body + data
      },
      letterSpacing: {
        tightest: "-0.04em", // hero negative tracking
        label: "0.12em", // uppercase wide-tracked labels
      },
      fontSize: {
        base: ["14px", "1.45"], // 14px body base, modular scale ~1.25
      },
      borderColor: {
        DEFAULT: "var(--hairline)",
      },
    },
  },
  plugins: [],
};
export default config;
