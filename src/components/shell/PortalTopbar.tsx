"use client";

import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Sun, Moon, BadgeCheck, LogOut, PanelLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/primitives";
import { GlobalSearch } from "@/components/shell/GlobalSearch";
import { NotificationsBell } from "@/components/shell/NotificationsBell";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";

/** Slim sticky top bar for the left-sidebar shell — greeting, search, theme, bell, account. */
export function PortalTopbar() {
  const router = useRouter();
  const accountType = useStore((s) => s.accountType);
  const agencyMode = useStore((s) => s.agencyMode);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const setWorkspace = useStore((s) => s.setWorkspace);
  const brand = useStore((s) => s.brand);
  const agency = useStore((s) => s.agency);
  const profile = useStore((s) => s.profile);
  const members = useStore((s) => s.members);
  const currentMemberId = useStore((s) => s.currentMemberId);
  const setCurrentMember = useStore((s) => s.setCurrentMember);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const member = members.find((m) => m.member_id === currentMemberId);

  const wsName = profile.companyName || (accountType === "agency" ? agency.name : brand.name);
  const wsSub = accountType === "agency" ? (agencyMode === "MARKETING" ? "Agency · Marketing" : "Agency · Management") : "Brand";
  const greetingName = profile.firstName || wsName;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-hairline bg-surface/90 px-4 backdrop-blur-md md:px-8">
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-textMuted hover:bg-surfaceMuted hover:text-text"
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={18} />
      </button>
      <span className="md:hidden"><Logo height={22} /></span>
      <div className="hidden min-w-0 md:block">
        <div className="truncate text-sm font-medium text-text">Welcome, {greetingName}</div>
        <div className="label text-[10px] text-textMuted">Your workspace</div>
      </div>

      <div className="ml-auto hidden max-w-md flex-1 md:block"><GlobalSearch /></div>

      <div className="ml-auto flex items-center gap-1 md:ml-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg p-2 text-textMuted hover:bg-surfaceMuted hover:text-text"
          aria-label="Theme"
        >
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
              <DropdownMenu.Item onSelect={() => router.push("/settings")} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-text outline-none hover:bg-surfaceMuted">Settings</DropdownMenu.Item>
              <Sep />
              <div className="label px-3 py-1.5 text-textMuted">Switch workspace</div>
              <WsItem active={accountType === "brand"} label={brand.name} tag="Brand" onSelect={() => { setWorkspace("brand"); router.push("/home"); }} />
              <WsItem active={accountType === "agency" && agencyMode === "MANAGEMENT"} label={agency.name} tag="Mgmt" onSelect={() => { setWorkspace("agency", "MANAGEMENT"); router.push("/home"); }} />
              <WsItem active={accountType === "agency" && agencyMode === "MARKETING"} label={agency.name} tag="Mktg" onSelect={() => { setWorkspace("agency", "MARKETING"); router.push("/home"); }} />
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
