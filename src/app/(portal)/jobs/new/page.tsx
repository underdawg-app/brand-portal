"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Lightbulb } from "lucide-react";
import { useStore } from "@/lib/store";
import { useVerified } from "@/lib/gate";
import { PageHeader, Card, Label, Field, inputClass, Money } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
import type { JobType, PaymentStructure } from "@/lib/types";

// Upwork-style: three phases, with sub-steps inside (Flow 1 in the spec).
const PHASES = ["Brief", "Requirements", "Budget & terms"];
const STEPS = [
  { phase: 0, key: "start", title: "Start the brief", hint: "A clear title and a few lines on what you need." },
  { phase: 0, key: "type", title: "What kind of work is it?", hint: "Pick the engagement type." },
  { phase: 0, key: "medium", title: "Medium & niche", hint: "The craft and the space." },
  { phase: 1, key: "scope", title: "Scope & timeline", hint: "How big is it, and by when?" },
  { phase: 1, key: "requirements", title: "Creator requirements", hint: "Who's a fit — or judge purely on craft." },
  { phase: 1, key: "deliverables", title: "Deliverables", hint: "Exactly what gets delivered." },
  { phase: 2, key: "budget", title: "Budget", hint: "What you'll pay, and how." },
  { phase: 2, key: "terms", title: "Usage & terms", hint: "Rights, exclusivity, disclosure." },
  { phase: 2, key: "review", title: "Review & post", hint: "Check everything, then go live." },
];

const JOB_TYPES: JobType[] = [
  "Sponsored Post", "Story/Reel", "Video Integration", "Brand Ambassador",
  "Product Review", "Event Coverage", "UGC Creation", "Affiliate",
  "Account Takeover", "Get Viral Campaign", "Custom",
];
const MEDIA = ["Skincare", "Beauty", "Fashion", "Film", "Video", "Illustration", "Design", "Music", "Photo", "Food", "Multi-niche"];
const SCOPES = [
  { key: "one-off", label: "One-off", desc: "A single, well-defined deliverable" },
  { key: "short", label: "Short project", desc: "A few weeks of work" },
  { key: "ongoing", label: "Ongoing / retainer", desc: "Monthly ambassador-style" },
];

export default function NewJobWizard() {
  const router = useRouter();
  const addJob = useStore((s) => s.addJob);
  const publishJob = useStore((s) => s.publishJob);
  const toast = useStore((s) => s.toast);
  const verified = useVerified();

  const [step, setStep] = useState(0);
  const [posted, setPosted] = useState<string | null>(null);
  const [f, setF] = useState({
    title: "", description: "", type: "UGC Creation" as JobType, niche: "Skincare",
    scope: "one-off", timeline: "14 days", deadline: "2026-07-15",
    anyFollowers: false, minFollowers: 20000, location: "India", verifiedHuman: true, minReputation: 70,
    deliverables: "1 reel (≤60s), 3 UGC stills", revisions: 2,
    paymentStructure: "FLAT" as PaymentStructure, budgetMin: 30000, budgetMax: 60000,
    usageRights: "Organic, 90 days", exclusivity: "No competing brand, 30 days",
    ownership: "Creator retains, brand licensed",
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const canNext =
    cur.key !== "start" || (f.title.trim().length > 2 && f.description.trim().length > 10);

  const build = () => addJob({
    title: f.title || "Untitled brief", type: f.type, niche: f.niche, description: f.description,
    budgetMin: Number(f.budgetMin), budgetMax: Number(f.budgetMax), currency: "INR",
    paymentStructure: f.paymentStructure,
    requirements: { minFollowers: f.anyFollowers ? 0 : Number(f.minFollowers), niche: f.niche, location: f.location },
    deliverables: f.deliverables.split(",").map((d) => d.trim()).filter(Boolean),
    timeline: f.timeline, usageRights: f.usageRights, exclusivity: f.exclusivity,
    applicationDeadline: f.deadline, verified: true, status: "DRAFT", postedBy: "m_owner", brandDisplay: "Copperleaf",
  });

  const saveDraft = () => { const id = build(); toast("Draft saved.", "default"); router.push(`/jobs/${id}`); };
  const post = () => { const id = build(); publishJob(id); setPosted(id); };

  const marketHint = `Creators in ${f.niche} typically charge ${formatMoney(28000)}–${formatMoney(85000)} for this scope.`;

  return (
    <>
      <PageHeader eyebrow="Jobs · Post a job" title={cur.title} sub={cur.hint}
        action={<Button variant="ghost" onClick={() => router.push("/jobs")}>Save & exit</Button>} />

      {/* phase indicator (Upwork-style) */}
      <div className="flex items-center gap-3">
        {PHASES.map((p, i) => {
          const done = cur.phase > i;
          const active = cur.phase === i;
          return (
            <div key={p} className="flex flex-1 items-center gap-2">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${active ? "border-brand bg-brand text-brandFg" : done ? "border-brand bg-brand/10 text-brand" : "border-hairlineStrong text-textMuted"}`}>
                {done ? <Check size={12} /> : i + 1}
              </span>
              <span className={`label ${active ? "text-text" : "text-textMuted"}`}>{p}</span>
              {i < PHASES.length - 1 && <div className={`mx-1 h-px flex-1 ${done ? "bg-brand" : "bg-hairline"}`} />}
            </div>
          );
        })}
      </div>
      {/* sub-step progress */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-surfaceMuted">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <Card className="p-6">
        {cur.key === "start" && (
          <div className="space-y-4">
            <Field label="Job title"><input className={inputClass} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Summer Serum launch — UGC + Reels" /></Field>
            <Field label="Describe what you need" hint="Tone, must-haves, what 'great' looks like.">
              <textarea className={`${inputClass} min-h-32`} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="We're launching a Vitamin C serum and want honest, real-routine UGC — not scripted ads…" />
            </Field>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-hairlineStrong p-3 text-sm text-textMuted">
              <Lightbulb size={16} className="text-brand" /> Tip: the clearer the brief, the better your applicants.
            </div>
          </div>
        )}

        {cur.key === "type" && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {JOB_TYPES.map((t) => (
              <button key={t} onClick={() => set("type", t)} className={`rounded-xl border p-3 text-left text-sm transition-colors ${f.type === t ? "border-brand bg-brand/5 text-text" : "border-hairline text-textMuted hover:border-hairlineStrong hover:text-text"}`}>
                {t}{f.type === t && <Check size={14} className="float-right text-brand" />}
                {t === "Get Viral Campaign" && <div className="mt-1 text-[11px] text-textMuted">Coordinated multi-creator push</div>}
              </button>
            ))}
          </div>
        )}

        {cur.key === "medium" && (
          <div>
            <Label>Medium / niche</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {MEDIA.map((m) => (
                <button key={m} onClick={() => set("niche", m)} className={`label rounded-full border px-3 py-1.5 ${f.niche === m ? "border-brand bg-brand text-brandFg" : "border-hairline text-textMuted hover:text-text"}`}>{m}</button>
              ))}
            </div>
          </div>
        )}

        {cur.key === "scope" && (
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-3">
              {SCOPES.map((s) => (
                <button key={s.key} onClick={() => { set("scope", s.key); set("timeline", s.key === "ongoing" ? "3 months" : s.key === "short" ? "3–4 weeks" : "14 days"); }} className={`rounded-xl border p-3 text-left transition-colors ${f.scope === s.key ? "border-brand bg-brand/5" : "border-hairline hover:border-hairlineStrong"}`}>
                  <div className="text-sm font-medium text-text">{s.label}</div>
                  <div className="mt-1 text-xs text-textMuted">{s.desc}</div>
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Timeline"><input className={inputClass} value={f.timeline} onChange={(e) => set("timeline", e.target.value)} /></Field>
              <Field label="Application deadline"><input type="date" className={inputClass} value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></Field>
            </div>
          </div>
        )}

        {cur.key === "requirements" && (
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm text-text">
              <input type="checkbox" checked={f.anyFollowers} onChange={(e) => set("anyFollowers", e.target.checked)} />
              Any follower count — judge purely on craft (good for commissions)
            </label>
            {!f.anyFollowers && (
              <Field label="Minimum followers"><input type="number" className={inputClass} value={f.minFollowers} onChange={(e) => set("minFollowers", Number(e.target.value))} /></Field>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location / region"><input className={inputClass} value={f.location} onChange={(e) => set("location", e.target.value)} /></Field>
              <Field label="Min reputation"><input type="number" className={inputClass} value={f.minReputation} onChange={(e) => set("minReputation", Number(e.target.value))} /></Field>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-hairline bg-surfaceMuted/40 p-3 text-sm text-text">
              <input type="checkbox" checked={f.verifiedHuman} onChange={(e) => set("verifiedHuman", e.target.checked)} />
              <ShieldCheck size={16} className="text-brand" /> Verified-Human required (no bots / AI accounts)
            </label>
          </div>
        )}

        {cur.key === "deliverables" && (
          <div className="space-y-4">
            <Field label="Deliverables (comma-separated)" hint="e.g. 1 reel, 3 UGC stills, 1 story set">
              <input className={inputClass} value={f.deliverables} onChange={(e) => set("deliverables", e.target.value)} />
            </Field>
            <Field label="Revisions included"><input type="number" className={`${inputClass} max-w-[8rem]`} value={f.revisions} onChange={(e) => set("revisions", Number(e.target.value))} /></Field>
          </div>
        )}

        {cur.key === "budget" && (
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-3">
              {(["FLAT", "PER_POST", "AFFILIATE"] as PaymentStructure[]).map((ps) => (
                <button key={ps} onClick={() => set("paymentStructure", ps)} className={`label rounded-xl border px-3 py-2.5 ${f.paymentStructure === ps ? "border-brand bg-brand/5 text-text" : "border-hairline text-textMuted hover:text-text"}`}>{ps.replace("_", " ")}</button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Budget min (₹)"><input type="number" className={inputClass} value={f.budgetMin} onChange={(e) => set("budgetMin", Number(e.target.value))} /></Field>
              <Field label="Budget max (₹)"><input type="number" className={inputClass} value={f.budgetMax} onChange={(e) => set("budgetMax", Number(e.target.value))} /></Field>
            </div>
            <div className="rounded-lg border border-dashed border-hairlineStrong p-3 text-xs text-textMuted">{marketHint}</div>
          </div>
        )}

        {cur.key === "terms" && (
          <div className="space-y-4">
            <Field label="Usage rights"><input className={inputClass} value={f.usageRights} onChange={(e) => set("usageRights", e.target.value)} /></Field>
            <Field label="Exclusivity"><input className={inputClass} value={f.exclusivity} onChange={(e) => set("exclusivity", e.target.value)} /></Field>
            <Field label="Content ownership"><input className={inputClass} value={f.ownership} onChange={(e) => set("ownership", e.target.value)} /></Field>
            <div className="flex items-center gap-2 rounded-lg border border-hairline bg-surfaceMuted/40 p-3 text-sm text-text">
              <Check size={16} className="text-brand" /> #ad / #paidcollab disclosure is auto-required on paid jobs.
            </div>
          </div>
        )}

        {cur.key === "review" && (
          <div className="space-y-2 text-sm">
            <Row k="Title" v={f.title || "Untitled"} />
            <Row k="Type" v={f.type} />
            <Row k="Niche" v={f.niche} />
            <Row k="Scope / timeline" v={`${f.scope} · ${f.timeline}`} />
            <Row k="Requirements" v={f.anyFollowers ? "Any followers · craft-first" : `${f.minFollowers}+ followers`} />
            <Row k="Deliverables" v={`${f.deliverables} · ${f.revisions} revisions`} />
            <Row k="Budget" v={<><Money amount={f.budgetMin} />–<Money amount={f.budgetMax} /> · {f.paymentStructure.replace("_", " ")}</>} />
            <Row k="Usage" v={f.usageRights} />
            {!verified && <p className="pt-2 text-xs text-textMuted">Posting is locked until your brand is verified. You can still save a draft.</p>}
          </div>
        )}
      </Card>

      {/* nav */}
      <div className="flex items-center justify-between border-t border-hairline pt-5">
        <Button variant="ghost" onClick={() => (step === 0 ? router.push("/jobs") : setStep((s) => s - 1))}>
          <ArrowLeft size={16} /> {step === 0 ? "Cancel" : "Back"}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveDraft}>Save draft</Button>
          {isLast ? (
            <Button onClick={post} disabled={!verified} title={verified ? undefined : "Verify your brand to publish"}>Post this job</Button>
          ) : (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>Next <ArrowRight size={16} /></Button>
          )}
        </div>
      </div>

      {/* "What happens after you post?" modal */}
      <Dialog.Root open={!!posted} onOpenChange={(v) => { if (!v && posted) router.push(`/jobs/${posted}`); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-hairline bg-surfaceElevated p-6 shadow-2xl focus:outline-none">
            <Dialog.Title className="font-heavy text-xl text-text">Your job is live</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-textMuted">What happens next:</Dialog.Description>
            <ol className="mt-4 space-y-2 text-sm text-text">
              {["Verified applicants apply", "Shortlist & compare them in the ATS", "Negotiate → e-sign a contract", "Fund escrow → review deliverables", "Pay on approval → rate the creator"].map((s, i) => (
                <li key={s} className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-[11px] text-brand">{i + 1}</span>{s}</li>
              ))}
            </ol>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.push("/discover")}>Browse creators</Button>
              <Button onClick={() => router.push(`/jobs/${posted}`)}>View job</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-hairline py-2 last:border-0">
      <span className="text-textMuted">{k}</span>
      <span className="text-right text-text">{v}</span>
    </div>
  );
}
