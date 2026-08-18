"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Global listener pattern to support static toast.success(...) calls anywhere
type ToastListener = (toast: ToastItem) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  show: (message: string, type: ToastType = "info", title?: string, duration = 4000) => {
    const item: ToastItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
      title,
      duration,
    };
    listeners.forEach((listener) => listener(item));
  },
  success: (message: string, title?: string, duration = 4000) => {
    toast.show(message, "success", title, duration);
  },
  error: (message: string, title?: string, duration = 4000) => {
    toast.show(message, "error", title, duration);
  },
  info: (message: string, title?: string, duration = 4000) => {
    toast.show(message, "info", title, duration);
  },
  warning: (message: string, title?: string, duration = 4000) => {
    toast.show(message, "warning", title, duration);
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", title?: string, duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev.slice(-4), { id, type, message, title, duration }]);
    },
    []
  );

  useEffect(() => {
    const handleGlobalToast: ToastListener = (item) => {
      setToasts((prev) => [...prev.slice(-4), item]);
    };
    listeners.add(handleGlobalToast);
    return () => {
      listeners.delete(handleGlobalToast);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Global Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: toast.show,
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warning: toast.warning,
      removeToast: () => {},
    };
  }
  return {
    showToast: context.showToast,
    success: (msg: string, title?: string) => context.showToast(msg, "success", title),
    error: (msg: string, title?: string) => context.showToast(msg, "error", title),
    info: (msg: string, title?: string) => context.showToast(msg, "info", title),
    warning: (msg: string, title?: string) => context.showToast(msg, "warning", title),
    removeToast: context.removeToast,
  };
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      border: "border-emerald-500",
      bg: "bg-emerald-50/95 dark:bg-slate-900/95",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      titleColor: "text-emerald-950 dark:text-emerald-200",
    },
    error: {
      icon: AlertCircle,
      border: "border-rose-500",
      bg: "bg-rose-50/95 dark:bg-slate-900/95",
      iconColor: "text-rose-600 dark:text-rose-400",
      titleColor: "text-rose-950 dark:text-rose-200",
    },
    warning: {
      icon: AlertTriangle,
      border: "border-amber-500",
      bg: "bg-amber-50/95 dark:bg-slate-900/95",
      iconColor: "text-amber-600 dark:text-amber-400",
      titleColor: "text-amber-950 dark:text-amber-200",
    },
    info: {
      icon: Info,
      border: "border-indigo-500",
      bg: "bg-indigo-50/95 dark:bg-slate-900/95",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      titleColor: "text-indigo-950 dark:text-indigo-200",
    },
  }[toast.type];

  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border-l-4 ${config.border} ${config.bg} p-4 shadow-xl backdrop-blur-md border border-slate-200 dark:border-slate-800`}
    >
      <IconComponent className={`h-5 w-5 shrink-0 ${config.iconColor} mt-0.5`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h5 className={`text-xs font-bold uppercase tracking-wider ${config.titleColor}`}>
            {toast.title}
          </h5>
        )}
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-lg"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
