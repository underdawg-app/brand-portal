"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, MapPin, Star, Lock, MessageSquare, Briefcase, Bookmark, Check } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useStore } from "@/lib/store";
import { useBrandColor } from "@/lib/useBrandColor";
import { creatorAnalytics } from "@/lib/analytics";
import { PageHeader, Card, Label, Money, StatusBadge, Avatar } from "@/components/ui/primitives";
import type { EngagementTone } from "@/lib/analytics";
import { LineArea } from "@/components/ui/Charts";
import { Button } from "@/components/ui/Button";
import { compact } from "@/lib/format";

export default function CreatorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const creator = useStore((s) => s.creators.find((c) => c.cr_id === id));
  const ratings = useStore((s) => s.ratings).filter((r) => r.toCreatorId === id);
  const verified = useStore((s) => s.brand.verificationStatus === "VERIFIED");
  const liveJobs = useStore((s) => s.jobs).filter((j) => j.status === "LIVE");
  const savedLists = useStore((s) => s.savedLists);
  const inviteToJob = useStore((s) => s.inviteToJob);
  const toggleInList = useStore((s) => s.toggleInList);
  const createList = useStore((s) => s.createList);
  const toast = useStore((s) => s.toast);
  const accountType = useStore((s) => s.accountType);
  const sendRepRequest = useStore((s) => s.sendRepRequest);
  const repStatus = useStore((s) => s.representations.find((r) => r.creatorId === id && r.status !== "ENDED")?.status);
  const brandColor = useBrandColor();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  if (!creator) {
    return (
      <>
        <PageHeader title="Creator not found" sub="This profile doesn't exist." />
        <Button variant="outline" onClick={() => router.push("/discover")}><ArrowLeft size={16} /> Back to Discover</Button>
      </>
    );
  }

  const c = creator;
  const a = creatorAnalytics(c);
  const ratesLocked = c.ratesVisibility === "VERIFIED_BRANDS_ONLY" && !verified;
  const contactLocked = c.contactVisibility === "VERIFIED_BRANDS_ONLY" && !verified;

  return (
    <>
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-textMuted hover:text-text">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
        <div className="flex items-center gap-4">
          <Avatar name={c.name} src={c.avatarUrl} accent={c.accent} size={72} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="hero text-4xl text-text">{c.name}</h1>
              {c.verifiedHuman && <BadgeCheck size={20} className="text-brand" />}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-textMuted">
              <span>{c.handle} · {c.type}</span>
              <span className="flex items-center gap-1"><MapPin size={13} />{c.location}</span>
              <span className="flex items-center gap-1"><Star size={13} className="text-textMuted" />{c.ratingAvg} ({c.ratingCount})</span>
              <StatusBadge tone="info">{c.tier}</StatusBadge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setListOpen(true)}><Bookmark size={16} /> Add to list</Button>
          <Button variant="outline" onClick={() => router.push("/messages")} disabled={contactLocked}>
            <MessageSquare size={16} /> {contactLocked ? "Contact locked" : "Message"}
          </Button>
          {accountType === "agency" ? (
            <Button
              onClick={() => { sendRepRequest(c.cr_id); toast("Representation request sent.", "success"); }}
              disabled={!!repStatus}
            >
              <Briefcase size={16} /> {repStatus === "ACTIVE" ? "On your roster" : repStatus === "REQUESTED" ? "Request sent" : "Request representation"}
            </Button>
          ) : (
            <Button onClick={() => setInviteOpen(true)}><Briefcase size={16} /> Invite to job</Button>
          )}
        </div>
      </div>

      {/* Invite to job */}
      <PickerDialog open={inviteOpen} onOpenChange={setInviteOpen} title="Invite to a job" subtitle="Pick a live job to invite this creator to.">
        {liveJobs.length === 0 ? (
          <p className="text-sm text-textMuted">No live jobs. Publish a job first.</p>
        ) : (
          <div className="space-y-2">
            {liveJobs.map((j) => (
              <button
                key={j.job_id}
                onClick={() => { inviteToJob(j.job_id, c.cr_id); setInviteOpen(false); toast(`Invited ${c.name} to “${j.title}”.`, "success"); }}
                className="flex w-full items-center justify-between rounded-lg border border-hairline px-3 py-2.5 text-left text-sm hover:border-hairlineStrong"
              >
                <span className="text-text">{j.title}</span>
                <span className="label text-textMuted">{j.type}</span>
              </button>
            ))}
          </div>
        )}
      </PickerDialog>

      {/* Add to list */}
      <PickerDialog open={listOpen} onOpenChange={setListOpen} title="Add to a shortlist" subtitle="Toggle this creator in your lists.">
        <div className="space-y-2">
          {savedLists.map((l) => {
            const inList = l.creatorIds.includes(c.cr_id);
            return (
              <button
                key={l.id}
                onClick={() => { toggleInList(l.id, c.cr_id); toast(inList ? "Removed from list." : "Added to list.", "success"); }}
                className="flex w-full items-center justify-between rounded-lg border border-hairline px-3 py-2.5 text-left text-sm hover:border-hairlineStrong"
              >
                <span className="text-text">{l.name}</span>
                {inList ? <Check size={16} className="text-brand" /> : <span className="label text-textMuted">{l.creatorIds.length}</span>}
              </button>
            );
          })}
          <button
            onClick={() => { const id2 = createList("New shortlist"); toggleInList(id2, c.cr_id); toast("Created list & added creator.", "success"); }}
            className="w-full rounded-lg border border-dashed border-hairlineStrong px-3 py-2.5 text-sm text-textMuted hover:text-text"
          >
            + New list with this creator
          </button>
        </div>
      </PickerDialog>

      <p className="text-sm text-textSoft">{c.bio}</p>

      {/* Qoruz-style overview */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
          <Label>Overview</Label>
          <span className="label text-textMuted">verified analytics</span>
        </div>
        <div className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCell label="Followers" value={compact(c.stats.followers)} sub="across platforms" />
          <OverviewCell
            label="Engagement Rate"
            value={`${a.engagementRate}%`}
            chip={<ToneChip tone={a.engagementTone} />}
          />
          <OverviewCell label="Estimated Reach" value={compact(a.estimatedReach)} sub={`+${a.growth30d}% growth`} />
          <OverviewCell
            label="Underdawg Score"
            value={
              <span className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-sm font-heavy text-brandFg">{a.score.toFixed(1)}</span>
              </span>
            }
            chip={<span className="label rounded-md border border-hairlineStrong px-2 py-0.5 text-text">{a.percentile}</span>}
          />
        </div>
        <div className="border-t border-hairline px-5 py-4">
          <Label>Insights</Label>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {a.insights.map((ins) => (
              <div key={ins.label} className="flex items-center gap-2 text-sm text-text">
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${ins.good ? "bg-brand/10 text-brand" : "bg-surfaceMuted text-textMuted"}`}>
                  {ins.good ? "+" : "−"}
                </span>
                {ins.label}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Reach + engagement trend */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <Label>Reach & engagement · last 8 weeks</Label>
          <span className="label text-textMuted">verified analytics</span>
        </div>
        <div className="mt-4">
          <LineArea points={a.reachTrend.map((r) => r.reach)} labels={a.reachTrend.map((r) => r.w)} height={220} color={brandColor} />
        </div>
      </Card>

      {/* Audience */}
      <div className="grid gap-4 lg:grid-cols-2">
        <BarCard title="Audience age" data={a.ages} color={brandColor} />
        <BarCard title="Top locations" data={a.locations} color={brandColor} />
        <BarCard title="Gender" data={a.gender} color={brandColor} />
        <BarCard title="Devices" data={a.devices} color={brandColor} />
      </div>

      {/* Top content */}
      <Card className="p-5">
        <Label>Top content</Label>
        <div className="mt-3 divide-y divide-hairline">
          {a.topContent.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className="flex items-center gap-2 text-text">
                <span className="h-8 w-8 rounded-md" style={{ background: `${c.accent}33` }} />
                {t.title}
              </span>
              <div className="flex items-center gap-5 text-textMuted">
                <span>{compact(t.views)} views</span>
                <span>{compact(t.likes)} likes</span>
                <span className="text-text">{t.rate}% rate</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reputation breakdown */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <Label>Reputation breakdown</Label>
          <span className="font-heavy text-2xl text-text">{c.stats.reputation}<span className="text-sm text-textMuted">/100</span></span>
        </div>
        <div className="mt-4 space-y-3">
          {a.reputation.map((r) => (
            <div key={r.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-text">{r.label} <span className="text-textMuted">· weight {r.weight}</span></span>
                <span className="text-textMuted">{r.score}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surfaceMuted">
                <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: brandColor }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Platforms + rates */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <Label>Platforms</Label>
          <div className="mt-3 space-y-1.5">
            {c.platforms.map((p) => (
              <div key={p.key} className="flex items-center justify-between rounded-lg border border-hairline px-3 py-2 text-sm">
                <span className="flex items-center gap-1.5 text-text">{p.name}{p.verified && <BadgeCheck size={12} className="text-brand" />}</span>
                <span className="text-textMuted">{compact(p.followers)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <Label>Rate card</Label>
          {ratesLocked ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-hairline px-3 py-6 text-sm text-textMuted">
              <Lock size={14} /> Rates are visible to verified brands only.
            </div>
          ) : (
            <div className="mt-3 space-y-1.5">
              {c.rates.map((r) => (
                <div key={r.key} className="flex items-center justify-between rounded-lg border border-hairline px-3 py-2 text-sm">
                  <span className="text-text">{r.name}</span>
                  <Money amount={r.base} currency={c.currency} className="text-text" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Portfolio */}
      <div>
        <Label>Portfolio</Label>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.portfolio.map((p) => (
            <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl border border-hairline bg-surfaceMuted">
              {p.cover.startsWith("http") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover} alt={p.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
                <span className="label text-white">{p.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {ratings.length > 0 && (
        <div>
          <Label>Brand reviews</Label>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {ratings.map((r) => (
              <Card key={r.rating_id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-heavy text-xl text-text">{r.scores.overall}.0 ★</span>
                  <span className="label text-textMuted">{r.wouldWorkAgain ? "would work again" : ""}</span>
                </div>
                <p className="mt-2 text-sm text-textSoft">{r.writtenReview}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function PickerDialog({
  open, onOpenChange, title, subtitle, children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-hairline bg-surfaceElevated p-6 shadow-2xl focus:outline-none">
          <Dialog.Title className="font-heavy text-lg text-text">{title}</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-textMuted">{subtitle}</Dialog.Description>
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function OverviewCell({ label, value, sub, chip }: { label: string; value: React.ReactNode; sub?: string; chip?: React.ReactNode }) {
  return (
    <div className="bg-surfaceElevated p-5">
      <Label>{label}</Label>
      <div className="mt-2 flex items-center gap-2 font-heavy text-2xl text-text">{value}{chip}</div>
      {sub && <div className="mt-1 text-xs text-textMuted">{sub}</div>}
    </div>
  );
}

function ToneChip({ tone }: { tone: EngagementTone }) {
  return <span className="label rounded-md bg-brand px-2 py-0.5 text-brandFg">{tone}</span>;
}

function BarCard({ title, data, color }: { title: string; data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <Card className="p-5">
      <Label>{title}</Label>
      <div className="mt-3 space-y-2.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3 text-sm">
            <span className="w-20 shrink-0 text-textMuted">{d.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surfaceMuted">
              <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, background: color }} />
            </div>
            <span className="w-9 shrink-0 text-right text-text">{d.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
