"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Project {
  _id: string;
  title: string;
  description: string;
  bannerImage: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  isFeatured: boolean;
  order: number;
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

export default function AdminProjectsPage() {
  const { showToast } = useToast();

  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    itemId: string;
    loading: boolean;
  }>({ open: false, itemId: "", loading: false });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setBannerImage("");
    setTechStackInput("");
    setGithubLink("");
    setLiveLink("");
    setIsFeatured(false);
    setOrder(0);
  }

  function openCreateModal() {
    resetForm();
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEditModal(item: Project) {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setBannerImage(item.bannerImage);
    setTechStackInput(item.techStack.join(", "));
    setGithubLink(item.githubLink);
    setLiveLink(item.liveLink);
    setIsFeatured(item.isFeatured);
    setOrder(item.order);
    setModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setBannerImage(data.url);
        showToast("Image uploaded successfully", "success");
      } else {
        const err = await res.json();
        showToast(err.error || "Upload failed", "error");
      }
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!title.trim() || !description.trim() || !bannerImage.trim()) {
      showToast("Title, description, and banner image are required", "error");
      return;
    }

    setSaving(true);
    try {
      const body = {
        title: title.trim(),
        description: description.trim(),
        bannerImage: bannerImage.trim(),
        techStack: techStackInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        githubLink: githubLink.trim(),
        liveLink: liveLink.trim(),
        isFeatured,
        order,
      };

      const url = editingItem
        ? `/api/projects/${editingItem._id}`
        : "/api/projects";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast(
          editingItem ? "Project updated" : "Project created",
          "success"
        );
        setModalOpen(false);
        fetchProjects();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to save", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  function promptDelete(itemId: string) {
    setDeleteDialog({ open: true, itemId, loading: false });
  }

  async function handleDelete() {
    setDeleteDialog((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`/api/projects/${deleteDialog.itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Project deleted", "success");
        setDeleteDialog({ open: false, itemId: "", loading: false });
        fetchProjects();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to delete", "error");
        setDeleteDialog((prev) => ({ ...prev, loading: false }));
      }
    } catch {
      showToast("Something went wrong", "error");
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground ink-shadow-sm">
              Projects
            </h1>
            <p className="font-body text-text-muted mt-1 text-sm sm:text-base">
              Manage your portfolio projects
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Project
          </button>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && <SkeletonGrid />}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <span className="material-symbols-outlined text-text-muted text-4xl mb-3 block">
              folder_off
            </span>
            <p className="font-body text-text-muted mb-4">
              No projects yet
            </p>
            <button
              onClick={openCreateModal}
              className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Create your first project
            </button>
          </motion.div>
        )}

        {/* Project Grid */}
        {!loading && items.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            {items.map((item) => (
              <motion.div
                key={item._id}
                variants={cardVariants}
                className="bg-card border border-border rounded-2xl ink-shadow-sm overflow-hidden"
              >
                {/* Banner Image */}
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {item.bannerImage ? (
                    <img
                      src={item.bannerImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-text-muted">
                      <span className="material-symbols-outlined text-3xl">
                        image
                      </span>
                    </div>
                  )}
                  {item.isFeatured && (
                    <span className="absolute top-3 left-3 rounded-md bg-primary/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                      Featured
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-text-muted line-clamp-3 mb-4">
                    {item.description}
                  </p>

                  {/* Tech Stack Chips */}
                  {item.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links & Order */}
                  <div className="flex items-center gap-4 text-xs text-text-muted mb-4 font-mono">
                    {item.githubLink && (
                      <a
                        href={item.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">
                          code
                        </span>
                        GitHub
                      </a>
                    )}
                    {item.liveLink && (
                      <a
                        href={item.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">
                          open_in_new
                        </span>
                        Live
                      </a>
                    )}
                    <span className="ml-auto">Order: {item.order}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => openEditModal(item)}
                      className="rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors px-4 py-2.5 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">
                        edit
                      </span>
                      Edit
                    </button>
                    <button
                      onClick={() => promptDelete(item._id)}
                      className="rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold px-4 py-2.5 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">
                        delete
                      </span>
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-[9997] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setModalOpen(false)}
              />

              {/* Modal Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 w-full max-w-xl shadow-2xl my-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {editingItem ? "Edit Project" : "Add Project"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-text-muted">
                      close
                    </span>
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-5"
                >
                  {/* Title */}
                  <div>
                    <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Project title"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Project description"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 resize-none"
                    />
                  </div>

                  {/* Banner Image */}
                  <div>
                    <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                      Banner Image
                    </label>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <label className="cursor-pointer rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors px-4 py-2.5 inline-flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                          upload
                        </span>
                        {uploading ? "Uploading..." : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                      </label>
                      {bannerImage && (
                        <div className="flex items-center gap-2 bg-background rounded-lg border border-border px-3 py-2 max-w-full">
                          <span className="material-symbols-outlined text-primary text-sm">
                            image
                          </span>
                          <span className="font-mono text-xs text-text-muted truncate max-w-[200px]">
                            {bannerImage}
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      placeholder="Image URL or upload above"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                      Tech Stack
                    </label>
                    <input
                      type="text"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      placeholder="React, TypeScript, Node.js"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                    <p className="font-mono text-[11px] text-text-muted mt-1">
                      Comma-separated values
                    </p>
                  </div>

                  {/* GitHub & Live Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                        GitHub Link
                      </label>
                      <input
                        type="text"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                        Live Link
                      </label>
                      <input
                        type="text"
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                      />
                    </div>
                  </div>

                  {/* Featured & Order */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        id="isFeatured"
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary/25"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="font-body text-sm text-foreground cursor-pointer"
                      >
                        Featured
                      </label>
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                        Order
                      </label>
                      <input
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors px-4 py-2.5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
                    >
                      {saving && (
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
                      {editingItem ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteDialog.open}
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          loading={deleteDialog.loading}
          onConfirm={handleDelete}
          onCancel={() =>
            setDeleteDialog({ open: false, itemId: "", loading: false })
          }
        />
      </div>
    </div>
  );
}

/* ---- Skeleton Grid ---- */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="aspect-video bg-border" />
          <div className="p-5 space-y-3">
            <div className="w-3/4 h-5 bg-border rounded" />
            <div className="w-full h-4 bg-border rounded" />
            <div className="w-2/3 h-4 bg-border rounded" />
            <div className="flex gap-2 pt-2">
              <div className="w-16 h-5 bg-border rounded-md" />
              <div className="w-16 h-5 bg-border rounded-md" />
            </div>
            <div className="flex gap-2 pt-3 border-t border-border">
              <div className="w-16 h-9 bg-border rounded-xl" />
              <div className="w-16 h-9 bg-border rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
