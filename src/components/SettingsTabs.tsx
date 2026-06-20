"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { usePermission } from "@/lib/gate";

const TABS = [
  { href: "/settings", label: "Company & Team" },
  { href: "/settings/verification", label: "Verification" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/billing", label: "Billing", perm: "viewFinancials" as const },
  { href: "/settings/payment-methods", label: "Payment methods", perm: "viewFinancials" as const },
];

export function SettingsTabs() {
  const pathname = usePathname();
  const canFinance = usePermission("viewFinancials");
  const tabs = TABS.filter((t) => !t.perm || canFinance);
  return (
    <div className="flex flex-wrap gap-1 border-b border-hairline">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm transition-colors",
              active ? "border-brand font-medium text-text" : "border-transparent text-textMuted hover:text-text",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
