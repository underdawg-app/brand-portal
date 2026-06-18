"use client";

import { ShieldCheck, Clock, ShieldAlert, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Field, inputClass, StatusBadge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { SettingsTabs } from "@/components/SettingsTabs";

const UNLOCKS = [
  "View creator contact & rates marked “Verified Brands Only”",
  "Post jobs and commissions",
  "Run Get Viral campaigns",
  "Show the Verified Brand badge to creators",
];

export default function VerificationPage() {
  const brand = useStore((s) => s.brand);
  const submit = useStore((s) => s.submitVerification);
  const approve = useStore((s) => s.approveVerification);
  const toast = useStore((s) => s.toast);
  const status = brand.verificationStatus;

  return (
    <>
      <PageHeader eyebrow="Settings" title="Verification" sub="Become a Verified Brand to unlock posting, campaigns and restricted creator info." />
      <SettingsTabs />

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <Label>Current status</Label>
          <StatusBadge tone={status === "VERIFIED" ? "success" : status === "PENDING" ? "warn" : status === "REJECTED" ? "danger" : "neutral"}>
            {status}
          </StatusBadge>
        </div>
        <div className="mt-4 flex items-start gap-3">
          {status === "VERIFIED" ? <ShieldCheck size={20} className="text-brand" />
            : status === "PENDING" ? <Clock size={20} className="text-textMuted" />
            : <ShieldAlert size={20} className="text-brand" />}
          <p className="text-sm text-textSoft">
            {status === "VERIFIED" && `Verified on ${brand.kyc?.verifiedAt ?? "—"}. All gated features are unlocked.`}
            {status === "PENDING" && "Your documents are under review. This usually takes 1–2 business days."}
            {status === "UNVERIFIED" && "Submit your business identity to get verified."}
            {status === "REJECTED" && "Your submission was rejected — please correct the details and resubmit."}
          </p>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <Label>Business identity (KYC)</Label>
          <div className="mt-3 space-y-4">
            <Field label="Legal company name"><input className={inputClass} defaultValue={brand.legalName} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="GSTIN"><input className={inputClass} defaultValue={brand.kyc?.gstin} placeholder="29ABCDE1234F1Z5" /></Field>
              <Field label="PAN"><input className={inputClass} defaultValue={brand.kyc?.pan} placeholder="ABCDE1234F" /></Field>
            </div>
            <Field label="Registration document">
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-hairlineStrong px-3 py-4 text-sm text-textMuted">
                <Upload size={16} /> Drag & drop or browse (PDF, JPG)
              </div>
            </Field>
          </div>
        </Card>

        <Card className="p-5">
          <Label>Authorized contact</Label>
          <div className="mt-3 space-y-4">
            <Field label="Name"><input className={inputClass} defaultValue={brand.kyc?.contactName} /></Field>
            <Field label="Work email"><input className={inputClass} defaultValue={brand.kyc?.contactEmail} /></Field>
            <Field label="Phone"><input className={inputClass} defaultValue={brand.kyc?.contactPhone} /></Field>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <Label>What verification unlocks</Label>
        <ul className="mt-3 space-y-1.5 text-sm text-textMuted">
          {UNLOCKS.map((u) => <li key={u}>· {u}</li>)}
        </ul>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
        <span className="text-xs text-textMuted">Demo controls let you walk the Unverified → Pending → Verified flow.</span>
        <div className="flex gap-2">
          {(status === "UNVERIFIED" || status === "REJECTED") && (
            <Button onClick={() => { submit(); toast("Submitted for verification.", "success"); }}>
              {status === "REJECTED" ? "Resubmit" : "Submit for verification"}
            </Button>
          )}
          {status === "PENDING" && (
            <Button onClick={() => { approve(); toast("Verification approved — you're a Verified Brand.", "success"); }}>
              Simulate approval
            </Button>
          )}
          {status === "VERIFIED" && (
            <Button variant="outline" onClick={() => { submit(); toast("Reset to pending (demo).", "default"); }}>
              Re-run verification (demo)
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
