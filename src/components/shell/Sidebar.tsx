"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Search,
  GitCompare,
  Briefcase,
  Handshake,
  Megaphone,
  KanbanSquare,
  MessageSquare,
  Wallet,
  BarChart3,
  Settings,
  Star,
  Users,
  UserPlus,
  FileSignature,
  Percent,
  Building2,
  Layers,
  LineChart,
  PanelLeftClose,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/ui/primitives";
import type { Permissions } from "@/lib/types";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  perm?: keyof Permissions;
};

const BRAND_NAV: Item[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/jobs", label: "Jobs", icon: Briefcase, perm: "postJobsOrCampaigns" },
  { href: "/deals", label: "Deals", icon: Handshake },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone, perm: "manageCampaigns" },
  { href: "/plans", label: "Plans", icon: KanbanSquare },
  { href: "/messages", label: "Messages", icon: MessageSquare, perm: "replyToMessages" },
  { href: "/ratings", label: "Ratings", icon: Star },
  { href: "/finance", label: "Finance", icon: Wallet, perm: "viewFinancials" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, perm: "viewAnalytics" },
  { href: "/settings", label: "Settings", icon: Settings },
];

const AGENCY_MGMT_NAV: Item[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roster", label: "Roster", icon: Users },
  { href: "/discover", label: "Talent Discovery", icon: UserPlus },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/representation", label: "Representation", icon: FileSignature },
  { href: "/deals", label: "Deal Desk", icon: Handshake },
  { href: "/plans", label: "Plans", icon: KanbanSquare },
  { href: "/commissions", label: "Commissions", icon: Percent, perm: "viewFinancials" },
  { href: "/messages", label: "Messages", icon: MessageSquare, perm: "replyToMessages" },
  { href: "/settings", label: "Settings", icon: Settings },
];

const AGENCY_MKTG_NAV: Item[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Building2 },
  { href: "/discover", label: "Talent", icon: UserPlus },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/talent-pools", label: "Talent Pools", icon: Layers },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone, perm: "manageCampaigns" },
  { href: "/jobs", label: "Jobs", icon: Briefcase, perm: "postJobsOrCampaigns" },
  { href: "/plans", label: "Plans", icon: KanbanSquare },
  { href: "/reporting", label: "Reporting", icon: LineChart, perm: "viewAnalytics" },
  { href: "/messages", label: "Messages", icon: MessageSquare, perm: "replyToMessages" },
  { href: "/settings/billing", label: "Billing", icon: Wallet, perm: "viewFinancials" },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const accountType = useStore((s) => s.accountType);
  const agencyMode = useStore((s) => s.agencyMode);
  const member = useStore((s) => s.currentMember());
  const profile = useStore((s) => s.profile);
  const brand = useStore((s) => s.brand);
  const agency = useStore((s) => s.agency);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);
  const perms = member?.permissions;

  // Start collapsed on small screens so the drawer never covers content on load.
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) setSidebarOpen(false);
  }, [setSidebarOpen]);

  const nav =
    accountType === "agency"
      ? agencyMode === "MARKETING" ? AGENCY_MKTG_NAV : AGENCY_MGMT_NAV
      : BRAND_NAV;
  const items = nav.filter((i) => !i.perm || perms?.[i.perm]);

  const wsName = profile.companyName || (accountType === "agency" ? agency.name : brand.name);
  const wsSub = accountType === "agency" ? (agencyMode === "MARKETING" ? "Agency · Marketing" : "Agency · Management") : "Brand workspace";

  return (
    <>
      {/* mobile backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} aria-hidden className="fixed inset-0 z-40 bg-black/40 md:hidden" />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-hairline bg-surface transition-transform duration-300 ease-out",
          "md:sticky md:top-0 md:h-screen md:translate-x-0 md:transition-[width] md:duration-300",
          sidebarOpen ? "translate-x-0 md:w-60" : "-translate-x-full md:w-0 md:overflow-hidden md:border-r-0",
        )}
      >
        <div className="flex h-full w-60 shrink-0 flex-col">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-5">
            <Link href="/home"><Logo height={24} /></Link>
            <button onClick={() => setSidebarOpen(false)} className="rounded-md p-1 text-textMuted hover:bg-surfaceMuted hover:text-text md:hidden" aria-label="Close menu">
              <PanelLeftClose size={18} />
            </button>
          </div>

          {/* workspace identity */}
          <div className="flex items-center gap-2.5 border-b border-hairline px-4 py-3">
            <Avatar name={wsName} accent="#9CA3AF" size={34} />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-text">{wsName}</div>
              <div className="label text-[10px] text-textMuted">{wsSub}</div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => { if (window.innerWidth < 768) setSidebarOpen(false); }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-brand/10 font-medium text-brand"
                      : "text-textMuted hover:bg-surfaceMuted/60 hover:text-text",
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-hairline p-3">
            <Link href="/jobs/post" className="block rounded-lg bg-brand p-3 text-brandFg transition-opacity hover:opacity-90">
              <span className="label">Post a job</span>
              <p className="mt-1 text-xs leading-snug opacity-80">Let AI draft it — live in under a minute.</p>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
