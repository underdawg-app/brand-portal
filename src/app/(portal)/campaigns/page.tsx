"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { useVerified, usePermission } from "@/lib/gate";
import { PageHeader, Card, Label, Money, StatusBadge, Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { compact } from "@/lib/format";
import type { Tone } from "@/lib/status";
import type { CampaignTier } from "@/lib/types";

const TIERS: { tier: CampaignTier; budget: string; creators: string }[] = [
  { tier: "SPARK", budget: "₹75K–1.5L", creators: "15–20" },
  { tier: "WAVE", budget: "₹1.5L–5L", creators: "30–50" },
  { tier: "STORM", budget: "₹5L–15L", creators: "50–100" },
  { tier: "TAKEOVER", budget: "₹15L–25L+", creators: "100+" },
];

const slotTone = (s: string): Tone => (s === "ACCEPTED" ? "success" : s === "INVITED" ? "warn" : "neutral");

export default function CampaignsPage() {
  const campaigns = useStore((s) => s.campaigns);
  const creators = useStore((s) => s.creators);
  const router = useRouter();
  const verified = useVerified();
  const canManage = usePermission("manageCampaigns");
  const canCreate = verified && canManage;

  return (
    <>
      <PageHeader
        eyebrow="Layer 3 · Amplification"
        title="Get Viral Campaigns"
        sub="Coordinated, disclosed, multi-creator pushes. Invite-only and #ad-mandatory."
        action={
          <Button onClick={() => router.push("/campaigns/new")} disabled={!canCreate} title={canCreate ? undefined : "Verify your brand to run Get Viral"}>
            <Plus size={16} /> New campaign
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => (
          <Card key={t.tier} className="p-4">
            <Label className="text-brand">{t.tier}</Label>
            <div className="mt-2 font-heavy text-lg text-text">{t.budget}</div>
            <div className="text-xs text-textMuted">{t.creators} creators</div>
          </Card>
        ))}
      </div>

      {campaigns.map((c) => (
        <Card key={c.campaign_id} className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-heavy text-lg text-text">{c.name}</div>
              <div className="label text-textMuted">{c.tier} · target reach {compact(c.targetReach)}</div>
            </div>
            <StatusBadge tone={c.status === "LIVE" ? "accent" : "info"}>{c.status}</StatusBadge>
          </div>
          <p className="mt-2 text-sm text-textSoft">{c.brief}</p>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="rounded-full bg-surfaceMuted px-2 py-1 text-textMuted">{c.requiredDisclosure} required</span>
            <span className="text-textMuted">Budget <Money amount={c.budget} currency={c.currency} className="text-text" /></span>
          </div>

          <div className="mt-4">
            <Label>Creator slots</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {c.creatorSlots.map((slot) => {
                const cr = creators.find((x) => x.cr_id === slot.creatorId);
                return (
                  <div key={slot.creatorId} className="flex items-center justify-between rounded-lg border border-hairline p-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar name={cr?.name ?? "?"} accent={cr?.accent} size={28} />
                      <div>
                        <div className="text-xs font-medium text-text">{cr?.name}</div>
                        <Money amount={slot.payout} currency={c.currency} className="text-[11px] text-textMuted" />
                      </div>
                    </div>
                    <StatusBadge tone={slotTone(slot.status)}>{slot.status}</StatusBadge>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => router.push(`/campaigns/${c.campaign_id}`)}>Open campaign →</Button>
          </div>
        </Card>
      ))}
    </>
  );
}
