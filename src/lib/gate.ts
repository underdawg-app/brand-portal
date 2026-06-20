"use client";

import { useStore } from "@/lib/store";
import type { Permissions } from "@/lib/types";

/** Is the brand verified? (gates job posting, campaigns, restricted info) */
export function useVerified() {
  return useStore((s) => s.brand.verificationStatus === "VERIFIED");
}

/** Does the current member hold a given permission? */
export function usePermission(perm: keyof Permissions) {
  return useStore((s) => s.currentMember()?.permissions[perm] ?? false);
}
