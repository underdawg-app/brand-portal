import type { Creator } from "./types";

/**
 * Deterministic "fit %" — a transparent stand-in for the backend's
 * /creators/:id/fit signal. Blends reputation, verified-human, and follower
 * scale so the number is stable per creator (no Math.random in render).
 */
export function fitScore(c: Creator, niche?: string): number {
  let score = 50;
  score += Math.min(25, Math.round(c.stats.reputation / 4));
  if (c.verifiedHuman) score += 8;
  if (niche && c.niches.some((n) => n.toLowerCase().includes(niche.toLowerCase()))) score += 12;
  if (c.stats.followers > 50000) score += 5;
  return Math.min(99, score);
}
