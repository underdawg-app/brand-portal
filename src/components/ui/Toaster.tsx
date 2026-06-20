"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { useStore } from "@/lib/store";

export function Toaster() {
  const toasts = useStore((s) => s.toasts);
  const dismiss = useStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((t) => (
        <ToastRow key={t.id} id={t.id} message={t.message} tone={t.tone} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastRow({
  id, message, tone, onDismiss,
}: {
  id: number;
  message: string;
  tone: "default" | "success" | "warn";
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const Icon = tone === "success" ? CheckCircle2 : tone === "warn" ? AlertTriangle : Info;
  return (
    <div className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-hairlineStrong bg-surfaceElevated px-4 py-3 text-sm text-text shadow-2xl">
      <Icon size={16} className="text-brand" />
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="text-textMuted hover:text-text"><X size={14} /></button>
    </div>
  );
}
