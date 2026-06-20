"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Avatar, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

export default function RatingsPage() {
  const ratings = useStore((s) => s.ratings);
  const creators = useStore((s) => s.creators);
  const deals = useStore((s) => s.deals);
  const creatorOf = (id: string) => creators.find((c) => c.cr_id === id);

  const completedUnrated = deals.filter(
    (d) => d.status === "COMPLETED" && !ratings.some((r) => r.dealId === d.deal_id),
  );

  return (
    <>
      <PageHeader eyebrow="Reputation" title="Ratings & Reviews" sub="Your ratings feed the creator's portable reputation (brand reliability) and the BRAND FAVORITE badge." />

      {completedUnrated.length > 0 && (
        <Card className="p-4">
          <Label>Awaiting your rating</Label>
          <div className="mt-3 space-y-2">
            {completedUnrated.map((d) => (
              <div key={d.deal_id} className="flex items-center justify-between">
                <span className="text-sm text-text">{creatorOf(d.creatorId)?.name}</span>
                <Link href={`/deals/${d.deal_id}`}><Button size="sm" variant="outline">Rate now</Button></Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {ratings.length === 0 ? (
        <EmptyState title="No ratings yet" body="Complete a deal and rate the creator — it closes the loop." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {ratings.map((r) => {
            const c = creatorOf(r.toCreatorId);
            return (
              <Card key={r.rating_id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c?.name ?? "?"} accent={c?.accent} size={36} />
                    <div>
                      <div className="font-medium text-text">{c?.name}</div>
                      <div className="text-xs text-textMuted">{c?.handle}</div>
                    </div>
                  </div>
                  <div className="font-heavy text-2xl text-text">{r.scores.overall}.0 ★</div>
                </div>
                <p className="mt-3 text-sm text-textSoft">{r.writtenReview}</p>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-hairline pt-3 text-xs text-textMuted">
                  {Object.entries(r.scores).filter(([k]) => k !== "overall").map(([k, v]) => (
                    <span key={k} className="capitalize">{k.replace(/([A-Z])/g, " $1")}: <span className="text-text">{v}</span></span>
                  ))}
                  <span className="ml-auto">Would work again: <span className="text-text">{r.wouldWorkAgain ? "Yes" : "No"}</span></span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
