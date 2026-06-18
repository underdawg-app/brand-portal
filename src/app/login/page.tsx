"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, inputClass, Label } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { Marquee } from "@/components/ui/Marquee";
import { useStore } from "@/lib/store";

const HERO_LINES = [
  "GET DISCOVERED",
  "GET CONNECTED",
  "GET PAID",
  "VERIFIED CREATORS",
  "ESCROW-BACKED DEALS",
];

export default function LoginPage() {
  const router = useRouter();
  const setWorkspace = useStore((s) => s.setWorkspace);
  const [email, setEmail] = useState("aarav@copperleaf.in");
  const [password, setPassword] = useState("••••••••");
  const [accountType, setAccountType] = useState<"brand" | "agency">("brand");
  const [agencyMode, setAgencyMode] = useState<"MANAGEMENT" | "MARKETING">("MANAGEMENT");

  const signIn = (e?: React.FormEvent) => {
    e?.preventDefault();
    // Demo auth — no backend. Enter the chosen workspace so brand vs agency differs.
    setWorkspace(accountType, accountType === "agency" ? agencyMode : undefined);
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4 text-text">
      {/* Marquee hero background — big stacked headlines scrolling, no partition */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 opacity-[0.07]">
        {HERO_LINES.map((line, i) => (
          <Marquee key={line} speed={26 + i * 5} reverse={i % 2 === 1}>
            <span className="hero whitespace-nowrap pr-8 text-[12vw] leading-none text-text">
              {Array.from({ length: 6 }).map((_, j) => (
                <span key={j} className="pr-8">{line} ·</span>
              ))}
            </span>
          </Marquee>
        ))}
      </div>
      {/* subtle vignette so the card pops */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--surface)_85%)]" />

      {/* top chrome */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-6">
        <Logo height={26} />
        <ThemeToggle />
      </div>

      {/* Centered login card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-hairline bg-surfaceElevated/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <Label className="text-brand">Welcome back</Label>
          <h1 className="hero mt-2 text-4xl text-text">Sign in</h1>
          <p className="mt-2 text-sm text-textMuted">Log in to your brand or agency workspace.</p>
        </div>

        {/* account type */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          {(["brand", "agency"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setAccountType(t)}
              className={`label rounded-lg border px-3 py-2.5 capitalize transition-colors ${
                accountType === t
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-hairline text-textMuted hover:text-text"
              }`}
            >
              {t === "brand" ? "I'm a Brand" : "I'm an Agency"}
            </button>
          ))}
        </div>

        {accountType === "agency" && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["MANAGEMENT", "MARKETING"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setAgencyMode(m)}
                className={`label rounded-lg border px-3 py-2 transition-colors ${
                  agencyMode === m ? "border-brand bg-brand/10 text-brand" : "border-hairline text-textMuted hover:text-text"
                }`}
              >
                {m === "MANAGEMENT" ? "Manage talent" : "Run campaigns"}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={signIn} className="mt-5 space-y-4">
          <Field label="Work email">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input type="email" className={`${inputClass} pl-9`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
          </Field>
          <Field label="Password">
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input type="password" className={`${inputClass} pl-9`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </Field>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-textMuted">
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <a href="#" className="text-brand hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" size="lg" className="w-full">Sign in <ArrowRight size={16} /></Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-textMuted">
          <div className="h-px flex-1 bg-hairline" />
          <span className="label">or</span>
          <div className="h-px flex-1 bg-hairline" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => signIn()}>Google</Button>
          <Button variant="outline" onClick={() => signIn()}>Apple</Button>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-sm text-textMuted">
          <BadgeCheck size={14} className="text-brand" /> New here?
          <Link href="/signup" className="text-brand hover:underline">Request brand access</Link>
        </p>
      </div>
    </div>
  );
}
