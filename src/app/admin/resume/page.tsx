"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/Toast";

interface ResumeDoc {
  _id?: string;
  pdfUrl: string;
  createdAt?: string;
  updatedAt?: string;
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

export default function AdminResumePage() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resume, setResume] = useState<ResumeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function fetchResume() {
    try {
      const res = await fetch("/api/resume");
      if (res.ok) {
        const data: ResumeDoc = await res.json();
        setResume(data.pdfUrl ? data : null);
      }
    } catch {
      showToast("Failed to load resume", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResume();
  }, []);

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      showToast("Please select a PDF file", "info");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Upload failed");
      }

      const { url } = await uploadRes.json();

      const saveRes = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl: url }),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error || "Failed to save resume");
      }

      const saved: ResumeDoc = await saveRes.json();
      setResume(saved);
      setConfirmDelete(false);
      showToast("Resume uploaded successfully", "success");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl: "" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete resume");
      }

      setResume(null);
      setConfirmDelete(false);
      showToast("Resume deleted", "info");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setDeleting(false);
    }
  }

  function extractFilename(url: string): string {
    const parts = url.split("/");
    return parts[parts.length - 1] || "resume.pdf";
  }

  function formatDate(iso: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const hasResume = resume !== null;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Resume Management
          </h1>
          <p className="font-body text-text-muted mt-1 text-sm sm:text-base">
            Manage your downloadable resume PDF
          </p>
        </motion.div>

        {loading ? (
          <SkeletonBlock />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Upload Card */}
            <motion.div
              variants={cardVariants}
              className="bg-card border border-border rounded-2xl p-5 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    upload_file
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {hasResume ? "Replace Resume" : "Upload Resume"}
                  </h2>
                  <p className="font-body text-xs text-text-muted mt-0.5">
                    Only PDF files are accepted
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:font-display file:text-xs file:font-semibold file:text-white file:hover:opacity-90 file:transition-opacity file:cursor-pointer cursor-pointer outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
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
                      Uploading…
                    </>
                  ) : hasResume ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        upload
                      </span>
                      Replace Resume
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        upload
                      </span>
                      Upload Resume
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Current Resume Card */}
            {hasResume ? (
              <motion.div
                variants={cardVariants}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[22px]">
                      picture_as_pdf
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      Current Resume
                    </h2>
                    <p className="font-body text-xs text-text-muted mt-0.5">
                      Active resume available for download
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-text-muted w-24 shrink-0">
                      Filename
                    </span>
                    <span className="font-body text-sm text-foreground truncate">
                      {extractFilename(resume.pdfUrl)}
                    </span>
                  </div>

                  {resume.createdAt && (
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-text-muted w-24 shrink-0">
                        Uploaded
                      </span>
                      <span className="font-body text-sm text-foreground">
                        {formatDate(resume.createdAt)}
                      </span>
                    </div>
                  )}

                  {resume.updatedAt && resume.updatedAt !== resume.createdAt && (
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-text-muted w-24 shrink-0">
                        Updated
                      </span>
                      <span className="font-body text-sm text-foreground">
                        {formatDate(resume.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-border">
                  <a
                    href={resume.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 font-display text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      visibility
                    </span>
                    View Resume
                  </a>

                  <a
                    href={resume.pdfUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 font-display text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      download
                    </span>
                    Download
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={cardVariants}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6 text-center"
              >
                <span className="material-symbols-outlined text-text-muted text-4xl mb-3 block">
                  description_off
                </span>
                <p className="font-body text-sm text-text-muted">
                  No resume uploaded yet. Use the upload section above to add your
                  first resume.
                </p>
              </motion.div>
            )}

            {/* Delete Section */}
            {hasResume && (
              <motion.div
                variants={cardVariants}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-red-400 text-[22px]">
                      delete
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      Delete Resume
                    </h2>
                    <p className="font-body text-xs text-text-muted mt-0.5">
                      Permanently remove the current resume
                    </p>
                  </div>
                </div>

                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 font-display text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Delete Resume
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="font-body text-sm text-red-400">
                      Are you sure? This action cannot be undone.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="rounded-lg bg-red-500 px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {deleting ? (
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
                            Deleting…
                          </>
                        ) : (
                          "Yes, delete it"
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        disabled={deleting}
                        className="rounded-lg border border-border bg-background px-4 py-2.5 font-display text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SkeletonBlock() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-card border border-border rounded-2xl p-6 h-36">
        <div className="w-40 h-5 bg-border rounded mb-4" />
        <div className="w-full h-10 bg-border rounded mb-4" />
        <div className="w-28 h-9 bg-border rounded" />
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 h-36">
        <div className="w-36 h-5 bg-border rounded mb-4" />
        <div className="w-64 h-4 bg-border rounded mb-2" />
        <div className="w-48 h-4 bg-border rounded" />
      </div>
    </div>
  );
}
