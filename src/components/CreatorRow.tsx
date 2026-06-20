"use client";

import { BadgeCheck, MapPin, Bookmark, Zap, Star } from "lucide-react";
import type { Creator } from "@/lib/types";
import { Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { compact } from "@/lib/format";

/**
 * Contra-style full-width profile row: identity + inline stat row + actions on top,
 * then a uniform 4-up portfolio strip. Every row renders exactly 4 aligned thumbnails
 * (padded when a creator has fewer) so the list never looks ragged.
 */
export function CreatorRow({
  creator,
  fit,
  onClick,
  saved,
  onToggleSave,
  onMessage,
}: {
  creator: Creator;
  fit?: number;
  onClick?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
  onMessage?: () => void;
}) {
  const c = creator;
  const stats: [string, string][] = [
    [`₹${compact(c.stats.earned)}`, "Earned"],
    [`${c.ratingCount ?? 0}x`, "Hired"],
    [`★ ${c.ratingAvg ?? "—"}`, "Rating"],
    [compact(c.stats.followers), "Followers"],
  ];

  // Always render 4 tiles, aligned. Pad with accent placeholders if needed.
  const tiles = [...c.portfolio.slice(0, 4)];
  while (tiles.length < 4) tiles.push({ id: `ph-${tiles.length}`, title: "", cover: c.accent, kind: "PLACEHOLDER" });

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-surfaceElevated transition-colors hover:border-hairlineStrong">
      {/* top: identity + stats + actions */}
      <div className="flex flex-wrap items-start gap-4 p-5">
        <button type="button" onClick={onClick} className="flex min-w-0 items-center gap-3 text-left">
          <Avatar name={c.name} src={c.avatarUrl} accent={c.accent} size={56} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-lg font-medium text-text">{c.name}</span>
              {c.verifiedHuman && <BadgeCheck size={16} className="shrink-0 text-brand" />}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-textMuted">
              <span className="label rounded-md border border-hairline px-1.5 py-0.5">{c.tier}</span>
              <span className="flex items-center gap-1"><MapPin size={11} /> {c.location}</span>
            </div>
          </div>
        </button>

        <div className="ml-auto flex items-center gap-2">
          {fit != null && (
            <span className="label rounded-full border border-hairlineStrong px-2.5 py-1 text-text">{fit}% fit</span>
          )}
          <Button variant="outline" size="sm" onClick={onToggleSave}>
            <Bookmark size={15} className={saved ? "fill-current text-brand" : ""} /> {saved ? "Saved" : "Save"}
          </Button>
          <Button size="sm" onClick={onMessage ?? onClick}><Zap size={15} /> Message</Button>
        </div>

        {/* inline stat row (Contra-style) */}
        <div className="flex w-full items-center gap-6 border-t border-hairline pt-4">
          {stats.map(([v, l]) => (
            <div key={l}>
              <div className="text-base font-heavy text-text">{v}</div>
              <div className="label text-[10px] text-textMuted">{l}</div>
            </div>
          ))}
          <p className="ml-2 hidden min-w-0 flex-1 truncate text-sm text-textSoft sm:block">{c.bio || `${c.type} · ${c.niches.slice(0, 3).join(" · ")}`}</p>
        </div>
      </div>

      {/* uniform 4-up portfolio strip */}
      <button type="button" onClick={onClick} className="grid w-full grid-cols-4 gap-0.5">
        {tiles.map((p, i) => {
          const isImg = p.cover.startsWith("http");
          return (
            <div key={i} className="relative aspect-[4/3] overflow-hidden bg-surfaceMuted" style={isImg ? undefined : { background: `${p.cover}22` }}>
              {isImg && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover} alt={p.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              )}
              {p.title && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/55 to-transparent p-2">
                  <span className="label text-[9px] text-white">{p.title}</span>
                </div>
              )}
              {!isImg && !p.title && (
                <div className="absolute inset-0 grid place-items-center"><Star size={14} className="text-textMuted/30" /></div>
              )}
            </div>
          );
        })}
      </button>
    </div>
  );
}
