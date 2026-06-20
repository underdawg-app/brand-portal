/**
 * Underdawg Brand & Agency Portal — shared type system.
 *
 * These are the CONTRACT between the portal and the existing creator app.
 * Status enums are copied VERBATIM from the spec (§4.3 / Appendix B) — including
 * the space-containing values ("BRAND DEAL", "IN REVIEW", "GO LIVE"). Do not
 * rename them; if the two halves drift here, they stop syncing.
 */

// ---------------------------------------------------------------------------
// Canonical enums
// ---------------------------------------------------------------------------

export type Currency = "INR" | "USD";

export type DealStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "NEGOTIATING"
  | "CONTRACT"
  | "ACTIVE"
  | "IN REVIEW"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export type DeliveryPhase =
  | "SUBMIT"
  | "IN REVIEW"
  | "REVISION"
  | "APPROVED"
  | "GO LIVE";

export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "REJECTED"
  | "WITHDRAWN";

export type EscrowStatus = "PENDING" | "PROCESSING" | "PAID";

export type JobStatus = "DRAFT" | "LIVE" | "CLOSED" | "FILLED";

export type JobType =
  | "Sponsored Post"
  | "Story/Reel"
  | "Video Integration"
  | "Brand Ambassador"
  | "Product Review"
  | "Event Coverage"
  | "UGC Creation"
  | "Affiliate"
  | "Account Takeover"
  | "Get Viral Campaign"
  | "Custom";

export type PaymentStructure = "FLAT" | "PER_POST" | "AFFILIATE";

export type ContractStatus =
  | "DRAFT"
  | "SENT"
  | "COUNTERED"
  | "SIGNED_CREATOR"
  | "SIGNED_BRAND"
  | "EXECUTED"
  | "VOID";

export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "VOID";

export type CampaignTier = "SPARK" | "WAVE" | "STORM" | "TAKEOVER";

export type CampaignStatus =
  | "DRAFT"
  | "INVITING"
  | "ACTIVE"
  | "LIVE"
  | "COMPLETED";

export type ThreadKind = "PRIMARY" | "REQUEST" | "COLLAB" | "DEAL";

export type TransactionKind =
  | "BRAND DEAL"
  | "MERCH"
  | "ART SALE"
  | "TIP"
  | "PAYOUT"
  | "FEE"
  | "GET VIRAL"
  | "COMMISSION";

export type TransactionStatus = "CLEARED" | "PENDING" | "SCHEDULED";
export type TransactionDirection = "IN" | "OUT";

export type VerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export type CreatorTier =
  | "EMERGING"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM";

export type OpenTo =
  | "BRAND DEALS"
  | "COLLABORATIONS"
  | "AVAILABLE FOR HIRE"
  | "COMMISSIONS"
  | "MANAGEMENT"
  | "NOT AVAILABLE";

export type Visibility = "PUBLIC" | "VERIFIED_BRANDS_ONLY" | "PRIVATE";

export type MemberRole = "OWNER" | "MANAGER" | "ASSISTANT" | "EDITOR";

export type AgencyType = "MANAGEMENT" | "MARKETING";

export type PaymentProvider = "RAZORPAY" | "STRIPE";

/** Kanban buckets (reuse the app's grouping verbatim). */
export type PipelineBucket = "PROPOSED" | "ACTIVE" | "CLOSED";

// ---------------------------------------------------------------------------
// Money
// ---------------------------------------------------------------------------

export interface Money {
  amount: number;
  currency: Currency;
}

// ---------------------------------------------------------------------------
// Org + members + permissions
// ---------------------------------------------------------------------------

export interface Permissions {
  viewAnalytics: boolean;
  replyToMessages: boolean;
  acceptOrSignDeals: boolean;
  postJobsOrCampaigns: boolean;
  editCompanyProfile: boolean;
  viewFinancials: boolean;
  manageCampaigns: boolean;
}

export interface OrgMember {
  member_id: string;
  orgId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: MemberRole;
  permissions: Permissions;
  status: "INVITED" | "ACTIVE" | "SUSPENDED";
  invitedAt: string;
}

export interface Kyc {
  gstin?: string;
  pan?: string;
  cin?: string;
  registrationDocUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  verifiedAt?: string;
}

export interface Billing {
  provider: PaymentProvider;
  customerId?: string;
  currency: Currency;
  plan?: string;
}

export interface Brand {
  brand_id: string;
  name: string;
  legalName?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  description?: string;
  hqLocation?: string;
  verificationStatus: VerificationStatus;
  kyc?: Kyc;
  billing?: Billing;
  teamSeats: OrgMember[];
  createdAt: string;
  updatedAt: string;
}

export interface Agency {
  agency_id: string;
  type: AgencyType;
  internal: boolean; // true = Underdawg's own L4 management arm
  name: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  specialties?: string[];
  location?: string;
  commissionRate?: number; // MANAGEMENT only, 15–25
  verificationStatus: VerificationStatus;
  billing?: Billing;
  teamSeats: OrgMember[];
  createdAt: string;
  updatedAt: string;
}

export type Org = Brand | Agency;

export interface Representation {
  rep_id: string;
  agencyId: string;
  creatorId: string;
  status: "REQUESTED" | "ACTIVE" | "ENDED";
  commissionRate: number; // 15–25
  agreementUrl?: string;
  startedAt?: string;
  endedAt?: string;
}

// Agency · Marketing (Phase 3) — a brand client served by a marketing agency.
export interface Client {
  client_id: string;
  agencyId: string;
  brandName: string;
  industry?: string;
  contact?: string;
  billingRef?: string;
  activeJobs: number;
  activeCampaigns: number;
  spend: number; // total managed spend for this client
  reach: number; // aggregate reach delivered
}

export interface TalentPool {
  pool_id: string;
  name: string;
  note?: string;
  creatorIds: string[];
}

// ---------------------------------------------------------------------------
// Creator (read-only mirror of the app's public profile)
// ---------------------------------------------------------------------------

export interface PlatformConn {
  key: string; // ig | yt | tt | tw | sp | tv
  name: string;
  handle: string;
  followers: number;
  verified: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  cover: string; // image url or accent hex
  kind: string;
}

export interface RateCardItem {
  key: string;
  name: string;
  base: number;
  desc?: string;
}

export interface Creator {
  cr_id: string;
  handle: string;
  name: string;
  avatarUrl?: string;
  type: string;
  location: string;
  bio: string;
  accent: string; // brand accent hex (from the app's Person.color)
  stats: { followers: number; following: number; reputation: number; earned: number };
  tier: CreatorTier;
  isRosterEligible: boolean; // the 5k craft-gate flag
  niches: string[];
  skills: string[];
  platforms: PlatformConn[];
  portfolio: PortfolioItem[];
  openTo: OpenTo[];
  rates: RateCardItem[];
  currency: Currency;
  contactVisibility: Visibility;
  ratesVisibility: Visibility;
  verifiedHuman: boolean;
  verificationLevel: "email" | "phone" | "govID" | "liveness" | "manual";
  managedBy: string | null; // agency_id
  ratingAvg?: number;
  ratingCount?: number;
}

// ---------------------------------------------------------------------------
// Jobs / applications / deals
// ---------------------------------------------------------------------------

export interface JobRequirements {
  minFollowers?: number;
  niche?: string;
  location?: string;
}

export interface Job {
  job_id: string;
  orgId: string;
  clientId?: string;
  postedBy?: string;
  brandDisplay?: string;
  title: string;
  type: JobType;
  niche: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  currency: Currency;
  paymentStructure: PaymentStructure;
  requirements: JobRequirements;
  deliverables: string[];
  timeline: string;
  usageRights: string;
  exclusivity: string;
  applicationDeadline: string; // ISO
  verified: boolean;
  status: JobStatus;
  applicants: number;
  createdAt: string;
}

export interface Application {
  application_id: string;
  jobId: string;
  creatorId: string;
  orgId: string;
  pitch: string;
  rate: number;
  currency: Currency;
  timeline: string;
  portfolioSnapshot?: string;
  repScoreSnapshot: number;
  status: ApplicationStatus;
  brandResponse?: string;
  respondedBy?: string;
  respondedAt?: string;
  submittedAt: string;
}

export interface ContractTerms {
  rate: number;
  currency: Currency;
  paymentTerms: string;
  deliverables: string;
  timeline: string;
  usageRights: string;
  exclusivity: string;
  contentOwnership: string;
  revisions: string;
}

export interface Contract {
  contract_id: string;
  dealId: string;
  parties: { brandId: string; creatorId: string };
  terms: ContractTerms;
  clauses: { title: string; body: string }[];
  status: ContractStatus;
  esign: {
    provider: "DIGIO";
    documentId?: string;
    brandSignedAt?: string;
    creatorSignedAt?: string;
    pdfUrl?: string;
  };
  createdAt: string;
}

export interface Deliverable {
  deliverable_id: string;
  dealId: string;
  title: string;
  fileUrls: string[];
  submittedAt?: string;
  reviewStatus: DeliveryPhase;
  revisionNotes: string[];
  revisionCount: number;
  approvedBy?: string;
  approvedAt?: string;
  goLiveUrl?: string;
}

export interface Escrow {
  escrow_id: string;
  dealId: string;
  grossAmount: number;
  currency: Currency;
  platformFeePct: number; // 12
  platformFeeAmount: number;
  gstPct: number; // 18
  gstAmount: number;
  netToCreator: number;
  status: EscrowStatus;
  fundedAt?: string;
  releasedAt?: string;
  paymentProvider: PaymentProvider;
  providerRef?: string;
}

export interface Deal {
  deal_id: string;
  jobId: string;
  applicationId: string;
  orgId: string;
  creatorId: string;
  title: string;
  amount: number;
  currency: Currency;
  status: DealStatus;
  deliveryPhase?: DeliveryPhase;
  progress: number; // 0–1
  nextAction: string;
  contractId?: string;
  escrowId?: string;
  threadId?: string;
  goLiveUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Campaigns / invoices / ratings / messaging / finance
// ---------------------------------------------------------------------------

export interface CampaignSlot {
  creatorId: string;
  dealId?: string;
  status: string;
  payout: number;
}

export interface Campaign {
  campaign_id: string;
  orgId: string;
  clientId?: string;
  name: string;
  type: "GET_VIRAL";
  tier: CampaignTier;
  budget: number;
  currency: Currency;
  brief: string;
  requiredDisclosure: string; // "#ad"
  windowStart: string;
  windowEnd: string;
  creatorSlots: CampaignSlot[];
  targetReach: number;
  status: CampaignStatus;
  analytics: {
    totalReach: number;
    impressions: number;
    engagement: number;
    clicks: number;
    conversions: number;
  };
  createdAt: string;
}

export interface Invoice {
  invoice_id: string;
  dealId?: string;
  campaignId?: string;
  fromOrgId: string;
  toCreatorId: string;
  lineItems: { label: string; amount: number }[];
  subtotal: number;
  gstPct: number; // 18
  gstAmount: number;
  total: number;
  currency: Currency;
  gstin?: string;
  pan?: string;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt?: string;
  pdfUrl?: string;
}

export interface Rating {
  rating_id: string;
  dealId: string;
  fromOrgId: string;
  toCreatorId: string;
  scores: {
    overall: number;
    communication: number;
    timeliness: number;
    contentQuality: number;
    professionalism: number;
  };
  writtenReview: string;
  wouldWorkAgain: boolean;
  createdAt: string;
}

export interface Message {
  from: "me" | "them";
  body: string;
  ts: string;
}

export interface Thread {
  thread_id: string;
  kind: ThreadKind;
  orgId?: string;
  creatorId: string;
  name: string;
  preview: string;
  unread: number;
  verified?: boolean;
  typing?: boolean;
  archived?: boolean;
  dealId?: string;
  messages: Message[];
  updatedAgo: string;
}

export interface Transaction {
  txn_id: string;
  kind: TransactionKind;
  source: string;
  amount: number;
  currency: Currency;
  direction: TransactionDirection;
  status: TransactionStatus;
  date: string;
  escrowId?: string;
  invoiceId?: string;
}

// ---------------------------------------------------------------------------
// Plans (kanban board) — brand/agency campaign planning
// ---------------------------------------------------------------------------

export type PlanColumn = "backlog" | "progress" | "review" | "done";

export interface PlanCard {
  card_id: string;
  column: PlanColumn;
  title: string;
  body?: string;
  tag?: string;
  ai?: boolean;
}

// ---------------------------------------------------------------------------
// Drafting gigs — in-progress AI job posts (show splash until ready)
// ---------------------------------------------------------------------------

export interface DraftingGig {
  gig_id: string;
  brief: string;
  status: "drafting" | "ready";
  jobId?: string;
  title?: string;
  niche?: string;
  budgetMin?: number;
  budgetMax?: number;
}
