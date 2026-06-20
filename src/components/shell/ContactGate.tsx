"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Phone, BellOff, Check, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { Field, inputClass } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

/**
 * One-time contact ask shown right after a brand/agency enters the workspace.
 * Reassuring, skippable, with a clear "don't contact me" opt-out — never spammy.
 */
export function ContactGate() {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);

  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [optOut, setOptOut] = useState(false);

  // Open once per session, after entry, if we've never asked.
  useEffect(() => {
    if (!profile.phoneAsked) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [profile.phoneAsked]);

  const confirm = () => {
    setProfile({ contactPhone: phone.trim(), contactOptOut: optOut, phoneAsked: true });
    setOpen(false);
  };
  const skip = () => {
    setProfile({ contactOptOut: true, phoneAsked: true });
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) skip(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[81] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-hairline bg-surfaceElevated p-6 shadow-2xl focus:outline-none">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand"><Phone size={18} /></span>
          <Dialog.Title className="mt-4 font-heavy text-lg text-text">Welcome in — one quick thing</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-textMuted">
            Drop a number so creators (and only creators you choose to work with) can reach you fast. We won&apos;t spam you — promise.
          </Dialog.Description>
          <div className="mt-5">
            <Field label="Phone number">
              <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98xxxxxx21" />
            </Field>
            <button
              onClick={() => setOptOut((v) => !v)}
              className={`mt-3 flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${optOut ? "border-brand bg-brand/5 text-text" : "border-hairline text-textMuted hover:text-text"}`}
            >
              <span className={`grid h-5 w-5 place-items-center rounded-md border ${optOut ? "border-brand bg-brand text-brandFg" : "border-hairlineStrong"}`}>
                {optOut ? <Check size={13} /> : <BellOff size={12} />}
              </span>
              Don&apos;t contact me — I&apos;ll reach out myself.
            </button>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={skip}>Skip for now</Button>
            <Button onClick={confirm} disabled={!optOut && !phone.trim()}>Done <ArrowRight size={16} /></Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
