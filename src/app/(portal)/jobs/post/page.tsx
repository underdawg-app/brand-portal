"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Sparkles, Send, ArrowRight, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Field, inputClass } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Splash } from "@/components/Splash";
import { draftJobFromPrompt } from "@/lib/draftJob";
import { formatMoney } from "@/lib/format";

type ChatMsg = { from: "ai" | "me"; body: string };

const SUGGESTIONS = [
  "Skincare UGC — 5 creators, honest reels for a vitamin-C serum",
  "Brand film, 60s hero edit, natural light",
  "Fashion ambassador for 3 months, 2 reels/month",
];

export default function PostJobPage() {
  const draftingGigs = useStore((s) => s.draftingGigs);
  const startDraftingGig = useStore((s) => s.startDraftingGig);
  const completeDraftingGig = useStore((s) => s.completeDraftingGig);
  const toast = useStore((s) => s.toast);

  // compose form
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [niche, setNiche] = useState("");
  const [budget, setBudget] = useState({ from: 30000, to: 60000 });
  const [deliverables, setDeliverables] = useState<string[]>([]);

  // AI assistant
  const [chat, setChat] = useState<ChatMsg[]>([
    { from: "ai", body: "Hey! Describe the creator or campaign you need in a sentence and I'll draft the whole job post for you." },
  ]);
  const [aiInput, setAiInput] = useState("");

  // drive concurrent drafting timers (so multiple posts can run at once)
  const timers = useRef<Set<string>>(new Set());
  useEffect(() => {
    draftingGigs.forEach((g) => {
      if (g.status === "drafting" && !timers.current.has(g.gig_id)) {
        timers.current.add(g.gig_id);
        setTimeout(() => completeDraftingGig(g.gig_id), 3600);
      }
    });
  }, [draftingGigs, completeDraftingGig]);

  const runAI = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const d = draftJobFromPrompt(t);
    setTitle(d.title);
    setBrief(d.description);
    setNiche(d.niche);
    setBudget({ from: d.budgetMin, to: d.budgetMax });
    setDeliverables(d.deliverables);
    setChat((c) => [
      ...c,
      { from: "me", body: t },
      { from: "ai", body: `Done — I drafted "${d.title}" in ${d.niche}, suggested ${formatMoney(d.budgetMin)}–${formatMoney(d.budgetMax)} and added ${d.deliverables.length} deliverables. Review on the left, tweak anything, then post.` },
    ]);
    setAiInput("");
  };

  const submitPost = () => {
    const text = brief.trim() || title.trim();
    if (!text) {
      toast("Add a brief or use the AI assistant first.", "warn");
      return;
    }
    startDraftingGig(text);
    toast("Your gig is being drafted…", "success");
    // reset the form so another post can be started while this one drafts
    setTitle("");
    setBrief("");
    setNiche("");
    setDeliverables([]);
    setBudget({ from: 30000, to: 60000 });
  };

  return (
    <>
      <PageHeader
        eyebrow="Post a job"
        title="Create a gig"
        sub="Write it yourself or let AI draft it. Post as many as you like — they draft in the background."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* compose */}
        <div className="min-w-0 space-y-5">
          <Card className="space-y-5 p-5">
            <Field label="Job title">
              <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Serum launch — UGC + Reels" />
            </Field>
            <Field label="Brief">
              <textarea className={`${inputClass} min-h-[120px] resize-none`} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Describe the work, the audience and the vibe…" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Category"><input className={inputClass} value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Skincare" /></Field>
              <Field label="Budget from"><input type="number" className={inputClass} value={budget.from} onChange={(e) => setBudget((b) => ({ ...b, from: Number(e.target.value) }))} /></Field>
              <Field label="Budget to"><input type="number" className={inputClass} value={budget.to} onChange={(e) => setBudget((b) => ({ ...b, to: Number(e.target.value) }))} /></Field>
            </div>
            {deliverables.length > 0 && (
              <div>
                <Label>Deliverables</Label>
                <ul className="mt-2 space-y-1 text-sm text-text">
                  {deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2"><Check size={14} className="text-brand" /> {d}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-end border-t border-hairline pt-4">
              <Button size="lg" onClick={submitPost}>Post job <ArrowRight size={16} /></Button>
            </div>
          </Card>

          {/* my gig posts */}
          <section>
            <Label>My gig posts</Label>
            <div className="mt-3 space-y-3">
              {draftingGigs.length === 0 && (
                <p className="rounded-xl border border-dashed border-hairline px-4 py-6 text-center text-sm text-textMuted">
                  Nothing yet. Post your first gig above — you can queue several at once.
                </p>
              )}
              {draftingGigs.map((g) =>
                g.status === "drafting" ? (
                  <Card key={g.gig_id} className="overflow-hidden">
                    <div className="h-32 w-full overflow-hidden">
                      <Splash className="!bg-surfaceMuted/40" />
                    </div>
                    <div className="border-t border-hairline px-4 py-3">
                      <div className="text-sm font-medium text-text">Drafting your gig…</div>
                      <div className="truncate text-xs text-textMuted">{g.brief}</div>
                    </div>
                  </Card>
                ) : (
                  <Link key={g.gig_id} href={g.jobId ? `/jobs/${g.jobId}` : "/jobs"}>
                    <Card className="flex items-center justify-between p-4 transition-colors hover:border-hairlineStrong">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-medium text-text">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-brand/10 text-brand"><Check size={12} /></span>
                          {g.title}
                        </div>
                        <div className="mt-1 text-xs text-textMuted">{g.niche} · {formatMoney(g.budgetMin ?? 0)}–{formatMoney(g.budgetMax ?? 0)} · Live</div>
                      </div>
                      <ArrowRight size={16} className="text-textMuted" />
                    </Card>
                  </Link>
                ),
              )}
            </div>
          </section>
        </div>

        {/* AI assistant */}
        <Card className="flex h-[34rem] flex-col overflow-hidden p-0 lg:sticky lg:top-20">
          <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-brandFg"><Bot size={16} /></span>
            <div>
              <div className="text-sm font-medium text-text">AI Job Assistant</div>
              <div className="label text-[10px] text-textMuted">drafts your post for you</div>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${m.from === "me" ? "bg-brand text-brandFg" : "bg-surfaceMuted text-text"}`}>{m.body}</div>
              </div>
            ))}
            <div className="space-y-1.5 pt-1">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => runAI(s)} className="flex w-full items-center gap-2 rounded-lg border border-hairline px-3 py-2 text-left text-xs text-textMuted hover:border-hairlineStrong hover:text-text">
                  <Sparkles size={12} className="shrink-0 text-brand" /> {s}
                </button>
              ))}
            </div>
          </div>
          <form className="flex gap-2 border-t border-hairline p-3" onSubmit={(e) => { e.preventDefault(); runAI(aiInput); }}>
            <input className={inputClass} placeholder="Describe what you need…" value={aiInput} onChange={(e) => setAiInput(e.target.value)} />
            <Button type="submit" size="icon"><Send size={16} /></Button>
          </form>
        </Card>
      </div>
    </>
  );
}
