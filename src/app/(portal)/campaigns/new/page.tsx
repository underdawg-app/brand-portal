"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { useVerified } from "@/lib/gate";
import { PageHeader, Card, Label, Field, inputClass, Avatar, Money } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { compact } from "@/lib/format";
import type { CampaignTier } from "@/lib/types";

const TIERS: { tier: CampaignTier; budget: number; reach: number; slots: string; blurb: string }[] = [
  { tier: "SPARK", budget: 100000, reach: 500000, slots: "15–20", blurb: "A focused spark across rising creators." },
  { tier: "WAVE", budget: 300000, reach: 2000000, slots: "30–50", blurb: "A coordinated wave for a launch." },
  { tier: "STORM", budget: 800000, reach: 6000000, slots: "50–100", blurb: "Heavy, multi-niche saturation." },
  { tier: "TAKEOVER", budget: 1800000, reach: 15000000, slots: "100+", blurb: "Category takeover at scale." },
];

const STEPS = ["Tier & budget", "Brief & window", "Creators", "Review & launch"];

export default function NewCampaignPage() {
  const router = useRouter();
  const creators = useStore((s) => s.creators);
  const createCampaign = useStore((s) => s.createCampaign);
  const advanceCampaign = useStore((s) => s.advanceCampaign);
  const toast = useStore((s) => s.toast);
  const verified = useVerified();

  const [step, setStep] = useState(0);
  const [tier, setTier] = useState<CampaignTier>("WAVE");
  const tierCfg = TIERS.find((t) => t.tier === tier)!;
  const [form, setForm] = useState({ name: "", brief: "", windowStart: "2026-07-01", windowEnd: "2026-07-11" });
  const [budget, setBudget] = useState(tierCfg.budget);
  const [picked, setPicked] = useState<string[]>([]);
  const [disclosure, setDisclosure] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const eligible = creators.filter((c) => c.verifiedHuman);
  const togglePick = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const canNext =
    (step === 0) ||
    (step === 1 && form.name.trim() && disclosure) ||
    (step === 2 && picked.length >= 1) ||
    step === 3;

  const launch = () => {
    const id = createCampaign({
      name: form.name || "Untitled campaign", tier, budget, brief: form.brief,
      windowStart: form.windowStart, windowEnd: form.windowEnd, targetReach: tierCfg.reach, creatorIds: picked,
    });
    advanceCampaign(id); // DRAFT -> INVITING
    toast("Campaign launched — creators are being invited.", "success");
    router.push(`/campaigns/${id}`);
  };

  return (
    <>
      <PageHeader eyebrow="Layer 3 · Get Viral" title="Create campaign" sub="A coordinated, disclosed, multi-creator push." />

      {/* step indicator */}
      <div className="flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className={`label flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${i === step ? "border-brand bg-brand text-brandFg" : i < step ? "border-brand bg-brand/10 text-brand" : "border-hairline text-textMuted"}`}>
            {i < step ? <Check size={12} /> : `${i + 1}`} {s}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <button key={t.tier} onClick={() => { setTier(t.tier); setBudget(t.budget); }} className={`rounded-xl border p-4 text-left transition-colors ${tier === t.tier ? "border-brand bg-brand/5" : "border-hairline hover:border-hairlineStrong"}`}>
              <Label className={tier === t.tier ? "text-brand" : ""}>{t.tier}</Label>
              <div className="mt-2 font-heavy text-lg text-text"><Money amount={t.budget} /></div>
              <div className="text-xs text-textMuted">{t.slots} creators · reach {compact(t.reach)}</div>
              <p className="mt-2 text-xs text-textMuted">{t.blurb}</p>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <Card className="space-y-4 p-5">
          <Field label="Campaign name"><input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. ACID SUMMER" /></Field>
          <Field label="Brief"><textarea className={`${inputClass} min-h-24`} value={form.brief} onChange={(e) => set("brief", e.target.value)} placeholder="What's the push? Tone, must-haves, hashtags…" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Window start"><input type="date" className={inputClass} value={form.windowStart} onChange={(e) => set("windowStart", e.target.value)} /></Field>
            <Field label="Window end"><input type="date" className={inputClass} value={form.windowEnd} onChange={(e) => set("windowEnd", e.target.value)} /></Field>
          </div>
          <Field label="Budget (₹)"><input type="number" className={inputClass} value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></Field>
          <label className="flex items-center gap-2 rounded-lg border border-hairlineStrong bg-surfaceMuted/40 p-3 text-sm text-text">
            <input type="checkbox" checked={disclosure} onChange={(e) => setDisclosure(e.target.checked)} />
            <ShieldCheck size={16} className="text-brand" /> I confirm every deliverable will carry <span className="font-medium">#ad / #paidcollab</span> (mandatory).
          </label>
        </Card>
      )}

      {step === 2 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <Label>Pick creators · {picked.length} selected (tier expects {tierCfg.slots})</Label>
            <span className="text-xs text-textMuted">Per-slot payout ≈ <Money amount={picked.length ? Math.round(budget / picked.length) : 0} /></span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eligible.map((c) => {
              const on = picked.includes(c.cr_id);
              return (
                <button key={c.cr_id} onClick={() => togglePick(c.cr_id)} className={`flex items-center justify-between rounded-xl border p-3 text-left ${on ? "border-brand bg-brand/5" : "border-hairline hover:border-hairlineStrong"}`}>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.name} accent={c.accent} size={34} />
                    <div>
                      <div className="text-sm font-medium text-text">{c.name}</div>
                      <div className="text-xs text-textMuted">{compact(c.stats.followers)} · {c.niches[0]}</div>
                    </div>
                  </div>
                  {on && <Check size={16} className="text-brand" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <Card className="space-y-3 p-5">
          <Label>Review</Label>
          <Row k="Name" v={form.name || "Untitled"} />
          <Row k="Tier" v={tier} />
          <Row k="Budget" v={<Money amount={budget} />} />
          <Row k="Target reach" v={compact(tierCfg.reach)} />
          <Row k="Creators" v={`${picked.length} selected`} />
          <Row k="Window" v={`${form.windowStart} → ${form.windowEnd}`} />
          <Row k="Disclosure" v={disclosure ? "#ad confirmed" : "missing"} />
          {!verified && <p className="text-xs text-textMuted">Launch is locked until your brand is verified.</p>}
        </Card>
      )}

      {/* nav */}
      <div className="flex items-center justify-between border-t border-hairline pt-5">
        <Button variant="ghost" onClick={() => (step === 0 ? router.push("/campaigns") : setStep((s) => s - 1))}>
          <ArrowLeft size={16} /> {step === 0 ? "Cancel" : "Back"}
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>Next <ArrowRight size={16} /></Button>
        ) : (
          <Button onClick={launch} disabled={!verified || !disclosure || picked.length === 0}>Launch campaign</Button>
        )}
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-textMuted">{k}</span>
      <span className="text-right text-text">{v}</span>
    </div>
  );
}
