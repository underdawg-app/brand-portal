// Hardcoded "AI" job drafting. Maps a free-text brief to a structured job post.
// Swap this for a real model call later — the shape is what the review screen expects.
import type { JobType } from "./types";

export interface JobDraft {
  title: string;
  niche: string; // category
  type: JobType;
  description: string;
  deliverables: string[];
  timeline: string;
  budgetMin: number;
  budgetMax: number;
}

const NICHES: { keys: string[]; niche: string }[] = [
  { keys: ["skincare", "beauty", "serum", "makeup", "cosmetic"], niche: "Skincare & Beauty" },
  { keys: ["fashion", "apparel", "outfit", "clothing", "streetwear"], niche: "Fashion" },
  { keys: ["fitness", "gym", "workout", "wellness", "yoga"], niche: "Fitness & Wellness" },
  { keys: ["food", "recipe", "restaurant", "cafe", "snack", "beverage"], niche: "Food & Beverage" },
  { keys: ["tech", "gadget", "app", "software", "saas", "device"], niche: "Tech & Gadgets" },
  { keys: ["game", "gaming", "esports"], niche: "Gaming" },
  { keys: ["travel", "hotel", "trip", "destination"], niche: "Travel" },
  { keys: ["finance", "fintech", "crypto", "investing", "money"], niche: "Finance" },
];

const TYPES: { keys: string[]; type: JobType; deliverables: string[]; title: string }[] = [
  { keys: ["ugc", "user generated", "authentic"], type: "UGC Creation", deliverables: ["3 UGC videos (≤30s)", "5 raw stills", "Usage rights for paid ads"], title: "UGC Content Creation" },
  { keys: ["reel", "short", "tiktok", "video"], type: "Story/Reel", deliverables: ["1 Reel (≤60s)", "2 story frames", "1 round of revisions"], title: "Short-Form Video for" },
  { keys: ["review", "unboxing"], type: "Product Review", deliverables: ["1 dedicated review video", "1 carousel post", "Pinned comment"], title: "Product Review for" },
  { keys: ["ambassador", "long-term", "ongoing"], type: "Brand Ambassador", deliverables: ["4 posts / month", "8 stories / month", "Exclusivity in category"], title: "Brand Ambassador for" },
  { keys: ["event", "launch party", "coverage"], type: "Event Coverage", deliverables: ["Live story coverage", "1 recap Reel", "10 edited photos"], title: "Event Coverage for" },
  { keys: ["ad", "advertisement", "campaign", "social media", "promo"], type: "Sponsored Post", deliverables: ["1 feed post", "3 stories", "Approved ad usage (90 days)"], title: "Social Media Ad Creation" },
];

function titleCaseSubject(prompt: string): string {
  // Grab a short noun-ish subject from the prompt for the title tail.
  const cleaned = prompt.replace(/[^a-zA-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ").filter((w) => w.length > 2).slice(0, 4);
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export function draftJobFromPrompt(prompt: string): JobDraft {
  const p = prompt.toLowerCase();
  const nicheMatch = NICHES.find((n) => n.keys.some((k) => p.includes(k)));
  const niche = nicheMatch?.niche ?? "Lifestyle";
  const typeMatch = TYPES.find((t) => t.keys.some((k) => p.includes(k))) ?? TYPES[5];

  const subject = titleCaseSubject(prompt) || "New Product";
  const title = typeMatch.title.endsWith("for")
    ? `${typeMatch.title} ${subject}`
    : typeMatch.type === "UGC Creation"
      ? `UGC Content for ${subject}`
      : `${typeMatch.title} — ${subject}`;

  const description =
    `We're looking for a creative ${niche.toLowerCase()} creator to produce ${typeMatch.type.toLowerCase()} that brings this brief to life: "${prompt.trim()}". ` +
    `The ideal creator has a distinctive voice, a track record of high-engagement content, and can deliver on a tight timeline. ` +
    `You'll own the concept end-to-end — from hook to edit — and collaborate with us on revisions so the final piece feels native to your audience while hitting our goals.`;

  return {
    title,
    niche,
    type: typeMatch.type,
    description,
    deliverables: typeMatch.deliverables,
    timeline: "14 days",
    budgetMin: 25000,
    budgetMax: 60000,
  };
}
