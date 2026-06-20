"use client";

import { BadgeCheck, Check, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Avatar, StatusBadge, Field, inputClass } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { SettingsTabs } from "@/components/SettingsTabs";
import { usePermission } from "@/lib/gate";
import type { Permissions } from "@/lib/types";

const PERM_LABELS: Record<keyof Permissions, string> = {
  viewAnalytics: "View analytics",
  replyToMessages: "Reply to messages",
  acceptOrSignDeals: "Accept / sign deals",
  postJobsOrCampaigns: "Post jobs / campaigns",
  editCompanyProfile: "Edit company profile",
  viewFinancials: "View financials",
  manageCampaigns: "Manage campaigns",
};

export default function SettingsPage() {
  const brand = useStore((s) => s.brand);
  const members = useStore((s) => s.members);
  const toast = useStore((s) => s.toast);
  const canEdit = usePermission("editCompanyProfile");
  const permKeys = Object.keys(PERM_LABELS) as (keyof Permissions)[];

  return (
    <>
      <PageHeader eyebrow="Settings" title="Company & Team" sub="Profile, verification, billing and team seats." />
      <SettingsTabs />

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <Label>Company profile</Label>
          <StatusBadge tone={brand.verificationStatus === "VERIFIED" ? "success" : "warn"}>
            {brand.verificationStatus === "VERIFIED" ? "Verified Brand" : brand.verificationStatus}
          </StatusBadge>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Brand name"><input className={inputClass} defaultValue={brand.name} /></Field>
          <Field label="Legal name"><input className={inputClass} defaultValue={brand.legalName} /></Field>
          <Field label="Industry"><input className={inputClass} defaultValue={brand.industry} /></Field>
          <Field label="Website"><input className={inputClass} defaultValue={brand.website} /></Field>
          <Field label="GSTIN"><input className={inputClass} defaultValue={brand.kyc?.gstin} /></Field>
          <Field label="PAN"><input className={inputClass} defaultValue={brand.kyc?.pan} /></Field>
        </div>
        <div className="mt-4 flex justify-end border-t border-hairline pt-4">
          <Button disabled={!canEdit} title={canEdit ? undefined : "You don't have permission to edit the profile"} onClick={() => toast("Company profile saved.", "success")}>
            Save changes
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <BadgeCheck size={16} className="text-brand" />
          <Label>Verification unlocks</Label>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-textMuted">
          <li>· View creator contact + rates marked “Verified Brands Only”</li>
          <li>· Post jobs and run Get Viral campaigns</li>
          <li>· The Verified Brand badge shown to creators</li>
        </ul>
      </Card>

      <div>
        <Label>Team seats & permissions</Label>
        <div className="mt-3 overflow-hidden rounded-xl border border-hairline">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surfaceMuted/40">
                <th className="label px-4 py-3 text-left text-textMuted">Member</th>
                <th className="label px-4 py-3 text-left text-textMuted">Role</th>
                {permKeys.map((p) => (
                  <th key={p} className="label px-2 py-3 text-center text-textMuted" title={PERM_LABELS[p]}>
                    {PERM_LABELS[p].split(" ").map((w) => w[0]).join("")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.member_id} className="border-b border-hairline last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={m.name} size={28} />
                      <div>
                        <div className="text-text">{m.name}</div>
                        <div className="text-xs text-textMuted">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge tone={m.role === "OWNER" ? "info" : "neutral"}>{m.role}</StatusBadge></td>
                  {permKeys.map((p) => (
                    <td key={p} className="px-2 py-3 text-center">
                      {m.permissions[p] ? <Check size={15} className="mx-auto text-text" /> : <X size={15} className="mx-auto text-textMuted/40" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-textMuted">Switch seats from the top-right menu to see how the nav and actions change for non-owners (e.g. Dev can’t view financials).</p>
      </div>
    </>
  );
}
