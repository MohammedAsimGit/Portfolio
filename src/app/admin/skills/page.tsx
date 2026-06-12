"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
}

const CATEGORIES = [
  "Programming Languages",
  "Frontend Development",
  "Backend Development",
  "Database Technologies",
  "AI & Machine Learning",
  "Development Tools",
] as const;

const CATEGORY_ICON_MAP: Record<string, string> = {
  "Programming Languages": "code",
  "Frontend Development": "palette",
  "Backend Development": "dns",
  "Database Technologies": "storage",
  "AI & Machine Learning": "neurology",
  "Development Tools": "build",
};

const CATEGORY_BG_MAP: Record<string, string> = {
  "Programming Languages": "bg-primary/10 text-primary",
  "Frontend Development": "bg-secondary/10 text-secondary",
  "Backend Development": "bg-emerald-500/10 text-emerald-400",
  "Database Technologies": "bg-amber-500/10 text-amber-400",
  "AI & Machine Learning": "bg-purple-500/10 text-purple-400",
  "Development Tools": "bg-rose-500/10 text-rose-400",
};

interface DeleteState {
  _id: string;
  name: string;
}

interface FormData {
  name: string;
  category: string;
  level: number;
}

const emptyForm: FormData = {
  name: "",
  category: "Programming Languages",
  level: 50,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function AdminSkillsPage() {
  const { showToast } = useToast();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<DeleteState | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setLoading(true);
    try {
      const res = await fetch("/api/skills");
      if (res.ok) {
        const data: Skill[] = await res.json();
        setSkills(data);
      }
    } catch {
      // silently fail — skeleton stays
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(skill: Skill) {
    setEditingId(skill._id);
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setSaving(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/skills/${editingId}` : "/api/skills";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(
          editingId ? "Skill updated successfully" : "Skill created successfully",
          "success"
        );
        closeModal();
        fetchSkills();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to save skill", "error");
      }
    } catch {
      showToast("Network error — please try again", "error");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteDialog(skill: Skill) {
    setDeleteDialog({ _id: skill._id, name: skill.name });
  }

  async function handleDeleteConfirm() {
    if (!deleteDialog) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/skills/${deleteDialog._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`"${deleteDialog.name}" deleted`, "success");
        setDeleteDialog(null);
        fetchSkills();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to delete skill", "error");
      }
    } catch {
      showToast("Network error — please try again", "error");
    } finally {
      setDeleting(false);
    }
  }

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categoryOrder = CATEGORIES.filter((c) => grouped[c]);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10"
        >
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground ink-shadow-sm">
              Skills
            </h1>
            <p className="font-body text-text-muted mt-1 text-sm">
              Manage your technical skills and proficiency levels
            </p>
          </div>
          <button onClick={openAddModal} className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity inline-flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="material-symbols-outlined text-lg">add</span>
            Add Skill
          </button>
        </motion.div>

        {/* Loading skeleton */}
        {loading && <SkeletonList />}

        {/* Empty state */}
        {!loading && skills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <span className="material-symbols-outlined text-text-muted text-5xl mb-4 block">
              psychology
            </span>
            <p className="font-body text-text-muted text-lg mb-2">
              No skills yet
            </p>
            <p className="font-body text-text-muted text-sm mb-6">
              Add your first skill to get started
            </p>
            <button onClick={openAddModal} className="rounded-lg bg-primary px-5 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Skill
            </button>
          </motion.div>
        )}

        {/* Grouped skill list */}
        {!loading && skills.length > 0 && (
          <div className="space-y-10">
            {categoryOrder.map((category) => (
              <motion.section
                key={category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-text-muted text-xl">
                    {CATEGORY_ICON_MAP[category] || "label"}
                  </span>
                  <h2 className="font-display text-lg font-semibold text-foreground ink-shadow-sm">
                    {category}
                  </h2>
                  <span className="font-mono text-[11px] text-text-muted bg-card border border-border rounded-full px-2.5 py-0.5">
                    {grouped[category].length}
                  </span>
                </div>

                {/* Skill cards */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {grouped[category].map((skill) => (
                    <motion.div
                      key={skill._id}
                      variants={cardVariants}
                      className="bg-card border border-border rounded-2xl p-5 group hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-base font-semibold text-foreground truncate">
                            {skill.name}
                          </h3>
                          <span
                            className={`inline-block mt-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                              CATEGORY_BG_MAP[skill.category] ||
                              "bg-border/50 text-text-muted"
                            }`}
                          >
                            {skill.category}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(skill)}
                            className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => openDeleteDialog(skill)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                            Proficiency
                          </span>
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              ease: [0.22, 1, 0.36, 1] as const,
                              delay: 0.1,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            ))}

            {/* Any uncategorized (fallback) */}
            {Object.keys(grouped).some(
              (c) => !CATEGORIES.includes(c as (typeof CATEGORIES)[number])
            ) && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="font-display text-lg font-semibold text-foreground ink-shadow-sm mb-4">
                  Uncategorized
                </h2>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {Object.entries(grouped)
                    .filter(
                      ([c]) =>
                        !CATEGORIES.includes(c as (typeof CATEGORIES)[number])
                    )
                    .flatMap(([, items]) => items)
                    .map((skill) => (
                      <motion.div
                        key={skill._id}
                        variants={cardVariants}
                        className="bg-card border border-border rounded-2xl p-5 group hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display text-base font-semibold text-foreground truncate">
                              {skill.name}
                            </h3>
                            <span className="inline-block mt-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider bg-border/50 text-text-muted">
                              {skill.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(skill)}
                              className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => openDeleteDialog(skill)}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                              Proficiency
                            </span>
                            <span className="font-mono text-xs font-semibold text-foreground">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-primary"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.8,
                                ease: [0.22, 1, 0.36, 1] as const,
                                delay: 0.1,
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </motion.section>
            )}
          </div>
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
              className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {editingId ? "Edit Skill" : "Add Skill"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-muted hover:text-foreground transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="skill-name"
                    className="block font-display text-sm font-semibold text-foreground mb-1.5"
                  >
                    Skill Name
                  </label>
                  <input
                    id="skill-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. TypeScript"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="skill-category"
                    className="block font-display text-sm font-semibold text-foreground mb-1.5"
                  >
                    Category
                  </label>
                  <select
                    id="skill-category"
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="skill-level"
                      className="font-display text-sm font-semibold text-foreground"
                    >
                      Proficiency Level
                    </label>
                    <span className="font-mono text-sm font-semibold text-primary bg-primary/10 rounded-lg px-2.5 py-0.5 min-w-[3rem] text-center">
                      {form.level}%
                    </span>
                  </div>
                  <input
                    id="skill-level"
                    type="range"
                    min={0}
                    max={100}
                    value={form.level}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        level: Number(e.target.value),
                      }))
                    }
                    className="w-full h-2 rounded-full bg-border appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-primary
                      [&::-webkit-slider-thumb]:shadow-md
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-110"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[10px] text-text-muted">0%</span>
                    <span className="font-mono text-[10px] text-text-muted">100%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
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
                    {editingId ? "Save Changes" : "Create Skill"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog !== null}
        title="Delete Skill"
        message={
          deleteDialog
            ? `Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
        loading={deleting}
      />
    </div>
  );
}

/* ---- Skeleton loader ---- */
function SkeletonList() {
  return (
    <div className="space-y-10 animate-pulse">
      {Array.from({ length: 3 }).map((_, gi) => (
        <div key={gi} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-border" />
            <div className="w-32 h-5 rounded bg-border" />
            <div className="w-8 h-5 rounded-full bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: gi === 0 ? 4 : gi === 1 ? 3 : 2 }).map(
              (_, ci) => (
                <div
                  key={ci}
                  className="bg-card border border-border rounded-2xl p-5 h-32"
                >
                  <div className="w-24 h-4 bg-border rounded mb-3" />
                  <div className="w-16 h-3 bg-border rounded-full mb-4" />
                  <div className="w-full h-2 rounded-full bg-border" />
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
