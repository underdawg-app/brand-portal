"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { inputClass } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/** Global search across creators, jobs and deals (§5). */
export function GlobalSearch() {
  const router = useRouter();
  const creators = useStore((s) => s.creators);
  const jobs = useStore((s) => s.jobs);
  const deals = useStore((s) => s.deals);
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const term = q.trim().toLowerCase();
  const results = term
    ? [
        ...creators.filter((c) => (c.name + c.handle + c.type).toLowerCase().includes(term)).slice(0, 4).map((c) => ({ type: "Creator", label: c.name, sub: c.handle, href: `/creators/${c.cr_id}` })),
        ...jobs.filter((j) => j.title.toLowerCase().includes(term)).slice(0, 3).map((j) => ({ type: "Job", label: j.title, sub: j.type, href: `/jobs/${j.job_id}` })),
        ...deals.filter((d) => d.title.toLowerCase().includes(term)).slice(0, 3).map((d) => ({ type: "Deal", label: d.title, sub: d.status, href: `/deals/${d.deal_id}` })),
      ]
    : [];

  const go = (href: string) => { setQ(""); setFocused(false); router.push(href); };

  return (
    <div className="relative ml-4 hidden max-w-md flex-1 md:block">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
      <input
        placeholder="Search creators, jobs, deals…"
        className={cn(inputClass, "pl-9")}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />
      {focused && term && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-hairline bg-surfaceElevated shadow-xl">
          {results.length === 0 ? (
            <div className="px-3 py-4 text-sm text-textMuted">No matches.</div>
          ) : (
            results.map((r) => (
              <button key={r.type + r.href} onMouseDown={() => go(r.href)} className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm hover:bg-surfaceMuted">
                <span className="text-text">{r.label} <span className="text-textMuted">· {r.sub}</span></span>
                <span className="label text-textMuted">{r.type}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
