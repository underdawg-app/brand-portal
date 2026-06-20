"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, BadgeCheck, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import GeometricBlurMesh from "@/components/ui/geometric-blur-mesh";

// Real brand + agency logos (PNG via Clearbit logo API).
const TRUSTED: { name: string; domain: string }[] = [
  { name: "Nike", domain: "nike.com" },
  { name: "Spotify", domain: "spotify.com" },
  { name: "Airbnb", domain: "airbnb.com" },
  { name: "Adobe", domain: "adobe.com" },
  { name: "Shopify", domain: "shopify.com" },
  { name: "Notion", domain: "notion.so" },
  { name: "Figma", domain: "figma.com" },
  { name: "Canva", domain: "canva.com" },
  { name: "Ogilvy", domain: "ogilvy.com" },
  { name: "Publicis", domain: "publicisgroupe.com" },
  { name: "Dentsu", domain: "dentsu.com" },
];
const CATEGORIES = ["Illustration", "Music", "Design", "Video", "Photography", "UGC", "Fashion", "Writing"];

const WHY = [
  { icon: BadgeCheck, title: "Verified-human creators", body: "Every creator is identity- and liveness-checked. No bots, no AI-grown follower farms." },
  { icon: TrendingUp, title: "Rising talent, fair prices", body: "Discover creators on the way up — book them before they're mainstream-expensive." },
  { icon: ShieldCheck, title: "Safe end-to-end", body: "Standard contracts, e-signatures and escrow. Funds release only on approved delivery." },
  { icon: Zap, title: "Get Viral campaigns", body: "Coordinated, disclosed multi-creator pushes — Spark to Takeover, fully tracked." },
];

const STEPS = [
  ["01", "Post a job — free", "Describe the work. Set budget, deliverables and usage in a guided brief."],
  ["02", "Review verified applicants", "Shortlist, compare and negotiate. Every applicant is a real, vetted creator."],
  ["03", "Pay via escrow on approval", "Sign the contract, fund escrow, approve the work — then release payment."],
];

const TIERS = [
  { name: "Brand Free", price: "₹0", line: "Post jobs, browse verified creators, run the full deal loop.", cta: "Get started" },
  { name: "Brand Pro", price: "₹2,999/mo", line: "Get Viral campaigns, advanced analytics, priority support, team seats.", cta: "Start Pro", featured: true },
  { name: "Agency", price: "Talk to us", line: "Roster management or multi-client campaigns, cross-client reporting, white-label.", cta: "For Agencies" },
];

export default function Landing() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <>
      {/* HERO — geometric wireframe mesh */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-black text-bone">
        {/* WebGL wireframe mesh — pushed back so it doesn't fight the text */}
        <div className="absolute inset-0 opacity-50">
          <GeometricBlurMesh initialShape={3} />
        </div>
        {/* legibility scrims — darker behind the centred text */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_center,rgba(0,0,0,0.85),rgba(0,0,0,0.4)_60%,transparent_80%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />

        {/* centered content */}
        <div className="pointer-events-none relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center">
          <span className="label rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-bone/80 backdrop-blur">The hiring platform for the creator economy</span>
          <h1 className="hero mt-6 max-w-4xl text-balance text-4xl text-bone sm:text-5xl md:text-6xl">
            <span className="whitespace-nowrap">Hire verified creators</span><br />
            <span className="whitespace-nowrap">before they&apos;re expensive.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-bone/70">
            Discover rising, identity-verified creators. Post a brief, review real applicants, and pay safely through escrow — start to finish.
          </p>

          {/* brief search */}
          <form
            onSubmit={(e) => { e.preventDefault(); router.push("/onboarding"); }}
            className="pointer-events-auto mt-8 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] p-2 backdrop-blur"
          >
            <Search size={18} className="ml-2 text-bone/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Describe the creative work or campaign you need…"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-bone placeholder:text-bone/40 focus:outline-none"
            />
            <Button type="submit" className="bg-bone text-ink hover:bg-bone/90">Find creators</Button>
          </form>

          {/* CTAs */}
          <div className="pointer-events-auto mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="bg-bone text-ink hover:bg-bone/90" onClick={() => router.push("/onboarding")}>Get started <ArrowRight size={16} /></Button>
            <Button size="lg" variant="outline" className="border-white/25 text-bone hover:bg-white/10" onClick={() => router.push("/login")}>Log in</Button>
          </div>
        </div>
      </section>

      {/* trusted-by — full-bleed marquee with edge fades */}
      <div className="border-y border-hairline bg-surface py-10">
        <p className="label mb-6 text-center text-textMuted">Trusted by teams hiring the next generation of creators</p>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-surface to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-surface to-transparent" />
          <Marquee speed={32}>
            {TRUSTED.map((b) => (
              <span key={b.name} className="flex shrink-0 items-center px-8 md:px-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://logo.clearbit.com/${b.domain}?size=128&format=png`}
                  alt={b.name}
                  className="h-7 w-auto max-w-[140px] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-9"
                  loading="lazy"
                />
              </span>
            ))}
          </Marquee>
        </div>
      </div>

      {/* WHY */}
      <Section eyebrow="Why Underdawg" title="Built for safe, early discovery.">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w) => (
            <div key={w.title} className="bg-surface p-6">
              <w.icon size={22} className="text-brand" />
              <h3 className="heading mt-4 text-lg text-text">{w.title}</h3>
              <p className="mt-2 text-sm text-textMuted">{w.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* DISCOVER BY CRAFT */}
      <Section eyebrow="Discover by craft" title="Every kind of creator." dark>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Link key={c} href="/onboarding" className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-inkSoft p-5">
              <span className="absolute right-4 top-4 text-bone/30 transition-transform group-hover:translate-x-1"><ArrowRight size={18} /></span>
              <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, transparent, ${["#FF6BB5", "#2E5BFF", "#FF5A1F", "#9CA3AF"][i % 4]}66)` }} />
              <div className="relative flex h-full flex-col justify-end">
                <span className="heading text-2xl text-bone">{c}</span>
                <span className="label mt-1 text-bone/50">browse →</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section eyebrow="How it works · Brands" title="Post → review → pay on approval.">
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(([n, t, b]) => (
            <div key={n} className="rounded-2xl border border-hairline bg-surfaceElevated p-6">
              <div className="hero text-4xl text-brand">{n}</div>
              <h3 className="heading mt-3 text-lg text-text">{t}</h3>
              <p className="mt-2 text-sm text-textMuted">{b}</p>
            </div>
          ))}
        </div>
        <div className="mt-6"><Link href="/onboarding"><Button size="lg">Post a job <ArrowRight size={16} /></Button></Link></div>
      </Section>

      {/* BANDS */}
      <section className="mx-auto max-w-7xl px-5 pb-4 md:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <Band eyebrow="For Agencies" title="Manage talent or run client campaigns." body="Management agencies represent a roster and earn commission; marketing agencies run campaigns for many brand clients from one vetted pool." href="/for-agencies" cta="Explore agencies" />
          <Band eyebrow="Get Viral" title="Coordinated, disclosed campaigns." body="Spark to Takeover. Pick verified creators into slots, enforce #ad disclosure, and track reach to conversions." href="/for-brands" cta="See Get Viral" dark />
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <Section eyebrow="Pricing" title="Start free. Scale when you do.">
        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.name} className={`rounded-2xl border p-6 ${t.featured ? "border-text bg-text text-surface" : "border-hairline bg-surfaceElevated"}`}>
              <div className={`label ${t.featured ? "text-surface/70" : "text-textMuted"}`}>{t.name}</div>
              <div className="hero mt-2 text-4xl">{t.price}</div>
              <p className={`mt-3 text-sm ${t.featured ? "text-surface/80" : "text-textMuted"}`}>{t.line}</p>
              <Link href={t.name === "Agency" ? "/for-agencies" : "/onboarding"} className="mt-5 block">
                <Button variant={t.featured ? "secondary" : "outline"} className="w-full">{t.cta}</Button>
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-textMuted">Platform fee 12% on deals · GST 18% on invoices · escrow held until approval.</p>
      </Section>

      {/* FINAL CTA — award statement */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink py-28 text-bone">
        <div className="pointer-events-none absolute inset-0 flex items-center opacity-[0.05]">
          <Marquee speed={45}>
            <span className="hero whitespace-nowrap pr-12 text-[17vw] leading-none">GET DISCOVERED · GET CONNECTED · GET PAID · </span>
          </Marquee>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_center,transparent,rgba(10,10,10,0.85))]" />
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
          <span className="label text-bone/50">Start in minutes</span>
          <h2 className="hero mt-4 text-balance text-5xl text-bone md:text-7xl">Find your next creator today.</h2>
          <p className="mx-auto mt-5 max-w-md text-bone/70">Free to post. Verified creators. Escrow-protected, start to finish.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/onboarding"><Button size="lg" className="bg-bone text-ink hover:bg-bone/90">Get started <ArrowRight size={16} /></Button></Link>
            <Link href="/login"><Button size="lg" variant="outline" className="border-white/30 text-bone hover:bg-white/10">Log in</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({ eyebrow, title, children, dark }: { eyebrow: string; title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section className={dark ? "bg-ink text-bone" : ""}>
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <span className={`label ${dark ? "text-bone/50" : "text-brand"}`}>{eyebrow}</span>
        <h2 className={`hero mt-2 max-w-3xl text-3xl md:text-4xl ${dark ? "text-bone" : "text-text"}`}>{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function Band({ eyebrow, title, body, href, cta, dark }: { eyebrow: string; title: string; body: string; href: string; cta: string; dark?: boolean }) {
  return (
    <div className={`flex flex-col justify-between rounded-2xl border p-8 ${dark ? "border-white/10 bg-ink text-bone" : "border-hairline bg-surfaceElevated"}`}>
      <div>
        <span className={`label ${dark ? "text-bone/50" : "text-brand"}`}>{eyebrow}</span>
        <h3 className={`heading mt-2 text-2xl ${dark ? "text-bone" : "text-text"}`}>{title}</h3>
        <p className={`mt-3 text-sm ${dark ? "text-bone/70" : "text-textMuted"}`}>{body}</p>
      </div>
      <Link href={href} className="mt-6">
        <Button variant={dark ? "secondary" : "outline"}>{cta} <ArrowRight size={16} /></Button>
      </Link>
    </div>
  );
}
