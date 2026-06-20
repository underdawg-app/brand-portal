import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STEPS = [
  ["Post a job", "Build a brief with budget, deliverables, timeline and usage rights — free."],
  ["Review applicants", "Verified creators apply. Shortlist, compare and message in the ATS."],
  ["Negotiate", "Agree rate, scope and usage in a deal-channel chat with structured offers."],
  ["Sign the contract", "Generate from 9 standard terms and e-sign. Both signatures activate the deal."],
  ["Fund escrow", "Money is held safely the moment the contract executes."],
  ["Review deliverables", "Approve or request revisions; confirm the go-live link."],
  ["Release & rate", "Escrow releases on approval. Rate the creator to build their reputation."],
];
const SAFE = [
  ["Verified-Human", "ID + liveness checks — no bots or AI accounts."],
  ["Escrow", "Funds release only on approved delivery + go-live."],
  ["Contracts", "Standardized, e-signed, stored and downloadable."],
  ["Disclosure", "#ad / #paidcollab enforced on paid campaigns."],
];

export default function HowItWorks() {
  return (
    <>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <span className="label text-bone/60">How it works</span>
          <h1 className="hero mt-3 max-w-3xl text-5xl md:text-6xl">From brief to paid — safely.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-3 md:grid-cols-2">
          {STEPS.map(([t, b], i) => (
            <div key={t} className="flex gap-4 rounded-2xl border border-hairline bg-surfaceElevated p-5">
              <div className="hero text-3xl text-brand">{String(i + 1).padStart(2, "0")}</div>
              <div><h3 className="heading text-lg text-text">{t}</h3><p className="mt-1 text-sm text-textMuted">{b}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <span className="label text-bone/50">What makes it safe</span>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SAFE.map(([t, b]) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-inkSoft p-5"><h3 className="heading text-bone">{t}</h3><p className="mt-2 text-sm text-bone/60">{b}</p></div>
            ))}
          </div>
          <Link href="/signup" className="mt-8 inline-block"><Button size="lg" className="bg-bone text-ink hover:bg-bone/90">Get started</Button></Link>
        </div>
      </section>
    </>
  );
}
