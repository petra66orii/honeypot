import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost";
};

type Toast = {
  id: number;
  message: string;
  type: ToastType;
  actions?: ToastAction[];
  durationMs?: number | null;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, type, durationMs: 3500 }]);
    window.setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  const showConfirm = useCallback(
    (message: string, onConfirm: () => void, onCancel?: () => void) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const actions: ToastAction[] = [
        {
          label: "Cancel",
          onClick: () => {
            onCancel?.();
            removeToast(id);
          },
          variant: "ghost",
        },
        {
          label: "Log out",
          onClick: () => {
            onConfirm();
            removeToast(id);
          },
          variant: "primary",
        },
      ];
      setToasts((prev) => [
        ...prev,
        { id, message, type: "info", actions, durationMs: null },
      ]);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ showToast, showConfirm }), [showToast, showConfirm]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[90vw] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl border px-4 py-3 text-sm shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : toast.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-yellow-200 bg-yellow-50 text-yellow-900"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-honey-gold/80 shadow-sm"></div>
              <div className="flex-1">
                <p className="font-medium">{toast.message}</p>
                {toast.actions && (
                  <div className="mt-3 flex items-center justify-end gap-2">
                    {toast.actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={action.onClick}
                        className={
                          action.variant === "primary"
                            ? "rounded-full bg-honey-gold px-4 py-1.5 text-xs font-semibold text-white hover:bg-yellow-600"
                            : "rounded-full border border-yellow-200 px-3 py-1.5 text-xs font-semibold text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};
