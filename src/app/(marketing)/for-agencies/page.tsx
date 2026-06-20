import Link from "next/link";
import { Button } from "@/components/ui/Button";

const TRACKS = [
  {
    tag: "Management",
    title: "Represent a roster of creators.",
    points: ["Discover & sign rising creators", "Negotiate deals on their behalf", "Track commission (15–25%) across the roster", "Per-creator client dashboards"],
    cta: "Start as Management",
    mode: "MANAGEMENT",
  },
  {
    tag: "Marketing",
    title: "Run campaigns for many brand clients.",
    points: ["Per-client workspaces", "Vet talent once, reuse the pool", "Multi-client jobs & campaigns", "Cross-client reporting + white-label"],
    cta: "Start as Marketing",
    mode: "MARKETING",
  },
];

export default function ForAgencies() {
  return (
    <>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <span className="label text-bone/60">For Agencies</span>
          <h1 className="hero mt-3 max-w-3xl text-5xl md:text-6xl">Two ways to work. One platform.</h1>
          <p className="mt-4 max-w-xl text-bone/70">Whether you represent creators or run campaigns for brands, manage everything — discovery, deals, escrow and reporting — in one workspace.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {TRACKS.map((t) => (
            <div key={t.tag} className="flex flex-col justify-between rounded-2xl border border-hairline bg-surfaceElevated p-8">
              <div>
                <span className="label text-brand">{t.tag}</span>
                <h2 className="heading mt-2 text-2xl text-text">{t.title}</h2>
                <ul className="mt-4 space-y-2">
                  {t.points.map((p) => <li key={p} className="flex items-start gap-2 text-sm text-textMuted"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{p}</li>)}
                </ul>
              </div>
              <Link href="/signup" className="mt-6"><Button className="w-full">{t.cta}</Button></Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="rounded-2xl bg-ink p-8 text-center text-bone">
          <h2 className="hero text-3xl md:text-4xl">Team seats, scoped access.</h2>
          <p className="mx-auto mt-3 max-w-md text-bone/70">Invite Owners, Managers, Assistants and Editors with the exact permissions they need.</p>
          <Link href="/signup" className="mt-6 inline-block"><Button size="lg" className="bg-bone text-ink hover:bg-bone/90">Get started</Button></Link>
        </div>
      </section>
    </>
  );
}
