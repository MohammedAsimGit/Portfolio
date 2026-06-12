import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center space-y-6 text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="font-display text-3xl font-bold text-primary tracking-tight">
            404
          </span>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Page not found
          </h1>
          <p className="font-body text-sm text-text-muted">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="rounded-lg bg-primary px-6 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
          <Link
            href="/admin/dashboard"
            className="rounded-xl border border-border px-6 py-2.5 font-display text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
