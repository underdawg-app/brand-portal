"use client";

/**
 * Lightweight, dependency-free charts (pure SVG/CSS). Replaces recharts, which
 * triggered "Maximum update depth exceeded" loops via its internal redux store +
 * ResponsiveContainer. These never set state, so they can't loop.
 */

export function LineArea({
  points,
  height = 240,
  color,
  labels,
}: {
  points: number[];
  height?: number;
  color: string;
  labels?: string[];
}) {
  const w = 100;
  const h = 40;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = max - min || 1;
  const n = points.length;
  const x = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * w);
  const y = (v: number) => h - ((v - min) / span) * (h - 4) - 2;
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(p).toFixed(2)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div style={{ height }} className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <linearGradient id="laGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#laGrad)" />
        <path d={line} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      {labels && (
        <div className="mt-1 flex justify-between">
          {labels.map((l) => <span key={l} className="text-[10px] text-textMuted">{l}</span>)}
        </div>
      )}
    </div>
  );
}

export function Bars({
  data,
  height = 240,
  color,
}: {
  data: { label: string; value: number }[];
  height?: number;
  color: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ height }} className="flex w-full items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md transition-all"
              style={{ height: `${(d.value / max) * 100}%`, background: color, minHeight: 2 }}
            />
          </div>
          <span className="text-[10px] text-textMuted">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
