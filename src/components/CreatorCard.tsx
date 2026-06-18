"use client";

import { BadgeCheck, MapPin, Star, Bookmark } from "lucide-react";
import type { Creator } from "@/lib/types";
import { Avatar, Card, Label } from "@/components/ui/primitives";
import { compact } from "@/lib/format";

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
  return (
    <Card className="relative cursor-pointer p-4 transition-colors hover:border-hairlineStrong" >
      {onToggleSave && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
          className="absolute right-3 top-3 z-10 rounded-md p-1 text-textMuted hover:bg-surfaceMuted hover:text-text"
          aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
        >
          <Bookmark size={16} className={saved ? "fill-current text-brand" : ""} />
        </button>
      )}
      <button type="button" onClick={onClick} className="w-full text-left">
        <div className="flex items-start gap-3 pr-7">
          <Avatar name={c.name} accent={c.accent} size={44} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="truncate font-medium text-text">{c.name}</span>
              {c.verifiedHuman && <BadgeCheck size={14} className="shrink-0 text-brand" />}
            </div>
            <div className="truncate text-xs text-textMuted">{c.handle} · {c.type}</div>
          </div>
          {fit != null && (
            <div className="shrink-0 text-right">
              <div className="font-heavy text-lg text-brand">{fit}%</div>
              <Label className="text-[9px]">fit</Label>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.niches.slice(0, 3).map((n) => (
            <span key={n} className="label rounded-full border border-hairline px-2 py-0.5 text-textMuted">{n}</span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3 text-xs text-textMuted">
          <span className="flex items-center gap-1"><MapPin size={12} />{c.location}</span>
          <span>{compact(c.stats.followers)} followers</span>
          <span className="flex items-center gap-1 text-text"><Star size={12} className="text-textMuted" />{c.ratingAvg}</span>
        </div>
      </button>
    </Card>
  );
}
