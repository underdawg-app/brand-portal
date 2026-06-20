"use client";

import { BadgeCheck, MapPin, Star, Bookmark } from "lucide-react";
import type { Creator } from "@/lib/types";
import { Avatar, Card } from "@/components/ui/primitives";
import { compact } from "@/lib/format";
import type { PortfolioItem } from "@/lib/types";

/** Always return exactly 4 portfolio tiles so cards never look ragged. */
function padTiles(portfolio: PortfolioItem[], accent: string): PortfolioItem[] {
  const tiles = portfolio.slice(0, 4);
  while (tiles.length < 4) tiles.push({ id: `ph-${tiles.length}`, title: "", cover: accent, kind: "PLACEHOLDER" });
  return tiles;
}

/** Contra/Upwork-style rich creator card: identity + stat row + badges + portfolio strip. */
export function CreatorCard({
  creator,
  fit,
  onClick,
  saved,
  onToggleSave,
}: {
  creator: Creator;
  fit?: number;
  onClick?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  const c = creator;
  const stats: [string, string][] = [
    [`₹${compact(c.stats.earned)}`, "Earned"],
    [`${c.ratingCount ?? 0}`, "Deals"],
    [`★ ${c.ratingAvg ?? "—"}`, "Rating"],
    [compact(c.stats.followers), "Followers"],
  ];

  return (
    <Card className="overflow-hidden transition-colors hover:border-hairlineStrong">
      <div className="p-4">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={onClick} className="flex min-w-0 items-start gap-3 text-left">
            <Avatar name={c.name} src={c.avatarUrl} accent={c.accent} size={44} />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="truncate font-medium text-text">{c.name}</span>
                {c.verifiedHuman && <BadgeCheck size={14} className="shrink-0 text-brand" />}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-textMuted">
                <MapPin size={11} /> {c.location}
              </div>
            </div>
          </button>
          <div className="flex items-center gap-1">
            {fit != null && (
              <span className="label rounded-full border border-hairlineStrong px-2 py-1 text-text">{fit}% fit</span>
            )}
            {onToggleSave && (
              <button type="button" onClick={onToggleSave} aria-label={saved ? "Saved" : "Save"} className="rounded-md p-1.5 text-textMuted hover:bg-surfaceMuted hover:text-text">
                <Bookmark size={16} className={saved ? "fill-current text-brand" : ""} />
              </button>
            )}
          </div>
        </div>

        {/* badges + specialty */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="label rounded-md border border-hairline px-2 py-0.5 text-textMuted">{c.tier}</span>
          {c.verifiedHuman && <span className="label rounded-md border border-hairline px-2 py-0.5 text-textMuted">Verified Human</span>}
          {(c.stats.followers > 80000) && <span className="label rounded-md border border-hairline px-2 py-0.5 text-textMuted">Top Talent</span>}
        </div>
        <button type="button" onClick={onClick} className="mt-2 block w-full text-left text-sm text-textSoft">
          {c.type} · {c.niches.slice(0, 3).join(" · ")}
        </button>

        {/* stat row */}
        <div className="mt-3 grid grid-cols-4 gap-1 border-y border-hairline py-2.5">
          {stats.map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-sm font-heavy text-text">{v}</div>
              <div className="label text-[9px] text-textMuted">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* portfolio thumbnail strip — always 4 aligned tiles */}
      <button type="button" onClick={onClick} className="grid w-full grid-cols-4 gap-0.5">
        {padTiles(c.portfolio, c.accent).map((p, i) => {
          const isImg = p.cover.startsWith("http");
          return (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden bg-surfaceMuted"
              style={isImg ? undefined : { background: `${p.cover}22` }}
            >
              {isImg && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover} alt={p.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              )}
              <div className="absolute inset-0 flex items-end p-1.5">
                <Star size={10} className="text-white/70 drop-shadow" />
              </div>
            </div>
          );
        })}
      </button>
    </Card>
  );
}
