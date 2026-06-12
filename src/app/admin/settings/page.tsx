"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/Toast";

interface Settings {
  aboutBio: string;
  careerObjective: string;
  githubUrl: string;
  linkedinUrl: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    aboutBio: "",
    careerObjective: "",
    githubUrl: "",
    linkedinUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const json: Settings = await res.json();
          setSettings(json);
        }
      } catch {
        // silently fail — form will show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  function updateField(field: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast("Settings saved", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to save settings", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("All password fields are required", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Password changed successfully", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(data.error || "Failed to change password", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Settings
            </h1>
            <p className="font-body text-text-muted mt-1 text-sm sm:text-base">
              Manage your portfolio profile details
            </p>
          </div>
          <motion.button
            onClick={handleSave}
            disabled={loading || saving}
            whileHover={{ scale: loading || saving ? 1 : 1.02 }}
            whileTap={{ scale: loading || saving ? 1 : 0.98 }}
            className="rounded-lg bg-primary px-5 py-2.5 font-display text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
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
                Saving…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                Save Changes
              </>
            )}
          </motion.button>
        </motion.div>

        {loading ? (
          <SkeletonForm />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Profile Section */}
            <motion.div
              variants={cardVariants}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    person
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Profile
                  </h2>
                  <p className="font-body text-xs text-text-muted mt-0.5">
                    Personal information and career details
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="aboutBio"
                    className="block font-body text-sm font-medium text-foreground mb-1.5"
                  >
                    About Bio
                  </label>
                  <textarea
                    id="aboutBio"
                    rows={4}
                    value={settings.aboutBio}
                    onChange={(e) => updateField("aboutBio", e.target.value)}
                    placeholder="Write a detailed bio about yourself…"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 resize-y min-h-[120px]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="careerObjective"
                    className="block font-body text-sm font-medium text-foreground mb-1.5"
                  >
                    Career Objective
                  </label>
                  <textarea
                    id="careerObjective"
                    rows={3}
                    value={settings.careerObjective}
                    onChange={(e) => updateField("careerObjective", e.target.value)}
                    placeholder="Describe your career objective…"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 resize-y min-h-[120px]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Social Links Section */}
            <motion.div
              variants={cardVariants}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    link
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Social Links
                  </h2>
                  <p className="font-body text-xs text-text-muted mt-0.5">
                    Connect your professional profiles
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="githubUrl"
                    className="block font-body text-sm font-medium text-foreground mb-1.5"
                  >
                    GitHub URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <GithubIcon className="text-text-muted" />
                    </div>
                    <input
                      id="githubUrl"
                      type="url"
                      value={settings.githubUrl}
                      onChange={(e) => updateField("githubUrl", e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="linkedinUrl"
                    className="block font-body text-sm font-medium text-foreground mb-1.5"
                  >
                    LinkedIn URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <LinkedinIcon className="text-text-muted" />
                    </div>
                    <input
                      id="linkedinUrl"
                      type="url"
                      value={settings.linkedinUrl}
                      onChange={(e) => updateField("linkedinUrl", e.target.value)}
                      placeholder="https://linkedin.com/in/yourusername"
                      className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Password Section */}
            <motion.div
              variants={cardVariants}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-500 text-[20px]">
                    lock
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Change Password
                  </h2>
                  <p className="font-body text-xs text-text-muted mt-0.5">
                    Update your admin account password
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block font-body text-sm font-medium text-foreground mb-1.5"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block font-body text-sm font-medium text-foreground mb-1.5"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block font-body text-sm font-medium text-foreground mb-1.5"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                <div className="pt-2">
                  <motion.button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    whileHover={{ scale: changingPassword ? 1 : 1.02 }}
                    whileTap={{ scale: changingPassword ? 1 : 0.98 }}
                    className="rounded-lg bg-amber-500 px-5 py-2.5 font-display text-sm font-semibold text-white hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {changingPassword ? (
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
                        Updating…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">lock_reset</span>
                        Change Password
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Save button at bottom */}
            <motion.div
              variants={cardVariants}
              className="flex justify-end"
            >
              <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
                className="rounded-lg bg-primary px-6 py-2.5 font-display text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
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
                    Saving…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">save</span>
                    Save Changes
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SkeletonForm() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-border" />
          <div>
            <div className="w-24 h-5 bg-border rounded mb-1" />
            <div className="w-40 h-3 bg-border rounded" />
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <div className="w-20 h-4 bg-border rounded mb-2" />
            <div className="w-full h-[120px] bg-border rounded-lg" />
          </div>
          <div>
            <div className="w-32 h-4 bg-border rounded mb-2" />
            <div className="w-full h-[100px] bg-border rounded-lg" />
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-border" />
          <div>
            <div className="w-28 h-5 bg-border rounded mb-1" />
            <div className="w-44 h-3 bg-border rounded" />
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <div className="w-22 h-4 bg-border rounded mb-2" />
            <div className="w-full h-10 bg-border rounded-lg" />
          </div>
          <div>
            <div className="w-24 h-4 bg-border rounded mb-2" />
            <div className="w-full h-10 bg-border rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
