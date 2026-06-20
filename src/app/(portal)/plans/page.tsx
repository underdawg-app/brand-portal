"use client";

import { useState } from "react";
import { Plus, Sparkles, Trash2, GripVertical, Bot, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Label, inputClass } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import type { PlanColumn, PlanCard } from "@/lib/types";
import { cn } from "@/lib/cn";

const COLUMNS: { key: PlanColumn; title: string }[] = [
  { key: "backlog", title: "Backlog" },
  { key: "progress", title: "In progress" },
  { key: "review", title: "Review" },
  { key: "done", title: "Done" },
];

export default function PlansPage() {
  const planCards = useStore((s) => s.planCards);
  const addPlanCard = useStore((s) => s.addPlanCard);
  const movePlanCard = useStore((s) => s.movePlanCard);
  const deletePlanCard = useStore((s) => s.deletePlanCard);
  const updatePlanCard = useStore((s) => s.updatePlanCard);
  const generatePlan = useStore((s) => s.generatePlan);
  const toast = useStore((s) => s.toast);

  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<PlanColumn | null>(null);
  const [addingTo, setAddingTo] = useState<PlanColumn | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiBrief, setAiBrief] = useState("");

  const drop = (col: PlanColumn) => {
    if (dragId) movePlanCard(dragId, col);
    setDragId(null);
    setOverCol(null);
  };

  const commitAdd = (col: PlanColumn) => {
    if (newTitle.trim()) addPlanCard(col, newTitle.trim());
    setNewTitle("");
    setAddingTo(null);
  };

  const runAI = () => {
    if (!aiBrief.trim()) return;
    generatePlan(aiBrief.trim());
    toast("AI dropped a plan onto your board.", "success");
    setAiBrief("");
    setAiOpen(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Plans"
        title="Campaign board"
        sub="A kanban for your campaign ideas — drag cards across stages, jot notes, or let AI draft a plan."
        action={<Button onClick={() => setAiOpen(true)}><Sparkles size={16} /> Generate with AI</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const cards = planCards.filter((c) => c.column === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => { e.preventDefault(); setOverCol(col.key); }}
              onDragLeave={() => setOverCol((c) => (c === col.key ? null : c))}
              onDrop={() => drop(col.key)}
              className={cn("flex min-h-[24rem] flex-col rounded-2xl border border-hairline bg-surfaceMuted/30 p-3", overCol === col.key && "ud-kanban-over")}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <Label>{col.title}</Label>
                <span className="label rounded-full bg-surfaceMuted px-2 py-0.5 text-textMuted">{cards.length}</span>
              </div>

              <div className="flex-1 space-y-2.5">
                {cards.map((card) => (
                  <PlanCardView
                    key={card.card_id}
                    card={card}
                    onDragStart={() => setDragId(card.card_id)}
                    onDragEnd={() => { setDragId(null); setOverCol(null); }}
                    onDelete={() => deletePlanCard(card.card_id)}
                    onRename={(t) => updatePlanCard(card.card_id, { title: t })}
                  />
                ))}
              </div>

              {addingTo === col.key ? (
                <div className="mt-2">
                  <textarea
                    autoFocus
                    className={`${inputClass} min-h-[60px] resize-none`}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitAdd(col.key); } }}
                    placeholder="New note…"
                  />
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => commitAdd(col.key)}>Add</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setAddingTo(null); setNewTitle(""); }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingTo(col.key)}
                  className="mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-textMuted hover:text-text"
                >
                  <Plus size={15} /> Add card
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* AI plan generator */}
      {aiOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setAiOpen(false)}>
          <div className="w-full max-w-lg rounded-xl border border-hairline bg-surfaceElevated p-6 shadow-2xl" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-brandFg"><Bot size={16} /></span>
                <div>
                  <div className="font-heavy text-base text-text">AI plan assistant</div>
                  <div className="label text-[10px] text-textMuted">describe a campaign — I&apos;ll build the board</div>
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} className="rounded-md p-1 text-textMuted hover:bg-surfaceMuted hover:text-text"><X size={16} /></button>
            </div>
            <textarea
              autoFocus
              className={`${inputClass} mt-4 min-h-[100px] resize-none`}
              value={aiBrief}
              onChange={(e) => setAiBrief(e.target.value)}
              placeholder="e.g. Plan a summer skincare launch with UGC creators and a coordinated post window."
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAiOpen(false)}>Cancel</Button>
              <Button onClick={runAI} disabled={!aiBrief.trim()}><Sparkles size={16} /> Generate plan</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PlanCardView({
  card, onDragStart, onDragEnd, onDelete, onRename,
}: {
  card: PlanCard;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDelete: () => void;
  onRename: (t: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(card.title);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="group cursor-grab rounded-xl border border-hairline bg-surfaceElevated p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <GripVertical size={14} className="mt-0.5 shrink-0 text-textMuted/60" />
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              autoFocus
              className="w-full rounded border border-hairline bg-surface px-2 py-1 text-sm text-text focus:outline-none"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onBlur={() => { onRename(val.trim() || card.title); setEditing(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") { onRename(val.trim() || card.title); setEditing(false); } }}
            />
          ) : (
            <button onClick={() => setEditing(true)} className="block text-left text-sm font-medium text-text">{card.title}</button>
          )}
          {card.body && <p className="mt-1 text-xs text-textMuted">{card.body}</p>}
          <div className="mt-2 flex items-center gap-1.5">
            {card.tag && <span className="label rounded-md border border-hairline px-1.5 py-0.5 text-[9px] text-textMuted">{card.tag}</span>}
            {card.ai && <span className="label rounded-md bg-brand/10 px-1.5 py-0.5 text-[9px] text-brand">AI</span>}
          </div>
        </div>
        <button onClick={onDelete} className="rounded p-1 text-textMuted opacity-0 transition-opacity hover:bg-surfaceMuted hover:text-text group-hover:opacity-100" aria-label="Delete">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
