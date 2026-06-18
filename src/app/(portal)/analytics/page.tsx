"use client";

import { PageHeader, Card, Label, Stat } from "@/components/ui/primitives";
import { LineArea } from "@/components/ui/Charts";
import { useBrandColor } from "@/lib/useBrandColor";

const reach = [
  { w: "W1", v: 120 }, { w: "W2", v: 240 }, { w: "W3", v: 210 },
  { w: "W4", v: 380 }, { w: "W5", v: 520 }, { w: "W6", v: 610 },
];

export default function AnalyticsPage() {
  const brandColor = useBrandColor();
  return (
    <>
      <PageHeader eyebrow="Layer 6 · Intelligence" title="Analytics" sub="Partnership + campaign performance. Prove the channel before you scale it." />

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Reach (30d)" value="2.1M" sub="+18% vs prev" />
        <Stat label="Engagement" value="4.6%" sub="avg rate" />
        <Stat label="Deals run" value="5" sub="this quarter" />
        <Stat label="Repeat creators" value="2" sub="worked again" />
      </div>

      <Card className="p-5">
        <Label>Reach over time (000s)</Label>
        <div className="mt-4">
          <LineArea points={reach.map((r) => r.v)} labels={reach.map((r) => r.w)} height={240} color={brandColor} />
        </div>
      </Card>

      <Card className="p-5 text-sm text-textMuted">
        Full per-campaign and cross-client reporting lands with Get Viral (P1) and Agency · Marketing (P2).
      </Card>
    </>
  );
}
