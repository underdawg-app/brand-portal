"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Star, Check, X, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Money, StatusBadge, Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { applicationTone, jobTone } from "@/lib/status";
import { formatDate, compact } from "@/lib/format";
import type { Application, ApplicationStatus } from "@/lib/types";

const TABS: (ApplicationStatus | "ALL")[] = ["ALL", "APPLIED", "SHORTLISTED", "REJECTED", "WITHDRAWN"];

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const job = useStore((s) => s.jobs.find((j) => j.job_id === id));
  const applications = useStore((s) => s.applications).filter((a) => a.jobId === id);
  const creators = useStore((s) => s.creators);
  const setApplicationStatus = useStore((s) => s.setApplicationStatus);
  const acceptApplication = useStore((s) => s.acceptApplication);
  const closeJob = useStore((s) => s.closeJob);

  const [tab, setTab] = useState<(typeof TABS)[number]>("ALL");
  const [selected, setSelected] = useState<Application | null>(null);
  const [open, setOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  if (!job) return <p className="text-textMuted">Job not found.</p>;

  const creatorOf = (cid: string) => creators.find((c) => c.cr_id === cid);
  const filtered = tab === "ALL" ? applications : applications.filter((a) => a.status === tab);
  const decided = applications.filter((a) => a.status === "SHORTLISTED" || a.status === "REJECTED").length;
  const shortlisted = applications.filter((a) => a.status === "SHORTLISTED").length;

  const accept = (a: Application) => {
    const dealId = acceptApplication(a.application_id);
    setOpen(false);
    if (dealId) router.push(`/deals/${dealId}`);
  };

  return (
    <>
      <PageHeader
        eyebrow={job.type}
        title={job.title}
        action={<StatusBadge tone={jobTone[job.status]}>{job.status}</StatusBadge>}
      />

      {/* Brief */}
      <Card className="p-5">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="md:col-span-2">
            <Label>Brief</Label>
            <p className="mt-2 text-sm text-textSoft">{job.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {job.deliverables.map((d) => (
                <span key={d} className="label rounded-full border border-hairline px-2.5 py-1 text-textMuted">{d}</span>
              ))}
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <Row k="Budget" v={<><Money amount={job.budgetMin} currency={job.currency} />–<Money amount={job.budgetMax} currency={job.currency} /></>} />
            <Row k="Timeline" v={job.timeline} />
            <Row k="Usage" v={job.usageRights} />
            <Row k="Exclusivity" v={job.exclusivity} />
            <Row k="Deadline" v={formatDate(job.applicationDeadline)} />
            <Row k="Min followers" v={compact(job.requirements.minFollowers ?? 0)} />
          </div>
        </div>
        {job.status === "LIVE" && (
          <div className="mt-4 flex justify-end border-t border-hairline pt-4">
            <Button variant="outline" size="sm" onClick={() => closeJob(job.job_id)}>Close listing</Button>
          </div>
        )}
      </Card>

      {/* ATS */}
      <div>
        <div className="flex items-center justify-between">
          <Label>Applicant pipeline · ATS</Label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-textMuted">
              {shortlisted} shortlisted · {decided ? Math.round((shortlisted / decided) * 100) : 0}% shortlist rate
            </span>
            <Button size="sm" variant="outline" disabled={shortlisted < 2} onClick={() => setCompareOpen(true)}>
              Compare shortlisted
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const count = t === "ALL" ? applications.length : applications.filter((a) => a.status === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`label rounded-full border px-3 py-1.5 ${
                  tab === t ? "border-brand bg-brand text-brandFg" : "border-hairline text-textMuted hover:text-text"
                }`}
              >
                {t} · {count}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {filtered.map((a) => {
            const c = creatorOf(a.creatorId);
            return (
              <Card key={a.application_id} className="p-4">
                <button className="w-full text-left" onClick={() => { setSelected(a); setOpen(true); }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c?.name ?? "?"} accent={c?.accent} size={38} />
                      <div>
                        <div className="flex items-center gap-1 font-medium text-text">
                          {c?.name}{c?.verifiedHuman && <BadgeCheck size={13} className="text-brand" />}
                        </div>
                        <div className="text-xs text-textMuted">{c?.handle} · {compact(c?.stats.followers ?? 0)}</div>
                      </div>
                    </div>
                    <StatusBadge tone={applicationTone[a.status]}>{a.status}</StatusBadge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-textSoft">{a.pitch}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3 text-xs">
                    <span className="text-textMuted">Asks <Money amount={a.rate} currency={a.currency} className="text-text" /> · {a.timeline}</span>
                    <span className="flex items-center gap-1 text-text"><Star size={12} className="text-textMuted" />{a.repScoreSnapshot}</span>
                  </div>
                </button>
                {(a.status === "APPLIED" || a.status === "SHORTLISTED") && (
                  <div className="mt-3 flex gap-2">
                    {a.status === "APPLIED" && (
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setApplicationStatus(a.application_id, "SHORTLISTED", "You're shortlisted — let's talk.")}>
                        <Check size={14} /> Shortlist
                      </Button>
                    )}
                    {a.status === "SHORTLISTED" && (
                      <Button size="sm" className="flex-1" onClick={() => accept(a)}>
                        Accept → Deal <ArrowRight size={14} />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setApplicationStatus(a.application_id, "REJECTED", "Going a different direction — thank you!")}>
                      <X size={14} />
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
          {filtered.length === 0 && <p className="text-sm text-textMuted">No applicants in this column.</p>}
        </div>
      </div>

      {/* Applicant detail drawer */}
      <ApplicantDrawer
        application={selected}
        open={open}
        onOpenChange={setOpen}
        onShortlist={(a) => setApplicationStatus(a.application_id, "SHORTLISTED", "You're shortlisted — let's talk.")}
        onReject={(a) => setApplicationStatus(a.application_id, "REJECTED", "Going a different direction — thank you!")}
        onAccept={accept}
      />

      <CompareDrawer
        open={compareOpen}
        onOpenChange={setCompareOpen}
        applicants={applications.filter((a) => a.status === "SHORTLISTED").slice(0, 3)}
        onAccept={accept}
        onReject={(a) => setApplicationStatus(a.application_id, "REJECTED", "Going a different direction — thank you!")}
      />
    </>
  );
}

function CompareDrawer({
  open, onOpenChange, applicants, onAccept, onReject,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  applicants: Application[];
  onAccept: (a: Application) => void;
  onReject: (a: Application) => void;
}) {
  const creators = useStore((s) => s.creators);
  const rows: { label: string; get: (a: Application) => React.ReactNode }[] = [
    { label: "Proposed rate", get: (a) => <Money amount={a.rate} currency={a.currency} className="text-text" /> },
    { label: "Timeline", get: (a) => a.timeline },
    { label: "Reputation", get: (a) => String(a.repScoreSnapshot) },
    { label: "Followers", get: (a) => compact(creators.find((c) => c.cr_id === a.creatorId)?.stats.followers ?? 0) },
    { label: "Pitch", get: (a) => <span className="line-clamp-4 text-xs">{a.pitch}</span> },
  ];
  return (
    <Drawer open={open} onOpenChange={onOpenChange} eyebrow="ATS" title="Compare applicants" width="max-w-3xl">
      <div className="grid gap-3" style={{ gridTemplateColumns: `10rem repeat(${applicants.length}, 1fr)` }}>
        <div />
        {applicants.map((a) => {
          const c = creators.find((x) => x.cr_id === a.creatorId);
          return (
            <div key={a.application_id} className="flex flex-col items-center gap-1 text-center">
              <Avatar name={c?.name ?? "?"} accent={c?.accent} size={40} />
              <div className="text-sm font-medium text-text">{c?.name}</div>
              <div className="text-xs text-textMuted">{c?.handle}</div>
            </div>
          );
        })}
        {rows.map((r) => (
          <div key={r.label} className="contents">
            <div className="border-t border-hairline py-3"><span className="label text-textMuted">{r.label}</span></div>
            {applicants.map((a) => (
              <div key={a.application_id} className="border-t border-hairline py-3 text-center text-sm text-text">{r.get(a)}</div>
            ))}
          </div>
        ))}
        <div />
        {applicants.map((a) => (
          <div key={a.application_id} className="flex flex-col gap-2 pt-3">
            <Button size="sm" onClick={() => onAccept(a)}>Accept</Button>
            <Button size="sm" variant="ghost" onClick={() => onReject(a)}>Reject</Button>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="label text-textMuted">{k}</span>
      <span className="text-right text-text">{v}</span>
    </div>
  );
}

function ApplicantDrawer({
  application, open, onOpenChange, onShortlist, onReject, onAccept,
}: {
  application: Application | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onShortlist: (a: Application) => void;
  onReject: (a: Application) => void;
  onAccept: (a: Application) => void;
}) {
  const creators = useStore((s) => s.creators);
  if (!application) return null;
  const a = application;
  const c = creators.find((x) => x.cr_id === a.creatorId);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Applicant"
      title={c?.name ?? a.creatorId}
      footer={
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => { onReject(a); onOpenChange(false); }}>Reject</Button>
          {a.status === "APPLIED" && <Button variant="outline" className="flex-1" onClick={() => { onShortlist(a); onOpenChange(false); }}>Shortlist</Button>}
          <Button className="flex-1" onClick={() => onAccept(a)}>Accept → Deal</Button>
        </div>
      }
    >
      <div className="flex items-center gap-3">
        <Avatar name={c?.name ?? "?"} accent={c?.accent} size={52} />
        <div>
          <div className="font-heavy text-text">{c?.handle}</div>
          <div className="text-xs text-textMuted">{c?.type} · {c?.location}</div>
        </div>
        <StatusBadge tone={applicationTone[a.status]}>{a.status}</StatusBadge>
      </div>

      <Link href={`/creators/${a.creatorId}`} className="mt-3 inline-block text-sm text-brand hover:underline">
        View full profile & analytics →
      </Link>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <Metric k="Asks" v={<Money amount={a.rate} currency={a.currency} />} />
        <Metric k="Timeline" v={a.timeline} />
        <Metric k="Rep" v={String(a.repScoreSnapshot)} />
      </div>

      <div className="mt-5">
        <Label>Pitch</Label>
        <p className="mt-2 text-sm text-textSoft">{a.pitch}</p>
      </div>

      {a.brandResponse && (
        <div className="mt-5">
          <Label>Your response</Label>
          <p className="mt-2 rounded-lg border border-hairline bg-surfaceMuted/40 p-3 text-sm text-textSoft">{a.brandResponse}</p>
        </div>
      )}

      <div className="mt-5">
        <Label>Portfolio (auto-attached)</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(c?.portfolio ?? []).map((p) => (
            <div key={p.id} className="aspect-video rounded-lg border border-hairline" style={{ background: `${p.cover}22` }}>
              <div className="flex h-full items-end p-2"><span className="label text-text">{p.title}</span></div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

function Metric({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-hairline p-2">
      <div className="font-heavy text-text">{v}</div>
      <Label className="text-[9px]">{k}</Label>
    </div>
  );
}
