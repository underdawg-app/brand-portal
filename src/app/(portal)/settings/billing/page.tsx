"use client";

import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Money, StatusBadge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { SettingsTabs } from "@/components/SettingsTabs";
import { usePermission } from "@/lib/gate";

export default function BillingSettings() {
  const brand = useStore((s) => s.brand);
  const toast = useStore((s) => s.toast);
  const canFinance = usePermission("viewFinancials");

  if (!canFinance) {
    return (
      <>
        <PageHeader eyebrow="Settings" title="Billing" />
        <SettingsTabs />
        <Card className="p-8 text-center text-sm text-textMuted">You don&apos;t have permission to view billing.</Card>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Settings" title="Billing" sub="Your plan and billing provider." />
      <SettingsTabs />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Label>Current plan</Label>
            <StatusBadge tone="accent">{brand.billing?.plan ?? "Free"}</StatusBadge>
          </div>
          <div className="mt-3 font-heavy text-2xl text-text">{brand.billing?.plan ?? "Free"}</div>
          <p className="mt-1 text-sm text-textMuted">Billed monthly · platform fee 12% applies to deals.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => toast("Plan management opens with billing provider (demo).", "default")}>Change plan</Button>
        </Card>
        <Card className="p-5">
          <Label>Billing provider</Label>
          <div className="mt-3 space-y-2 text-sm">
            <Row k="Provider" v={brand.billing?.provider ?? "RAZORPAY"} />
            <Row k="Currency" v={brand.billing?.currency ?? "INR"} />
            <Row k="Customer ID" v={brand.billing?.customerId ?? "—"} />
          </div>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => toast("Redirecting to your billing provider (demo).", "default")}>Manage in provider</Button>
        </Card>
      </div>
      <Card className="p-5 text-sm text-textMuted">
        Next invoice estimate <Money amount={0} className="text-text" /> — usage-based; deals are charged via the 12% platform fee at payout.
      </Card>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-textMuted">{k}</span>
      <span className="text-text">{v}</span>
    </div>
  );
}
