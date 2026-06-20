import Link from "next/link";
import { Logo } from "@/components/Logo";

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "For Brands",
    links: [["How to hire", "/how-it-works"], ["Browse creators", "/onboarding"], ["Post a job", "/onboarding"], ["Get Viral", "/for-brands"], ["Commission work", "/for-brands"], ["Pricing", "/pricing"]],
  },
  {
    title: "For Agencies",
    links: [["How it works", "/for-agencies"], ["Manage talent", "/for-agencies"], ["Run client campaigns", "/for-agencies"], ["Pricing", "/pricing"]],
  },
  {
    title: "Company",
    links: [["About", "/"], ["Careers", "/"], ["Press", "/"], ["Contact", "/"], ["Blog", "/"]],
  },
  {
    title: "Trust & Legal",
    links: [["Trust & Safety", "/"], ["Verified-Human", "/"], ["Terms", "/"], ["Privacy", "/"], ["GST/Tax info", "/"]],
  },
];

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-bone">
      <div className="mx-auto max-w-7xl px-5 pt-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Logo height={26} variant="white" />
            <p className="mt-4 max-w-xs text-sm text-bone/55">
              Hire verified-human creators before they&apos;re expensive. Contracts and escrow, end to end.
            </p>
            <Link href="/onboarding" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-bone transition-colors hover:bg-white/10">
              Get started →
            </Link>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="label text-bone/40">{c.title}</div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-bone/70 transition-colors hover:text-bone">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 py-7 text-xs text-bone/45 sm:flex-row sm:items-center">
          <span>© MMXXVI Underdawg. Built for the creator economy.</span>
          <span className="label">Get Discovered · Get Connected · Get Paid</span>
        </div>
      </div>

      {/* oversized wordmark — award-style sign-off */}
      <div className="pointer-events-none select-none overflow-hidden px-2">
        <div className="hero text-center text-[22vw] leading-[0.72] text-bone/[0.06]">UNDERDAWG</div>
      </div>
    </footer>
  );
}
