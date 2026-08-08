import { create } from "zustand";
import { useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Toast store                                                        */
/* ------------------------------------------------------------------ */

export type ToastKind = "success" | "error" | "info";

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  detail?: string;
}

interface ToastState {
  toasts: Toast[];
  push: (kind: ToastKind, title: string, detail?: string) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  push: (kind, title, detail) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, kind, title, detail }] }));
    // auto-dismiss after a short delay
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4200);
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Convenience hook returning toast helpers. */
export function useToast() {
  const push = useToasts((s) => s.push);
  const success = useCallback(
    (title: string, detail?: string) => push("success", title, detail),
    [push],
  );
  const error = useCallback(
    (title: string, detail?: string) => push("error", title, detail),
    [push],
  );
  const info = useCallback(
    (title: string, detail?: string) => push("info", title, detail),
    [push],
  );
  return { success, error, info };
}

/* ------------------------------------------------------------------ */
/*  Toast viewport                                                     */
/* ------------------------------------------------------------------ */

const kindStyles: Record<
  ToastKind,
  { bar: string; icon: string; label: string }
> = {
  success: {
    bar: "bg-accent-500",
    icon: "text-accent-400",
    label: "✓",
  },
  error: {
    bar: "bg-danger-500",
    icon: "text-danger-400",
    label: "✕",
  },
  info: {
    bar: "bg-ink-500",
    icon: "text-ink-300",
    label: "i",
  },
};

export function Toasts() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-80 flex-col gap-2">
      {toasts.map((toast) => {
        const style = kindStyles[toast.kind];
        return (
          <div
            key={toast.id}
            className="animate-toast-in pointer-events-auto flex items-start gap-3 overflow-hidden rounded-xl border border-workspace-600 bg-workspace-800/95 p-3 shadow-panel backdrop-blur"
            role="status"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${style.icon} ${style.bar} bg-opacity-20`}
            >
              {style.label}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink-100">
                {toast.title}
              </p>
              {toast.detail && (
                <p className="mt-0.5 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-ink-500">
                  {toast.detail}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 rounded p-1 text-ink-500 transition-colors hover:text-ink-100"
              aria-label="Dismiss"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 2l8 8M10 2l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
