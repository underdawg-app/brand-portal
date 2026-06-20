"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

/**
 * Sign-up is now a frictionless funnel — we collect role + name + email inside the
 * onboarding flow itself, so this route just forwards there.
 */
export default function SignupRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/onboarding");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface text-text">
      <Logo height={28} />
    </div>
  );
}
