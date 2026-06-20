"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Avatar, inputClass, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function SavedListsPage() {
  const lists = useStore((s) => s.savedLists);
  const creators = useStore((s) => s.creators);
  const createList = useStore((s) => s.createList);
  const deleteList = useStore((s) => s.deleteList);
  const toggleInList = useStore((s) => s.toggleInList);
  const toast = useStore((s) => s.toast);
  const router = useRouter();

  const [active, setActive] = useState(lists[0]?.id ?? "");
  const [newName, setNewName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const list = lists.find((l) => l.id === active) ?? lists[0];
  const creatorOf = (id: string) => creators.find((c) => c.cr_id === id);

  return (
    <>
      <PageHeader
        eyebrow="Discovery"
        title="Saved Lists"
        sub="Organize candidate creators into shortlists, then act in bulk."
        action={<Button variant="outline" onClick={() => router.push("/discover")}>Back to Discover</Button>}
      />

      {lists.length === 0 ? (
        <EmptyState title="No lists yet" body="Create a shortlist, then save creators to it from their profile." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
          {/* lists */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <input className={inputClass} placeholder="New list name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Button size="icon" onClick={() => { if (newName.trim()) { const id = createList(newName.trim()); setActive(id); setNewName(""); toast("List created.", "success"); } }}>
                <Plus size={16} />
              </Button>
            </div>
            {lists.map((l) => (
              <button
                key={l.id}
                onClick={() => setActive(l.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${l.id === active ? "border-brand bg-brand/5" : "border-hairline hover:border-hairlineStrong"}`}
              >
                <span className="text-sm font-medium text-text">{l.name}</span>
                <span className="label text-textMuted">{l.creatorIds.length}</span>
              </button>
            ))}
          </div>

          {/* members */}
          <div>
            {list && (
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <Label>{list.name} · {list.creatorIds.length} creators</Label>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(list.id)}><Trash2 size={14} /> Delete list</Button>
                </div>
                {list.creatorIds.length === 0 ? (
                  <p className="mt-4 text-sm text-textMuted">Empty — open a creator from Discover and choose “Add to list”.</p>
                ) : (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {list.creatorIds.map((cid) => {
                      const c = creatorOf(cid);
                      return (
                        <div key={cid} className="flex items-center justify-between rounded-lg border border-hairline p-3">
                          <button className="flex items-center gap-2.5 text-left" onClick={() => router.push(`/creators/${cid}`)}>
                            <Avatar name={c?.name ?? "?"} accent={c?.accent} size={34} />
                            <div>
                              <div className="text-sm font-medium text-text">{c?.name}</div>
                              <div className="text-xs text-textMuted">{c?.handle}</div>
                            </div>
                          </button>
                          <button onClick={() => toggleInList(list.id, cid)} className="text-textMuted hover:text-text"><X size={16} /></button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(v) => !v && setConfirmDelete(null)}
        title="Delete this list?"
        description="The shortlist will be removed. Creators themselves aren't affected."
        confirmLabel="Delete"
        danger
        onConfirm={() => { if (confirmDelete) { deleteList(confirmDelete); setActive(lists.find((l) => l.id !== confirmDelete)?.id ?? ""); toast("List deleted.", "warn"); } }}
      />
    </>
  );
}
