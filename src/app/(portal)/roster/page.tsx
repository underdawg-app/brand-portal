"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PageHeader, Money, StatusBadge, Avatar, Label, EmptyState } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { compact } from "@/lib/format";
import type { Representation } from "@/lib/types";

export default function RosterPage() {
  const router = useRouter();
  const reps = useStore((s) => s.representations).filter((r) => r.status === "ACTIVE");
  const creators = useStore((s) => s.creators);
  const deals = useStore((s) => s.deals);

  const creatorOf = (id: string) => creators.find((c) => c.cr_id === id);
  const commissionFor = (r: Representation) => {
    const earned = deals.filter((d) => d.creatorId === r.creatorId && d.status === "COMPLETED").reduce((s, d) => s + d.amount, 0);
    return Math.round((earned * r.commissionRate) / 100);
  };

  const columns: Column<Representation>[] = [
    {
      key: "creator", header: "Creator",
      render: (r) => {
        const c = creatorOf(r.creatorId);
        return (
          <div className="flex items-center gap-2.5">
            <Avatar name={c?.name ?? "?"} accent={c?.accent} size={34} />
            <div><div className="font-medium text-text">{c?.name}</div><div className="text-xs text-textMuted">{c?.handle} · {c?.type}</div></div>
          </div>
        );
      },
    },
    { key: "followers", header: "Followers", render: (r) => <span className="text-textMuted">{compact(creatorOf(r.creatorId)?.stats.followers ?? 0)}</span> },
    { key: "rep", header: "Reputation", render: (r) => <span className="text-text">{creatorOf(r.creatorId)?.stats.reputation}</span> },
    { key: "rate", header: "Commission", render: (r) => <StatusBadge tone="info">{r.commissionRate}%</StatusBadge> },
    { key: "due", header: "Commission due", render: (r) => <Money amount={commissionFor(r)} className="text-text" /> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Agency · Management"
        title="Roster"
        sub="Your represented creators. Click a creator for their client dashboard."
        action={<Button variant="outline" onClick={() => router.push("/discover")}>Find talent</Button>}
      />
      {reps.length === 0 ? (
        <EmptyState title="No creators yet" body="Discover and represent rising creators to build your roster." action={<Button onClick={() => router.push("/discover")}>Find talent</Button>} />
      ) : (
        <DataTable columns={columns} rows={reps} onRowClick={(r) => router.push(`/creators/${r.creatorId}`)} />
      )}
      <div className="rounded-xl border border-dashed border-hairline p-4">
        <Label>Tip</Label>
        <p className="mt-1 text-sm text-textMuted">Opening a creator shows their full analytics — the client dashboard you manage on their behalf.</p>
      </div>
    </>
  );
}
