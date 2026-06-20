"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Avatar, inputClass } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function TalentPoolsPage() {
  const router = useRouter();
  const pools = useStore((s) => s.talentPools);
  const creators = useStore((s) => s.creators);
  const createPool = useStore((s) => s.createPool);
  const deletePool = useStore((s) => s.deletePool);
  const toggleInPool = useStore((s) => s.toggleInPool);
  const toast = useStore((s) => s.toast);

  const [active, setActive] = useState(pools[0]?.pool_id ?? "");
  const [name, setName] = useState("");
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const pool = pools.find((p) => p.pool_id === active) ?? pools[0];
  const creatorOf = (id: string) => creators.find((c) => c.cr_id === id);
  const notInPool = creators.filter((c) => c.verifiedHuman && !pool?.creatorIds.includes(c.cr_id));

  return (
    <>
      <PageHeader
        eyebrow="Agency · Marketing"
        title="Talent Pools"
        sub="Vet creators once, reuse the pool across every client campaign."
      />

      <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input className={inputClass} placeholder="New pool name" value={name} onChange={(e) => setName(e.target.value)} />
            <Button size="icon" onClick={() => { if (name.trim()) { const id = createPool(name.trim()); setActive(id); setName(""); toast("Pool created.", "success"); } }}><Plus size={16} /></Button>
          </div>
          {pools.map((p) => (
            <button key={p.pool_id} onClick={() => setActive(p.pool_id)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${p.pool_id === active ? "border-brand bg-brand/5" : "border-hairline hover:border-hairlineStrong"}`}>
              <div><div className="text-sm font-medium text-text">{p.name}</div>{p.note && <div className="text-xs text-textMuted">{p.note}</div>}</div>
              <span className="label text-textMuted">{p.creatorIds.length}</span>
            </button>
          ))}
        </div>

        {pool && (
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <Label>{pool.name} · {pool.creatorIds.length} creators</Label>
                <Button variant="ghost" size="sm" onClick={() => setConfirmDel(pool.pool_id)}><Trash2 size={14} /> Delete</Button>
              </div>
              {pool.creatorIds.length === 0 ? (
                <p className="mt-4 text-sm text-textMuted">Empty — add vetted creators below.</p>
              ) : (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {pool.creatorIds.map((cid) => {
                    const c = creatorOf(cid);
                    return (
                      <div key={cid} className="flex items-center justify-between rounded-lg border border-hairline p-2.5">
                        <button className="flex items-center gap-2.5 text-left" onClick={() => router.push(`/creators/${cid}`)}>
                          <Avatar name={c?.name ?? "?"} accent={c?.accent} size={32} />
                          <div><div className="text-sm font-medium text-text">{c?.name}</div><div className="text-xs text-textMuted">{c?.niches[0]}</div></div>
                        </button>
                        <button onClick={() => toggleInPool(pool.pool_id, cid)} className="text-textMuted hover:text-text"><X size={16} /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card className="p-5">
              <Label>Add vetted creators</Label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {notInPool.map((c) => (
                  <button key={c.cr_id} onClick={() => { toggleInPool(pool.pool_id, c.cr_id); toast(`Added ${c.name}.`, "success"); }} className="flex items-center justify-between rounded-lg border border-hairline p-2.5 text-left hover:border-hairlineStrong">
                    <div className="flex items-center gap-2.5"><Avatar name={c.name} accent={c.accent} size={30} /><span className="text-sm text-text">{c.name}</span></div>
                    <Plus size={15} className="text-brand" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmDel}
        onOpenChange={(v) => !v && setConfirmDel(null)}
        title="Delete this pool?"
        description="The talent pool will be removed. The creators themselves aren't affected."
        confirmLabel="Delete"
        danger
        onConfirm={() => { if (confirmDel) { deletePool(confirmDel); setActive(pools.find((p) => p.pool_id !== confirmDel)?.pool_id ?? ""); toast("Pool deleted.", "warn"); } }}
      />
    </>
  );
}
