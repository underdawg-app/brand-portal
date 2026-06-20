"use client";

import Link from "next/link";
import { ShieldAlert, Clock } from "lucide-react";
import { useStore } from "@/lib/store";

/** Persistent banner shown while a brand isn't verified (§3.4 / 6.1). */
export function VerificationBanner() {
  const status = useStore((s) => s.brand.verificationStatus);
  const accountType = useStore((s) => s.accountType);
  if (accountType !== "brand" || status === "VERIFIED") return null;

  if (status === "PENDING") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-hairlineStrong bg-surfaceMuted/50 px-4 py-3 text-sm">
        <Clock size={16} className="text-textMuted" />
        <span className="flex-1 text-text">Verification is under review. Posting jobs, campaigns and restricted creator info unlock once approved.</span>
        <Link href="/settings/verification" className="label text-brand hover:underline">View status</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-hairlineStrong bg-surfaceMuted/50 px-4 py-3 text-sm">
      <ShieldAlert size={16} className="text-brand" />
      <span className="flex-1 text-text">
        You&apos;re not verified yet. Verify your business to post jobs, run Get Viral, and view creator contact &amp; rates.
      </span>
      <Link href="/settings/verification" className="label text-brand hover:underline">Get verified →</Link>
    </div>
  );
}
