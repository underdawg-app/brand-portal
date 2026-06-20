"use client";

import { useState } from "react";
import { MessageCircle, X, Send, BadgeCheck, ChevronLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/**
 * Persistent bottom-right chat dock. Always mounted across the portal; opens with a
 * smooth clip-path reveal (grows upward from the launcher — no fade, no bounce).
 */
export function MessageDock() {
  const threads = useStore((s) => s.threads);
  const creators = useStore((s) => s.creators);
  const sendMessage = useStore((s) => s.sendMessage);

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const active = threads.find((t) => t.thread_id === activeId);
  const unreadTotal = threads.reduce((n, t) => n + t.unread, 0);
  const avatarFor = (creatorId?: string) => creators.find((c) => c.cr_id === creatorId)?.avatarUrl;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      <div
        data-open={open}
        className="ud-dock-panel flex h-[30rem] w-[22rem] max-w-[calc(100vw-2.5rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-hairline bg-surfaceElevated shadow-2xl"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <div className="flex items-center gap-2">
            {active && (
              <button onClick={() => setActiveId(null)} className="rounded-md p-1 text-textMuted hover:bg-surfaceMuted hover:text-text" aria-label="Back">
                <ChevronLeft size={16} />
              </button>
            )}
            <span className="text-sm font-medium text-text">{active ? active.name : "Messages"}</span>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-md p-1 text-textMuted hover:bg-surfaceMuted hover:text-text" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* body */}
        {active ? (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {active.messages.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[78%] rounded-2xl px-3.5 py-2 text-sm", m.from === "me" ? "bg-brand text-brandFg" : "bg-surfaceMuted text-text")}>
                    {m.body}
                  </div>
                </div>
              ))}
            </div>
            <form
              className="flex gap-2 border-t border-hairline p-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (draft.trim()) { sendMessage(active.thread_id, draft.trim()); setDraft(""); }
              }}
            >
              <input
                className="w-full rounded-full border border-hairline bg-surface px-3.5 py-2 text-sm text-text placeholder:text-textMuted focus:border-brand focus:outline-none"
                placeholder="Message…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button type="submit" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-brandFg" aria-label="Send">
                <Send size={15} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 space-y-1.5 overflow-y-auto p-2">
            {threads.map((t) => (
              <button
                key={t.thread_id}
                onClick={() => setActiveId(t.thread_id)}
                className="flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left transition-colors hover:bg-surfaceMuted/60"
              >
                <Avatar name={t.name} src={avatarFor(t.creatorId)} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-sm font-medium text-text">
                    {t.name}
                    {t.verified && <BadgeCheck size={12} className="text-brand" />}
                    <span className="ml-auto text-[10px] text-textMuted">{t.updatedAgo}</span>
                  </div>
                  <div className="truncate text-xs text-textMuted">{t.preview}</div>
                </div>
                {t.unread > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] text-brandFg">{t.unread}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto relative grid h-14 w-14 place-items-center rounded-full bg-brand text-brandFg shadow-xl transition-transform hover:scale-105 active:scale-95"
        aria-label="Messages"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && unreadTotal > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-surface bg-ember px-1 text-[10px] font-bold text-white">
            {unreadTotal}
          </span>
        )}
      </button>
    </div>
  );
}
