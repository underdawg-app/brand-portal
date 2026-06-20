import Link from "next/link";
import { Button } from "@/components/ui/Button";

const PROBLEMS = [
  ["Fake followers everywhere", "Every creator is identity- and liveness-verified. Filter to Verified-Human only."],
  ["Top creators are overpriced", "Discover rising talent early and book them at pre-fame rates."],
  ["Risky, informal deals", "Standard contracts, e-signatures and escrow protect both sides."],
  ["No way to prove ROI", "Campaign analytics: reach, engagement, clicks and conversions per creator."],
];
const TIERS = [["Spark", "₹75K–1.5L", "15–20 creators"], ["Wave", "₹1.5L–5L", "30–50 creators"], ["Storm", "₹5L–15L", "50–100 creators"], ["Takeover", "₹15L–25L+", "100+ creators"]];

export default function ForBrands() {
  return (
    <>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <span className="label text-bone/60">For Brands</span>
          <h1 className="hero mt-3 max-w-3xl text-5xl md:text-6xl">Hire authentic creators. Run measurable pushes.</h1>
          <p className="mt-4 max-w-xl text-bone/70">From a single commission to a coordinated Get Viral campaign — discover, contract, pay and measure, all in one place.</p>
          <div className="mt-7 flex gap-3"><Link href="/signup"><Button size="lg" className="bg-bone text-ink hover:bg-bone/90">Get started free</Button></Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <span className="label text-brand">What we fix</span>
        <h2 className="hero mt-2 text-3xl md:text-4xl">The problems with creator hiring.</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2">
          {PROBLEMS.map(([p, s]) => (
            <div key={p} className="bg-surface p-6"><h3 className="heading text-lg text-text">{p}</h3><p className="mt-2 text-sm text-textMuted">{s}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <span className="label text-bone/50">Get Viral</span>
          <h2 className="hero mt-2 text-3xl md:text-4xl">Coordinated campaigns, four tiers.</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map(([n, p, c]) => (
              <div key={n} className="rounded-2xl border border-white/10 bg-inkSoft p-5">
                <div className="label text-bone/50">{n}</div>
                <div className="hero mt-2 text-2xl text-bone">{p}</div>
                <div className="mt-1 text-xs text-bone/60">{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="rounded-2xl border border-hairline bg-surfaceElevated p-8">
          <span className="label text-brand">Commission work</span>
          <h2 className="heading mt-2 text-2xl text-text">Need a specific creator for a brief?</h2>
          <p className="mt-2 max-w-2xl text-sm text-textMuted">Commission any creator at any follower size — judged on craft, not reach. Escrow funds on acceptance; usage rights are standardized and clear.</p>
          <Link href="/signup" className="mt-5 inline-block"><Button>Commission a creator</Button></Link>
        </div>
      </section>
    </>
  );
}
