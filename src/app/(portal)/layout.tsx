import { Sidebar } from "@/components/shell/Sidebar";
import { PortalTopbar } from "@/components/shell/PortalTopbar";
import { MessageDock } from "@/components/shell/MessageDock";
import { ContactGate } from "@/components/shell/ContactGate";
import { Toaster } from "@/components/ui/Toaster";
import { VerificationBanner } from "@/components/shell/VerificationBanner";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface text-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <PortalTopbar />
        <main className="flex-1 px-4 py-6 md:px-6">
          <div className="mx-auto max-w-7xl space-y-8">
            <VerificationBanner />
            {children}
          </div>
        </main>
      </div>
      <MessageDock />
      <ContactGate />
      <Toaster />
    </div>
  );
}
