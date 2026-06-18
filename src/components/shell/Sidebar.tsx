"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Handshake,
  Megaphone,
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
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";
import type { Permissions } from "@/lib/types";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  perm?: keyof Permissions;
};

const BRAND_NAV: Item[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/jobs", label: "Jobs", icon: Briefcase, perm: "postJobsOrCampaigns" },
  { href: "/deals", label: "Deals", icon: Handshake },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone, perm: "manageCampaigns" },
  { href: "/messages", label: "Messages", icon: MessageSquare, perm: "replyToMessages" },
  { href: "/ratings", label: "Ratings", icon: Star },
  { href: "/finance", label: "Finance", icon: Wallet, perm: "viewFinancials" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, perm: "viewAnalytics" },
  { href: "/settings", label: "Settings", icon: Settings },
];

const AGENCY_MGMT_NAV: Item[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roster", label: "Roster", icon: Users },
  { href: "/discover", label: "Talent Discovery", icon: UserPlus },
  { href: "/representation", label: "Representation", icon: FileSignature },
  { href: "/deals", label: "Deal Desk", icon: Handshake },
  { href: "/commissions", label: "Commissions", icon: Percent, perm: "viewFinancials" },
  { href: "/messages", label: "Messages", icon: MessageSquare, perm: "replyToMessages" },
  { href: "/settings", label: "Settings", icon: Settings },
];

const AGENCY_MKTG_NAV: Item[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Building2 },
  { href: "/talent-pools", label: "Talent Pools", icon: Layers },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone, perm: "manageCampaigns" },
  { href: "/jobs", label: "Jobs", icon: Briefcase, perm: "postJobsOrCampaigns" },
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
  const perms = member?.permissions;

  const nav =
    accountType === "agency"
      ? agencyMode === "MARKETING" ? AGENCY_MKTG_NAV : AGENCY_MGMT_NAV
      : BRAND_NAV;
  const items = nav.filter((i) => !i.perm || perms?.[i.perm]);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-hairline bg-surface md:flex">
      <Link href="/dashboard" className="flex items-center border-b border-hairline px-5 py-6">
        <Logo height={26} />
      </Link>
      <div className="px-3 pb-2 pt-4">
        <span className="label px-2 text-textMuted">{accountType === "agency" ? (agencyMode === "MARKETING" ? "Agency · Marketing" : "Agency · Management") : "Brand Portal"}</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
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
      <div className="border-t border-hairline p-3 text-xs text-textMuted">
        <div className="rounded-lg bg-surfaceMuted/40 p-3">
          <span className="label">Get Connected</span>
          <p className="mt-1 leading-snug">Prove one deal loop, then scale to campaigns.</p>
        </div>
      </div>
    </aside>
  );
}
