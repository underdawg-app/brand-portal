import type {
  Brand,
  Agency,
  Representation,
  Client,
  TalentPool,
  Creator,
  Job,
  Application,
  Deal,
  Contract,
  Deliverable,
  Escrow,
  Thread,
  Transaction,
  Rating,
  Campaign,
  Invoice,
  Permissions,
  OrgMember,
} from "@/lib/types";
import { dealMath } from "@/lib/format";

const fullPerms: Permissions = {
  viewAnalytics: true,
  replyToMessages: true,
  acceptOrSignDeals: true,
  postJobsOrCampaigns: true,
  editCompanyProfile: true,
  viewFinancials: true,
  manageCampaigns: true,
};

const coordinatorPerms: Permissions = {
  viewAnalytics: true,
  replyToMessages: true,
  acceptOrSignDeals: false,
  postJobsOrCampaigns: true,
  editCompanyProfile: false,
  viewFinancials: false,
  manageCampaigns: false,
};

export const CURRENT_ORG_ID = "brand_copperleaf";

export const members: OrgMember[] = [
  {
    member_id: "m_owner",
    orgId: CURRENT_ORG_ID,
    userId: "u_aarav",
    name: "Aarav Mehta",
    email: "aarav@copperleaf.in",
    role: "OWNER",
    permissions: fullPerms,
    status: "ACTIVE",
    invitedAt: "2026-01-04",
  },
  {
    member_id: "m_coord",
    orgId: CURRENT_ORG_ID,
    userId: "u_dev",
    name: "Dev Sharma",
    email: "dev@copperleaf.in",
    role: "ASSISTANT",
    permissions: coordinatorPerms,
    status: "ACTIVE",
    invitedAt: "2026-02-12",
  },
];

export const brand: Brand = {
  brand_id: CURRENT_ORG_ID,
  name: "Copperleaf",
  legalName: "Copperleaf Wellness Pvt. Ltd.",
  logoUrl: "",
  website: "copperleaf.in",
  industry: "D2C Skincare",
  description:
    "Small-batch, plant-forward skincare for people who read the ingredient list. Made in Bengaluru.",
  hqLocation: "Bengaluru, IN",
  verificationStatus: "VERIFIED",
  kyc: {
    gstin: "29ABCDE1234F1Z5",
    pan: "ABCDE1234F",
    contactName: "Aarav Mehta",
    contactEmail: "aarav@copperleaf.in",
    contactPhone: "+91 98xxxxxx21",
    verifiedAt: "2026-01-09",
  },
  billing: { provider: "RAZORPAY", customerId: "cust_x91", currency: "INR", plan: "Growth" },
  teamSeats: members,
  createdAt: "2026-01-04",
  updatedAt: "2026-06-10",
};

// ---------------------------------------------------------------------------
// Creators (read-only mirror of public app profiles)
// ---------------------------------------------------------------------------

type Seed = Partial<Creator> & Pick<Creator, "cr_id" | "handle" | "name" | "type" | "location" | "accent">;

// Deterministic real-photo avatar per creator (pravatar has imgs 1–70).
function avatarFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return `https://i.pravatar.cc/240?img=${(h % 70) + 1}`;
}

function creator(s: Seed): Creator {
  const followers = s.stats?.followers ?? 12000;
  return {
    avatarUrl: avatarFor(s.cr_id),
    bio: "",
    stats: { followers, following: 320, reputation: 80, earned: 0 },
    tier: "EMERGING",
    isRosterEligible: followers >= 5000,
    niches: [],
    skills: [],
    platforms: [],
    portfolio: [],
    openTo: ["BRAND DEALS", "COLLABORATIONS"],
    rates: [],
    currency: "INR",
    contactVisibility: "VERIFIED_BRANDS_ONLY",
    ratesVisibility: "PUBLIC",
    verifiedHuman: true,
    verificationLevel: "liveness",
    managedBy: null,
    ratingAvg: 4.6,
    ratingCount: 7,
    ...s,
  } as Creator;
}

const rc = (post: number, reel: number) => [
  { key: "post", name: "Feed Post", base: post, desc: "1 in-feed post" },
  { key: "reel", name: "Short Video", base: reel, desc: "1 reel ≤ 60s" },
  { key: "story", name: "Story / 24h", base: Math.round(post / 3), desc: "3-frame story" },
];

const plats = (ig: number, yt = 0, tt = 0) => [
  { key: "ig", name: "Instagram", handle: "ig", followers: ig, verified: ig > 50000 },
  ...(yt ? [{ key: "yt", name: "YouTube", handle: "yt", followers: yt, verified: yt > 50000 }] : []),
  ...(tt ? [{ key: "tt", name: "TikTok", handle: "tt", followers: tt, verified: false }] : []),
];

// Real portfolio thumbnails — stable per (accent+title) via picsum seed.
const port = (accent: string, titles: string[]) =>
  titles.map((t, i) => ({
    id: `${t}-${i}`,
    title: t,
    cover: `https://picsum.photos/seed/${(accent + t + i).replace(/[^a-zA-Z0-9]/g, "")}/600/450`,
    kind: "IMAGE",
  }));

export const creators: Creator[] = [
  creator({
    cr_id: "cr_sola", handle: "@solaroux", name: "Sola Roux", type: "Visual Artist",
    location: "Mumbai, IN", accent: "#FF6BB5", bio: "Resin + abstract. Brooklyn-by-way-of-Bombay.",
    stats: { followers: 84200, following: 410, reputation: 88, earned: 540000 }, tier: "SILVER",
    niches: ["Visual Art", "Abstract", "Resin"], skills: ["Painting", "Product styling", "Reels"],
    platforms: plats(84200, 12000), portfolio: port("#FF6BB5", ["BONE TONES", "ACID BLOOM", "NIGHT GLASS", "SLOW SET"]),
    openTo: ["BRAND DEALS", "COMMISSIONS", "COLLABORATIONS"], rates: rc(28000, 45000), ratingAvg: 4.8, ratingCount: 12,
  }),
  creator({
    cr_id: "cr_maya", handle: "@maya.frames", name: "Maya Frames", type: "Filmmaker",
    location: "Bengaluru, IN", accent: "#2E5BFF", bio: "Short-form film + brand stories. Natural light only.",
    stats: { followers: 51200, following: 280, reputation: 84, earned: 410000 }, tier: "SILVER",
    niches: ["Film", "Video", "Multi-niche"], skills: ["Direction", "Editing", "Color"],
    platforms: plats(31000, 120000), portfolio: port("#2E5BFF", ["NIGHT BUS", "SLOW PRESS", "FIELD NOTES"]),
    rates: rc(45000, 85000), ratingAvg: 4.7, ratingCount: 9,
  }),
  creator({
    cr_id: "cr_nia", handle: "@nia.raval", name: "Nia Raval", type: "Skincare Creator",
    location: "Delhi, IN", accent: "#FF5A1F", bio: "Honest skincare reviews. Ingredient nerd.",
    stats: { followers: 142000, following: 600, reputation: 91, earned: 980000 }, tier: "GOLD",
    niches: ["Beauty", "Skincare", "Lifestyle"], skills: ["UGC", "Reviews", "Reels"],
    platforms: plats(142000, 0, 60000), portfolio: port("#FF5A1F", ["GLASS SKIN", "PM ROUTINE", "DUPE OR NOT"]),
    rates: rc(38000, 60000), ratingAvg: 4.9, ratingCount: 21,
  }),
  creator({
    cr_id: "cr_kabir", handle: "@kabir.makes", name: "Kabir Sen", type: "Illustrator",
    location: "Kolkata, IN", accent: "#9CA3AF", bio: "Madhubani-rooted illustration + packaging art.",
    stats: { followers: 3800, following: 190, reputation: 79, earned: 86000 }, tier: "EMERGING",
    isRosterEligible: false,
    niches: ["Illustration", "Design", "Packaging"], skills: ["Madhubani", "Vector", "Packaging"],
    platforms: plats(3800), portfolio: port("#9CA3AF", ["FOLK SERIES", "TEA LABELS", "MITHILA SET"]),
    openTo: ["COMMISSIONS", "AVAILABLE FOR HIRE"], rates: rc(12000, 0), ratingAvg: 4.6, ratingCount: 4,
  }),
  creator({
    cr_id: "cr_aria", handle: "@aria.sound", name: "Aria Bose", type: "Musician",
    location: "Goa, IN", accent: "#FF6BB5", bio: "Lo-fi + sound design for film and brands.",
    stats: { followers: 22400, following: 210, reputation: 82, earned: 230000 }, tier: "BRONZE",
    niches: ["Music", "Sound Design"], skills: ["Composition", "Mixing"],
    platforms: plats(8000, 0, 60000), portfolio: port("#FF6BB5", ["EP ONE", "FILM CUES"]),
    rates: rc(20000, 35000), ratingAvg: 4.5, ratingCount: 6,
  }),
  creator({
    cr_id: "cr_devika", handle: "@devika.eats", name: "Devika Rao", type: "Food Creator",
    location: "Chennai, IN", accent: "#FF5A1F", bio: "South Indian food + product reviews.",
    stats: { followers: 67000, following: 340, reputation: 86, earned: 510000 }, tier: "SILVER",
    niches: ["Food", "Lifestyle"], skills: ["UGC", "Reels", "Photography"],
    platforms: plats(67000, 24000), portfolio: port("#FF5A1F", ["FILTER COFFEE", "TIFFIN RUN"]),
    rates: rc(30000, 52000), ratingAvg: 4.7, ratingCount: 11,
  }),
  creator({
    cr_id: "cr_ishaan", handle: "@ishaan.lens", name: "Ishaan Verma", type: "Photographer",
    location: "Jaipur, IN", accent: "#2E5BFF", bio: "Product + lifestyle stills. Warm, grainy.",
    stats: { followers: 18900, following: 150, reputation: 80, earned: 175000 }, tier: "BRONZE",
    niches: ["Photo", "Product"], skills: ["Product photography", "Retouch"],
    platforms: plats(18900), portfolio: port("#2E5BFF", ["AMBER", "STILL LIFE", "STUDIO 9"]),
    openTo: ["AVAILABLE FOR HIRE", "COMMISSIONS"], rates: rc(16000, 0), ratingAvg: 4.4, ratingCount: 5,
  }),
  creator({
    cr_id: "cr_tara", handle: "@tara.moves", name: "Tara Iyer", type: "Dancer",
    location: "Mumbai, IN", accent: "#FF6BB5", bio: "Contemporary + brand choreography.",
    stats: { followers: 96000, following: 380, reputation: 85, earned: 620000 }, tier: "GOLD",
    niches: ["Dance", "Performance"], skills: ["Choreography", "Reels"],
    platforms: plats(96000, 0, 210000), portfolio: port("#FF6BB5", ["MONSOON", "STREET SET"]),
    rates: rc(42000, 70000), ratingAvg: 4.8, ratingCount: 14,
  }),
  creator({
    cr_id: "cr_rhea", handle: "@rhea.writes", name: "Rhea Kapoor", type: "Writer",
    location: "Pune, IN", accent: "#9CA3AF", bio: "Brand copy + poetry. Words that don't sound like ads.",
    stats: { followers: 9400, following: 120, reputation: 78, earned: 92000 }, tier: "EMERGING",
    niches: ["Poetry", "Copy"], skills: ["Copywriting", "Scriptwriting"],
    platforms: plats(9400), portfolio: port("#9CA3AF", ["FIELD NOTES", "AD SPEAK"]),
    openTo: ["AVAILABLE FOR HIRE", "BRAND DEALS"], rates: rc(14000, 0), ratingAvg: 4.6, ratingCount: 3,
  }),
  creator({
    cr_id: "cr_zoya", handle: "@zoya.fits", name: "Zoya Khan", type: "Fashion Creator",
    location: "Hyderabad, IN", accent: "#FF6BB5", bio: "Sustainable fashion + styling.",
    stats: { followers: 128000, following: 520, reputation: 89, earned: 870000 }, tier: "GOLD",
    niches: ["Fashion", "Lifestyle"], skills: ["Styling", "UGC", "Reels"],
    platforms: plats(128000, 0, 90000), portfolio: port("#FF6BB5", ["THRIFT EDIT", "SLOW WARDROBE"]),
    rates: rc(40000, 68000), ratingAvg: 4.9, ratingCount: 18,
  }),
  creator({
    cr_id: "cr_arjun", handle: "@arjun.streams", name: "Arjun Nair", type: "Streamer",
    location: "Kochi, IN", accent: "#2E5BFF", bio: "Gaming + tech. Long-form + clips.",
    stats: { followers: 210000, following: 90, reputation: 83, earned: 1100000 }, tier: "PLATINUM",
    niches: ["Streaming", "Tech"], skills: ["Live", "Integrations"],
    platforms: plats(40000, 210000, 0), portfolio: port("#2E5BFF", ["TECH TEARDOWN", "CLUTCH"]),
    rates: rc(55000, 95000), ratingAvg: 4.5, ratingCount: 8,
  }),
  creator({
    cr_id: "cr_meher", handle: "@meher.skin", name: "Meher Singh", type: "Skincare Creator",
    location: "Chandigarh, IN", accent: "#FF5A1F", bio: "Derm-informed skincare for sensitive skin.",
    stats: { followers: 44000, following: 260, reputation: 87, earned: 360000 }, tier: "SILVER",
    niches: ["Beauty", "Skincare"], skills: ["UGC", "Reviews"],
    platforms: plats(44000), portfolio: port("#FF5A1F", ["BARRIER", "SPF DAILY"]),
    rates: rc(26000, 44000), ratingAvg: 4.8, ratingCount: 10,
  }),
];

export const creatorById = (id: string) => creators.find((c) => c.cr_id === id);

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export const jobs: Job[] = [
  {
    job_id: "job_summer_serum", orgId: CURRENT_ORG_ID, postedBy: "m_owner",
    brandDisplay: "Copperleaf", title: "Summer Serum launch — UGC + Reels", type: "UGC Creation",
    niche: "Skincare", description:
      "We're launching our Vitamin C summer serum. Want 5 authentic skincare creators to produce honest UGC + one reel each. Looking for real routines, not scripted ads.",
    budgetMin: 30000, budgetMax: 60000, currency: "INR", paymentStructure: "FLAT",
    requirements: { minFollowers: 20000, niche: "Skincare", location: "IN" },
    deliverables: ["1 reel (≤60s)", "3 UGC stills", "1 story set"], timeline: "14 days",
    usageRights: "Organic + paid amplification, 90 days", exclusivity: "No competing skincare, 30 days",
    applicationDeadline: "2026-06-28", verified: true, status: "LIVE", applicants: 6, createdAt: "2026-06-08",
  },
  {
    job_id: "job_packaging_art", orgId: CURRENT_ORG_ID, postedBy: "m_owner",
    brandDisplay: "Copperleaf", title: "Packaging illustration — Madhubani style", type: "Custom",
    niche: "Illustration", description:
      "Commission a folk/Madhubani-style illustrator for our limited festive box. Need original artwork with full commercial usage rights. Follower count irrelevant — craft is everything.",
    budgetMin: 25000, budgetMax: 50000, currency: "INR", paymentStructure: "FLAT",
    requirements: { niche: "Illustration" },
    deliverables: ["3 illustration concepts", "1 final artwork (print-ready)"], timeline: "21 days",
    usageRights: "Full commercial, perpetual", exclusivity: "Exclusive to packaging",
    applicationDeadline: "2026-07-05", verified: true, status: "LIVE", applicants: 3, createdAt: "2026-06-10",
  },
  {
    job_id: "job_film_brand", orgId: CURRENT_ORG_ID, postedBy: "m_coord",
    brandDisplay: "Copperleaf", title: "Brand film — 60s hero edit", type: "Video Integration",
    niche: "Film", description:
      "A 60-second hero film for our new range. Natural light, slow, editorial. Will run on YouTube + IG.",
    budgetMin: 80000, budgetMax: 140000, currency: "INR", paymentStructure: "FLAT",
    requirements: { minFollowers: 30000, niche: "Film" },
    deliverables: ["1 × 60s hero film", "3 × 15s cutdowns"], timeline: "18 days",
    usageRights: "Organic, 90 days", exclusivity: "None",
    applicationDeadline: "2026-06-30", verified: true, status: "LIVE", applicants: 2, createdAt: "2026-06-09",
  },
  {
    job_id: "job_ambassador", orgId: CURRENT_ORG_ID, postedBy: "m_owner",
    brandDisplay: "Copperleaf", title: "Skincare Brand Ambassador — 3 months", type: "Brand Ambassador",
    niche: "Skincare", description:
      "Monthly retainer for a skincare creator to be the face of Copperleaf for one quarter. 2 reels + 4 stories / month.",
    budgetMin: 120000, budgetMax: 200000, currency: "INR", paymentStructure: "PER_POST",
    requirements: { minFollowers: 50000, niche: "Skincare" },
    deliverables: ["2 reels / month", "4 stories / month"], timeline: "3 months",
    usageRights: "Organic + paid, term of contract", exclusivity: "Exclusive skincare ambassador",
    applicationDeadline: "2026-07-10", verified: true, status: "LIVE", applicants: 4, createdAt: "2026-06-05",
  },
  {
    job_id: "job_getviral", orgId: CURRENT_ORG_ID, postedBy: "m_owner",
    brandDisplay: "Copperleaf", title: "ACID SUMMER — Get Viral wave", type: "Get Viral Campaign",
    niche: "Multi-niche", description:
      "Coordinated launch push across 30–50 verified creators for our summer drop. #ad disclosure mandatory.",
    budgetMin: 150000, budgetMax: 500000, currency: "INR", paymentStructure: "FLAT",
    requirements: { minFollowers: 10000 },
    deliverables: ["1 reel per creator", "coordinated post window"], timeline: "10 days",
    usageRights: "Organic, 30 days", exclusivity: "None",
    applicationDeadline: "2026-07-01", verified: true, status: "DRAFT", applicants: 0, createdAt: "2026-06-12",
  },
  {
    job_id: "job_product_review", orgId: CURRENT_ORG_ID, postedBy: "m_coord",
    brandDisplay: "Copperleaf", title: "Honest product review — barrier cream", type: "Product Review",
    niche: "Skincare", description:
      "Send-and-review: we ship the product, you give a genuine 2-week review. No script.",
    budgetMin: 20000, budgetMax: 40000, currency: "INR", paymentStructure: "FLAT",
    requirements: { minFollowers: 15000, niche: "Skincare" },
    deliverables: ["1 review reel", "1 story set"], timeline: "21 days",
    usageRights: "Organic, 90 days", exclusivity: "None",
    applicationDeadline: "2026-06-25", verified: true, status: "CLOSED", applicants: 9, createdAt: "2026-05-20",
  },
];

export const jobById = (id: string) => jobs.find((j) => j.job_id === id);

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export const applications: Application[] = [
  app("ap1", "job_summer_serum", "cr_nia", 55000, "12 days", "SHORTLISTED", "Loved your honest reviews — looping in our brand lead to talk numbers."),
  app("ap2", "job_summer_serum", "cr_meher", 40000, "14 days", "APPLIED"),
  app("ap3", "job_summer_serum", "cr_ishaan", 0, "14 days", "REJECTED", "Going a different direction this round — thank you!"),
  app("ap4", "job_summer_serum", "cr_zoya", 60000, "10 days", "APPLIED"),
  app("ap5", "job_summer_serum", "cr_devika", 50000, "14 days", "APPLIED"),
  app("ap6", "job_packaging_art", "cr_kabir", 38000, "21 days", "SHORTLISTED", "Your Mithila set is exactly the language we want."),
  app("ap7", "job_packaging_art", "cr_rhea", 0, "20 days", "WITHDRAWN"),
  app("ap8", "job_film_brand", "cr_maya", 120000, "18 days", "SHORTLISTED", "Sending over a counter on usage rights."),
  app("ap9", "job_ambassador", "cr_nia", 180000, "3 months", "APPLIED"),
  app("ap10", "job_ambassador", "cr_meher", 150000, "3 months", "SHORTLISTED", "Shortlisted — let's chat timelines."),
];

function app(
  id: string, jobId: string, creatorId: string, rate: number, timeline: string,
  status: Application["status"], brandResponse?: string,
): Application {
  const c = creators.find((x) => x.cr_id === creatorId);
  return {
    application_id: id, jobId, creatorId, orgId: CURRENT_ORG_ID,
    pitch:
      "I'd love to work on this. My audience skews exactly to your target, and I keep content honest — I only take products I'd actually use. Portfolio + recent rates attached.",
    rate: rate || (c ? c.rates[0]?.base ?? 25000 : 25000), currency: "INR", timeline,
    portfolioSnapshot: c?.portfolio[0]?.title, repScoreSnapshot: c?.stats.reputation ?? 80,
    status, brandResponse,
    respondedBy: brandResponse ? "m_owner" : undefined,
    respondedAt: brandResponse ? "2026-06-13" : undefined, submittedAt: "2026-06-11",
  };
}

export const applicationsForJob = (jobId: string) =>
  applications.filter((a) => a.jobId === jobId);

// ---------------------------------------------------------------------------
// Deals + contracts + deliverables + escrow
// ---------------------------------------------------------------------------

function escrowFor(id: string, dealId: string, gross: number, status: Escrow["status"]): Escrow {
  const { platformFeeAmount, gstAmount, netToCreator } = dealMath(gross);
  return {
    escrow_id: id, dealId, grossAmount: gross, currency: "INR",
    platformFeePct: 12, platformFeeAmount, gstPct: 18, gstAmount, netToCreator,
    status, paymentProvider: "RAZORPAY",
    fundedAt: status !== "PENDING" ? "2026-06-14" : undefined,
    releasedAt: status === "PAID" ? "2026-06-16" : undefined,
  };
}

export const escrows: Escrow[] = [
  escrowFor("esc_d2", "deal_film", 130000, "PROCESSING"),
  escrowFor("esc_d3", "deal_amb", 165000, "PENDING"),
  escrowFor("esc_d4", "deal_review", 32000, "PAID"),
];

export const contracts: Contract[] = [
  {
    contract_id: "ct_film", dealId: "deal_film",
    parties: { brandId: CURRENT_ORG_ID, creatorId: "cr_maya" },
    terms: {
      rate: 130000, currency: "INR", paymentTerms: "50% on signing / 50% on approval",
      deliverables: "1 × 60s hero film, 3 × 15s cutdowns", timeline: "18 days from signing",
      usageRights: "Organic, 90 days", exclusivity: "No competing brand, 30 days",
      contentOwnership: "Creator retains, brand licensed", revisions: "2 included",
    },
    clauses: [
      { title: "01 · Scope", body: "Creator delivers the agreed assets per the brief attached to this deal." },
      { title: "02 · Payment", body: "50% on signing; balance within 7 days of brand approval. Funds held in escrow." },
      { title: "03 · Revisions", body: "2 rounds included; further revisions billed hourly." },
      { title: "04 · Usage & ownership", body: "Creator owns the work; brand gets a 90-day organic license. Paid amplification is a separate fee." },
    ],
    status: "EXECUTED",
    esign: { provider: "DIGIO", documentId: "DIGIO-2026-014", brandSignedAt: "2026-06-14", creatorSignedAt: "2026-06-14", pdfUrl: "#" },
    createdAt: "2026-06-13",
  },
];

export const deliverables: Deliverable[] = [
  {
    deliverable_id: "dl_film_1", dealId: "deal_film", title: "60s hero film — v1",
    fileUrls: ["#"], submittedAt: "2026-06-15", reviewStatus: "IN REVIEW",
    revisionNotes: [], revisionCount: 0,
  },
  {
    deliverable_id: "dl_film_2", dealId: "deal_film", title: "15s cutdowns ×3",
    fileUrls: [], reviewStatus: "SUBMIT", revisionNotes: [], revisionCount: 0,
  },
];

export const deals: Deal[] = [
  {
    deal_id: "deal_nia", jobId: "job_summer_serum", applicationId: "ap1", orgId: CURRENT_ORG_ID,
    creatorId: "cr_nia", title: "Summer Serum — Nia Raval", amount: 55000, currency: "INR",
    status: "NEGOTIATING", progress: 0.35, nextAction: "Counter on rate (₹48k offered)",
    threadId: "th_nia", createdAt: "2026-06-13", updatedAt: "2026-06-14",
  },
  {
    deal_id: "deal_film", jobId: "job_film_brand", applicationId: "ap8", orgId: CURRENT_ORG_ID,
    creatorId: "cr_maya", title: "Brand film — Maya Frames", amount: 130000, currency: "INR",
    status: "IN REVIEW", deliveryPhase: "IN REVIEW", progress: 0.7, nextAction: "Review hero film v1",
    contractId: "ct_film", escrowId: "esc_d2", threadId: "th_maya",
    createdAt: "2026-06-12", updatedAt: "2026-06-15",
  },
  {
    deal_id: "deal_amb", jobId: "job_ambassador", applicationId: "ap10", orgId: CURRENT_ORG_ID,
    creatorId: "cr_meher", title: "Ambassador — Meher Singh", amount: 165000, currency: "INR",
    status: "CONTRACT", progress: 0.5, nextAction: "Counter-sign contract",
    escrowId: "esc_d3", threadId: "th_meher", createdAt: "2026-06-13", updatedAt: "2026-06-14",
  },
  {
    deal_id: "deal_review", jobId: "job_product_review", applicationId: "ap-old", orgId: CURRENT_ORG_ID,
    creatorId: "cr_devika", title: "Barrier cream review — Devika Rao", amount: 32000, currency: "INR",
    status: "COMPLETED", deliveryPhase: "GO LIVE", progress: 1, nextAction: "Rate the creator",
    escrowId: "esc_d4", goLiveUrl: "https://instagram.com/p/xxxx", threadId: "th_devika",
    createdAt: "2026-05-22", updatedAt: "2026-06-16",
  },
  {
    deal_id: "deal_kabir", jobId: "job_packaging_art", applicationId: "ap6", orgId: CURRENT_ORG_ID,
    creatorId: "cr_kabir", title: "Packaging art — Kabir Sen", amount: 38000, currency: "INR",
    status: "SHORTLISTED", progress: 0.2, nextAction: "Move to negotiation",
    threadId: "th_kabir", createdAt: "2026-06-13", updatedAt: "2026-06-13",
  },
];

export const dealById = (id: string) => deals.find((d) => d.deal_id === id);

// ---------------------------------------------------------------------------
// Threads (messaging) + transactions + ratings + campaign
// ---------------------------------------------------------------------------

export const threads: Thread[] = [
  th("th_maya", "DEAL", "cr_maya", "Maya Frames", "love the cut. one small note coming on the audio.", 1, "deal_film", true, [
    { from: "them", body: "Hero film v1 is up in the deal workspace — let me know your notes!", ts: "2h" },
    { from: "me", body: "Watching now. Looks gorgeous.", ts: "1h" },
    { from: "them", body: "love the cut. one small note coming on the audio.", ts: "40m" },
  ]),
  th("th_nia", "DEAL", "cr_nia", "Nia Raval", "₹48k works if usage stays organic-only.", 2, "deal_nia", true, [
    { from: "them", body: "Thanks for shortlisting! My rate for this scope is ₹55k.", ts: "1d" },
    { from: "me", body: "Can we do ₹48k for the launch window?", ts: "1d" },
    { from: "them", body: "₹48k works if usage stays organic-only.", ts: "3h" },
  ]),
  th("th_meher", "DEAL", "cr_meher", "Meher Singh", "Contract is ready when you are.", 0, "deal_amb", true, [
    { from: "me", body: "Sending the ambassador contract over now.", ts: "1d" },
    { from: "them", body: "Contract is ready when you are.", ts: "20h" },
  ]),
  th("th_luma", "REQUEST", "cr_luma", "Luma Agency", "We represent a roster of skincare creators. Hear us out.", 1, undefined, false, [
    { from: "them", body: "Hi Copperleaf — we represent a roster of skincare creators. Hear us out?", ts: "2d" },
  ]),
  th("th_kabir", "DEAL", "cr_kabir", "Kabir Sen", "Excited about the festive box brief.", 0, "deal_kabir", false, [
    { from: "them", body: "Excited about the festive box brief — happy to share concepts.", ts: "1d" },
  ]),
];

function th(
  id: string, kind: Thread["kind"], creatorId: string, name: string, preview: string,
  unread: number, dealId: string | undefined, verified: boolean, messages: Thread["messages"],
): Thread {
  return {
    thread_id: id, kind, orgId: CURRENT_ORG_ID, creatorId, name, preview, unread, dealId,
    verified, messages, updatedAgo: messages[messages.length - 1]?.ts ?? "now",
  };
}

export const transactions: Transaction[] = [
  { txn_id: "tx1", kind: "BRAND DEAL", source: "Barrier cream review — Devika Rao", amount: 32000, currency: "INR", direction: "OUT", status: "CLEARED", date: "2026-06-16", escrowId: "esc_d4" },
  { txn_id: "tx2", kind: "FEE", source: "Platform fee — Devika deal", amount: 3840, currency: "INR", direction: "OUT", status: "CLEARED", date: "2026-06-16" },
  { txn_id: "tx3", kind: "BRAND DEAL", source: "Brand film — Maya Frames (50% on signing)", amount: 65000, currency: "INR", direction: "OUT", status: "PENDING", date: "2026-06-14", escrowId: "esc_d2" },
  { txn_id: "tx4", kind: "GET VIRAL", source: "ACID SUMMER — reserved budget", amount: 300000, currency: "INR", direction: "OUT", status: "SCHEDULED", date: "2026-07-01" },
];

export const ratings: Rating[] = [
  {
    rating_id: "rt1", dealId: "deal_review", fromOrgId: CURRENT_ORG_ID, toCreatorId: "cr_devika",
    scores: { overall: 5, communication: 5, timeliness: 4, contentQuality: 5, professionalism: 5 },
    writtenReview: "Genuinely great to work with. Honest review landed well with our audience.",
    wouldWorkAgain: true, createdAt: "2026-06-16",
  },
];

export const campaigns: Campaign[] = [
  {
    campaign_id: "cmp_acid", orgId: CURRENT_ORG_ID, name: "ACID SUMMER", type: "GET_VIRAL",
    tier: "WAVE", budget: 300000, currency: "INR",
    brief: "Coordinated summer drop push. Honest, disclosed, on-brand. #ad mandatory.",
    requiredDisclosure: "#ad", windowStart: "2026-07-01", windowEnd: "2026-07-11",
    creatorSlots: [
      { creatorId: "cr_nia", status: "INVITED", payout: 22000 },
      { creatorId: "cr_zoya", status: "INVITED", payout: 20000 },
      { creatorId: "cr_meher", status: "ACCEPTED", payout: 18000 },
    ],
    targetReach: 2000000, status: "INVITING",
    analytics: { totalReach: 0, impressions: 0, engagement: 0, clicks: 0, conversions: 0 },
    createdAt: "2026-06-12",
  },
];

// ---------------------------------------------------------------------------
// Agency · Management (Phase 2)
// ---------------------------------------------------------------------------

export const AGENCY_ID = "agency_risehouse";

export const agency: Agency = {
  agency_id: AGENCY_ID,
  type: "MANAGEMENT",
  internal: false,
  name: "Rise House",
  website: "risehouse.in",
  description: "A boutique talent agency repping emerging visual, music and film creators.",
  specialties: ["Visual Art", "Music", "Film"],
  location: "Mumbai, IN",
  commissionRate: 20,
  verificationStatus: "VERIFIED",
  billing: { provider: "RAZORPAY", customerId: "cust_ag1", currency: "INR", plan: "Agency" },
  teamSeats: [
    { member_id: "am_owner", orgId: AGENCY_ID, userId: "u_rohan", name: "Rohan Desai", email: "rohan@risehouse.in", role: "OWNER", permissions: fullPerms, status: "ACTIVE", invitedAt: "2026-01-02" },
    { member_id: "am_coord", orgId: AGENCY_ID, userId: "u_dev2", name: "Dev Menon", email: "dev@risehouse.in", role: "ASSISTANT", permissions: coordinatorPerms, status: "ACTIVE", invitedAt: "2026-03-01" },
  ],
  createdAt: "2026-01-02",
  updatedAt: "2026-06-10",
};

// Agency · Marketing (Phase 3) — a buy-side agency running campaigns for many brand clients.
export const clients: Client[] = [
  { client_id: "cl_lumen", agencyId: AGENCY_ID, brandName: "Lumen Skincare", industry: "D2C Skincare", contact: "priya@lumen.in", billingRef: "INV-LUM", activeJobs: 2, activeCampaigns: 1, spend: 520000, reach: 2400000 },
  { client_id: "cl_cityline", agencyId: AGENCY_ID, brandName: "Cityline Beverages", industry: "F&B", contact: "ops@cityline.in", billingRef: "INV-CTY", activeJobs: 1, activeCampaigns: 2, spend: 880000, reach: 5100000 },
  { client_id: "cl_slowpress", agencyId: AGENCY_ID, brandName: "Slow Press", industry: "Coffee", contact: "hi@slowpress.in", billingRef: "INV-SLW", activeJobs: 3, activeCampaigns: 0, spend: 210000, reach: 760000 },
];

export const talentPools: TalentPool[] = [
  { pool_id: "pool_skin", name: "Verified skincare", note: "Vetted derm-aware skincare creators", creatorIds: ["cr_nia", "cr_meher"] },
  { pool_id: "pool_visual", name: "Visual & film", note: "Editorial visual + film talent", creatorIds: ["cr_sola", "cr_maya", "cr_ishaan"] },
];

export const representations: Representation[] = [
  { rep_id: "rep_sola", agencyId: AGENCY_ID, creatorId: "cr_sola", status: "ACTIVE", commissionRate: 20, agreementUrl: "#", startedAt: "2026-02-10" },
  { rep_id: "rep_aria", agencyId: AGENCY_ID, creatorId: "cr_aria", status: "ACTIVE", commissionRate: 18, agreementUrl: "#", startedAt: "2026-03-15" },
  { rep_id: "rep_maya", agencyId: AGENCY_ID, creatorId: "cr_maya", status: "ACTIVE", commissionRate: 22, agreementUrl: "#", startedAt: "2026-04-01" },
  { rep_id: "rep_kabir", agencyId: AGENCY_ID, creatorId: "cr_kabir", status: "REQUESTED", commissionRate: 20 },
];

export const invoices: Invoice[] = [
  {
    invoice_id: "UD-2026-014", dealId: "deal_review", fromOrgId: CURRENT_ORG_ID, toCreatorId: "cr_devika",
    lineItems: [{ label: "Barrier cream review — Devika Rao", amount: 32000 }],
    subtotal: 32000, gstPct: 18, gstAmount: 5760, total: 37760, currency: "INR",
    gstin: "29ABCDE1234F1Z5", pan: "ABCDE1234F", status: "PAID", issuedAt: "2026-06-16", pdfUrl: "#",
  },
];

// ---------------------------------------------------------------------------
// Home feed — trending, niches, challenges (engaging, not a boring portal)
// ---------------------------------------------------------------------------

const pic = (seed: string, w = 600, h = 400) =>
  `https://picsum.photos/seed/${seed.replace(/[^a-zA-Z0-9]/g, "")}/${w}/${h}`;

export interface NicheTile {
  key: string;
  name: string;
  blurb: string;
  cover: string;
  creators: number;
  trend: string; // e.g. "+18%"
}

export const nicheTiles: NicheTile[] = [
  { key: "skincare", name: "Skincare & Beauty", blurb: "Honest routines + ingredient deep-dives are spiking.", cover: pic("nicheSkincare"), creators: 1240, trend: "+18%" },
  { key: "fashion", name: "Fashion", blurb: "Thrift edits and slow-wardrobe styling lead this week.", cover: pic("nicheFashion"), creators: 980, trend: "+12%" },
  { key: "food", name: "Food & Beverage", blurb: "Regional food creators driving the highest save rates.", cover: pic("nicheFood"), creators: 760, trend: "+9%" },
  { key: "tech", name: "Tech & Gaming", blurb: "Long-form teardowns + clutch clips converting well.", cover: pic("nicheTech"), creators: 540, trend: "+22%" },
  { key: "film", name: "Film & Photo", blurb: "Editorial, natural-light brand films in demand.", cover: pic("nicheFilm"), creators: 430, trend: "+7%" },
  { key: "fitness", name: "Fitness & Wellness", blurb: "Morning-routine and recovery content trending up.", cover: pic("nicheFitness"), creators: 610, trend: "+15%" },
];

export interface TrendingPost {
  id: string;
  author: string;
  avatar: string;
  niche: string;
  caption: string;
  cover: string;
  likes: number;
  comments: number;
  ago: string;
}

export const trendingPosts: TrendingPost[] = [
  { id: "tp1", author: "Nia Raval", avatar: "https://i.pravatar.cc/120?img=45", niche: "Skincare", caption: "Cloud is a community-led skincare drop built around honest reviews and education.", cover: pic("postCloud", 900, 600), likes: 2280, comments: 660, ago: "2d" },
  { id: "tp2", author: "Zoya Khan", avatar: "https://i.pravatar.cc/120?img=32", niche: "Fashion", caption: "The slow-wardrobe edit — 6 pieces, 20 looks. Here's how brands can plug in.", cover: pic("postWardrobe", 900, 600), likes: 1740, comments: 410, ago: "3d" },
  { id: "tp3", author: "Arjun Nair", avatar: "https://i.pravatar.cc/120?img=12", niche: "Tech", caption: "Teardown season: what actually makes a sponsored integration land in gaming.", cover: pic("postTeardown", 900, 600), likes: 3120, comments: 890, ago: "5d" },
];

export interface Challenge {
  id: string;
  tag: string;
  title: string;
  prize: string;
  daysLeft: number;
  cover: string;
}

export const challenges: Challenge[] = [
  { id: "ch1", tag: "summerdrop", title: "Summer Drop Challenge", prize: "₹5L", daysLeft: 6, cover: pic("chSummer") },
  { id: "ch2", tag: "honestreview", title: "Honest Review Sprint", prize: "₹2L", daysLeft: 12, cover: pic("chReview") },
  { id: "ch3", tag: "brandfilm", title: "60s Brand Film Challenge", prize: "₹3L", daysLeft: 9, cover: pic("chFilm") },
];
