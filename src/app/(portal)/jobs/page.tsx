"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Money, StatusBadge, Label } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { jobTone } from "@/lib/status";
import { formatDate } from "@/lib/format";
import type { Job } from "@/lib/types";

export default function JobsPage() {
  const jobs = useStore((s) => s.jobs);
  const router = useRouter();

  const columns: Column<Job>[] = [
    {
      key: "title",
      header: "Job",
      render: (j) => (
        <div>
          <div className="font-medium text-text">{j.title}</div>
          <div className="label mt-0.5 text-textMuted">{j.type}</div>
        </div>
      ),
    },
    { key: "niche", header: "Niche", render: (j) => <span className="text-textMuted">{j.niche}</span> },
    {
      key: "budget",
      header: "Budget",
      render: (j) => (
        <span className="text-text">
          <Money amount={j.budgetMin} currency={j.currency} />–<Money amount={j.budgetMax} currency={j.currency} />
        </span>
      ),
    },
    { key: "deadline", header: "Deadline", render: (j) => <span className="text-textMuted">{formatDate(j.applicationDeadline)}</span> },
    { key: "applicants", header: "Applicants", render: (j) => <span className="font-heavy text-text">{j.applicants}</span> },
    { key: "status", header: "Status", render: (j) => <StatusBadge tone={jobTone[j.status]}>{j.status}</StatusBadge> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Layer 2 · Monetization"
        title="Jobs & Briefs"
        sub="Post a brief, then triage applicants in the ATS."
        action={
          <Button onClick={() => router.push("/jobs/post")}>
            <Plus size={16} /> New job
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={jobs}
        onRowClick={(j) => router.push(`/jobs/${j.job_id}`)}
        empty={
          <div className="space-y-3">
            <p>No jobs yet.</p>
            <Link href="/jobs/post" className="text-brand underline">Post your first brief</Link>
          </div>
        }
      />

      <div className="rounded-xl border border-dashed border-hairline p-4">
        <Label>Tip</Label>
        <p className="mt-1 text-sm text-textMuted">
          Clicking a job opens its applicant pipeline (ATS). Shortlist or reject, then accept to spin up a deal.
        </p>
      </div>
    </>
  );
}
