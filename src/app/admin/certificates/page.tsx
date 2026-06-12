"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface CertificateItem {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  pdf?: string;
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

export default function AdminCertificatesPage() {
  const { showToast } = useToast();

  const [items, setItems] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificateItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<CertificateItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formIssuer, setFormIssuer] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formPdfUrl, setFormPdfUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/certificates");
      if (res.ok) {
        const json: CertificateItem[] = await res.json();
        setItems(json);
      }
    } catch {
      showToast("Failed to load certificates", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formTitle.trim() || !formIssuer.trim() || !formDate.trim() || !formImageUrl) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setSaving(true);
    try {
      const body = {
        title: formTitle.trim(),
        issuer: formIssuer.trim(),
        date: formDate.trim(),
        image: formImageUrl,
        pdf: formPdfUrl || undefined,
      };

      if (editingItem) {
        const res = await fetch(`/api/certificates/${editingItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        showToast("Certificate updated", "success");
      } else {
        const res = await fetch("/api/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        showToast("Certificate created", "success");
      }

      closeModal();
      fetchItems();
    } catch {
      showToast("Failed to save certificate", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/certificates/${deleteItem._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      showToast("Certificate deleted", "success");
      setDeleteItem(null);
      fetchItems();
    } catch {
      showToast("Failed to delete certificate", "error");
    } finally {
      setDeleting(false);
    }
  }

  async function handleFileUpload(
    file: File,
    type: "image" | "pdf"
  ): Promise<string | null> {
    const setter = type === "image" ? setUploadingImage : setUploadingPdf;
    setter(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.url as string;
    } catch {
      showToast(`Failed to upload ${type}`, "error");
      return null;
    } finally {
      setter(false);
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setFormTitle("");
    setFormIssuer("");
    setFormDate("");
    setFormImageUrl("");
    setFormPdfUrl("");
    setModalOpen(true);
  }

  function openEditModal(item: CertificateItem) {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormIssuer(item.issuer);
    setFormDate(item.date);
    setFormImageUrl(item.image);
    setFormPdfUrl(item.pdf || "");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingItem(null);
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground ink-shadow-sm">
              Certificates
            </h1>
            <p className="font-body text-text-muted mt-1 text-sm sm:text-base">
              Manage your credentials and certifications
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity self-start"
          >
            <span className="material-symbols-outlined text-[18px] align-middle mr-1.5">
              add
            </span>
            Add Certificate
          </button>
        </motion.div>

        {loading ? (
          <SkeletonGrid />
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-primary text-3xl">
                workspace_premium
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
              No certificates yet
            </h3>
            <p className="font-body text-sm text-text-muted mb-6">
              Add your first certificate to get started
            </p>
            <button
              onClick={openCreateModal}
              className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Add Certificate
            </button>
          </motion.div>
        ) : (
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
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/30 transition-colors"
              >
                {/* Image Preview */}
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-base font-semibold text-foreground truncate">
                        {item.title}
                      </h3>
                      <p className="font-body text-sm text-text-muted mt-0.5">
                        {item.issuer}
                      </p>
                      <p className="font-mono text-xs text-text-muted mt-1.5">
                        {item.date}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <a
                      href={item.pdf || item.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        visibility
                      </span>
                      View
                    </a>
                    <button
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        edit
                      </span>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteItem(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold px-3 py-1.5 hover:bg-red-500/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
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
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[9997] flex items-start justify-center p-4 pt-[8vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {editingItem ? "Edit Certificate" : "Add Certificate"}
                </h2>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label
                    htmlFor="cert-title"
                    className="block font-body text-sm font-medium text-foreground mb-1.5"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cert-title"
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. AWS Solutions Architect"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                {/* Issuer */}
                <div>
                  <label
                    htmlFor="cert-issuer"
                    className="block font-body text-sm font-medium text-foreground mb-1.5"
                  >
                    Issuer <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cert-issuer"
                    type="text"
                    value={formIssuer}
                    onChange={(e) => setFormIssuer(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="cert-date"
                    className="block font-body text-sm font-medium text-foreground mb-1.5"
                  >
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cert-date"
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="e.g. June 2024"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                    Preview Image <span className="text-red-500">*</span>
                  </label>
                  {formImageUrl && (
                    <div className="relative mb-3 h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setFormImageUrl("")}
                        className="absolute top-2 right-2 w-6 h-6 rounded-md bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-text-muted cursor-pointer hover:border-primary/50 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">
                      {uploadingImage ? "hourglass_top" : "upload_file"}
                    </span>
                    <span className="truncate">
                      {uploadingImage
                        ? "Uploading..."
                        : formImageUrl
                        ? "Change image"
                        : "Upload image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await handleFileUpload(file, "image");
                        if (url) setFormImageUrl(url);
                      }}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                    PDF Document <span className="text-text-muted font-normal">(optional)</span>
                  </label>
                  {formPdfUrl && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs text-foreground">
                      <span className="material-symbols-outlined text-[16px] text-red-500">
                        picture_as_pdf
                      </span>
                      <span className="truncate flex-1">{formPdfUrl}</span>
                      <button
                        onClick={() => setFormPdfUrl("")}
                        className="shrink-0 text-text-muted hover:text-foreground transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-text-muted cursor-pointer hover:border-primary/50 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">
                      {uploadingPdf ? "hourglass_top" : "upload_file"}
                    </span>
                    <span className="truncate">
                      {uploadingPdf
                        ? "Uploading..."
                        : formPdfUrl
                        ? "Change PDF"
                        : "Upload PDF"}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await handleFileUpload(file, "pdf");
                        if (url) setFormPdfUrl(url);
                      }}
                      className="hidden"
                      disabled={uploadingPdf}
                    />
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || uploadingImage || uploadingPdf}
                  className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
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
                  ) : editingItem ? (
                    "Save Changes"
                  ) : (
                    "Create Certificate"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        title="Delete Certificate"
        message={
          deleteItem
            ? `Are you sure you want to delete "${deleteItem.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
        loading={deleting}
      />
    </div>
  );
}

/* ---- Skeleton loader ---- */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="h-48 bg-slate-200 dark:bg-slate-800" />
          <div className="p-5 space-y-3">
            <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-1/3 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="flex gap-2 pt-4 border-t border-border">
              <div className="w-16 h-7 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="w-16 h-7 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="w-16 h-7 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
