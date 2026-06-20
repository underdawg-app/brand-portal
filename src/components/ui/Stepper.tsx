"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Horizontal lifecycle stepper (§5). Shows ordered stages with the current one
 * highlighted and completed ones marked done. Off-path states are handled by
 * the caller (replace the stepper with a notice).
 */
export function Stepper({ stages, current }: { stages: string[]; current: string }) {
  const idx = stages.indexOf(current);
  return (
    <div className="flex w-full items-center overflow-x-auto">
      {stages.map((stage, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={stage} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs",
                  active && "border-brand bg-brand text-brandFg",
                  done && "border-brand bg-brand/10 text-brand",
                  !active && !done && "border-hairlineStrong text-textMuted",
                )}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn("label whitespace-nowrap text-[9px]", active ? "text-text" : "text-textMuted")}>
                {stage}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div className={cn("mx-1 h-px flex-1", i < idx ? "bg-brand" : "bg-hairline")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
