"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { Currency } from "@/lib/types";
import type { Tone } from "@/lib/status";

// --------------------------------------------------------------------------
// Label — the signature uppercase wide-tracked text
// --------------------------------------------------------------------------
export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("label text-textMuted", className)}>{children}</span>;
}

// --------------------------------------------------------------------------
// Card / Section
// --------------------------------------------------------------------------
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-hairline bg-surfaceElevated", className)}>
      {children}
    </div>
  );
}

export function Section({
  title,
  action,
  className,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between">
          {title && <Label>{title}</Label>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

// --------------------------------------------------------------------------
// StatusBadge / Chip
// --------------------------------------------------------------------------
// Strictly monochrome — tones differ by fill vs outline vs invert, never by hue.
const toneClass: Record<Tone, string> = {
  neutral: "bg-surfaceMuted text-textMuted border-hairline",
  info: "bg-transparent text-text border-hairlineStrong",
  accent: "bg-brand text-brandFg border-transparent", // solid (strongest)
  success: "bg-surfaceMuted text-text border-hairlineStrong",
  warn: "bg-transparent text-text border-dashed border-hairlineStrong",
  danger: "bg-transparent text-text border-text",
};

export function StatusBadge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("label inline-flex items-center rounded-full border px-2.5 py-1", toneClass[tone])}>
      {children}
    </span>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "label rounded-full border px-3 py-1.5 transition-colors",
        active
          ? "border-brand bg-brand text-brandFg"
          : "border-hairline text-textMuted hover:border-hairlineStrong hover:text-text",
      )}
    >
      {children}
    </button>
  );
}

// --------------------------------------------------------------------------
// Money
// --------------------------------------------------------------------------
export function Money({
  amount,
  currency = "INR",
  className,
}: {
  amount: number;
  currency?: Currency;
  className?: string;
}) {
  return <span className={cn("tabular-nums font-medium", className)}>{formatMoney(amount, currency)}</span>;
}

// --------------------------------------------------------------------------
// Avatar — accent-tinted monogram fallback
// --------------------------------------------------------------------------
export function Avatar({
  name,
  src,
  accent = "#9CA3AF",
  size = 36,
}: {
  name: string;
  src?: string;
  accent?: string;
  size?: number;
}) {
  const initials = name.replace(/^@/, "").slice(0, 2).toUpperCase();
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div
      className="flex items-center justify-center rounded-full font-heavy text-ink"
      style={{ width: size, height: size, background: accent, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

// --------------------------------------------------------------------------
// ProgressBar
// --------------------------------------------------------------------------
export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surfaceMuted", className)}>
      <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

// --------------------------------------------------------------------------
// Stat
// --------------------------------------------------------------------------
export function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <Card className="p-4">
      <Label>{label}</Label>
      <div className="mt-2 font-heavy text-2xl text-text">{value}</div>
      {sub && <div className="mt-1 text-xs text-textMuted">{sub}</div>}
    </Card>
  );
}

// --------------------------------------------------------------------------
// EmptyState
// --------------------------------------------------------------------------
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hairline px-6 py-16 text-center">
      <div className="font-heavy text-lg text-text">{title}</div>
      {body && <p className="mt-2 max-w-sm text-sm text-textMuted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// --------------------------------------------------------------------------
// PageHeader — stacked hero type
// --------------------------------------------------------------------------
export function PageHeader({
  eyebrow,
  title,
  sub,
  action,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-5">
      <div>
        {eyebrow && <Label className="text-brand">{eyebrow}</Label>}
        <h1 className="hero mt-1 text-4xl text-text md:text-5xl">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-sm text-textMuted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// --------------------------------------------------------------------------
// Field — labelled form control wrapper
// --------------------------------------------------------------------------
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <span className="block text-xs text-textMuted">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-text placeholder:text-textMuted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";
