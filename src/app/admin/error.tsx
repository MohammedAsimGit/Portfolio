"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4 text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-red-500 text-3xl">
            error
          </span>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Something went wrong
        </h2>
        <p className="font-body text-sm text-text-muted">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
