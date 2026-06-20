"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Label } from "./primitives";

/** Right-side slide-over sheet for detail panels (applicant, deal, etc.). */
export function Drawer({
  open,
  onOpenChange,
  title,
  eyebrow,
  children,
  footer,
  width = "max-w-xl",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: React.ReactNode;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className={cn(
            "fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-hairline bg-surface shadow-2xl focus:outline-none",
            width,
          )}
        >
          <div className="flex items-start justify-between border-b border-hairline p-5">
            <div className="min-w-0">
              {eyebrow && <Label className="text-brand">{eyebrow}</Label>}
              <Dialog.Title className="font-heavy text-xl text-text">{title}</Dialog.Title>
            </div>
            <Dialog.Close className="rounded-md p-1.5 text-textMuted hover:bg-surfaceMuted hover:text-text">
              <X size={18} />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
          {footer && <div className="border-t border-hairline p-5">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
