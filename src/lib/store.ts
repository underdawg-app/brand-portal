"use client";

import { create } from "zustand";
import {
  brand as seedBrand,
  members as seedMembers,
  creators as seedCreators,
  jobs as seedJobs,
  applications as seedApplications,
  deals as seedDeals,
  contracts as seedContracts,
  deliverables as seedDeliverables,
  escrows as seedEscrows,
  threads as seedThreads,
  transactions as seedTransactions,
  ratings as seedRatings,
  campaigns as seedCampaigns,
  invoices as seedInvoices,
  agency as seedAgency,
  representations as seedReps,
  clients as seedClients,
  talentPools as seedPools,
  CURRENT_ORG_ID,
} from "@/data/seed";
import type {
  Application,
  ApplicationStatus,
  Brand,
  Contract,
  Deal,
  Deliverable,
  Escrow,
  Job,
  Rating,
  Thread,
  Transaction,
  OrgMember,
  DeliveryPhase,
  Campaign,
  CampaignTier,
  CampaignStatus,
  Agency,
  Representation,
  Client,
  TalentPool,
  PlanCard,
  PlanColumn,
  DraftingGig,
} from "@/lib/types";
import { draftJobFromPrompt } from "@/lib/draftJob";
import { generatePlanCards } from "@/lib/draftPlan";
import { dealMath } from "@/lib/format";
import { nextDealStatus } from "@/lib/status";

let seq = 1000;
const uid = (p: string) => `${p}_${++seq}`;

type Theme = "dark" | "light";

interface PortalState {
  // session
  orgId: string;
  currentMemberId: string;
  theme: Theme;
  setTheme: (t: Theme) => void;
  setCurrentMember: (id: string) => void;
  currentMember: () => OrgMember | undefined;

  // shell
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;

  // account type / workspace (Brand vs Agency·Management vs Agency·Marketing)
  accountType: "brand" | "agency";
  agencyMode: "MANAGEMENT" | "MARKETING";
  setWorkspace: (t: "brand" | "agency", mode?: "MANAGEMENT" | "MARKETING") => void;
  profile: { firstName: string; companyName: string; email: string; website: string; teamSize: string; contactPhone: string; contactOptOut: boolean; phoneAsked: boolean };
  setProfile: (p: Partial<{ firstName: string; companyName: string; email: string; website: string; teamSize: string; contactPhone: string; contactOptOut: boolean; phoneAsked: boolean }>) => void;
  agency: Agency;
  representations: Representation[];
  sendRepRequest: (creatorId: string) => void;
  setRepStatus: (repId: string, status: Representation["status"]) => void;

  // agency · marketing (Phase 3)
  clients: Client[];
  activeClientId: string | null;
  setActiveClient: (id: string | null) => void;
  addClient: (brandName: string, industry: string) => void;
  talentPools: TalentPool[];
  createPool: (name: string) => string;
  deletePool: (id: string) => void;
  toggleInPool: (poolId: string, creatorId: string) => void;

  // data
  brand: Brand;
  members: OrgMember[];
  creators: typeof seedCreators;
  jobs: Job[];
  applications: Application[];
  deals: Deal[];
  contracts: Contract[];
  deliverables: Deliverable[];
  escrows: Escrow[];
  threads: Thread[];
  transactions: Transaction[];
  ratings: Rating[];
  campaigns: typeof seedCampaigns;
  invoices: typeof seedInvoices;

  // mutations — jobs / applications
  addJob: (j: Omit<Job, "job_id" | "createdAt" | "applicants" | "orgId">) => string;
  publishJob: (id: string) => void;
  closeJob: (id: string) => void;
  setApplicationStatus: (id: string, status: ApplicationStatus, response?: string) => void;
  acceptApplication: (id: string) => string; // -> dealId

  // deals
  advanceDeal: (id: string) => void;
  setDealStatus: (id: string, status: Deal["status"]) => void;

  // contract
  generateContract: (dealId: string) => string;
  sendContract: (contractId: string) => void;
  signContractAsBrand: (contractId: string) => void;

  // deliverables
  approveDeliverable: (id: string) => void;
  requestRevision: (id: string, note: string) => void;
  confirmGoLive: (id: string, url: string) => void;

  // escrow
  fundEscrow: (dealId: string) => void;
  releaseEscrow: (escrowId: string) => void;

  // messaging
  sendMessage: (threadId: string, body: string) => void;

  // ratings
  addRating: (r: Omit<Rating, "rating_id" | "createdAt" | "fromOrgId">) => void;

  // verification (Module A3 / §3.4 gate)
  submitVerification: () => void;
  approveVerification: () => void;

  // saved lists / shortlists (C3)
  savedLists: { id: string; name: string; creatorIds: string[] }[];
  createList: (name: string) => string;
  deleteList: (id: string) => void;
  toggleInList: (listId: string, creatorId: string) => void;

  // invite a creator to a job (flow 6.2)
  inviteToJob: (jobId: string, creatorId: string) => void;

  // off-path deal states (F0 / §10)
  cancelDeal: (id: string) => void;
  disputeDeal: (id: string) => void;

  // toasts (§5)
  toasts: { id: number; message: string; tone: "default" | "success" | "warn" }[];
  toast: (message: string, tone?: "default" | "success" | "warn") => void;
  dismissToast: (id: number) => void;

  // campaigns / Get Viral (Module J)
  createCampaign: (c: { name: string; tier: CampaignTier; budget: number; brief: string; windowStart: string; windowEnd: string; targetReach: number; creatorIds: string[] }) => string;
  advanceCampaign: (id: string) => void;
  setCampaignStatus: (id: string, status: CampaignStatus) => void;
  toggleCampaignSlot: (campaignId: string, creatorId: string, payout: number) => void;
  setSlotStatus: (campaignId: string, creatorId: string, status: string) => void;

  // plans / kanban (drag-and-drop board)
  planCards: PlanCard[];
  addPlanCard: (column: PlanColumn, title: string, body?: string, tag?: string, ai?: boolean) => string;
  updatePlanCard: (id: string, patch: Partial<Pick<PlanCard, "title" | "body" | "tag">>) => void;
  movePlanCard: (id: string, column: PlanColumn) => void;
  deletePlanCard: (id: string) => void;
  generatePlan: (brief: string) => void;

  // drafting gigs (AI job posting — concurrent, splash while drafting)
  draftingGigs: DraftingGig[];
  startDraftingGig: (brief: string) => string;
  completeDraftingGig: (gigId: string) => void;
  dismissDraftingGig: (gigId: string) => void;
}

export const useStore = create<PortalState>((set, get) => ({
  orgId: CURRENT_ORG_ID,
  currentMemberId: "m_owner",
  theme: "light",
  setTheme: (t) => set({ theme: t }),
  setCurrentMember: (id) => set({ currentMemberId: id }),
  currentMember: () => get().members.find((m) => m.member_id === get().currentMemberId),

  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  accountType: "brand",
  agencyMode: "MANAGEMENT",
  setWorkspace: (t, mode) => set({ accountType: t, ...(mode ? { agencyMode: mode } : {}) }),
  profile: { firstName: "", companyName: "", email: "", website: "", teamSize: "", contactPhone: "", contactOptOut: false, phoneAsked: false },
  setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
  agency: seedAgency,
  representations: seedReps,

  clients: seedClients,
  activeClientId: null,
  setActiveClient: (id) => set({ activeClientId: id }),
  addClient: (brandName, industry) =>
    set((s) => ({
      clients: [
        { client_id: uid("cl"), agencyId: s.agency.agency_id, brandName, industry, activeJobs: 0, activeCampaigns: 0, spend: 0, reach: 0 },
        ...s.clients,
      ],
    })),
  talentPools: seedPools,
  createPool: (name) => {
    const id = uid("pool");
    set((s) => ({ talentPools: [{ pool_id: id, name, creatorIds: [] }, ...s.talentPools] }));
    return id;
  },
  deletePool: (id) => set((s) => ({ talentPools: s.talentPools.filter((p) => p.pool_id !== id) })),
  toggleInPool: (poolId, creatorId) =>
    set((s) => ({
      talentPools: s.talentPools.map((p) =>
        p.pool_id === poolId
          ? { ...p, creatorIds: p.creatorIds.includes(creatorId) ? p.creatorIds.filter((x) => x !== creatorId) : [...p.creatorIds, creatorId] }
          : p,
      ),
    })),
  sendRepRequest: (creatorId) =>
    set((s) => {
      if (s.representations.some((r) => r.creatorId === creatorId && r.status !== "ENDED")) return s;
      return {
        representations: [
          { rep_id: uid("rep"), agencyId: s.agency.agency_id, creatorId, status: "REQUESTED", commissionRate: s.agency.commissionRate ?? 20 },
          ...s.representations,
        ],
      };
    }),
  setRepStatus: (repId, status) =>
    set((s) => ({
      representations: s.representations.map((r) =>
        r.rep_id === repId
          ? {
              ...r, status,
              startedAt: status === "ACTIVE" && !r.startedAt ? new Date().toISOString().slice(0, 10) : r.startedAt,
              endedAt: status === "ENDED" ? new Date().toISOString().slice(0, 10) : r.endedAt,
            }
          : r,
      ),
    })),

  brand: seedBrand,
  members: seedMembers,
  creators: seedCreators,
  jobs: seedJobs,
  applications: seedApplications,
  deals: seedDeals,
  contracts: seedContracts,
  deliverables: seedDeliverables,
  escrows: seedEscrows,
  threads: seedThreads,
  transactions: seedTransactions,
  ratings: seedRatings,
  campaigns: seedCampaigns,
  invoices: seedInvoices,

  addJob: (j) => {
    const id = uid("job");
    const job: Job = {
      ...j, job_id: id, orgId: get().orgId, applicants: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((s) => ({ jobs: [job, ...s.jobs] }));
    return id;
  },
  publishJob: (id) =>
    set((s) => ({ jobs: s.jobs.map((j) => (j.job_id === id ? { ...j, status: "LIVE" } : j)) })),
  closeJob: (id) =>
    set((s) => ({ jobs: s.jobs.map((j) => (j.job_id === id ? { ...j, status: "CLOSED" } : j)) })),

  setApplicationStatus: (id, status, response) =>
    set((s) => ({
      applications: s.applications.map((a) =>
        a.application_id === id
          ? {
              ...a, status, brandResponse: response ?? a.brandResponse,
              respondedBy: get().currentMemberId,
              respondedAt: new Date().toISOString().slice(0, 10),
            }
          : a,
      ),
    })),

  acceptApplication: (id) => {
    const a = get().applications.find((x) => x.application_id === id);
    if (!a) return "";
    const existing = get().deals.find((d) => d.applicationId === id);
    if (existing) return existing.deal_id;
    const dealId = uid("deal");
    const c = get().creators.find((x) => x.cr_id === a.creatorId);
    const deal: Deal = {
      deal_id: dealId, jobId: a.jobId, applicationId: id, orgId: get().orgId,
      creatorId: a.creatorId, title: `${a.jobId} — ${c?.name ?? a.creatorId}`,
      amount: a.rate, currency: a.currency, status: "NEGOTIATING", progress: 0.3,
      nextAction: "Agree terms in negotiation", threadId: undefined,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    set((s) => ({
      deals: [deal, ...s.deals],
      applications: s.applications.map((x) =>
        x.application_id === id ? { ...x, status: "SHORTLISTED" } : x,
      ),
    }));
    return dealId;
  },

  advanceDeal: (id) =>
    set((s) => ({
      deals: s.deals.map((d) =>
        d.deal_id === id
          ? { ...d, status: nextDealStatus(d.status), progress: Math.min(1, d.progress + 0.15) }
          : d,
      ),
    })),
  setDealStatus: (id, status) =>
    set((s) => ({ deals: s.deals.map((d) => (d.deal_id === id ? { ...d, status } : d)) })),

  generateContract: (dealId) => {
    const d = get().deals.find((x) => x.deal_id === dealId);
    if (!d) return "";
    const existing = get().contracts.find((c) => c.dealId === dealId);
    if (existing) return existing.contract_id;
    const id = uid("ct");
    const ct: Contract = {
      contract_id: id, dealId, parties: { brandId: get().orgId, creatorId: d.creatorId },
      terms: {
        rate: d.amount, currency: d.currency, paymentTerms: "50% on signing / 50% on approval",
        deliverables: "Per the agreed brief", timeline: "14 days from signing",
        usageRights: "Organic, 90 days", exclusivity: "No competing brand, 30 days",
        contentOwnership: "Creator retains, brand licensed", revisions: "2 included",
      },
      clauses: [
        { title: "01 · Scope", body: "Creator delivers the agreed assets per the brief attached to this deal." },
        { title: "02 · Payment", body: "50% on signing; balance within 7 days of brand approval. Funds held in escrow." },
        { title: "03 · Revisions", body: "2 rounds included; further revisions billed hourly." },
        { title: "04 · Usage & ownership", body: "Creator owns the work; brand gets a 90-day organic license." },
      ],
      status: "DRAFT", esign: { provider: "DIGIO" },
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((s) => ({
      contracts: [ct, ...s.contracts],
      deals: s.deals.map((x) => (x.deal_id === dealId ? { ...x, status: "CONTRACT", contractId: id } : x)),
    }));
    return id;
  },
  sendContract: (contractId) =>
    set((s) => ({
      contracts: s.contracts.map((c) => (c.contract_id === contractId ? { ...c, status: "SENT" } : c)),
    })),
  signContractAsBrand: (contractId) =>
    set((s) => {
      const ct = s.contracts.find((c) => c.contract_id === contractId);
      if (!ct) return s;
      const executed = !!ct.esign.creatorSignedAt; // both signed -> EXECUTED
      const today = new Date().toISOString().slice(0, 10);
      const contracts = s.contracts.map((c) =>
        c.contract_id === contractId
          ? {
              ...c,
              status: executed ? "EXECUTED" : "SIGNED_BRAND",
              esign: { ...c.esign, brandSignedAt: today, documentId: c.esign.documentId ?? uid("DIGIO") },
            }
          : c,
      ) as Contract[];
      // executing a contract activates the deal + funds escrow
      let deals = s.deals;
      let escrows = s.escrows;
      if (executed) {
        deals = s.deals.map((d) =>
          d.contractId === contractId ? { ...d, status: "ACTIVE", progress: Math.max(d.progress, 0.6) } : d,
        );
        const deal = deals.find((d) => d.contractId === contractId);
        if (deal && !deal.escrowId) {
          const { platformFeeAmount, gstAmount, netToCreator } = dealMath(deal.amount);
          const escId = uid("esc");
          escrows = [
            { escrow_id: escId, dealId: deal.deal_id, grossAmount: deal.amount, currency: deal.currency,
              platformFeePct: 12, platformFeeAmount, gstPct: 18, gstAmount, netToCreator,
              status: "PROCESSING", paymentProvider: "RAZORPAY", fundedAt: today },
            ...s.escrows,
          ];
          deals = deals.map((d) => (d.deal_id === deal.deal_id ? { ...d, escrowId: escId } : d));
        }
      }
      return { contracts, deals, escrows };
    }),

  approveDeliverable: (id) =>
    set((s) => ({
      deliverables: s.deliverables.map((d) =>
        d.deliverable_id === id
          ? { ...d, reviewStatus: "APPROVED" as DeliveryPhase, approvedBy: get().currentMemberId, approvedAt: new Date().toISOString().slice(0, 10) }
          : d,
      ),
    })),
  requestRevision: (id, note) =>
    set((s) => ({
      deliverables: s.deliverables.map((d) =>
        d.deliverable_id === id
          ? { ...d, reviewStatus: "REVISION" as DeliveryPhase, revisionNotes: [...d.revisionNotes, note], revisionCount: d.revisionCount + 1 }
          : d,
      ),
    })),
  confirmGoLive: (id, url) =>
    set((s) => ({
      deliverables: s.deliverables.map((d) =>
        d.deliverable_id === id ? { ...d, reviewStatus: "GO LIVE" as DeliveryPhase, goLiveUrl: url } : d,
      ),
    })),

  fundEscrow: (dealId) =>
    set((s) => ({
      escrows: s.escrows.map((e) =>
        e.dealId === dealId ? { ...e, status: "PROCESSING", fundedAt: new Date().toISOString().slice(0, 10) } : e,
      ),
    })),
  releaseEscrow: (escrowId) =>
    set((s) => ({
      escrows: s.escrows.map((e) =>
        e.escrow_id === escrowId ? { ...e, status: "PAID", releasedAt: new Date().toISOString().slice(0, 10) } : e,
      ),
    })),

  sendMessage: (threadId, body) =>
    set((s) => ({
      threads: s.threads.map((t) =>
        t.thread_id === threadId
          ? { ...t, preview: body, updatedAgo: "now", messages: [...t.messages, { from: "me", body, ts: "now" }] }
          : t,
      ),
    })),

  addRating: (r) =>
    set((s) => ({
      ratings: [
        { ...r, rating_id: uid("rt"), fromOrgId: get().orgId, createdAt: new Date().toISOString().slice(0, 10) },
        ...s.ratings,
      ],
    })),

  // ---- verification ------------------------------------------------------
  submitVerification: () =>
    set((s) => ({ brand: { ...s.brand, verificationStatus: "PENDING" } })),
  approveVerification: () =>
    set((s) => ({
      brand: {
        ...s.brand,
        verificationStatus: "VERIFIED",
        kyc: { ...s.brand.kyc, verifiedAt: new Date().toISOString().slice(0, 10) },
      },
    })),

  // ---- saved lists -------------------------------------------------------
  savedLists: [{ id: "list_launch", name: "Summer launch shortlist", creatorIds: ["cr_nia", "cr_meher"] }],
  createList: (name) => {
    const id = uid("list");
    set((s) => ({ savedLists: [{ id, name, creatorIds: [] }, ...s.savedLists] }));
    return id;
  },
  deleteList: (id) => set((s) => ({ savedLists: s.savedLists.filter((l) => l.id !== id) })),
  toggleInList: (listId, creatorId) =>
    set((s) => ({
      savedLists: s.savedLists.map((l) =>
        l.id === listId
          ? {
              ...l,
              creatorIds: l.creatorIds.includes(creatorId)
                ? l.creatorIds.filter((x) => x !== creatorId)
                : [...l.creatorIds, creatorId],
            }
          : l,
      ),
    })),

  // ---- invite to job -----------------------------------------------------
  inviteToJob: (jobId, creatorId) => {
    const c = get().creators.find((x) => x.cr_id === creatorId);
    set((s) => ({
      applications: [
        {
          application_id: uid("ap"), jobId, creatorId, orgId: get().orgId,
          pitch: "Invited by the brand — awaiting the creator's response.",
          rate: c?.rates[0]?.base ?? 25000, currency: "INR", timeline: "TBD",
          repScoreSnapshot: c?.stats.reputation ?? 80, status: "APPLIED",
          brandResponse: "You invited this creator.", submittedAt: new Date().toISOString().slice(0, 10),
        },
        ...s.applications,
      ],
      jobs: s.jobs.map((j) => (j.job_id === jobId ? { ...j, applicants: j.applicants + 1 } : j)),
    }));
  },

  // ---- off-path deal states ---------------------------------------------
  cancelDeal: (id) =>
    set((s) => ({ deals: s.deals.map((d) => (d.deal_id === id ? { ...d, status: "CANCELLED", nextAction: "Deal cancelled" } : d)) })),
  disputeDeal: (id) =>
    set((s) => ({ deals: s.deals.map((d) => (d.deal_id === id ? { ...d, status: "DISPUTED", nextAction: "Under dispute review" } : d)) })),

  // ---- toasts ------------------------------------------------------------
  toasts: [],
  toast: (message, tone = "default") => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    return id;
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // ---- campaigns / Get Viral --------------------------------------------
  createCampaign: (c) => {
    const id = uid("cmp");
    const perSlot = c.creatorIds.length ? Math.round(c.budget / c.creatorIds.length) : 0;
    const campaign: Campaign = {
      campaign_id: id, orgId: get().orgId, name: c.name, type: "GET_VIRAL",
      tier: c.tier, budget: c.budget, currency: "INR", brief: c.brief,
      requiredDisclosure: "#ad", windowStart: c.windowStart, windowEnd: c.windowEnd,
      creatorSlots: c.creatorIds.map((cid) => ({ creatorId: cid, status: "INVITED", payout: perSlot })),
      targetReach: c.targetReach, status: "DRAFT",
      analytics: { totalReach: 0, impressions: 0, engagement: 0, clicks: 0, conversions: 0 },
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((s) => ({ campaigns: [campaign, ...s.campaigns] }));
    return id;
  },
  advanceCampaign: (id) => {
    const order: CampaignStatus[] = ["DRAFT", "INVITING", "ACTIVE", "LIVE", "COMPLETED"];
    set((s) => ({
      campaigns: s.campaigns.map((c) => {
        if (c.campaign_id !== id) return c;
        const i = order.indexOf(c.status);
        const next = order[Math.min(i + 1, order.length - 1)];
        // populate analytics once the campaign goes live
        const live = next === "LIVE" || next === "COMPLETED";
        const reach = live ? c.targetReach : c.analytics.totalReach;
        return {
          ...c, status: next,
          analytics: live
            ? {
                totalReach: reach,
                impressions: Math.round(reach * 1.8),
                engagement: Math.round(reach * 0.06),
                clicks: Math.round(reach * 0.02),
                conversions: Math.round(reach * 0.004),
              }
            : c.analytics,
        };
      }),
    }));
  },
  setCampaignStatus: (id, status) =>
    set((s) => ({ campaigns: s.campaigns.map((c) => (c.campaign_id === id ? { ...c, status } : c)) })),
  toggleCampaignSlot: (campaignId, creatorId, payout) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) =>
        c.campaign_id === campaignId
          ? {
              ...c,
              creatorSlots: c.creatorSlots.some((sl) => sl.creatorId === creatorId)
                ? c.creatorSlots.filter((sl) => sl.creatorId !== creatorId)
                : [...c.creatorSlots, { creatorId, status: "INVITED", payout }],
            }
          : c,
      ),
    })),
  setSlotStatus: (campaignId, creatorId, status) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) =>
        c.campaign_id === campaignId
          ? { ...c, creatorSlots: c.creatorSlots.map((sl) => (sl.creatorId === creatorId ? { ...sl, status } : sl)) }
          : c,
      ),
    })),

  // ---- plans / kanban ----------------------------------------------------
  planCards: [
    { card_id: "pc_1", column: "backlog", title: "Summer serum launch push", body: "5 skincare creators, honest UGC + 1 reel each.", tag: "Skincare" },
    { card_id: "pc_2", column: "backlog", title: "Festive box illustration", body: "Commission a Madhubani artist for packaging.", tag: "Design" },
    { card_id: "pc_3", column: "progress", title: "Ambassador shortlist", body: "Lock 3 candidates for the 3-month retainer.", tag: "Beauty" },
    { card_id: "pc_4", column: "review", title: "Brand film — hero edit", body: "Review Maya's v1 cut, send audio notes.", tag: "Film" },
    { card_id: "pc_5", column: "done", title: "Barrier cream review", body: "Devika's review went live — rated 5★.", tag: "Skincare" },
  ],
  addPlanCard: (column, title, body, tag, ai) => {
    const id = uid("pc");
    set((s) => ({ planCards: [{ card_id: id, column, title, body, tag, ai }, ...s.planCards] }));
    return id;
  },
  updatePlanCard: (id, patch) =>
    set((s) => ({ planCards: s.planCards.map((c) => (c.card_id === id ? { ...c, ...patch } : c)) })),
  movePlanCard: (id, column) =>
    set((s) => ({ planCards: s.planCards.map((c) => (c.card_id === id ? { ...c, column } : c)) })),
  deletePlanCard: (id) => set((s) => ({ planCards: s.planCards.filter((c) => c.card_id !== id) })),
  generatePlan: (brief) => {
    const cards = generatePlanCards(brief).map((c) => ({ ...c, card_id: uid("pc"), ai: true }));
    set((s) => ({ planCards: [...cards, ...s.planCards] }));
  },

  // ---- drafting gigs -----------------------------------------------------
  draftingGigs: [],
  startDraftingGig: (brief) => {
    const id = uid("gig");
    set((s) => ({ draftingGigs: [{ gig_id: id, brief, status: "drafting" }, ...s.draftingGigs] }));
    return id;
  },
  completeDraftingGig: (gigId) => {
    const g = get().draftingGigs.find((x) => x.gig_id === gigId);
    if (!g) return;
    const d = draftJobFromPrompt(g.brief);
    const jobId = get().addJob({
      title: d.title, type: d.type, niche: d.niche, description: d.description,
      budgetMin: d.budgetMin, budgetMax: d.budgetMax, currency: "INR",
      paymentStructure: "FLAT", requirements: { minFollowers: 10000, niche: d.niche, location: "India" },
      deliverables: d.deliverables, timeline: d.timeline, usageRights: "Organic, 90 days",
      exclusivity: "No competing brand, 30 days", applicationDeadline: "2026-07-31",
      verified: true, status: "DRAFT", postedBy: "m_owner",
      brandDisplay: get().profile.companyName || "Your brand",
    });
    get().publishJob(jobId);
    set((s) => ({
      draftingGigs: s.draftingGigs.map((x) =>
        x.gig_id === gigId
          ? { ...x, status: "ready", jobId, title: d.title, niche: d.niche, budgetMin: d.budgetMin, budgetMax: d.budgetMax }
          : x,
      ),
    }));
  },
  dismissDraftingGig: (gigId) =>
    set((s) => ({ draftingGigs: s.draftingGigs.filter((x) => x.gig_id !== gigId) })),
}));
