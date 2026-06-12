"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-red-500 text-xl">
                  warning
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {title}
                </h3>
                <p className="font-body text-sm text-text-muted mt-1">
                  {message}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {loading && (
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
