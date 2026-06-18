import type {
  DealStatus,
  ApplicationStatus,
  PipelineBucket,
  DeliveryPhase,
  EscrowStatus,
  JobStatus,
  ContractStatus,
} from "./types";

/** Visual tone for a status chip. Maps to StatusBadge colors. */
export type Tone = "neutral" | "info" | "accent" | "success" | "warn" | "danger";

export const dealTone: Record<DealStatus, Tone> = {
  APPLIED: "neutral",
  SHORTLISTED: "info",
  NEGOTIATING: "accent",
  CONTRACT: "accent",
  ACTIVE: "info",
  "IN REVIEW": "warn",
  COMPLETED: "success",
  CANCELLED: "neutral",
  DISPUTED: "danger",
};

export const applicationTone: Record<ApplicationStatus, Tone> = {
  APPLIED: "neutral",
  SHORTLISTED: "info",
  REJECTED: "danger",
  WITHDRAWN: "neutral",
};

export const deliveryTone: Record<DeliveryPhase, Tone> = {
  SUBMIT: "neutral",
  "IN REVIEW": "warn",
  REVISION: "warn",
  APPROVED: "success",
  "GO LIVE": "accent",
};

export const escrowTone: Record<EscrowStatus, Tone> = {
  PENDING: "neutral",
  PROCESSING: "warn",
  PAID: "success",
};

export const jobTone: Record<JobStatus, Tone> = {
  DRAFT: "neutral",
  LIVE: "success",
  CLOSED: "neutral",
  FILLED: "info",
};

export const contractTone: Record<ContractStatus, Tone> = {
  DRAFT: "neutral",
  SENT: "info",
  COUNTERED: "warn",
  SIGNED_CREATOR: "info",
  SIGNED_BRAND: "info",
  EXECUTED: "success",
  VOID: "danger",
};

/** Group a deal status into a kanban bucket (verbatim from spec §3.1). */
export function bucketOf(status: DealStatus): PipelineBucket {
  if (
    status === "APPLIED" ||
    status === "SHORTLISTED" ||
    status === "NEGOTIATING" ||
    status === "CONTRACT"
  )
    return "PROPOSED";
  if (status === "ACTIVE" || status === "IN REVIEW") return "ACTIVE";
  return "CLOSED";
}

export const DEAL_ORDER: DealStatus[] = [
  "APPLIED",
  "SHORTLISTED",
  "NEGOTIATING",
  "CONTRACT",
  "ACTIVE",
  "IN REVIEW",
  "COMPLETED",
];

export function nextDealStatus(status: DealStatus): DealStatus {
  const i = DEAL_ORDER.indexOf(status);
  if (i < 0 || i === DEAL_ORDER.length - 1) return status;
  return DEAL_ORDER[i + 1];
}
