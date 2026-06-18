"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PageHeader, Chip, inputClass } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { CreatorCard } from "@/components/CreatorCard";
import { fitScore } from "@/lib/fit";

const NICHES = ["Skincare", "Beauty", "Film", "Illustration", "Fashion", "Food", "Music", "Photo"];

export default function DiscoverPage() {
  const creators = useStore((s) => s.creators);
  const savedLists = useStore((s) => s.savedLists);
  const toggleInList = useStore((s) => s.toggleInList);
  const createList = useStore((s) => s.createList);
  const toast = useStore((s) => s.toast);
  const accountType = useStore((s) => s.accountType);
  const router = useRouter();
  const isAgency = accountType === "agency";

  // Quick-save toggles membership in the first ("default") shortlist.
  const defaultList = savedLists[0];
  const savedIds = new Set(defaultList?.creatorIds ?? []);
  const quickSave = (crId: string) => {
    const listId = defaultList?.id ?? createList("Shortlist");
    toggleInList(listId, crId);
    toast(savedIds.has(crId) ? "Removed from shortlist." : "Saved to shortlist.", "success");
  };

  const [q, setQ] = useState("");
  const [niche, setNiche] = useState<string | null>("Skincare");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [rosterOnly, setRosterOnly] = useState(false);

  const results = useMemo(() => {
    return creators
      .filter((c) => (verifiedOnly ? c.verifiedHuman : true))
      .filter((c) => (rosterOnly ? c.isRosterEligible : true))
      .filter((c) => (niche ? c.niches.some((n) => n.toLowerCase().includes(niche.toLowerCase())) : true))
      .filter((c) =>
        q
          ? (c.name + c.handle + c.type + c.niches.join(" ")).toLowerCase().includes(q.toLowerCase())
          : true,
      )
      .map((c) => ({ c, fit: fitScore(c, niche ?? undefined) }))
      .sort((a, b) => b.fit - a.fit);
  }, [creators, q, niche, verifiedOnly, rosterOnly]);

  return (
    <>
      <PageHeader
        eyebrow={isAgency ? "Agency · Talent Discovery" : "Discovery · Layer 1"}
        title={isAgency ? "Talent Discovery" : "Discover Creators"}
        sub={isAgency ? "Find emerging creators to represent — open a profile and send a representation request." : "Find authentic, verified creators before they're expensive. Click any creator to see full analytics."}
        action={<Button variant="outline" onClick={() => router.push("/discover/lists")}>Saved lists</Button>}
      />

      <div className="space-y-4">
        <input
          placeholder="Search by name, handle, craft…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className={inputClass}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={!niche} onClick={() => setNiche(null)}>All niches</Chip>
          {NICHES.map((n) => (
            <Chip key={n} active={niche === n} onClick={() => setNiche(n)}>{n}</Chip>
          ))}
          <span className="mx-2 h-5 w-px bg-hairline" />
          <Chip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>Verified human</Chip>
          <Chip active={rosterOnly} onClick={() => setRosterOnly((v) => !v)}>Roster (5k+)</Chip>
        </div>
        <div className="text-xs text-textMuted">{results.length} creators · sorted by fit</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(({ c, fit }) => (
          <CreatorCard
            key={c.cr_id}
            creator={c}
            fit={fit}
            saved={savedIds.has(c.cr_id)}
            onToggleSave={() => quickSave(c.cr_id)}
            onClick={() => router.push(`/creators/${c.cr_id}`)}
          />
        ))}
      </div>
    </>
  );
}
