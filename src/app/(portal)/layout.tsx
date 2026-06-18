import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { Toaster } from "@/components/ui/Toaster";
import { VerificationBanner } from "@/components/shell/VerificationBanner";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface text-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <VerificationBanner />
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
