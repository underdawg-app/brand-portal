"use client";

import { useState } from "react";
import { PageHeader, Card, Label } from "@/components/ui/primitives";
import { SettingsTabs } from "@/components/SettingsTabs";

const CATEGORIES = [
  ["New applicants", "When a creator applies to one of your jobs"],
  ["Deal updates", "Stage changes, counter-offers, signatures"],
  ["Deliverables", "Submissions and revisions awaiting review"],
  ["Payments", "Escrow funded / released, invoices issued"],
  ["Messages", "New messages on deal & request threads"],
  ["Campaigns", "Slot acceptances and campaign milestones"],
];

export default function NotificationsSettings() {
  const [prefs, setPrefs] = useState(() => CATEGORIES.map(() => ({ inApp: true, email: true })));

  return (
    <>
      <PageHeader eyebrow="Settings" title="Notifications" sub="Choose what you're notified about and where." />
      <SettingsTabs />
      <Card className="p-5">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-8 gap-y-1">
          <span />
          <Label>In-app</Label>
          <Label>Email</Label>
          {CATEGORIES.map(([title, desc], i) => (
            <FragmentRow
              key={title}
              title={title}
              desc={desc}
              inApp={prefs[i].inApp}
              email={prefs[i].email}
              onToggle={(k) => setPrefs((p) => p.map((row, j) => (j === i ? { ...row, [k]: !row[k] } : row)))}
            />
          ))}
        </div>
      </Card>
    </>
  );
}

function FragmentRow({
  title, desc, inApp, email, onToggle,
}: {
  title: string; desc: string; inApp: boolean; email: boolean; onToggle: (k: "inApp" | "email") => void;
}) {
  return (
    <>
      <div className="border-t border-hairline py-3">
        <div className="text-sm text-text">{title}</div>
        <div className="text-xs text-textMuted">{desc}</div>
      </div>
      <Toggle on={inApp} onClick={() => onToggle("inApp")} />
      <Toggle on={email} onClick={() => onToggle("email")} />
    </>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-5 w-9 shrink-0 rounded-full border transition-colors ${on ? "border-brand bg-brand" : "border-hairlineStrong bg-surfaceMuted"}`}
    >
      <span className={`block h-4 w-4 rounded-full bg-surfaceElevated transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}
