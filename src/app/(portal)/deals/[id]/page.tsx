"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Send, FileSignature, CheckCircle2, RotateCcw, Link2, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Money, StatusBadge, Avatar, ProgressBar, Field, inputClass } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { dealTone, deliveryTone, escrowTone, contractTone, DEAL_ORDER } from "@/lib/status";
import { dealMath, formatDate } from "@/lib/format";

const TABS = ["Overview", "Negotiation", "Contract", "Deliverables", "Escrow", "Rating", "Activity"] as const;
type Tab = (typeof TABS)[number];

export default function DealWorkspace() {
  const { id } = useParams<{ id: string }>();
  const deal = useStore((s) => s.deals.find((d) => d.deal_id === id));
  const creators = useStore((s) => s.creators);
  const [tab, setTab] = useState<Tab>("Overview");

  if (!deal) return <p className="text-textMuted">Deal not found.</p>;
  const creator = creators.find((c) => c.cr_id === deal.creatorId);

  return (
    <>
      <PageHeader
        eyebrow="Deal workspace"
        title={creator?.name ?? deal.title}
        action={<StatusBadge tone={dealTone[deal.status]}>{deal.status}</StatusBadge>}
      />

      <div className="flex items-center gap-3">
        <Avatar name={creator?.name ?? "?"} accent={creator?.accent} size={40} />
        <div className="flex-1">
          <Link href={`/creators/${deal.creatorId}`} className="text-sm text-textMuted hover:text-text hover:underline">
            {creator?.handle} · {creator?.type} · view analytics →
          </Link>
          <ProgressBar value={deal.progress} className="mt-2 max-w-xs" />
        </div>
        <Money amount={deal.amount} currency={deal.currency} className="font-heavy text-xl text-text" />
      </div>

      {/* lifecycle stepper — or off-path notice (§5 / §10) */}
      {deal.status === "CANCELLED" || deal.status === "DISPUTED" ? (
        <div className="rounded-xl border border-hairlineStrong bg-surfaceMuted/40 px-4 py-3 text-sm text-text">
          This deal is <span className="font-medium">{deal.status}</span>. Forward actions are disabled. See the Activity log for details.
        </div>
      ) : (
        <Card className="p-5">
          <Stepper stages={DEAL_ORDER} current={deal.status} />
        </Card>
      )}

      {/* tabs */}
      <div className="flex flex-wrap gap-1 border-b border-hairline">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm transition-colors ${
              tab === t ? "border-brand font-medium text-text" : "border-transparent text-textMuted hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && <Overview dealId={deal.deal_id} />}
      {tab === "Negotiation" && <Negotiation dealId={deal.deal_id} />}
      {tab === "Contract" && <ContractTab dealId={deal.deal_id} />}
      {tab === "Deliverables" && <Deliverables dealId={deal.deal_id} />}
      {tab === "Escrow" && <EscrowTab dealId={deal.deal_id} />}
      {tab === "Rating" && <RatingTab dealId={deal.deal_id} />}
      {tab === "Activity" && <Activity dealId={deal.deal_id} />}
    </>
  );
}

// ------------------------------------------------------------------ Overview
function Overview({ dealId }: { dealId: string }) {
  const deal = useStore((s) => s.deals.find((d) => d.deal_id === dealId))!;
  const advance = useStore((s) => s.advanceDeal);
  const cancelDeal = useStore((s) => s.cancelDeal);
  const disputeDeal = useStore((s) => s.disputeDeal);
  const toast = useStore((s) => s.toast);
  const { platformFeeAmount, netToCreator } = dealMath(deal.amount);
  const [confirm, setConfirm] = useState<null | "cancel" | "dispute">(null);
  const offPath = deal.status === "CANCELLED" || deal.status === "DISPUTED";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-5">
        <Label>Money math</Label>
        <div className="mt-3 space-y-2 text-sm">
          <Line k="Gross (deal value)" v={<Money amount={deal.amount} currency={deal.currency} />} />
          <Line k="Platform fee (12%)" v={<span className="text-textMuted">– <Money amount={platformFeeAmount} currency={deal.currency} /></span>} />
          <div className="border-t border-hairline pt-2">
            <Line k="Net to creator" v={<Money amount={netToCreator} currency={deal.currency} className="text-text" />} />
          </div>
        </div>
        <p className="mt-3 text-xs text-textMuted">Funds held in escrow, released on approval + go-live link.</p>
      </Card>
      <Card className="p-5">
        <Label>Next action</Label>
        <p className="mt-2 text-sm text-text">{deal.nextAction}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => advance(dealId)} disabled={offPath || deal.status === "COMPLETED"}>
            Advance stage →
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirm("cancel")} disabled={offPath || deal.status === "COMPLETED"}>
            Cancel deal
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirm("dispute")} disabled={offPath || deal.status === "COMPLETED"}>
            Raise dispute
          </Button>
        </div>
        <div className="mt-4 text-xs text-textMuted">
          Lifecycle: APPLIED → SHORTLISTED → NEGOTIATING → CONTRACT → ACTIVE → IN REVIEW → COMPLETED
        </div>
      </Card>

      <ConfirmDialog
        open={confirm === "cancel"}
        onOpenChange={(v) => !v && setConfirm(null)}
        title="Cancel this deal?"
        description="This stops the engagement and disables forward actions. Any held escrow is returned. This can't be undone."
        confirmLabel="Cancel deal"
        danger
        onConfirm={() => { cancelDeal(dealId); toast("Deal cancelled.", "warn"); }}
      />
      <ConfirmDialog
        open={confirm === "dispute"}
        onOpenChange={(v) => !v && setConfirm(null)}
        title="Raise a dispute?"
        description="This flags the deal for review and pauses forward actions until resolved. A dispute record is added to the activity log."
        confirmLabel="Raise dispute"
        danger
        onConfirm={() => { disputeDeal(dealId); toast("Dispute raised.", "warn"); }}
      />
    </div>
  );
}

// --------------------------------------------------------------- Negotiation
function Negotiation({ dealId }: { dealId: string }) {
  const deal = useStore((s) => s.deals.find((d) => d.deal_id === dealId))!;
  const thread = useStore((s) => s.threads.find((t) => t.thread_id === deal.threadId));
  const sendMessage = useStore((s) => s.sendMessage);
  const generateContract = useStore((s) => s.generateContract);
  const [draft, setDraft] = useState("");

  return (
    <Card className="flex h-[28rem] flex-col p-0">
      <div className="flex items-center justify-between border-b border-hairline p-4">
        <Label>Negotiation · DEAL channel</Label>
        <Button size="sm" onClick={() => generateContract(dealId)}>
          <FileSignature size={14} /> Accept terms → Contract
        </Button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {!thread && <p className="text-sm text-textMuted">No thread yet — send the first message.</p>}
        {thread?.messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
              m.from === "me" ? "bg-brand text-brandFg" : "bg-surfaceMuted text-text"
            }`}>
              {m.body}
              <div className={`mt-1 text-[10px] ${m.from === "me" ? "text-white/70" : "text-textMuted"}`}>{m.ts}</div>
            </div>
          </div>
        ))}
      </div>
      <form
        className="flex gap-2 border-t border-hairline p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (deal.threadId && draft.trim()) {
            sendMessage(deal.threadId, draft.trim());
            setDraft("");
          }
        }}
      >
        <input className={inputClass} placeholder="Counter on rate, scope, timeline, usage…" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <Button type="submit" size="icon"><Send size={16} /></Button>
      </form>
    </Card>
  );
}

// ------------------------------------------------------------------ Contract
function ContractTab({ dealId }: { dealId: string }) {
  const contract = useStore((s) => s.contracts.find((c) => c.dealId === dealId));
  const generateContract = useStore((s) => s.generateContract);
  const signContractAsBrand = useStore((s) => s.signContractAsBrand);
  const sendContract = useStore((s) => s.sendContract);
  const toast = useStore((s) => s.toast);

  if (!contract) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-textMuted">No contract yet. Generate one from the agreed terms.</p>
        <Button className="mt-4" onClick={() => generateContract(dealId)}>Generate contract</Button>
      </Card>
    );
  }

  const t = contract.terms;
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <Label>Terms</Label>
          <StatusBadge tone={contractTone[contract.status]}>{contract.status}</StatusBadge>
        </div>
        <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <Line k="Rate" v={<Money amount={t.rate} currency={t.currency} />} />
          <Line k="Payment terms" v={t.paymentTerms} />
          <Line k="Deliverables" v={t.deliverables} />
          <Line k="Timeline" v={t.timeline} />
          <Line k="Usage rights" v={t.usageRights} />
          <Line k="Exclusivity" v={t.exclusivity} />
          <Line k="Content ownership" v={t.contentOwnership} />
          <Line k="Revisions" v={t.revisions} />
        </div>
      </Card>

      <Card className="p-5">
        <Label>Clauses</Label>
        <div className="mt-3 space-y-3">
          {contract.clauses.map((cl) => (
            <div key={cl.title}>
              <div className="label text-text">{cl.title}</div>
              <p className="mt-1 text-sm text-textMuted">{cl.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="text-xs text-textMuted">
          {contract.esign.creatorSignedAt ? "Creator signed ✓ " : "Awaiting creator signature · "}
          {contract.esign.brandSignedAt ? "Brand signed ✓" : "you haven't signed"}
          {contract.esign.documentId && <> · Digio {contract.esign.documentId}</>}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => toast("Contract PDF downloaded (demo).", "default")}>View / Download</Button>
          {contract.status === "DRAFT" && <Button variant="outline" onClick={() => sendContract(contract.contract_id)}>Send to creator</Button>}
          <Button
            onClick={() => signContractAsBrand(contract.contract_id)}
            disabled={contract.status === "EXECUTED" || !!contract.esign.brandSignedAt}
          >
            <FileSignature size={16} /> {contract.status === "EXECUTED" ? "Executed" : "Counter-sign (Digio)"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------- Deliverables
function Deliverables({ dealId }: { dealId: string }) {
  const deal = useStore((s) => s.deals.find((d) => d.deal_id === dealId))!;
  const job = useStore((s) => s.jobs.find((j) => j.job_id === deal.jobId));
  const deliverables = useStore((s) => s.deliverables).filter((d) => d.dealId === dealId);
  const approve = useStore((s) => s.approveDeliverable);
  const requestRevision = useStore((s) => s.requestRevision);
  const confirmGoLive = useStore((s) => s.confirmGoLive);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [linkFor, setLinkFor] = useState<string | null>(null);
  const [link, setLink] = useState("");

  const isGetViral = job?.type === "Get Viral Campaign";

  if (deliverables.length === 0)
    return <Card className="p-8 text-center text-sm text-textMuted">No deliverables submitted yet. They appear here once the creator uploads.</Card>;

  return (
    <div className="space-y-3">
      {isGetViral && (
        <div className="flex items-center gap-2 rounded-lg border border-hairlineStrong bg-surfaceMuted p-3 text-sm text-textMuted">
          <ShieldCheck size={16} /> Get Viral: every deliverable must carry #ad / #paidcollab before approval.
        </div>
      )}
      {deliverables.map((d) => (
        <Card key={d.deliverable_id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium text-text">{d.title}</div>
            <StatusBadge tone={deliveryTone[d.reviewStatus]}>{d.reviewStatus}</StatusBadge>
          </div>
          {d.revisionNotes.length > 0 && (
            <div className="mt-2 space-y-1">
              {d.revisionNotes.map((n, i) => (
                <p key={i} className="rounded-lg border border-hairline bg-surfaceMuted/40 p-2 text-xs text-textMuted">↩ {n}</p>
              ))}
            </div>
          )}
          {d.goLiveUrl && <p className="mt-2 text-xs text-brand">Live: {d.goLiveUrl}</p>}

          <div className="mt-3 flex flex-wrap gap-2">
            {(d.reviewStatus === "IN REVIEW" || d.reviewStatus === "SUBMIT") && (
              <>
                <Button size="sm" onClick={() => approve(d.deliverable_id)}>
                  <CheckCircle2 size={14} /> Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => setNoteFor(noteFor === d.deliverable_id ? null : d.deliverable_id)}>
                  <RotateCcw size={14} /> Request revision
                </Button>
              </>
            )}
            {d.reviewStatus === "APPROVED" && (
              <Button size="sm" variant="outline" onClick={() => setLinkFor(linkFor === d.deliverable_id ? null : d.deliverable_id)}>
                <Link2 size={14} /> Confirm go-live link
              </Button>
            )}
          </div>

          {noteFor === d.deliverable_id && (
            <div className="mt-3 flex gap-2">
              <input className={inputClass} placeholder="What needs to change?" value={note} onChange={(e) => setNote(e.target.value)} />
              <Button size="sm" onClick={() => { if (note.trim()) { requestRevision(d.deliverable_id, note.trim()); setNote(""); setNoteFor(null); } }}>Send</Button>
            </div>
          )}
          {linkFor === d.deliverable_id && (
            <div className="mt-3 flex gap-2">
              <input className={inputClass} placeholder="https://instagram.com/p/…" value={link} onChange={(e) => setLink(e.target.value)} />
              <Button size="sm" onClick={() => { if (link.trim()) { confirmGoLive(d.deliverable_id, link.trim()); setLink(""); setLinkFor(null); } }}>Confirm</Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// --------------------------------------------------------------------- Escrow
function EscrowTab({ dealId }: { dealId: string }) {
  const escrow = useStore((s) => s.escrows.find((e) => e.dealId === dealId));
  const fund = useStore((s) => s.fundEscrow);
  const release = useStore((s) => s.releaseEscrow);
  const deliverables = useStore((s) => s.deliverables).filter((d) => d.dealId === dealId);

  if (!escrow) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-textMuted">Escrow is created when the contract is executed.</p>
        <Button className="mt-4" variant="outline" onClick={() => fund(dealId)}>Fund escrow now</Button>
      </Card>
    );
  }

  const approved = deliverables.some((d) => d.reviewStatus === "APPROVED" || d.reviewStatus === "GO LIVE");
  const liveLink = deliverables.some((d) => d.goLiveUrl);
  const canRelease = escrow.status === "PROCESSING" && approved && liveLink;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <Label>Escrow · {escrow.paymentProvider}</Label>
        <StatusBadge tone={escrowTone[escrow.status]}>{escrow.status}</StatusBadge>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <Line k="Gross" v={<Money amount={escrow.grossAmount} currency={escrow.currency} />} />
        <Line k={`Platform fee (${escrow.platformFeePct}%)`} v={<span className="text-textMuted">– <Money amount={escrow.platformFeeAmount} currency={escrow.currency} /></span>} />
        <Line k={`GST on fee (${escrow.gstPct}%)`} v={<Money amount={escrow.gstAmount} currency={escrow.currency} />} />
        <div className="border-t border-hairline pt-2">
          <Line k="Net to creator" v={<Money amount={escrow.netToCreator} currency={escrow.currency} className="text-text" />} />
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-hairline bg-surfaceMuted/30 p-3 text-xs text-textMuted">
        Release requires: deliverable approved {approved ? "✓" : "✗"} · go-live link posted {liveLink ? "✓" : "✗"}.
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={() => release(escrow.escrow_id)} disabled={!canRelease || escrow.status === "PAID"}>
          {escrow.status === "PAID" ? "Released ✓" : "Release to creator"}
        </Button>
      </div>
    </Card>
  );
}

// --------------------------------------------------------------------- Rating
function RatingTab({ dealId }: { dealId: string }) {
  const deal = useStore((s) => s.deals.find((d) => d.deal_id === dealId))!;
  const existing = useStore((s) => s.ratings.find((r) => r.dealId === dealId));
  const addRating = useStore((s) => s.addRating);
  const [scores, setScores] = useState({ overall: 5, communication: 5, timeliness: 5, contentQuality: 5, professionalism: 5 });
  const [review, setReview] = useState("");
  const [again, setAgain] = useState(true);

  if (deal.status !== "COMPLETED") {
    return <Card className="p-8 text-center text-sm text-textMuted">Rating unlocks when the deal is COMPLETED.</Card>;
  }
  if (existing) {
    return (
      <Card className="p-5">
        <Label>Your rating</Label>
        <div className="mt-3 font-heavy text-3xl text-text">{existing.scores.overall}.0 ★</div>
        <p className="mt-2 text-sm text-textSoft">{existing.writtenReview}</p>
        <p className="mt-2 text-xs text-textMuted">Would work again: {existing.wouldWorkAgain ? "Yes" : "No"}</p>
      </Card>
    );
  }

  const dims: (keyof typeof scores)[] = ["overall", "communication", "timeliness", "contentQuality", "professionalism"];
  return (
    <Card className="p-5">
      <Label>Rate the creator</Label>
      <div className="mt-3 space-y-3">
        {dims.map((d) => (
          <div key={d} className="flex items-center justify-between gap-4">
            <span className="text-sm capitalize text-text">{d.replace(/([A-Z])/g, " $1")}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setScores((s) => ({ ...s, [d]: n }))}
                  className={`h-7 w-7 rounded-md text-sm ${n <= scores[d] ? "bg-brand text-brandFg" : "bg-surfaceMuted text-textMuted"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Field label="Written review">
          <textarea className={`${inputClass} min-h-24`} value={review} onChange={(e) => setReview(e.target.value)} />
        </Field>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm text-text">
        <input type="checkbox" checked={again} onChange={(e) => setAgain(e.target.checked)} /> Would work again
      </label>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => addRating({ dealId, toCreatorId: deal.creatorId, scores, writtenReview: review, wouldWorkAgain: again })}>
          Submit rating
        </Button>
      </div>
    </Card>
  );
}

// ------------------------------------------------------------------ Activity
function Activity({ dealId }: { dealId: string }) {
  const deal = useStore((s) => s.deals.find((d) => d.deal_id === dealId))!;
  const contract = useStore((s) => s.contracts.find((c) => c.dealId === dealId));
  const deliverables = useStore((s) => s.deliverables).filter((d) => d.dealId === dealId);
  const escrow = useStore((s) => s.escrows.find((e) => e.dealId === dealId));
  const rating = useStore((s) => s.ratings.find((r) => r.dealId === dealId));

  // Derived, chronological record of every state change on the deal (F6).
  const entries: { when?: string; text: string }[] = [];
  entries.push({ when: deal.createdAt, text: "Deal created from accepted application" });
  if (contract) {
    entries.push({ when: contract.createdAt, text: `Contract generated (${contract.status})` });
    if (contract.esign.brandSignedAt) entries.push({ when: contract.esign.brandSignedAt, text: "Brand counter-signed the contract" });
    if (contract.esign.creatorSignedAt) entries.push({ when: contract.esign.creatorSignedAt, text: "Creator signed the contract" });
  }
  deliverables.forEach((d) => {
    if (d.submittedAt) entries.push({ when: d.submittedAt, text: `Deliverable submitted: ${d.title}` });
    d.revisionNotes.forEach((n) => entries.push({ text: `Revision requested on ${d.title}: “${n}”` }));
    if (d.approvedAt) entries.push({ when: d.approvedAt, text: `Deliverable approved: ${d.title}` });
    if (d.goLiveUrl) entries.push({ text: `Go-live link confirmed: ${d.goLiveUrl}` });
  });
  if (escrow) {
    if (escrow.fundedAt) entries.push({ when: escrow.fundedAt, text: "Escrow funded" });
    if (escrow.releasedAt) entries.push({ when: escrow.releasedAt, text: "Escrow released to creator" });
  }
  if (rating) entries.push({ when: rating.createdAt, text: `Brand rated the creator ${rating.scores.overall}.0★` });
  if (deal.status === "CANCELLED") entries.push({ text: "Deal cancelled" });
  if (deal.status === "DISPUTED") entries.push({ text: "Dispute raised — under review" });

  return (
    <Card className="p-5">
      <Label>Activity log</Label>
      <div className="mt-4 space-y-0">
        {entries.map((e, i) => (
          <div key={i} className="flex gap-3 border-l border-hairline pb-4 pl-4 last:pb-0">
            <div className="relative">
              <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-brand" />
            </div>
            <div>
              <div className="text-sm text-text">{e.text}</div>
              {e.when && <div className="text-xs text-textMuted">{formatDate(e.when)}</div>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Line({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-textMuted">{k}</span>
      <span className="text-right text-text">{v}</span>
    </div>
  );
}
