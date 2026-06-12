"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface ExperienceItem {
  _id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string[];
  type: "internship" | "leadership" | "job";
}

const TYPE_BADGE: Record<
  ExperienceItem["type"],
  { label: string; bg: string; text: string }
> = {
  internship: {
    label: "Internship",
    bg: "bg-primary/10",
    text: "text-primary",
  },
  leadership: {
    label: "Leadership",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
  },
  job: {
    label: "Job",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
  },
};

const TYPE_ICON: Record<ExperienceItem["type"], string> = {
  internship: "school",
  leadership: "diversity_3",
  job: "work",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const EMPTY_FORM: Omit<ExperienceItem, "_id"> = {
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  description: [],
  type: "internship",
};

export default function AdminExperiencePage() {
  const { showToast } = useToast();

  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [descRaw, setDescRaw] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: ExperienceItem | null;
    loading: boolean;
  }>({ open: false, item: null, loading: false });

  async function fetchItems() {
    try {
      const res = await fetch("/api/experience");
      if (res.ok) {
        const data: ExperienceItem[] = await res.json();
        setItems(data);
      }
    } catch {
      showToast("Failed to load experience data", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function openAddModal() {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM });
    setDescRaw("");
    setModalOpen(true);
  }

  function openEditModal(item: ExperienceItem) {
    setEditingItem(item);
    setForm({
      title: item.title,
      company: item.company,
      location: item.location || "",
      startDate: item.startDate,
      endDate: item.endDate === "Present" ? "" : item.endDate,
      description: item.description,
      type: item.type,
    });
    setDescRaw(item.description.join("\n"));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingItem(null);
    setForm({ ...EMPTY_FORM });
    setDescRaw("");
  }

  async function handleSave() {
    if (!form.title.trim() || !form.company.trim() || !form.startDate.trim()) {
      showToast("Title, company, and start date are required", "error");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location?.trim() || "",
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim() || "Present",
      description: descRaw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      if (editingItem) {
        const res = await fetch(`/api/experience/${editingItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const updated: ExperienceItem = await res.json();
        setItems((prev) =>
          prev.map((i) => (i._id === editingItem._id ? updated : i))
        );
        showToast("Experience updated", "success");
      } else {
        const res = await fetch("/api/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const created: ExperienceItem = await res.json();
        setItems((prev) => [created, ...prev]);
        showToast("Experience added", "success");
      }
      closeModal();
    } catch {
      showToast("Failed to save experience", "error");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteDialog(item: ExperienceItem) {
    setDeleteDialog({ open: true, item, loading: false });
  }

  async function handleDelete() {
    const item = deleteDialog.item;
    if (!item) return;

    setDeleteDialog((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`/api/experience/${item._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      showToast("Experience deleted", "success");
    } catch {
      showToast("Failed to delete experience", "error");
    } finally {
      setDeleteDialog({ open: false, item: null, loading: false });
    }
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
      >
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground ink-shadow-sm">
            Experience
          </h1>
          <p className="font-body text-text-muted mt-1 text-sm sm:text-base">
            Manage work experience and internships
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity inline-flex items-center gap-2 w-fit"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Experience
        </button>
      </motion.div>

      {loading ? (
        <TimelineSkeleton />
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-24"
        >
          <span className="material-symbols-outlined text-text-muted text-5xl mb-4 block">
            business_center
          </span>
          <p className="font-body text-text-muted text-lg mb-2">
            No experience entries yet
          </p>
          <p className="font-body text-text-muted text-sm">
            Add internships, jobs, or leadership roles.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Vertical timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border hidden sm:block" />

          <div className="space-y-8 sm:space-y-12">
            {items.map((item) => {
              const badge = TYPE_BADGE[item.type];

              return (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  className="relative pl-14 sm:pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center z-10">
                    <span
                      className={`material-symbols-outlined text-lg ${badge.text}`}
                    >
                      {TYPE_ICON[item.type]}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 hover:border-primary/20 transition-colors group">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="font-body text-sm text-text-muted mt-0.5">
                          {item.company}
                          {item.location ? ` · ${item.location}` : ""}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold ${badge.bg} ${badge.text} w-fit h-fit`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {TYPE_ICON[item.type]}
                        </span>
                        {badge.label}
                      </span>
                    </div>

                    <p className="font-mono text-xs text-text-muted mb-4">
                      {item.startDate} — {item.endDate}
                    </p>

                    {item.description.length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {item.description.map((bullet, j) => (
                          <li
                            key={j}
                            className="font-body text-sm text-foreground/80 pl-4 relative before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/40"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <button
                        onClick={() => openEditModal(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          edit
                        </span>
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteDialog(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[9997] flex items-start justify-center pt-[10vh] p-4 overflow-y-auto">
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
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {editingItem ? "Edit Experience" : "Add Experience"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="Software Engineering Intern"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-text-muted mb-1.5">
                      Company
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, company: e.target.value }))
                      }
                      placeholder="Google"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-text-muted mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, location: e.target.value }))
                      }
                      placeholder="New York, NY"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-text-muted mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={form.startDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, startDate: e.target.value }))
                      }
                      placeholder="June 2025"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-text-muted mb-1.5">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={form.endDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, endDate: e.target.value }))
                      }
                      placeholder="Present"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1.5">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        type: e.target.value as ExperienceItem["type"],
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  >
                    <option value="internship">Internship</option>
                    <option value="leadership">Leadership</option>
                    <option value="job">Job</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1.5">
                    Description (one bullet per line)
                  </label>
                  <textarea
                    value={descRaw}
                    onChange={(e) => setDescRaw(e.target.value)}
                    rows={5}
                    placeholder="Built REST APIs using Node.js&#10;Improved test coverage by 40%"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 resize-y"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center gap-2"
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
                  {editingItem ? "Save Changes" : "Add Experience"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Experience"
        message={`Are you sure you want to delete "${deleteDialog.item?.title}" at ${deleteDialog.item?.company}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteDialog({ open: false, item: null, loading: false })
        }
        loading={deleteDialog.loading}
      />
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-8 sm:space-y-12 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="relative pl-14 sm:pl-16">
          <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-border" />
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex gap-2">
              <div className="w-40 h-5 bg-border rounded" />
              <div className="w-16 h-4 bg-border rounded" />
            </div>
            <div className="w-48 h-3.5 bg-border rounded" />
            <div className="w-32 h-3 bg-border rounded" />
            <div className="space-y-2">
              <div className="w-full h-3 bg-border rounded" />
              <div className="w-3/4 h-3 bg-border rounded" />
              <div className="w-1/2 h-3 bg-border rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
