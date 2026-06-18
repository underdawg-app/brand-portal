"use client";

import { useState } from "react";
import { PageHeader, Card, Label, Money, StatusBadge, Avatar, Chip, ProgressBar, Stat, EmptyState, Field, inputClass } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";

const TONES = ["neutral", "info", "accent", "success", "warn", "danger"] as const;
const SWATCHES = [
  ["ink", "#0A0A0A"], ["bone", "#F2EFE6"], ["acid", "#9CA3AF"], ["brand", "token"],
];

export default function Styleguide() {
  const [open, setOpen] = useState(false);
  const [chip, setChip] = useState("A");

  return (
    <>
      <PageHeader eyebrow="System" title="Styleguide" sub="The shared component kit. Every screen is built on these." />

      <Card className="p-6">
        <Label>Type</Label>
        <div className="mt-3 space-y-2">
          <div className="hero text-5xl text-text">STACKED HERO</div>
          <div className="heading text-2xl text-text">Cabinet Grotesk heading</div>
          <p className="font-body text-text">Space Grotesk body — 14px base, the workhorse for dense data.</p>
          <Label>Uppercase wide-tracked label</Label>
        </div>
      </Card>

      <Card className="p-6">
        <Label>Palette</Label>
        <div className="mt-3 flex flex-wrap gap-3">
          {SWATCHES.map(([name, hex]) => (
            <div key={name} className="text-center">
              <div
                className={`h-14 w-20 rounded-lg border border-hairline ${hex === "token" ? "bg-brand" : ""}`}
                style={hex === "token" ? undefined : { background: hex }}
              />
              <div className="label mt-1 text-textMuted">{name}{hex === "token" ? " *" : ""}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <Label>Buttons</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="dark">Dark</Button>
        </div>
      </Card>

      <Card className="p-6">
        <Label>Status badges</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {TONES.map((t) => <StatusBadge key={t} tone={t}>{t}</StatusBadge>)}
        </div>
      </Card>

      <Card className="p-6">
        <Label>Chips</Label>
        <div className="mt-3 flex gap-2">
          {["A", "B", "C"].map((c) => <Chip key={c} active={chip === c} onClick={() => setChip(c)}>{c}</Chip>)}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Money" value={<Money amount={135000} />} sub="INR formatting" />
        <Stat label="Money (USD)" value={<Money amount={1899} currency="USD" />} sub="USD formatting" />
        <Card className="p-4">
          <Label>Progress</Label>
          <ProgressBar value={0.6} className="mt-3" />
          <div className="mt-3 flex items-center gap-2"><Avatar name="Sola Roux" accent="#FF6BB5" /><span className="text-sm text-text">Avatar</span></div>
        </Card>
      </div>

      <Card className="p-6">
        <Label>Drawer + Field</Label>
        <div className="mt-3 max-w-sm space-y-3">
          <Field label="Example field" hint="With a hint below"><input className={inputClass} placeholder="Type…" /></Field>
          <Button onClick={() => setOpen(true)}>Open drawer</Button>
        </div>
      </Card>

      <EmptyState title="Empty state" body="Used when a list or pipeline column has nothing in it yet." action={<Button variant="outline">Do something</Button>} />

      <Drawer open={open} onOpenChange={setOpen} eyebrow="Demo" title="Side sheet">
        <p className="text-sm text-textMuted">Detail panels (applicant, creator profile) slide in from the right.</p>
      </Drawer>
    </>
  );
}
