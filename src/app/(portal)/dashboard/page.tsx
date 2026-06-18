"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, FileSignature, Eye, Wallet, Star, Plus, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Stat, Label, Money, ProgressBar, StatusBadge, Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { KanbanBoard, KanbanColumn } from "@/components/ui/Kanban";
import { bucketOf, dealTone } from "@/lib/status";
import { compact } from "@/lib/format";
import type { Deal } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const accountType = useStore((s) => s.accountType);
  const deals = useStore((s) => s.deals);
  const escrows = useStore((s) => s.escrows);
  const creatorById = (id: string) => useStore.getState().creators.find((c) => c.cr_id === id);

  if (accountType === "agency") return <AgencyDashboard />;

  const buckets = {
    PROPOSED: deals.filter((d) => bucketOf(d.status) === "PROPOSED"),
    ACTIVE: deals.filter((d) => bucketOf(d.status) === "ACTIVE"),
    CLOSED: deals.filter((d) => bucketOf(d.status) === "CLOSED"),
  };

  const escrowHeld = escrows
    .filter((e) => e.status !== "PAID")
    .reduce((sum, e) => sum + e.grossAmount, 0);
  const totalCommitted = deals
    .filter((d) => d.status !== "COMPLETED" && d.status !== "CANCELLED")
    .reduce((s, d) => s + d.amount, 0);

  const actionItems = buildActions(deals);

  return (
    <>
      <PageHeader
        eyebrow="Copperleaf · Verified Brand"
        title="Command Centre"
        sub="Every deal, dollar and decision in one place. Prove one loop, then scale."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/discover")}><Search size={16} /> Discover creators</Button>
            <Button onClick={() => router.push("/jobs/new")}><Plus size={16} /> Post a job</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active deals" value={buckets.ACTIVE.length + buckets.PROPOSED.length} sub="in pipeline" />
        <Stat label="Committed spend" value={<Money amount={totalCommitted} />} sub="across open deals" />
        <Stat label="Held in escrow" value={<Money amount={escrowHeld} />} sub="awaiting approval" />
        <Stat label="Completed" value={buckets.CLOSED.length} sub="all-time" />
      </div>

      {/* Action items */}
      <Card className="p-5">
        <Label>Needs you</Label>
        <div className="mt-3 divide-y divide-hairline">
          {actionItems.length === 0 && <p className="py-4 text-sm text-textMuted">All caught up. Nice.</p>}
          {actionItems.map((a) => (
            <Link
              key={a.dealId}
              href={`/deals/${a.dealId}`}
              className="flex items-center gap-3 py-3 text-sm hover:opacity-80"
            >
              <a.icon size={16} className="text-brand" />
              <span className="flex-1 text-text">{a.label}</span>
              <span className="text-textMuted">{a.title}</span>
              <ArrowRight size={14} className="text-textMuted" />
            </Link>
          ))}
        </div>
      </Card>

      {/* Pipeline kanban */}
      <div>
        <Label>Pipeline</Label>
        <div className="mt-3">
          <KanbanBoard>
            {(["PROPOSED", "ACTIVE", "CLOSED"] as const).map((b) => (
              <KanbanColumn key={b} title={b} count={buckets[b].length}>
                {buckets[b].map((d) => {
                  const c = creatorById(d.creatorId);
                  return (
                    <Link key={d.deal_id} href={`/deals/${d.deal_id}`}>
                      <Card className="p-3 transition-colors hover:border-hairlineStrong">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Avatar name={c?.name ?? "?"} accent={c?.accent} size={26} />
                            <span className="truncate text-sm font-medium text-text">{c?.name}</span>
                          </div>
                          <StatusBadge tone={dealTone[d.status]}>{d.status}</StatusBadge>
                        </div>
                        <div className="mt-2 text-xs text-textMuted">{d.nextAction}</div>
                        <div className="mt-3 flex items-center justify-between">
                          <Money amount={d.amount} currency={d.currency} className="text-sm text-text" />
                          <span className="text-xs text-textMuted">{Math.round(d.progress * 100)}%</span>
                        </div>
                        <ProgressBar value={d.progress} className="mt-1.5" />
                      </Card>
                    </Link>
                  );
                })}
                {buckets[b].length === 0 && (
                  <p className="px-1 py-6 text-center text-xs text-textMuted">Empty</p>
                )}
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </div>
      </div>
    </>
  );
}

function buildActions(deals: Deal[]) {
  const items: { dealId: string; label: string; title: string; icon: typeof Eye }[] = [];
  for (const d of deals) {
    if (d.status === "CONTRACT") items.push({ dealId: d.deal_id, label: "Counter-sign contract", title: d.title, icon: FileSignature });
    else if (d.status === "IN REVIEW") items.push({ dealId: d.deal_id, label: "Review deliverable", title: d.title, icon: Eye });
    else if (d.status === "COMPLETED") items.push({ dealId: d.deal_id, label: "Rate the creator", title: d.title, icon: Star });
    else if (d.status === "ACTIVE") items.push({ dealId: d.deal_id, label: "Awaiting delivery / release", title: d.title, icon: Wallet });
  }
  return items;
}

// ---------------------------------------------------------------- Agency home
function AgencyDashboard() {
  const agencyMode = useStore((s) => s.agencyMode);
  if (agencyMode === "MARKETING") return <MarketingDashboard />;
  return <ManagementDashboard />;
}

function MarketingDashboard() {
  const router = useRouter();
  const agency = useStore((s) => s.agency);
  const clients = useStore((s) => s.clients);
  const campaigns = useStore((s) => s.campaigns);

  const spend = clients.reduce((s, c) => s + c.spend, 0);
  const reach = clients.reduce((s, c) => s + c.reach, 0);
  const jobs = clients.reduce((s, c) => s + c.activeJobs, 0);

  return (
    <>
      <PageHeader
        eyebrow={`${agency.name} · Agency · Marketing`}
        title="Agency Home"
        sub="Clients, campaigns and cross-client performance at a glance."
        action={<Button onClick={() => router.push("/clients")}>Manage clients</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Clients" value={clients.length} sub="active" />
        <Stat label="Managed spend" value={<Money amount={spend} />} sub="across clients" />
        <Stat label="Reach delivered" value={compact(reach)} sub="aggregate" />
        <Stat label="Active jobs" value={jobs} sub="across clients" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Label>Clients</Label>
            <Link href="/clients" className="label text-brand hover:underline">View all</Link>
          </div>
          <div className="mt-3 space-y-2">
            {clients.map((c) => (
              <button key={c.client_id} onClick={() => { router.push("/clients"); }} className="flex w-full items-center justify-between rounded-lg border border-hairline p-2.5 text-left hover:border-hairlineStrong">
                <div className="flex items-center gap-2.5"><Avatar name={c.brandName} accent="#9CA3AF" size={30} /><span className="text-sm text-text">{c.brandName}</span></div>
                <span className="text-xs text-textMuted">{c.activeJobs} jobs · {c.activeCampaigns} campaigns</span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Label>Campaigns</Label>
            <Link href="/campaigns" className="label text-brand hover:underline">View all</Link>
          </div>
          <div className="mt-3 space-y-2">
            {campaigns.map((c) => (
              <button key={c.campaign_id} onClick={() => router.push(`/campaigns/${c.campaign_id}`)} className="flex w-full items-center justify-between rounded-lg border border-hairline p-2.5 text-left hover:border-hairlineStrong">
                <span className="text-sm text-text">{c.name}</span>
                <StatusBadge tone={c.status === "LIVE" ? "accent" : "info"}>{c.status}</StatusBadge>
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push("/reporting")}>Open reporting →</Button>
        </Card>
      </div>
    </>
  );
}

function ManagementDashboard() {
  const router = useRouter();
  const agency = useStore((s) => s.agency);
  const reps = useStore((s) => s.representations);
  const deals = useStore((s) => s.deals);
  const creators = useStore((s) => s.creators);

  const active = reps.filter((r) => r.status === "ACTIVE");
  const requested = reps.filter((r) => r.status === "REQUESTED");
  const rosterIds = new Map(active.map((r) => [r.creatorId, r.commissionRate]));
  const rosterDeals = deals.filter((d) => rosterIds.has(d.creatorId));
  const earned = rosterDeals.filter((d) => d.status === "COMPLETED").reduce((s, d) => s + Math.round((d.amount * (rosterIds.get(d.creatorId) ?? 0)) / 100), 0);
  const pipeline = rosterDeals.filter((d) => d.status !== "COMPLETED" && d.status !== "CANCELLED").reduce((s, d) => s + Math.round((d.amount * (rosterIds.get(d.creatorId) ?? 0)) / 100), 0);
  const creatorOf = (id: string) => creators.find((c) => c.cr_id === id);

  return (
    <>
      <PageHeader
        eyebrow={`${agency.name} · Agency · Management`}
        title="Agency Home"
        sub="Your roster, deal pipeline, and commission at a glance."
        action={<Button onClick={() => router.push("/discover")}>Find talent</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Roster" value={active.length} sub={`${requested.length} pending`} />
        <Stat label="Roster deals" value={rosterDeals.length} sub="in flight + closed" />
        <Stat label="Commission earned" value={<Money amount={earned} />} sub="completed" />
        <Stat label="Commission pipeline" value={<Money amount={pipeline} />} sub="open deals" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Label>Roster</Label>
            <Link href="/roster" className="label text-brand hover:underline">View all</Link>
          </div>
          <div className="mt-3 space-y-2">
            {active.map((r) => {
              const c = creatorOf(r.creatorId);
              return (
                <button key={r.rep_id} onClick={() => router.push(`/creators/${r.creatorId}`)} className="flex w-full items-center justify-between rounded-lg border border-hairline p-2.5 text-left hover:border-hairlineStrong">
                  <div className="flex items-center gap-2.5"><Avatar name={c?.name ?? "?"} accent={c?.accent} size={30} /><span className="text-sm text-text">{c?.name}</span></div>
                  <StatusBadge tone="info">{r.commissionRate}%</StatusBadge>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Label>Representation requests</Label>
            <Link href="/representation" className="label text-brand hover:underline">Manage</Link>
          </div>
          <div className="mt-3 space-y-2">
            {requested.length === 0 && <p className="text-sm text-textMuted">No pending requests.</p>}
            {requested.map((r) => {
              const c = creatorOf(r.creatorId);
              return (
                <div key={r.rep_id} className="flex items-center justify-between rounded-lg border border-hairline p-2.5">
                  <div className="flex items-center gap-2.5"><Avatar name={c?.name ?? "?"} accent={c?.accent} size={30} /><span className="text-sm text-text">{c?.name}</span></div>
                  <StatusBadge tone="warn">REQUESTED</StatusBadge>
                </div>
              );
            })}
          </div>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push("/deals")}>Open Deal Desk →</Button>
        </Card>
      </div>
    </>
  );
}
