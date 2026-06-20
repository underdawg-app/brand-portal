"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Briefcase, Users, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Field, inputClass, Label } from "@/components/ui/primitives";
import { Logo } from "@/components/Logo";
import { GooeyTextSequence } from "@/components/ui/gooey-text-morphing";
import { GridBackdrop } from "@/components/GridBackdrop";

type Phase = "role" | "identity" | "welcome";

export default function Onboarding() {
  const router = useRouter();
  const setWorkspace = useStore((s) => s.setWorkspace);
  const setProfile = useStore((s) => s.setProfile);

  const [phase, setPhase] = useState<Phase>("role");
  const [account, setAccount] = useState<"brand" | "agency" | null>(null);
  const [agencyMode, setAgencyMode] = useState<"MANAGEMENT" | "MARKETING">("MANAGEMENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const chooseRole = (t: "brand" | "agency") => {
    setAccount(t);
    setWorkspace(t, t === "agency" ? agencyMode : undefined);
  };

  const continueToWelcome = () => {
    setProfile({
      companyName: name.trim(),
      email: email.trim(),
      website: website.trim(),
      firstName: name.trim().split(" ")[0],
    });
    setPhase("welcome");
  };

  // Fallback route in case nothing else fires.
  useEffect(() => {
    if (phase !== "welcome") return;
    const t = setTimeout(() => router.push("/home"), 7000);
    return () => clearTimeout(t);
  }, [phase, router]);

  if (phase === "welcome") {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-6 text-center text-text">
        {/* soft radial glow behind the mark */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.04] blur-3xl" />

        {/* gooey morph: lowercase words → the real logo, same effect throughout */}
        <GooeyTextSequence
          texts={["welcome", "discover", "get viral"]}
          logo={<Logo height={56} />}
          morphTime={0.9}
          holdTime={1.2}
          onComplete={() => router.push("/home")}
          className="relative h-[160px] w-full max-w-2xl"
        />

        <div className="relative mt-12 flex flex-col items-center gap-4">
          <div className="h-0.5 w-52 overflow-hidden rounded-full bg-surfaceMuted">
            <div className="h-full rounded-full bg-brand" style={{ animation: "ud-progress 3.8s cubic-bezier(0.4,0,0.2,1) forwards" }} />
          </div>
          <p className="label text-textMuted">Setting up {name.trim().split(" ")[0] ? `${name.trim().split(" ")[0]}'s` : "your"} workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface text-text">
      <GridBackdrop />
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface/70 p-5 backdrop-blur-md">
        <Logo height={24} />
        <button onClick={() => router.push("/login")} className="text-sm text-textMuted hover:text-text">
          Already a member? Log in
        </button>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-2xl rounded-3xl border border-hairline bg-surfaceElevated p-6 shadow-2xl sm:p-8 md:p-10">
          {/* 1 · Role */}
          {phase === "role" && (
            <>
              <h1 className="hero text-4xl text-text sm:text-5xl">Let&apos;s get you in.</h1>
              <p className="mt-2 text-sm text-textMuted">No long forms. Tell us who you are and you&apos;re through.</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {([
                  { r: "brand", icon: Briefcase, t: "I'm a Brand", d: "Hire creators for my own brand." },
                  { r: "agency", icon: Users, t: "I'm an Agency", d: "Represent talent or run campaigns." },
                ] as const).map(({ r, icon: Icon, t, d }) => (
                  <button
                    key={r}
                    onClick={() => chooseRole(r)}
                    className={`rounded-2xl border bg-surface p-6 text-left transition-colors ${
                      account === r ? "border-brand ring-1 ring-brand" : "border-hairline hover:border-hairlineStrong"
                    }`}
                  >
                    <Icon size={28} className="text-brand" />
                    <div className="mt-4 font-heavy text-lg text-text">{t}</div>
                    <p className="mt-1 text-sm text-textMuted">{d}</p>
                  </button>
                ))}
              </div>

              {account === "agency" && (
                <div className="mt-6">
                  <Label>How do you work?</Label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {([
                      { m: "MANAGEMENT", t: "Manage talent" },
                      { m: "MARKETING", t: "Run campaigns" },
                    ] as const).map(({ m, t }) => (
                      <button
                        key={m}
                        onClick={() => {
                          setAgencyMode(m);
                          setWorkspace("agency", m);
                        }}
                        className={`rounded-xl border bg-surface px-4 py-3 text-sm transition-colors ${
                          agencyMode === m ? "border-brand text-brand ring-1 ring-brand" : "border-hairline text-textMuted hover:text-text"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 flex items-center justify-between border-t border-hairline pt-5">
                <Button variant="ghost" onClick={() => router.push("/")}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button onClick={() => setPhase("identity")} disabled={!account}>
                  Continue <ArrowRight size={16} />
                </Button>
              </div>
            </>
          )}

          {/* 2 · Identity */}
          {phase === "identity" && (
            <>
              <h1 className="hero text-4xl text-text sm:text-5xl">
                {account === "agency" ? "Your agency" : "Your brand"}, in two fields.
              </h1>
              <p className="mt-2 text-sm text-textMuted">That&apos;s all we need to open your workspace.</p>

              <div className="mt-8 space-y-5">
                <Field label={account === "agency" ? "Agency name" : "Brand name"}>
                  <input
                    autoFocus
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={account === "agency" ? "Rise House" : "Copperleaf"}
                  />
                </Field>
                <Field label="Work email">
                  <input
                    className={inputClass}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                  />
                </Field>
                <Field label="Website (optional)">
                  <input className={inputClass} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="company.com" />
                </Field>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-hairline pt-5">
                <Button variant="ghost" onClick={() => setPhase("role")}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button size="lg" onClick={continueToWelcome} disabled={!name.trim() || !email.trim()}>
                  Enter workspace <Check size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
