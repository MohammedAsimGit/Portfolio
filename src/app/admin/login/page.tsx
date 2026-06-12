'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="bg-background min-h-screen flex items-center justify-center px-4 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex justify-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-primary tracking-tight">
                MA
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">
              Welcome back
            </h1>
            <p className="font-body text-sm text-text-muted">
              Sign in to access the admin dashboard
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 font-body"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block font-body text-sm font-medium text-foreground mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-body text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
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
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center font-body text-xs text-text-muted">
            Portfolio CMS &middot; Admin Panel
          </p>
        </div>
      </motion.div>
    </div>
  );
}
