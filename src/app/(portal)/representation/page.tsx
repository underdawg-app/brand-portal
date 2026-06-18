"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileSignature } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Avatar, StatusBadge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Representation } from "@/lib/types";

const repTone = (s: Representation["status"]) => (s === "ACTIVE" ? "success" : s === "REQUESTED" ? "warn" : "neutral");

export default function RepresentationPage() {
  const router = useRouter();
  const reps = useStore((s) => s.representations);
  const creators = useStore((s) => s.creators);
  const setRepStatus = useStore((s) => s.setRepStatus);
  const toast = useStore((s) => s.toast);
  const [endId, setEndId] = useState<string | null>(null);

  const creatorOf = (id: string) => creators.find((c) => c.cr_id === id);
  const groups: { title: string; items: Representation[] }[] = [
    { title: "Requested", items: reps.filter((r) => r.status === "REQUESTED") },
    { title: "Active", items: reps.filter((r) => r.status === "ACTIVE") },
    { title: "Ended", items: reps.filter((r) => r.status === "ENDED") },
  ];

  return (
    <>
      <PageHeader eyebrow="Agency · Management" title="Representation" sub="Requests in/out, standard agreements, and active engagements." />

      {groups.map((g) => (
        <div key={g.title}>
          <Label>{g.title} · {g.items.length}</Label>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {g.items.length === 0 && <p className="text-sm text-textMuted">None.</p>}
            {g.items.map((r) => {
              const c = creatorOf(r.creatorId);
              return (
                <Card key={r.rep_id} className="flex items-center justify-between p-4">
                  <button className="flex items-center gap-2.5 text-left" onClick={() => router.push(`/creators/${r.creatorId}`)}>
                    <Avatar name={c?.name ?? "?"} accent={c?.accent} size={36} />
                    <div>
                      <div className="font-medium text-text">{c?.name}</div>
                      <div className="text-xs text-textMuted">{r.commissionRate}% · standard agreement</div>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={repTone(r.status)}>{r.status}</StatusBadge>
                    {r.status === "REQUESTED" && (
                      <Button size="sm" onClick={() => { setRepStatus(r.rep_id, "ACTIVE"); toast("Representation activated.", "success"); }}>Accept</Button>
                    )}
                    {r.status === "ACTIVE" && (
                      <Button size="sm" variant="ghost" onClick={() => setEndId(r.rep_id)}>End</Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <Card className="flex items-center gap-3 p-4 text-sm text-textMuted">
        <FileSignature size={16} className="text-brand" />
        Send new representation requests from <button className="text-brand hover:underline" onClick={() => router.push("/discover")}>Talent Discovery</button>.
      </Card>

      <ConfirmDialog
        open={!!endId}
        onOpenChange={(v) => !v && setEndId(null)}
        title="End representation?"
        description="This ends your agreement with the creator. Active deals are unaffected, but you'll no longer manage them."
        confirmLabel="End representation"
        danger
        onConfirm={() => { if (endId) { setRepStatus(endId, "ENDED"); toast("Representation ended.", "warn"); } }}
      />
    </>
  );
}
