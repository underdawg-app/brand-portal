"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useBrandColor } from "@/lib/useBrandColor";
import { PageHeader, Card, Label, Money, Stat } from "@/components/ui/primitives";
import { Bars } from "@/components/ui/Charts";
import { compact } from "@/lib/format";

export default function ReportingPage() {
  const clients = useStore((s) => s.clients);
  const toast = useStore((s) => s.toast);
  const brandColor = useBrandColor();
  const [whiteLabel, setWhiteLabel] = useState(false);

  const totalSpend = clients.reduce((s, c) => s + c.spend, 0);
  const totalReach = clients.reduce((s, c) => s + c.reach, 0);
  const totalJobs = clients.reduce((s, c) => s + c.activeJobs, 0);
  const totalCampaigns = clients.reduce((s, c) => s + c.activeCampaigns, 0);
  const chartData = clients.map((c) => ({ label: c.brandName.split(" ")[0], value: Math.round(c.reach / 1000) }));

  return (
    <>
      <PageHeader eyebrow="Agency · Marketing" title="Cross-client Reporting" sub="Performance aggregated across every client and campaign." />

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Total managed spend" value={<Money amount={totalSpend} />} sub={`${clients.length} clients`} />
        <Stat label="Reach delivered" value={compact(totalReach)} sub="aggregate" />
        <Stat label="Active jobs" value={totalJobs} sub="across clients" />
        <Stat label="Active campaigns" value={totalCampaigns} sub="across clients" />
      </div>

      <Card className="p-5">
        <Label>Reach by client (000s)</Label>
        <div className="mt-4">
          <Bars data={chartData} height={240} color={brandColor} />
        </div>
      </Card>

      <Card className="p-5">
        <Label>Per-client breakdown</Label>
        <div className="mt-3 divide-y divide-hairline">
          {clients.map((c) => (
            <div key={c.client_id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-text">{c.brandName} <span className="text-textMuted">· {c.industry}</span></span>
              <div className="flex items-center gap-6 text-textMuted">
                <span>{c.activeJobs} jobs · {c.activeCampaigns} campaigns</span>
                <span>reach {compact(c.reach)}</span>
                <Money amount={c.spend} className="text-text" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <Label>White-label</Label>
          <p className="mt-1 text-sm text-textMuted">Show client-facing reports under your agency&apos;s branding instead of Underdawg&apos;s.</p>
        </div>
        <button
          onClick={() => { setWhiteLabel((v) => !v); toast(whiteLabel ? "White-label off." : "White-label on — reports use your branding.", "success"); }}
          className={`h-6 w-11 shrink-0 rounded-full border transition-colors ${whiteLabel ? "border-brand bg-brand" : "border-hairlineStrong bg-surfaceMuted"}`}
        >
          <span className={`block h-5 w-5 rounded-full bg-surfaceElevated transition-transform ${whiteLabel ? "translate-x-5" : "translate-x-0.5"}`} />
        </button>
      </Card>
    </>
  );
}
