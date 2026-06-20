"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, BadgeCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Avatar, StatusBadge, inputClass, Label } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

const KINDS = ["ALL", "DEAL", "REQUEST"] as const;

export default function MessagesPage() {
  const threads = useStore((s) => s.threads);
  const sendMessage = useStore((s) => s.sendMessage);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("ALL");
  const [activeId, setActiveId] = useState(threads[0]?.thread_id);
  const [draft, setDraft] = useState("");

  const list = kind === "ALL" ? threads : threads.filter((t) => t.kind === kind);
  const active = threads.find((t) => t.thread_id === activeId);

  return (
    <>
      <PageHeader eyebrow="Collaboration Hub" title="Messages" sub="DEAL threads with creators · REQUEST threads from agencies." />
      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        {/* thread list */}
        <div className="space-y-3">
          <div className="flex gap-2">
            {KINDS.map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`label rounded-full border px-3 py-1.5 ${kind === k ? "border-brand bg-brand text-brandFg" : "border-hairline text-textMuted"}`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {list.map((t) => (
              <button
                key={t.thread_id}
                onClick={() => setActiveId(t.thread_id)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  t.thread_id === activeId ? "border-brand bg-brand/5" : "border-hairline hover:border-hairlineStrong"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Avatar name={t.name} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-sm font-medium text-text">
                      {t.name}{t.verified && <BadgeCheck size={12} className="text-brand" />}
                    </div>
                    <div className="truncate text-xs text-textMuted">{t.preview}</div>
                  </div>
                  {t.unread > 0 && <span className="rounded-full bg-brand px-1.5 text-[10px] text-white">{t.unread}</span>}
                </div>
                <div className="mt-1.5"><StatusBadge tone={t.kind === "DEAL" ? "info" : "neutral"}>{t.kind}</StatusBadge></div>
              </button>
            ))}
          </div>
        </div>

        {/* active thread */}
        {active ? (
          <Card className="flex h-[32rem] flex-col p-0">
            <div className="flex items-center justify-between border-b border-hairline p-4">
              <div className="flex items-center gap-2">
                <Avatar name={active.name} size={34} />
                <div>
                  <div className="text-sm font-medium text-text">{active.name}</div>
                  <Label className="text-[10px]">{active.kind} thread</Label>
                </div>
              </div>
              {active.dealId && <Link href={`/deals/${active.dealId}`} className="text-xs text-brand underline">Open deal →</Link>}
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {active.messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.from === "me" ? "bg-brand text-brandFg" : "bg-surfaceMuted text-text"}`}>
                    {m.body}
                  </div>
                </div>
              ))}
            </div>
            <form
              className="flex gap-2 border-t border-hairline p-3"
              onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { sendMessage(active.thread_id, draft.trim()); setDraft(""); } }}
            >
              <input className={inputClass} placeholder="Message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <Button type="submit" size="icon"><Send size={16} /></Button>
            </form>
          </Card>
        ) : (
          <Card className="flex h-[32rem] items-center justify-center text-textMuted">Select a thread</Card>
        )}
      </div>
    </>
  );
}
