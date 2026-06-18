"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Money, StatusBadge, Avatar, Stat } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { compact } from "@/lib/format";

const STAGES = ["DRAFT", "INVITING", "ACTIVE", "LIVE", "COMPLETED"];
const SLOT_STATUSES = ["INVITED", "ACCEPTED", "IN PROGRESS", "LIVE"];

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const campaign = useStore((s) => s.campaigns.find((c) => c.campaign_id === id));
  const creators = useStore((s) => s.creators);
  const advance = useStore((s) => s.advanceCampaign);
  const setSlotStatus = useStore((s) => s.setSlotStatus);
  const toast = useStore((s) => s.toast);
  const [tab, setTab] = useState<"Tracking" | "Analytics">("Tracking");

  if (!campaign) return <p className="text-textMuted">Campaign not found.</p>;
  const c = campaign;
  const creatorOf = (cid: string) => creators.find((x) => x.cr_id === cid);
  const accepted = c.creatorSlots.filter((s) => s.status !== "INVITED").length;

  return (
    <>
      <button onClick={() => router.push("/campaigns")} className="flex items-center gap-1.5 text-sm text-textMuted hover:text-text">
        <ArrowLeft size={16} /> All campaigns
      </button>

      <PageHeader
        eyebrow={`Get Viral · ${c.tier}`}
        title={c.name}
        action={<StatusBadge tone={c.status === "LIVE" ? "accent" : "info"}>{c.status}</StatusBadge>}
      />

      <Card className="p-5"><Stepper stages={STAGES} current={c.status} /></Card>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-surfaceMuted px-2.5 py-1 text-xs"><ShieldCheck size={12} className="mr-1 inline text-brand" />{c.requiredDisclosure} required</span>
        <span className="text-textMuted">Budget <Money amount={c.budget} currency={c.currency} className="text-text" /></span>
        <span className="text-textMuted">Window {c.windowStart} → {c.windowEnd}</span>
        <span className="text-textMuted">Target reach <span className="text-text">{compact(c.targetReach)}</span></span>
        {c.status !== "COMPLETED" && (
          <Button size="sm" className="ml-auto" onClick={() => { advance(c.campaign_id); toast("Campaign advanced.", "success"); }}>
            Advance → next stage
          </Button>
        )}
      </div>

      <p className="text-sm text-textSoft">{c.brief}</p>

      <div className="flex gap-1 border-b border-hairline">
        {(["Tracking", "Analytics"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-4 py-2 text-sm ${tab === t ? "border-brand font-medium text-text" : "border-transparent text-textMuted hover:text-text"}`}>{t}</button>
        ))}
      </div>

      {tab === "Tracking" ? (
        <div>
          <Label>Creator slots · {accepted}/{c.creatorSlots.length} engaged</Label>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {c.creatorSlots.map((slot) => {
              const cr = creatorOf(slot.creatorId);
              return (
                <Card key={slot.creatorId} className="flex items-center justify-between p-3">
                  <button className="flex items-center gap-2.5 text-left" onClick={() => router.push(`/creators/${slot.creatorId}`)}>
                    <Avatar name={cr?.name ?? "?"} accent={cr?.accent} size={34} />
                    <div>
                      <div className="text-sm font-medium text-text">{cr?.name}</div>
                      <Money amount={slot.payout} currency={c.currency} className="text-xs text-textMuted" />
                    </div>
                  </button>
                  <select
                    value={slot.status}
                    onChange={(e) => setSlotStatus(c.campaign_id, slot.creatorId, e.target.value)}
                    className="rounded-lg border border-hairline bg-surface px-2 py-1 text-xs text-text"
                  >
                    {SLOT_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {c.analytics.totalReach === 0 ? (
            <Card className="p-8 text-center text-sm text-textMuted">Analytics populate once the campaign goes Live. Advance the stage to simulate.</Card>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Stat label="Reach" value={compact(c.analytics.totalReach)} />
                <Stat label="Impressions" value={compact(c.analytics.impressions)} />
                <Stat label="Engagement" value={compact(c.analytics.engagement)} />
                <Stat label="Clicks" value={compact(c.analytics.clicks)} />
                <Stat label="Conversions" value={compact(c.analytics.conversions)} />
              </div>
              <Card className="p-5">
                <Label>Per-creator contribution</Label>
                <div className="mt-3 space-y-2.5">
                  {(() => {
                    const totalF = c.creatorSlots.reduce((sum, s2) => sum + (creatorOf(s2.creatorId)?.stats.followers ?? 1), 0) || 1;
                    const max = Math.max(...c.creatorSlots.map((s2) => creatorOf(s2.creatorId)?.stats.followers ?? 1), 1);
                    return c.creatorSlots.map((slot) => {
                      const cr = creatorOf(slot.creatorId);
                      const f = cr?.stats.followers ?? 1;
                      const reachShare = Math.round((f / totalF) * c.analytics.totalReach);
                      return (
                        <div key={slot.creatorId} className="flex items-center gap-3 text-sm">
                          <span className="w-28 shrink-0 truncate text-text">{cr?.name}</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surfaceMuted">
                            <div className="h-full rounded-full bg-brand" style={{ width: `${(f / max) * 100}%` }} />
                          </div>
                          <span className="w-16 shrink-0 text-right text-textMuted">{compact(reachShare)}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </Card>
            </>
          )}
        </div>
      )}
    </>
  );
}
