"use client";

import { useStore } from "@/lib/store";
import { PageHeader, Money, StatusBadge, Avatar, Stat, Label } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { dealTone } from "@/lib/status";

interface Row {
  dealId: string;
  creatorId: string;
  title: string;
  gross: number;
  rate: number;
  commission: number;
  status: string;
}

export default function CommissionsPage() {
  const reps = useStore((s) => s.representations).filter((r) => r.status === "ACTIVE");
  const deals = useStore((s) => s.deals);
  const creators = useStore((s) => s.creators);
  const creatorOf = (id: string) => creators.find((c) => c.cr_id === id);

  const rosterIds = new Map(reps.map((r) => [r.creatorId, r.commissionRate]));
  const rows: Row[] = deals
    .filter((d) => rosterIds.has(d.creatorId))
    .map((d) => {
      const rate = rosterIds.get(d.creatorId)!;
      return { dealId: d.deal_id, creatorId: d.creatorId, title: d.title, gross: d.amount, rate, commission: Math.round((d.amount * rate) / 100), status: d.status };
    });

  const earned = rows.filter((r) => r.status === "COMPLETED").reduce((s, r) => s + r.commission, 0);
  const pipeline = rows.filter((r) => r.status !== "COMPLETED" && r.status !== "CANCELLED").reduce((s, r) => s + r.commission, 0);

  const columns: Column<Row>[] = [
    {
      key: "creator", header: "Creator",
      render: (r) => {
        const c = creatorOf(r.creatorId);
        return <div className="flex items-center gap-2.5"><Avatar name={c?.name ?? "?"} accent={c?.accent} size={30} /><span className="text-text">{c?.name}</span></div>;
      },
    },
    { key: "deal", header: "Deal", render: (r) => <span className="text-textMuted">{r.title}</span> },
    { key: "gross", header: "Gross", render: (r) => <Money amount={r.gross} className="text-text" /> },
    { key: "rate", header: "Rate", render: (r) => <span className="text-textMuted">{r.rate}%</span> },
    { key: "commission", header: "Commission", render: (r) => <Money amount={r.commission} className="text-text" /> },
    { key: "status", header: "Status", render: (r) => <StatusBadge tone={dealTone[r.status as keyof typeof dealTone] ?? "neutral"}>{r.status}</StatusBadge> },
  ];

  return (
    <>
      <PageHeader eyebrow="Agency · Management" title="Commissions" sub="Your cut across roster deals, reconciled by creator." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Earned (completed)" value={<Money amount={earned} />} sub="reconciled" />
        <Stat label="In pipeline" value={<Money amount={pipeline} />} sub="open deals" />
        <Stat label="Roster size" value={reps.length} sub="active creators" />
      </div>
      <div>
        <Label>Deal-by-deal</Label>
        <div className="mt-3"><DataTable columns={columns} rows={rows} empty="No roster deals yet." /></div>
      </div>
    </>
  );
}
