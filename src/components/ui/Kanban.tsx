"use client";

import * as React from "react";
import { Label } from "./primitives";

export function KanbanBoard({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-3">{children}</div>;
}

export function KanbanColumn({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-surfaceMuted/20 p-3">
      <div className="flex items-center justify-between px-1">
        <Label>{title}</Label>
        <span className="label rounded-full bg-surfaceMuted px-2 py-0.5 text-textMuted">{count}</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
