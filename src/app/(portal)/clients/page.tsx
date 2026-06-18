"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Briefcase, Megaphone, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Money, Avatar, inputClass, Stat } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { compact } from "@/lib/format";

export default function ClientsPage() {
  const router = useRouter();
  const clients = useStore((s) => s.clients);
  const activeClientId = useStore((s) => s.activeClientId);
  const setActiveClient = useStore((s) => s.setActiveClient);
  const addClient = useStore((s) => s.addClient);
  const toast = useStore((s) => s.toast);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");

  const totalSpend = clients.reduce((s, c) => s + c.spend, 0);
  const totalReach = clients.reduce((s, c) => s + c.reach, 0);

  return (
    <>
      <PageHeader
        eyebrow="Agency · Marketing"
        title="Clients"
        sub="Each client is a separate workspace. Scope the portal to a client to manage its jobs & campaigns."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Clients" value={clients.length} sub="active" />
        <Stat label="Managed spend" value={<Money amount={totalSpend} />} sub="across clients" />
        <Stat label="Reach delivered" value={compact(totalReach)} sub="aggregate" />
      </div>

      <Card className="p-4">
        <Label>Add a client</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          <input className={`${inputClass} max-w-xs`} placeholder="Brand name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={`${inputClass} max-w-xs`} placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <Button onClick={() => { if (name.trim()) { addClient(name.trim(), industry.trim() || "—"); setName(""); setIndustry(""); toast("Client added.", "success"); } }}>
            <Plus size={16} /> Add client
          </Button>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((c) => {
          const active = c.client_id === activeClientId;
          return (
            <Card key={c.client_id} className={`p-4 ${active ? "border-brand" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={c.brandName} accent="#9CA3AF" size={36} />
                  <div>
                    <div className="font-medium text-text">{c.brandName}</div>
                    <div className="text-xs text-textMuted">{c.industry}</div>
                  </div>
                </div>
                {active && <Check size={16} className="text-brand" />}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3 text-xs text-textMuted">
                <span className="flex items-center gap-1"><Briefcase size={12} />{c.activeJobs} jobs</span>
                <span className="flex items-center gap-1"><Megaphone size={12} />{c.activeCampaigns} campaigns</span>
                <span>reach {compact(c.reach)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Money amount={c.spend} className="text-sm text-text" />
                <Button
                  size="sm"
                  variant={active ? "secondary" : "outline"}
                  onClick={() => { setActiveClient(active ? null : c.client_id); toast(active ? "Scope cleared." : `Scoped to ${c.brandName}.`, "default"); }}
                >
                  {active ? "Scoped — clear" : "Work on this client"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {activeClientId && (
        <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
          <span className="text-sm text-text">
            Working on <span className="font-medium">{clients.find((c) => c.client_id === activeClientId)?.brandName}</span> — jobs, campaigns and applicants are scoped to this client.
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => router.push("/jobs")}>Jobs</Button>
            <Button size="sm" variant="outline" onClick={() => router.push("/campaigns")}>Campaigns</Button>
            <Button size="sm" onClick={() => router.push("/reporting")}>Reporting</Button>
          </div>
        </Card>
      )}
    </>
  );
}
