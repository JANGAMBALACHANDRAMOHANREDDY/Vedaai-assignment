"use client";

import { clsx } from "clsx";
import { useToastStore } from "@/store/toastStore";

const icons: Record<string, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={clsx(
            "flex min-w-[280px] max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-elevated animate-in slide-in-from-right",
            toast.type === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
            toast.type === "error" && "border-red-200 bg-red-50 text-red-900",
            toast.type === "info" && "border-slate-200 bg-white text-slate-800"
          )}
        >
          <span className="font-semibold">{icons[toast.type]}</span>
          <p className="flex-1 text-sm">{toast.message}</p>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
