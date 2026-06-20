"use client";

import { useState } from "react";
import { CreditCard, Plus, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, StatusBadge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { SettingsTabs } from "@/components/SettingsTabs";
import { usePermission } from "@/lib/gate";

const INITIAL = [
  { id: "pm1", label: "HDFC Bank ••••4821", kind: "Bank account (NEFT/UPI)", provider: "Razorpay", isDefault: true },
  { id: "pm2", label: "Visa ••••2043", kind: "Corporate card", provider: "Stripe", isDefault: false },
];

export default function PaymentMethods() {
  const canFinance = usePermission("viewFinancials");
  const toast = useStore((s) => s.toast);
  const [methods, setMethods] = useState(INITIAL);

  const makeDefault = (id: string) => {
    setMethods((m) => m.map((x) => ({ ...x, isDefault: x.id === id })));
    toast("Default payment method updated.", "success");
  };
  const addMethod = () => {
    setMethods((m) => [...m, { id: `pm${m.length + 1}`, label: "New UPI ••••@okhdfc", kind: "UPI", provider: "Razorpay", isDefault: false }]);
    toast("Payment method added (demo).", "success");
  };

  if (!canFinance) {
    return (
      <>
        <PageHeader eyebrow="Settings" title="Payment methods" />
        <SettingsTabs />
        <Card className="p-8 text-center text-sm text-textMuted">You don&apos;t have permission to view payment methods.</Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Payment methods"
        sub="Fund escrow and pay invoices. Razorpay (India) · Stripe (international)."
        action={<Button onClick={addMethod}><Plus size={16} /> Add method</Button>}
      />
      <SettingsTabs />
      <div className="space-y-3">
        {methods.map((m) => (
          <Card key={m.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surfaceMuted"><CreditCard size={18} className="text-text" /></div>
              <div>
                <div className="text-sm font-medium text-text">{m.label}</div>
                <div className="text-xs text-textMuted">{m.kind} · {m.provider}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {m.isDefault ? (
                <StatusBadge tone="success"><Check size={11} /> Default</StatusBadge>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => makeDefault(m.id)}>Make default</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
