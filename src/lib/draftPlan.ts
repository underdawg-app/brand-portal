// Hardcoded "AI" plan generator. Maps a one-line brief to a set of kanban cards
// spread across the board's columns. Swap for a real model call later.
import type { PlanColumn } from "./types";

export interface PlanCardDraft {
  column: PlanColumn;
  title: string;
  body: string;
  tag: string;
}

const NICHE_TAGS: { keys: string[]; tag: string }[] = [
  { keys: ["skincare", "beauty", "serum", "makeup"], tag: "Skincare" },
  { keys: ["fashion", "apparel", "outfit", "streetwear"], tag: "Fashion" },
  { keys: ["food", "recipe", "cafe", "beverage", "snack"], tag: "Food" },
  { keys: ["tech", "gadget", "app", "device"], tag: "Tech" },
  { keys: ["fitness", "gym", "wellness", "yoga"], tag: "Fitness" },
  { keys: ["film", "video", "reel", "story"], tag: "Film" },
];

function subject(brief: string): string {
  const cleaned = brief.replace(/[^a-zA-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ").filter((w) => w.length > 2).slice(0, 4);
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || "Campaign";
}

export function generatePlanCards(brief: string): PlanCardDraft[] {
  const p = brief.toLowerCase();
  const tag = NICHE_TAGS.find((n) => n.keys.some((k) => p.includes(k)))?.tag ?? "Campaign";
  const subj = subject(brief);

  return [
    { column: "backlog", title: `Define goals — ${subj}`, body: `Set reach + engagement targets and the core message for "${brief.trim()}".`, tag },
    { column: "backlog", title: "Build creator shortlist", body: `Discover 8–12 ${tag.toLowerCase()} creators that match the brief, save to a list, and compare top picks.`, tag },
    { column: "backlog", title: "Draft the job post", body: "Use AI to draft a brief, set budget range, and publish to talent.", tag },
    { column: "progress", title: "Outreach & negotiation", body: "Message shortlisted creators, agree scope and rates, move to deals.", tag },
    { column: "progress", title: "Content calendar", body: "Lock a coordinated post window so the launch lands together.", tag },
    { column: "review", title: "Review deliverables", body: "Approve drafts, send revision notes, confirm go-live links.", tag },
  ];
}
