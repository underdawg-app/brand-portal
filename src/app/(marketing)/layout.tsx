import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicFooter } from "@/components/marketing/PublicFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-text">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
