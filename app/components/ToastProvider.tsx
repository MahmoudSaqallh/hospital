"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, X, XCircle } from "lucide-react";

type ToastVariant = "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      success: () => {},
      error: () => {},
    };
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message: string, variant: ToastVariant) => {
      const id = ++toastId;
      setItems((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-[5.5rem] z-[200] flex flex-col items-center gap-2 px-4 sm:top-24"
        aria-live="polite"
      >
        <AnimatePresence>
          {items.map((item) => {
            const isSuccess = item.variant === "success";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_16px_40px_-16px_rgba(15,34,51,0.35)] ${
                  isSuccess
                    ? "border-emerald-200 bg-white text-ink"
                    : "border-rose-200 bg-white text-ink"
                }`}
                role="status"
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isSuccess
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </span>
                <p className="flex-1 pt-1.5 text-sm font-semibold leading-6">{item.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  className="rounded-lg p-1 text-muted transition hover:bg-slate-100 hover:text-ink"
                  aria-label="إغلاق"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
