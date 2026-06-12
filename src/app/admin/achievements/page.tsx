"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Achievement {
  _id: string;
  title: string;
  date: string;
  description: string;
  category: "hackathon" | "competition" | "achievement";
  createdAt?: string;
  updatedAt?: string;
}

interface FormFields {
  title: string;
  date: string;
  description: string;
  category: "hackathon" | "competition" | "achievement";
}

const EMPTY_FORM: FormFields = {
  title: "",
  date: "",
  description: "",
  category: "achievement",
};

const CATEGORY_META: Record<
  Achievement["category"],
  { label: string; bg: string; text: string; icon: string }
> = {
  hackathon: {
    label: "Hackathon",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    icon: "code",
  },
  competition: {
    label: "Competition",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    icon: "emoji_events",
  },
  achievement: {
    label: "Achievement",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    icon: "military_tech",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all";

export default function AdminAchievementsPage() {
  const { showToast } = useToast();

  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchItems() {
    try {
      const res = await fetch("/api/achievements");
      if (res.ok) {
        const data: Achievement[] = await res.json();
        setItems(data);
      }
    } catch {
      showToast("Failed to load achievements", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEditModal(item: Achievement) {
    setEditingId(item._id);
    setForm({
      title: item.title,
      date: item.date,
      description: item.description,
      category: item.category,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function setField(field: keyof FormFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function isFormValid() {
    return form.title.trim() && form.date.trim() && form.description.trim();
  }

  async function handleSave() {
    if (!isFormValid()) return;
    setSaving(true);

    try {
      if (editingId) {
        const res = await fetch(`/api/achievements/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const updated: Achievement = await res.json();
          setItems((prev) =>
            prev.map((item) => (item._id === editingId ? updated : item))
          );
          showToast("Achievement updated", "success");
          closeModal();
        } else {
          showToast("Failed to update achievement", "error");
        }
      } else {
        const res = await fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const created: Achievement = await res.json();
          setItems((prev) => [created, ...prev]);
          showToast("Achievement created", "success");
          closeModal();
        } else {
          showToast("Failed to create achievement", "error");
        }
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteDialog(item: Achievement) {
    setDeleteTarget(item);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/achievements/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
        showToast("Achievement deleted", "success");
      } else {
        showToast("Failed to delete achievement", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  function formatDate(raw: string) {
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return raw;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return raw;
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground ink-shadow-sm">
              Achievements
            </h1>
            <p className="font-body text-text-muted mt-1 text-sm">
              Manage your awards, hackathons, and milestones
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity self-start"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Achievement
          </button>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-6 h-48"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-6 bg-border rounded-full" />
                </div>
                <div className="w-3/4 h-5 bg-border rounded mb-3" />
                <div className="w-1/3 h-4 bg-border rounded mb-4" />
                <div className="w-full h-4 bg-border rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <span className="material-symbols-outlined text-text-muted text-5xl mb-4 block">
              military_tech
            </span>
            <p className="font-body text-text-muted text-lg mb-1">
              No achievements yet
            </p>
            <p className="font-body text-text-muted text-sm">
              Click &ldquo;Add Achievement&rdquo; to create your first one.
            </p>
          </motion.div>
        )}

        {/* Cards Grid */}
        {!loading && items.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            {items.map((item) => {
              const meta = CATEGORY_META[item.category];
              return (
                <motion.div
                  key={item._id}
                  variants={cardVariants}
                  className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col group hover:border-primary/30 transition-colors"
                >
                  {/* Top row: category badge + actions */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono ${meta.bg} ${meta.text}`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {meta.icon}
                      </span>
                      {meta.label}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-text-muted text-lg">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => openDeleteDialog(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-red-500 text-lg">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Trophy icon + Title */}
                  <div className="flex items-start gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary text-2xl shrink-0 mt-0.5">
                      trophy
                    </span>
                    <h3 className="font-display text-lg font-semibold text-foreground leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Date */}
                  <p className="font-mono text-xs text-text-muted mb-3 ml-9">
                    {formatDate(item.date)}
                  </p>

                  {/* Description */}
                  <p className="font-body text-sm text-text-muted leading-relaxed ml-9 line-clamp-3">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[9997] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                {editingId ? "Edit Achievement" : "New Achievement"}
              </h2>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g. Best AI Hackathon Winner"
                    className={inputClass}
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setField("date", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Brief description of the achievement..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                    className={inputClass}
                  >
                    <option value="achievement">Achievement</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="competition">Competition</option>
                  </select>
                </div>
              </div>

              {/* Modal actions */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !isFormValid()}
                  className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
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
                  {editingId ? "Save Changes" : "Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Achievement"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
