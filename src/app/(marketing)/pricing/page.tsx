import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

const TIERS = [
  { name: "Brand Free", price: "₹0", sub: "forever", feats: ["Post unlimited jobs", "Browse verified creators", "Full deal loop + escrow", "Contracts & e-sign", "1 seat"], cta: "Get started", href: "/signup" },
  { name: "Brand Pro", price: "₹2,999", sub: "/month", feats: ["Everything in Free", "Get Viral campaigns", "Advanced analytics", "Priority support", "Up to 5 seats"], cta: "Start Pro", href: "/signup", featured: true },
  { name: "Agency", price: "Custom", sub: "talk to us", feats: ["Management or Marketing", "Multi-client workspaces", "Talent pools", "Cross-client reporting", "White-label + seats"], cta: "For Agencies", href: "/for-agencies" },
];
const FAQ = [
  ["What's the platform fee?", "12% of the deal value, shown transparently on every payment as gross → fee → net."],
  ["How does escrow work?", "Funds are held when the contract executes and released only when a deliverable is approved and the go-live link is confirmed."],
  ["What about GST / TDS?", "Invoices show GST (18%) as a separate line and surface a TDS note for Indian brands."],
  ["What does verification unlock?", "Posting jobs, running Get Viral, and viewing creator contact/rates marked 'Verified Brands Only', plus the Verified-Brand badge."],
];

export default function Pricing() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-4 pt-16 text-center md:px-8 md:pt-20">
        <span className="label text-brand">Pricing</span>
        <h1 className="hero mt-2 text-5xl md:text-6xl">Start free. Scale when you do.</h1>
        <p className="mx-auto mt-4 max-w-lg text-textMuted">No fee to post or browse. You only pay the platform fee on completed deals.</p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.name} className={`rounded-2xl border p-7 ${t.featured ? "border-text bg-text text-surface" : "border-hairline bg-surfaceElevated"}`}>
              <div className={`label ${t.featured ? "text-surface/70" : "text-textMuted"}`}>{t.name}</div>
              <div className="mt-2 flex items-end gap-1"><span className="hero text-4xl">{t.price}</span><span className={`mb-1 text-sm ${t.featured ? "text-surface/70" : "text-textMuted"}`}>{t.sub}</span></div>
              <ul className="mt-5 space-y-2">
                {t.feats.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm"><Check size={15} className={`mt-0.5 shrink-0 ${t.featured ? "text-surface" : "text-brand"}`} />{f}</li>
                ))}
              </ul>
              <Link href={t.href} className="mt-6 block"><Button variant={t.featured ? "secondary" : "outline"} className="w-full">{t.cta}</Button></Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        <h2 className="hero text-3xl">Questions, answered.</h2>
        <div className="mt-6 divide-y divide-hairline">
          {FAQ.map(([q, a]) => (
            <div key={q} className="py-5"><h3 className="heading text-text">{q}</h3><p className="mt-2 text-sm text-textMuted">{a}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
