"use client";

import { Sun, Moon } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-hairline px-3 py-2 text-xs text-textMuted hover:bg-surfaceMuted hover:text-text",
        className,
      )}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="label">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
