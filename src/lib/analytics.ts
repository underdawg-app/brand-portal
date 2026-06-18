import type { Creator } from "./types";

/**
 * Deterministic, brand-visible analytics for a creator — a transparent stand-in
 * for the backend's /analytics/creators/:id. Values are derived from the
 * creator's id + stats so they're stable per creator (no Math.random in render).
 */

function seed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff; // 0..1
}

// A few stable pseudo-randoms off the same id.
function rng(id: string, salt: string) {
  return seed(id + salt);
}

function split(parts: number[]): number[] {
  const total = parts.reduce((a, b) => a + b, 0);
  const pct = parts.map((p) => Math.round((p / total) * 100));
  // fix rounding so it sums to 100
  const diff = 100 - pct.reduce((a, b) => a + b, 0);
  pct[0] += diff;
  return pct;
}

export interface CreatorAnalytics {
  reachTrend: { w: string; reach: number; eng: number }[];
  engagementRate: number;
  reach30d: number;
  profileViews: number;
  growth30d: number;
  ages: { label: string; value: number }[];
  gender: { label: string; value: number }[];
  locations: { label: string; value: number }[];
  devices: { label: string; value: number }[];
  topContent: { id: string; title: string; views: number; likes: number; rate: number }[];
  reputation: { key: string; label: string; weight: number; score: number }[];
  bestPostTime: string;
}

const REP_FACTORS: { key: string; label: string; weight: number }[] = [
  { key: "quality", label: "Content quality", weight: 20 },
  { key: "consistency", label: "Consistency", weight: 15 },
  { key: "authenticity", label: "Authenticity", weight: 15 },
  { key: "community", label: "Community standing", weight: 15 },
  { key: "brand", label: "Brand reliability", weight: 15 },
  { key: "growth", label: "Audience growth", weight: 10 },
  { key: "tenure", label: "Platform tenure", weight: 10 },
];

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata"];
const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

export function creatorAnalytics(c: Creator): CreatorAnalytics {
  const id = c.cr_id;
  const base = c.stats.followers;
  const rep = c.stats.reputation;

  // reach + engagement trend (8 weeks), trending upward for rising creators
  const reachTrend = WEEKS.map((w, i) => {
    const wobble = 0.7 + rng(id, "r" + i) * 0.6;
    const ramp = 1 + i * (0.06 + rng(id, "g") * 0.05);
    return {
      w,
      reach: Math.round((base * 0.18) * wobble * ramp),
      eng: Math.round((base * 0.05) * (0.6 + rng(id, "e" + i) * 0.8) * ramp),
    };
  });

  const engagementRate = Number((3 + rng(id, "er") * 5).toFixed(1));
  const reach30d = reachTrend.slice(-4).reduce((s, p) => s + p.reach, 0);
  const profileViews = Math.round(base * (0.4 + rng(id, "pv") * 0.5));
  const growth30d = Number((2 + rng(id, "gr") * 12).toFixed(1));

  const ageParts = [
    1 + rng(id, "a0") * 2, // 13-17
    4 + rng(id, "a1") * 5, // 18-24
    4 + rng(id, "a2") * 5, // 25-34
    2 + rng(id, "a3") * 3, // 35-44
    1 + rng(id, "a4") * 2, // 45+
  ];
  const agePct = split(ageParts);
  const ages = ["13–17", "18–24", "25–34", "35–44", "45+"].map((label, i) => ({ label, value: agePct[i] }));

  const gParts = [5 + rng(id, "gf") * 4, 4 + rng(id, "gm") * 4, 0.5];
  const gPct = split(gParts);
  const gender = ["Women", "Men", "Other"].map((label, i) => ({ label, value: gPct[i] }));

  // pick 4 cities, biased by the creator's own location first
  const ordered = [...CITIES].sort((a, b) => rng(id, a) - rng(id, b));
  const ownCity = c.location.split(",")[0];
  const cities = [ownCity, ...ordered.filter((x) => x !== ownCity)].slice(0, 4);
  const locPct = split(cities.map((_, i) => 5 - i + rng(id, "l" + i) * 2));
  const locations = cities.map((label, i) => ({ label, value: locPct[i] }));

  const devPct = split([7 + rng(id, "dm") * 2, 2 + rng(id, "dd") * 2, 1]);
  const devices = ["Mobile", "Desktop", "Tablet"].map((label, i) => ({ label, value: devPct[i] }));

  const topContent = (c.portfolio.length ? c.portfolio : [{ id: "x", title: "Recent post", cover: c.accent, kind: "" }])
    .slice(0, 4)
    .map((p, i) => ({
      id: p.id,
      title: p.title,
      views: Math.round(base * (0.3 + rng(id, "v" + i) * 0.9)),
      likes: Math.round(base * (0.04 + rng(id, "k" + i) * 0.12)),
      rate: Number((2 + rng(id, "c" + i) * 7).toFixed(1)),
    }));

  const reputation = REP_FACTORS.map((f) => ({
    ...f,
    score: Math.min(100, Math.round(rep * (0.85 + rng(id, f.key) * 0.3))),
  }));

  const hours = ["7–9 PM", "8–10 PM", "12–2 PM", "9–11 AM"];
  const bestPostTime = hours[Math.floor(rng(id, "bt") * hours.length)];

  return {
    reachTrend, engagementRate, reach30d, profileViews, growth30d,
    ages, gender, locations, devices, topContent, reputation, bestPostTime,
  };
}
