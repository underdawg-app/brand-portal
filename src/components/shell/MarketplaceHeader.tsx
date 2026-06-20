"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Sun, Moon, BadgeCheck, LogOut, Grid3x3 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/ui/primitives";
import { GlobalSearch } from "@/components/shell/GlobalSearch";
import { NotificationsBell } from "@/components/shell/NotificationsBell";
import { cn } from "@/lib/cn";
import type { Permissions } from "@/lib/types";

type Item = { href: string; label: string; perm?: keyof Permissions };

// Primary nav (inline) + secondary (avatar menu), per account type.
const NAV: Record<string, { primary: Item[]; menu: Item[] }> = {
  brand: {
    primary: [
      { href: "/discover", label: "Discover" },
      { href: "/jobs", label: "Jobs", perm: "postJobsOrCampaigns" },
      { href: "/deals", label: "Deals" },
      { href: "/campaigns", label: "Campaigns", perm: "manageCampaigns" },
      { href: "/messages", label: "Messages", perm: "replyToMessages" },
    ],
    menu: [
      { href: "/finance", label: "Finance", perm: "viewFinancials" },
      { href: "/analytics", label: "Analytics", perm: "viewAnalytics" },
      { href: "/ratings", label: "Ratings" },
      { href: "/settings", label: "Settings" },
    ],
  },
  management: {
    primary: [
      { href: "/discover", label: "Talent" },
      { href: "/roster", label: "Roster" },
      { href: "/deals", label: "Deal Desk" },
      { href: "/messages", label: "Messages", perm: "replyToMessages" },
    ],
    menu: [
      { href: "/representation", label: "Representation" },
      { href: "/commissions", label: "Commissions", perm: "viewFinancials" },
      { href: "/settings", label: "Settings" },
    ],
  },
  marketing: {
    primary: [
      { href: "/discover", label: "Talent" },
      { href: "/clients", label: "Clients" },
      { href: "/campaigns", label: "Campaigns", perm: "manageCampaigns" },
      { href: "/jobs", label: "Jobs", perm: "postJobsOrCampaigns" },
      { href: "/messages", label: "Messages", perm: "replyToMessages" },
    ],
    menu: [
      { href: "/talent-pools", label: "Talent Pools" },
      { href: "/reporting", label: "Reporting", perm: "viewAnalytics" },
      { href: "/settings/billing", label: "Billing", perm: "viewFinancials" },
      { href: "/settings", label: "Settings" },
    ],
  },
};

const CRAFTS = ["Skincare", "Beauty", "Film", "Illustration", "Music", "Design", "Photo", "Fashion", "Food"];

export function MarketplaceHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const accountType = useStore((s) => s.accountType);
  const agencyMode = useStore((s) => s.agencyMode);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const setWorkspace = useStore((s) => s.setWorkspace);
  const brand = useStore((s) => s.brand);
  const agency = useStore((s) => s.agency);
  const members = useStore((s) => s.members);
  const currentMemberId = useStore((s) => s.currentMemberId);
  const setCurrentMember = useStore((s) => s.setCurrentMember);
  const member = members.find((m) => m.member_id === currentMemberId);
  const perms = member?.permissions;

  const key = accountType === "agency" ? (agencyMode === "MARKETING" ? "marketing" : "management") : "brand";
  const nav = NAV[key];
  const primary = nav.primary.filter((i) => !i.perm || perms?.[i.perm]);
  const menu = nav.menu.filter((i) => !i.perm || perms?.[i.perm]);
  const wsName = accountType === "agency" ? agency.name : brand.name;
  const wsSub = accountType === "agency" ? (agencyMode === "MARKETING" ? "Agency · Marketing" : "Agency · Management") : "Brand";

  return (
    <header className="sticky top-0 z-40 bg-surface">
      {/* Row 1 */}
      <div className="flex h-16 items-center gap-4 border-b border-hairline px-5 md:px-8">
        <Link href="/dashboard" aria-label="Home"><Logo height={24} /></Link>
        <div className="hidden flex-1 md:block"><GlobalSearch /></div>

        <nav className="hidden items-center gap-1 lg:flex">
          {primary.map((i) => {
            const active = pathname === i.href || pathname.startsWith(i.href + "/");
            return (
              <Link key={i.href} href={i.href} className={cn("rounded-lg px-3 py-2 text-sm transition-colors", active ? "font-medium text-text" : "text-textMuted hover:text-text")}>
                {i.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-lg p-2 text-textMuted hover:bg-surfaceMuted hover:text-text" aria-label="Theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <NotificationsBell />

          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="ml-1 flex items-center gap-2 rounded-full border border-hairline py-1 pl-1 pr-2 hover:bg-surfaceMuted">
              <Avatar name={member?.name ?? wsName} size={28} accent="#9CA3AF" />
              <ChevronDown size={14} className="text-textMuted" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" sideOffset={8} className="z-50 w-64 rounded-xl border border-hairline bg-surfaceElevated p-1 shadow-xl">
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <Avatar name={wsName} size={32} accent="#9CA3AF" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-sm font-medium text-text">{wsName}<BadgeCheck size={12} className="text-brand" /></div>
                    <div className="label text-[10px] text-textMuted">{wsSub}</div>
                  </div>
                </div>
                <Sep />
                {menu.map((i) => (
                  <DropdownMenu.Item key={i.href} onSelect={() => router.push(i.href)} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-text outline-none hover:bg-surfaceMuted">{i.label}</DropdownMenu.Item>
                ))}
                <Sep />
                <div className="label px-3 py-1.5 text-textMuted">Switch workspace</div>
                <WsItem active={accountType === "brand"} label={brand.name} tag="Brand" onSelect={() => { setWorkspace("brand"); router.push("/dashboard"); }} />
                <WsItem active={accountType === "agency" && agencyMode === "MANAGEMENT"} label={agency.name} tag="Mgmt" onSelect={() => { setWorkspace("agency", "MANAGEMENT"); router.push("/dashboard"); }} />
                <WsItem active={accountType === "agency" && agencyMode === "MARKETING"} label={agency.name} tag="Mktg" onSelect={() => { setWorkspace("agency", "MARKETING"); router.push("/dashboard"); }} />
                <Sep />
                <div className="label px-3 py-1.5 text-textMuted">Seat (demo)</div>
                {members.map((m) => (
                  <DropdownMenu.Item key={m.member_id} onSelect={() => setCurrentMember(m.member_id)} className={cn("flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm outline-none", m.member_id === currentMemberId ? "bg-brand/10 text-brand" : "text-text hover:bg-surfaceMuted")}>
                    <span>{m.name}</span><span className="label text-[10px] text-textMuted">{m.role}</span>
                  </DropdownMenu.Item>
                ))}
                <Sep />
                <DropdownMenu.Item onSelect={() => router.push("/login")} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-textMuted outline-none hover:bg-surfaceMuted hover:text-text">
                  <LogOut size={14} /> Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Row 2 — craft/category bar (Fiverr-style) */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-hairline px-5 py-2 md:px-8">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-text hover:bg-surfaceMuted">
            <Grid3x3 size={15} /> Explore <ChevronDown size={13} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="start" sideOffset={8} className="z-50 grid w-72 grid-cols-2 gap-1 rounded-xl border border-hairline bg-surfaceElevated p-2 shadow-xl">
              {CRAFTS.map((c) => (
                <DropdownMenu.Item key={c} onSelect={() => router.push("/discover")} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-text outline-none hover:bg-surfaceMuted">{c}</DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <span className="mx-1 h-4 w-px shrink-0 bg-hairline" />
        {CRAFTS.map((c) => (
          <Link key={c} href="/discover" className="shrink-0 rounded-lg px-2.5 py-1 text-sm text-textMuted transition-colors hover:text-text">{c}</Link>
        ))}
      </div>
    </header>
  );
}

function Sep() {
  return <DropdownMenu.Separator className="my-1 h-px bg-hairline" />;
}

function WsItem({ active, label, tag, onSelect }: { active: boolean; label: string; tag: string; onSelect: () => void }) {
  return (
    <DropdownMenu.Item onSelect={onSelect} className={cn("flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm outline-none", active ? "bg-brand/10 text-brand" : "text-text hover:bg-surfaceMuted")}>
      <span>{label}</span><span className="label text-[10px] text-textMuted">{tag}</span>
    </DropdownMenu.Item>
  );
}
