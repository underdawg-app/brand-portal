"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, inputClass, Label } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useStore } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const setWorkspace = useStore((s) => s.setWorkspace);
  const [accountType, setAccountType] = useState<"brand" | "agency">("brand");
  const [agencyMode, setAgencyMode] = useState<"MANAGEMENT" | "MARKETING">("MANAGEMENT");
  const enter = () => { setWorkspace(accountType, accountType === "agency" ? agencyMode : undefined); router.push("/dashboard"); };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">
      <header className="flex items-center justify-between p-6">
        <Logo height={26} />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <Label className="text-brand">Get connected</Label>
          <h1 className="hero mt-1 text-4xl text-text">Request access</h1>
          <p className="mt-2 text-sm text-textMuted">
            Brands and agencies are verified (KYC) before they can view creator contact/rates and run campaigns.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {(["brand", "agency"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setAccountType(t)}
                className={`label rounded-lg border px-3 py-2.5 capitalize transition-colors ${
                  accountType === t ? "border-brand bg-brand/10 text-brand" : "border-hairline text-textMuted hover:text-text"
                }`}
              >
                {t === "brand" ? "Brand" : "Agency"}
              </button>
            ))}
          </div>

          {accountType === "agency" && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["MANAGEMENT", "MARKETING"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setAgencyMode(m)}
                  className={`label rounded-lg border px-3 py-2 transition-colors ${agencyMode === m ? "border-brand bg-brand/10 text-brand" : "border-hairline text-textMuted hover:text-text"}`}
                >
                  {m === "MANAGEMENT" ? "Manage talent" : "Run campaigns"}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); enter(); }}
            className="mt-5 space-y-4"
          >
            <Field label="Company name"><input className={inputClass} placeholder="e.g. Copperleaf" /></Field>
            <Field label="Work email"><input type="email" className={inputClass} placeholder="you@company.com" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="GSTIN / PAN"><input className={inputClass} placeholder="29ABCDE1234F1Z5" /></Field>
              <Field label="Website"><input className={inputClass} placeholder="company.com" /></Field>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-hairline bg-surfaceMuted/30 p-3 text-xs text-textMuted">
              <ShieldCheck size={16} className="text-brand" /> Verification unlocks contact/rates, job posting and Get Viral.
            </div>
            <Button type="submit" size="lg" className="w-full">Create workspace <ArrowRight size={16} /></Button>
          </form>

          <p className="mt-6 text-center text-sm text-textMuted">
            Already have an account? <Link href="/login" className="text-brand hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
