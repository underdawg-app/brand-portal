"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PageHeader, Field, inputClass, Label } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { useVerified } from "@/lib/gate";
import type { JobType, PaymentStructure } from "@/lib/types";

const JOB_TYPES: JobType[] = [
  "Sponsored Post", "Story/Reel", "Video Integration", "Brand Ambassador",
  "Product Review", "Event Coverage", "UGC Creation", "Affiliate",
  "Account Takeover", "Get Viral Campaign", "Custom",
];

export default function NewJobPage() {
  const addJob = useStore((s) => s.addJob);
  const publishJob = useStore((s) => s.publishJob);
  const toast = useStore((s) => s.toast);
  const verified = useVerified();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    type: "UGC Creation" as JobType,
    niche: "Skincare",
    description: "",
    budgetMin: 30000,
    budgetMax: 60000,
    paymentStructure: "FLAT" as PaymentStructure,
    minFollowers: 20000,
    deliverables: "1 reel (≤60s), 3 UGC stills",
    timeline: "14 days",
    usageRights: "Organic, 90 days",
    exclusivity: "No competing brand, 30 days",
    applicationDeadline: "2026-07-15",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = (publish: boolean) => {
    const id = addJob({
      title: form.title || "Untitled brief",
      type: form.type,
      niche: form.niche,
      description: form.description,
      budgetMin: Number(form.budgetMin),
      budgetMax: Number(form.budgetMax),
      currency: "INR",
      paymentStructure: form.paymentStructure,
      requirements: { minFollowers: Number(form.minFollowers), niche: form.niche, location: "IN" },
      deliverables: form.deliverables.split(",").map((d) => d.trim()).filter(Boolean),
      timeline: form.timeline,
      usageRights: form.usageRights,
      exclusivity: form.exclusivity,
      applicationDeadline: form.applicationDeadline,
      verified: true,
      status: "DRAFT",
      postedBy: "m_owner",
      brandDisplay: "Copperleaf",
    });
    if (publish) {
      publishJob(id);
      toast("Job published — it's now live for creators.", "success");
    } else {
      toast("Draft saved.", "default");
    }
    router.push(`/jobs/${id}`);
  };

  return (
    <>
      <PageHeader eyebrow="Jobs" title="Post a brief" sub="Define the work. Creators apply with pitch, rate and timeline." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Title">
          <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Summer Serum launch — UGC + Reels" />
        </Field>
        <Field label="Type">
          <select className={inputClass} value={form.type} onChange={(e) => set("type", e.target.value as JobType)}>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Niche">
          <input className={inputClass} value={form.niche} onChange={(e) => set("niche", e.target.value)} />
        </Field>
        <Field label="Payment structure">
          <select className={inputClass} value={form.paymentStructure} onChange={(e) => set("paymentStructure", e.target.value as PaymentStructure)}>
            <option value="FLAT">FLAT</option>
            <option value="PER_POST">PER_POST</option>
            <option value="AFFILIATE">AFFILIATE</option>
          </select>
        </Field>
        <div className="lg:col-span-2">
          <Field label="Brief / description">
            <textarea className={`${inputClass} min-h-28`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What are you looking for? Be honest about tone and expectations." />
          </Field>
        </div>
        <Field label="Budget min (₹)">
          <input type="number" className={inputClass} value={form.budgetMin} onChange={(e) => set("budgetMin", Number(e.target.value))} />
        </Field>
        <Field label="Budget max (₹)">
          <input type="number" className={inputClass} value={form.budgetMax} onChange={(e) => set("budgetMax", Number(e.target.value))} />
        </Field>
        <Field label="Min followers">
          <input type="number" className={inputClass} value={form.minFollowers} onChange={(e) => set("minFollowers", Number(e.target.value))} />
        </Field>
        <Field label="Application deadline">
          <input type="date" className={inputClass} value={form.applicationDeadline} onChange={(e) => set("applicationDeadline", e.target.value)} />
        </Field>
        <div className="lg:col-span-2">
          <Field label="Deliverables (comma-separated)">
            <input className={inputClass} value={form.deliverables} onChange={(e) => set("deliverables", e.target.value)} />
          </Field>
        </div>
        <Field label="Timeline">
          <input className={inputClass} value={form.timeline} onChange={(e) => set("timeline", e.target.value)} />
        </Field>
        <Field label="Usage rights">
          <input className={inputClass} value={form.usageRights} onChange={(e) => set("usageRights", e.target.value)} />
        </Field>
        <div className="lg:col-span-2">
          <Field label="Exclusivity">
            <input className={inputClass} value={form.exclusivity} onChange={(e) => set("exclusivity", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-hairline pt-5">
        <Label>{verified ? "Drafts stay private until you publish." : "Verify your brand to publish — drafts are allowed."}</Label>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => save(false)}>Save draft</Button>
          <Button onClick={() => save(true)} disabled={!verified} title={verified ? undefined : "Verify your brand to publish jobs"}>
            Publish job
          </Button>
        </div>
      </div>
      {!verified && (
        <p className="text-right text-xs text-textMuted">
          Publishing is locked until your brand is verified. <a href="/settings/verification" className="text-brand hover:underline">Get verified →</a>
        </p>
      )}
    </>
  );
}
