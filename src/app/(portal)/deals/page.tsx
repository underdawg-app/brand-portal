"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PageHeader, Money, StatusBadge, Avatar, ProgressBar, EmptyState } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { dealTone, bucketOf } from "@/lib/status";
import type { Deal } from "@/lib/types";

export default function DealsPage() {
  const allDeals = useStore((s) => s.deals);
  const creators = useStore((s) => s.creators);
  const accountType = useStore((s) => s.accountType);
  const representations = useStore((s) => s.representations);
  const router = useRouter();
  const creatorOf = (id: string) => creators.find((c) => c.cr_id === id);
  const isAgency = accountType === "agency";

  // Deal Desk (Agency·Management) shows only deals for the agency's roster —
  // the agency runs these on the creator's behalf. A brand sees all its own deals.
  const rosterIds = new Set(representations.filter((r) => r.status === "ACTIVE").map((r) => r.creatorId));
  const deals = isAgency ? allDeals.filter((d) => rosterIds.has(d.creatorId)) : allDeals;

  const columns: Column<Deal>[] = [
    {
      key: "creator",
      header: "Deal",
      render: (d) => {
        const c = creatorOf(d.creatorId);
        return (
          <div className="flex items-center gap-2.5">
            <Avatar name={c?.name ?? "?"} accent={c?.accent} size={34} />
            <div>
              <div className="font-medium text-text">{c?.name}</div>
              <div className="label text-textMuted">{bucketOf(d.status)}</div>
            </div>
          </div>
        );
      },
    },
    { key: "next", header: "Next action", render: (d) => <span className="text-textMuted">{d.nextAction}</span> },
    { key: "amount", header: "Amount", render: (d) => <Money amount={d.amount} currency={d.currency} className="text-text" /> },
    {
      key: "progress",
      header: "Progress",
      render: (d) => (
        <div className="w-28">
          <ProgressBar value={d.progress} />
        </div>
      ),
    },
    { key: "status", header: "Status", render: (d) => <StatusBadge tone={dealTone[d.status]}>{d.status}</StatusBadge> },
  ];

  return (
    <>
      <PageHeader
        eyebrow={isAgency ? "Agency · Deal Desk" : "Layer 2 · Deals"}
        title={isAgency ? "Deal Desk" : "Deals"}
        sub={isAgency ? "Deals you run on behalf of your roster — same workspace, you act as the creator's rep." : "Every engagement, from negotiation to payout."}
      />
      {deals.length === 0 ? (
        <EmptyState
          title={isAgency ? "No roster deals yet" : "No deals yet"}
          body={isAgency ? "Deals appear here once a roster creator has an active engagement you manage." : "Accept an applicant to start your first deal."}
        />
      ) : (
        <DataTable columns={columns} rows={deals} onRowClick={(d) => router.push(`/deals/${d.deal_id}`)} />
      )}
    </>
  );
}
