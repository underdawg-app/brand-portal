import type { Currency } from "./types";

const SYMBOL: Record<Currency, string> = { INR: "₹", USD: "$" };

/** Currency-aware money formatting. Never render a bare number. */
export function formatMoney(amount: number, currency: Currency = "INR") {
  const sym = SYMBOL[currency];
  // Indian grouping for INR, western for USD.
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return `${sym}${amount.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
}

/** Compact follower / reach counts: 12400 -> 12.4K, 2_300_000 -> 2.3M. */
export function compact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${n}`;
}

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Brand-deal money math (spec §6): gross → 12% platform fee → net. */
export function dealMath(gross: number, platformFeePct = 12, gstPct = 18) {
  const platformFeeAmount = Math.round((gross * platformFeePct) / 100);
  const gstAmount = Math.round((platformFeeAmount * gstPct) / 100);
  const netToCreator = gross - platformFeeAmount;
  return { platformFeeAmount, gstAmount, netToCreator };
}
