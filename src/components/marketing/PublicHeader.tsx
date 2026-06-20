"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { useBackdropTone } from "@/lib/useBackdropTone";

const NAV = [
  { href: "/for-brands", label: "For Brands" },
  { href: "/for-agencies", label: "For Agencies" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const tone = useBackdropTone(); // "dark" → over a dark band, "light" → over bone
  const dark = tone === "dark";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        dark ? "border-white/10 bg-ink" : "border-hairline bg-surface/70"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Underdawg home"><Logo height={24} variant={dark ? "white" : "black"} /></Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm transition-colors ${dark ? "text-bone/70 hover:text-bone" : "text-textMuted hover:text-text"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className={`text-sm transition-colors ${dark ? "text-bone hover:text-bone/70" : "text-text hover:opacity-70"}`}>Log in</Link>
          <Link href="/onboarding">
            <Button size="sm" className={dark ? "bg-bone text-ink hover:bg-bone/90" : ""}>Get started</Button>
          </Link>
        </div>

        <button className={`md:hidden ${dark ? "text-bone" : "text-text"}`} onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className={`border-t px-5 py-4 md:hidden ${dark ? "border-white/10 bg-ink" : "border-hairline bg-surface"}`}>
          <nav className="flex flex-col gap-3">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`text-sm ${dark ? "text-bone" : "text-text"}`}>{n.label}</Link>
            ))}
            <div className="mt-2 flex gap-3">
              <Link href="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Log in</Button></Link>
              <Link href="/onboarding" className="flex-1"><Button size="sm" className="w-full">Get started</Button></Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
