"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Label, Money, StatusBadge, Stat } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { escrowTone, type Tone } from "@/lib/status";
import { formatDate } from "@/lib/format";
import type { Transaction, Escrow, Invoice } from "@/lib/types";

const txnTone = (s: Transaction["status"]): Tone =>
  s === "CLEARED" ? "success" : s === "PENDING" ? "warn" : "neutral";

export default function FinancePage() {
  const router = useRouter();
  const transactions = useStore((s) => s.transactions);
  const escrows = useStore((s) => s.escrows);
  const invoices = useStore((s) => s.invoices);
  const creators = useStore((s) => s.creators);

  const held = escrows.filter((e) => e.status !== "PAID").reduce((s, e) => s + e.grossAmount, 0);
  const paid = escrows.filter((e) => e.status === "PAID").reduce((s, e) => s + e.grossAmount, 0);
  const fees = transactions.filter((t) => t.kind === "FEE").reduce((s, t) => s + t.amount, 0);

  const txnCols: Column<Transaction>[] = [
    { key: "kind", header: "Kind", render: (t) => <span className="label text-textMuted">{t.kind}</span> },
    { key: "source", header: "Source", render: (t) => <span className="text-text">{t.source}</span> },
    { key: "amount", header: "Amount", render: (t) => <span className={t.direction === "OUT" ? "text-textMuted" : "text-text"}>{t.direction === "OUT" ? "– " : "+ "}<Money amount={t.amount} currency={t.currency} /></span> },
    { key: "date", header: "Date", render: (t) => <span className="text-textMuted">{formatDate(t.date)}</span> },
    { key: "status", header: "Status", render: (t) => <StatusBadge tone={txnTone(t.status)}>{t.status}</StatusBadge> },
  ];

  const escrowCols: Column<Escrow>[] = [
    { key: "gross", header: "Gross", render: (e) => <Money amount={e.grossAmount} currency={e.currency} className="text-text" /> },
    { key: "fee", header: "Fee 12%", render: (e) => <span className="text-textMuted"><Money amount={e.platformFeeAmount} currency={e.currency} /></span> },
    { key: "net", header: "Net to creator", render: (e) => <Money amount={e.netToCreator} currency={e.currency} className="text-text" /> },
    { key: "status", header: "Status", render: (e) => <StatusBadge tone={escrowTone[e.status]}>{e.status}</StatusBadge> },
  ];

  const invCols: Column<Invoice>[] = [
    { key: "id", header: "Invoice", render: (i) => <span className="text-text">{i.invoice_id}</span> },
    { key: "to", header: "Creator", render: (i) => <span className="text-textMuted">{creators.find((c) => c.cr_id === i.toCreatorId)?.name ?? i.toCreatorId}</span> },
    { key: "gst", header: "GST 18%", render: (i) => <Money amount={i.gstAmount} currency={i.currency} /> },
    { key: "total", header: "Total", render: (i) => <Money amount={i.total} currency={i.currency} className="text-text" /> },
    { key: "status", header: "Status", render: (i) => <StatusBadge tone={i.status === "PAID" ? "success" : "warn"}>{i.status}</StatusBadge> },
  ];

  return (
    <>
      <PageHeader eyebrow="Layer 2 · Finance" title="Finance & Billing" sub="Escrow, transactions and GST invoices. Razorpay (IN) · Stripe (intl)." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Held in escrow" value={<Money amount={held} />} sub="awaiting approval" />
        <Stat label="Released" value={<Money amount={paid} />} sub="to creators" />
        <Stat label="Platform fees paid" value={<Money amount={fees} />} sub="12% of gross" />
      </div>

      <div><Label>Escrow ledger</Label><div className="mt-3"><DataTable columns={escrowCols} rows={escrows} onRowClick={(e) => router.push(`/deals/${e.dealId}`)} /></div></div>
      <div><Label>Transactions</Label><div className="mt-3"><DataTable columns={txnCols} rows={transactions} /></div></div>
      <div>
        <Label>Invoices (GST 18%)</Label>
        <div className="mt-3"><DataTable columns={invCols} rows={invoices} onRowClick={(i) => i.dealId && router.push(`/deals/${i.dealId}`)} /></div>
        <Card className="mt-3 p-4 text-xs text-textMuted">
          GSTIN <span className="text-text">29ABCDE1234F1Z5</span> · PAN <span className="text-text">ABCDE1234F</span>. TDS may apply on payouts — flagged per Indian brand.
        </Card>
      </div>
    </>
  );
}
