"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Camera, PlaySquare } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Avatar } from "@/components/ui/primitives";
import { creatorAnalytics } from "@/lib/analytics";
import { compact } from "@/lib/format";
import type { Creator } from "@/lib/types";

export default function ComparePage() {
  const router = useRouter();
  const creators = useStore((s) => s.creators);
  const [selected, setSelected] = useState<string[]>(creators.slice(0, 4).map((c) => c.cr_id));
  const [platform, setPlatform] = useState<"ig" | "yt">("ig");
  const [pickerOpen, setPickerOpen] = useState(false);

  const cols = selected.map((id) => creators.find((c) => c.cr_id === id)).filter(Boolean) as Creator[];
  const available = creators.filter((c) => !selected.includes(c.cr_id));

  const add = (id: string) => {
    if (selected.length >= 5) return;
    setSelected((s) => [...s, id]);
    setPickerOpen(false);
  };
  const remove = (id: string) => setSelected((s) => s.filter((x) => x !== id));

  return (
    <>
      <PageHeader
        eyebrow="Influencer Comparison"
        title="Compare creators"
        sub="Stack up to 5 creators side by side — followers, engagement, reach, score and insights."
        action={
          <div className="flex items-center gap-1 rounded-lg border border-hairline p-1">
            <button onClick={() => setPlatform("ig")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${platform === "ig" ? "bg-brand text-brandFg" : "text-textMuted"}`}>
              <Camera size={15} /> Instagram
            </button>
            <button onClick={() => setPlatform("yt")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${platform === "yt" ? "bg-brand text-brandFg" : "text-textMuted"}`}>
              <PlaySquare size={15} /> YouTube
            </button>
          </div>
        }
      />

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-40 bg-surfaceElevated p-4 text-left align-bottom">
                <button
                  onClick={() => setPickerOpen(true)}
                  disabled={selected.length >= 5}
                  className="flex items-center gap-1.5 rounded-lg border border-dashed border-hairlineStrong px-3 py-2 text-sm text-textMuted hover:text-text disabled:opacity-40"
                >
                  <Plus size={15} /> Add creator
                </button>
              </th>
              {cols.map((c) => (
                <th key={c.cr_id} className="min-w-[180px] border-l border-hairline p-4 text-center align-top">
                  <div className="relative flex flex-col items-center gap-2">
                    <button onClick={() => remove(c.cr_id)} className="absolute -right-1 -top-1 rounded-full p-1 text-textMuted hover:bg-surfaceMuted hover:text-text" aria-label="Remove">
                      <X size={14} />
                    </button>
                    <button onClick={() => router.push(`/creators/${c.cr_id}`)}>
                      <Avatar name={c.name} src={c.avatarUrl} accent={c.accent} size={64} />
                    </button>
                    <div>
                      <div className="text-sm font-medium text-text">{c.name}</div>
                      <div className="text-xs text-textMuted">{c.handle}</div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <MetricRow label="Followers" cols={cols} render={(c) => compact(c.stats.followers)} />
            <MetricRow
              label="Engagement Rate"
              cols={cols}
              render={(c) => {
                const a = creatorAnalytics(c);
                return (
                  <span className="inline-flex items-center gap-1.5">
                    {a.engagementRate}%
                    <span className="label rounded bg-brand px-1.5 py-0.5 text-[9px] text-brandFg">{a.engagementTone}</span>
                  </span>
                );
              }}
            />
            <MetricRow label="Estimated Reach" cols={cols} render={(c) => compact(creatorAnalytics(c).estimatedReach)} />
            <MetricRow
              label="Underdawg Score"
              cols={cols}
              render={(c) => {
                const a = creatorAnalytics(c);
                return (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-xs font-heavy text-brandFg">{a.score.toFixed(1)}</span>
                    <span className="label rounded border border-hairlineStrong px-1.5 py-0.5 text-[9px] text-text">{a.percentile}</span>
                  </span>
                );
              }}
            />
            <MetricRow label="Avg rating" cols={cols} render={(c) => `★ ${c.ratingAvg ?? "—"}`} />
            <MetricRow label="Reputation" cols={cols} render={(c) => `${c.stats.reputation}/100`} />
            {/* insights row */}
            <tr>
              <td className="sticky left-0 z-10 bg-surfaceElevated p-4 align-top"><Label>Insights</Label></td>
              {cols.map((c) => {
                const a = creatorAnalytics(c);
                return (
                  <td key={c.cr_id} className="border-l border-t border-hairline p-4 align-top">
                    <div className="space-y-1.5 text-left">
                      {a.insights.map((ins) => (
                        <div key={ins.label} className="flex items-start gap-1.5 text-xs text-text">
                          <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] ${ins.good ? "bg-brand/10 text-brand" : "bg-surfaceMuted text-textMuted"}`}>
                            {ins.good ? "+" : "−"}
                          </span>
                          {ins.label}
                        </div>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </Card>

      {/* picker */}
      <Dialog.Root open={pickerOpen} onOpenChange={setPickerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] max-h-[80vh] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-hairline bg-surfaceElevated p-6 shadow-2xl focus:outline-none">
            <Dialog.Title className="font-heavy text-lg text-text">Add a creator</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-textMuted">Pick a creator to add to the comparison.</Dialog.Description>
            <div className="mt-4 space-y-2">
              {available.map((c) => (
                <button
                  key={c.cr_id}
                  onClick={() => add(c.cr_id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-hairline p-2.5 text-left hover:border-hairlineStrong"
                >
                  <Avatar name={c.name} src={c.avatarUrl} accent={c.accent} size={40} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-text">{c.name}</div>
                    <div className="text-xs text-textMuted">{c.type} · {compact(c.stats.followers)} followers</div>
                  </div>
                </button>
              ))}
              {available.length === 0 && <p className="text-sm text-textMuted">All creators are already in the comparison.</p>}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function MetricRow({ label, cols, render }: { label: string; cols: Creator[]; render: (c: Creator) => React.ReactNode }) {
  return (
    <tr>
      <td className="sticky left-0 z-10 bg-surfaceElevated p-4"><Label>{label}</Label></td>
      {cols.map((c) => (
        <td key={c.cr_id} className="border-l border-t border-hairline p-4 text-center text-sm font-medium text-text">
          {render(c)}
        </td>
      ))}
    </tr>
  );
}
