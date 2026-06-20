"use client";

import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, FileSignature, Eye, Star, UserPlus, MessageSquare } from "lucide-react";
import { useStore } from "@/lib/store";

type Note = { id: string; text: string; href: string; icon: typeof Bell };

export function NotificationsBell() {
  const router = useRouter();
  const deals = useStore((s) => s.deals);
  const jobs = useStore((s) => s.jobs);
  const threads = useStore((s) => s.threads);

  const notes: Note[] = [];
  for (const d of deals) {
    if (d.status === "CONTRACT") notes.push({ id: d.deal_id, text: `Counter-sign contract · ${d.title}`, href: `/deals/${d.deal_id}`, icon: FileSignature });
    else if (d.status === "IN REVIEW") notes.push({ id: d.deal_id, text: `Review deliverable · ${d.title}`, href: `/deals/${d.deal_id}`, icon: Eye });
    else if (d.status === "COMPLETED") notes.push({ id: d.deal_id, text: `Rate the creator · ${d.title}`, href: `/deals/${d.deal_id}`, icon: Star });
  }
  jobs.filter((j) => j.status === "LIVE" && j.applicants > 0).forEach((j) =>
    notes.push({ id: j.job_id, text: `${j.applicants} applicants · ${j.title}`, href: `/jobs/${j.job_id}`, icon: UserPlus }),
  );
  const unreadMsgs = threads.reduce((s, t) => s + t.unread, 0);
  if (unreadMsgs > 0) notes.push({ id: "msgs", text: `${unreadMsgs} unread messages`, href: "/messages", icon: MessageSquare });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="relative rounded-lg p-2 text-textMuted hover:bg-surfaceMuted hover:text-text" aria-label="Notifications">
        <Bell size={18} />
        {notes.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand" />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="z-50 w-80 rounded-xl border border-hairline bg-surfaceElevated p-1 shadow-xl">
          <div className="label px-3 py-2 text-textMuted">Needs you · {notes.length}</div>
          {notes.length === 0 && <div className="px-3 py-6 text-center text-sm text-textMuted">All caught up.</div>}
          {notes.map((n) => (
            <DropdownMenu.Item
              key={n.id + n.text}
              onSelect={() => router.push(n.href)}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text outline-none hover:bg-surfaceMuted"
            >
              <n.icon size={15} className="shrink-0 text-brand" />
              <span className="flex-1">{n.text}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
