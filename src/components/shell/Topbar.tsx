"use client";

import { Sun, Moon, ChevronDown, BadgeCheck, LogOut } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { useBrandColor } from "@/lib/useBrandColor";
import { NotificationsBell } from "@/components/shell/NotificationsBell";
import { GlobalSearch } from "@/components/shell/GlobalSearch";

export function Topbar() {
  const router = useRouter();
  const brandColor = useBrandColor();
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const brand = useStore((s) => s.brand);
  const agency = useStore((s) => s.agency);
  const accountType = useStore((s) => s.accountType);
  const agencyMode = useStore((s) => s.agencyMode);
  const setWorkspace = useStore((s) => s.setWorkspace);
  const members = useStore((s) => s.members);
  const currentMemberId = useStore((s) => s.currentMemberId);
  const setCurrentMember = useStore((s) => s.setCurrentMember);
  const member = members.find((m) => m.member_id === currentMemberId);
  const ws =
    accountType === "agency"
      ? { name: agency.name, sub: agencyMode === "MARKETING" ? "Agency · Marketing" : "Agency · Management" }
      : { name: brand.name, sub: brand.industry ?? "Brand" };

  return (
    <header className="flex h-16 items-center gap-4 border-b border-hairline bg-surface px-5">
      {/* workspace switcher */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-surfaceMuted">
          <Avatar name={ws.name} accent={brandColor} size={28} />
          <div className="hidden text-left leading-tight sm:block">
            <div className="flex items-center gap-1 text-sm font-medium text-text">
              {ws.name}
              <BadgeCheck size={13} className="text-brand" />
            </div>
            <div className="label text-[10px] text-textMuted">{ws.sub}</div>
          </div>
          <ChevronDown size={14} className="text-textMuted" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content align="start" sideOffset={8} className="z-50 w-60 rounded-xl border border-hairline bg-surfaceElevated p-1 shadow-xl">
            <div className="label px-3 py-2 text-textMuted">Switch workspace</div>
            <DropdownMenu.Item onSelect={() => { setWorkspace("brand"); router.push("/dashboard"); }} className={cn("flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none", accountType === "brand" ? "bg-brand/10 text-brand" : "text-text hover:bg-surfaceMuted")}>
              <Avatar name={brand.name} size={24} accent="#9CA3AF" /> {brand.name} <span className="label ml-auto text-[10px] text-textMuted">Brand</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => { setWorkspace("agency", "MANAGEMENT"); router.push("/dashboard"); }} className={cn("flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none", accountType === "agency" && agencyMode === "MANAGEMENT" ? "bg-brand/10 text-brand" : "text-text hover:bg-surfaceMuted")}>
              <Avatar name={agency.name} size={24} accent="#9CA3AF" /> {agency.name} <span className="label ml-auto text-[10px] text-textMuted">Mgmt</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => { setWorkspace("agency", "MARKETING"); router.push("/dashboard"); }} className={cn("flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none", accountType === "agency" && agencyMode === "MARKETING" ? "bg-brand/10 text-brand" : "text-text hover:bg-surfaceMuted")}>
              <Avatar name={agency.name} size={24} accent="#9CA3AF" /> {agency.name} <span className="label ml-auto text-[10px] text-textMuted">Mktg</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* search */}
      <GlobalSearch />

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg p-2 text-textMuted hover:bg-surfaceMuted hover:text-text"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <NotificationsBell />

        {/* member switcher — demonstrates permission gating */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="ml-1 flex items-center gap-2 rounded-lg border border-hairline px-2 py-1.5 hover:bg-surfaceMuted">
            <Avatar name={member?.name ?? "?"} size={26} accent="#9CA3AF" />
            <div className="hidden text-left leading-tight sm:block">
              <div className="text-xs font-medium text-text">{member?.name}</div>
              <div className="label text-[10px] text-textMuted">{member?.role}</div>
            </div>
            <ChevronDown size={14} className="text-textMuted" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-56 rounded-xl border border-hairline bg-surfaceElevated p-1 shadow-xl"
            >
              <div className="label px-3 py-2 text-textMuted">Switch seat (demo)</div>
              {members.map((m) => (
                <DropdownMenu.Item
                  key={m.member_id}
                  onSelect={() => setCurrentMember(m.member_id)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm outline-none",
                    m.member_id === currentMemberId ? "bg-brand/10 text-brand" : "text-text hover:bg-surfaceMuted",
                  )}
                >
                  <span>{m.name}</span>
                  <span className="label text-[10px] text-textMuted">{m.role}</span>
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator className="my-1 h-px bg-hairline" />
              <DropdownMenu.Item
                onSelect={() => router.push("/login")}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-textMuted outline-none hover:bg-surfaceMuted hover:text-text"
              >
                <LogOut size={14} /> Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
