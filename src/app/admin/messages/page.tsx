"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface MessageItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeDate(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

function SkeletonList() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-border mt-1.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="w-24 h-4 bg-border rounded mb-2" />
            <div className="w-40 h-3 bg-border rounded mb-1.5" />
            <div className="w-full h-3 bg-border rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <span className="material-symbols-outlined text-text-muted text-5xl mb-4 block">
        inbox
      </span>
      <p className="font-display text-lg font-semibold text-foreground mb-1">
        No messages received yet
      </p>
      <p className="font-body text-sm text-text-muted">
        Contact form submissions will appear here.
      </p>
    </div>
  );
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    target: MessageItem | null;
  }>({ open: false, target: null });
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/messages");
        if (res.ok) {
          const json: MessageItem[] = await res.json();
          setMessages(json);
        } else {
          showToast("Failed to load messages", "error");
        }
      } catch {
        showToast("Failed to load messages", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [showToast]);

  const selectedMessage = messages.find((m) => m._id === selectedId) ?? null;

  function handleSelect(id: string) {
    setSelectedId(id);
    const msg = messages.find((m) => m._id === id);
    if (msg && !msg.isRead) {
      toggleRead(msg, true);
    }
  }

  function handleBack() {
    setSelectedId(null);
  }

  async function toggleRead(msg: MessageItem, forceRead?: boolean) {
    const nextRead = forceRead ?? !msg.isRead;
    setToggling(msg._id);
    try {
      const res = await fetch(`/api/messages/${msg._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: nextRead }),
      });
      if (res.ok) {
        const updated: MessageItem = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? updated : m))
        );
      } else {
        showToast("Failed to update message", "error");
      }
    } catch {
      showToast("Failed to update message", "error");
    } finally {
      setToggling(null);
    }
  }

  function confirmDelete(msg: MessageItem) {
    setDeleteDialog({ open: true, target: msg });
  }

  async function handleDelete() {
    const target = deleteDialog.target;
    if (!target) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/messages/${target._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== target._id));
        if (selectedId === target._id) setSelectedId(null);
        showToast("Message deleted", "success");
      } else {
        showToast("Failed to delete message", "error");
      }
    } catch {
      showToast("Failed to delete message", "error");
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, target: null });
    }
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground ink-shadow-sm">
              Messages
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-primary/10 rounded-lg px-3 py-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">
                  mark_email_unread
                </span>
                <span className="font-mono text-xs font-semibold text-primary">
                  {unreadCount}
                </span>
              </span>
            )}
          </div>
          <p className="font-body text-text-muted mt-1 text-sm sm:text-base">
            Manage contact form submissions
          </p>
        </motion.div>

        {loading ? (
          <SkeletonList />
        ) : messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Message List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`${
                selectedMessage && selectedId ? "hidden lg:block lg:col-span-5" : "lg:col-span-5"
              }`}
            >
              <ul className="space-y-3">
                {messages.map((msg) => (
                  <motion.li key={msg._id} variants={itemVariants}>
                    <button
                      onClick={() => handleSelect(msg._id)}
                      className={`w-full text-left bg-card border border-border rounded-2xl p-4 flex items-start gap-3 transition-colors hover:border-primary/30 group ${
                        selectedId === msg._id
                          ? "border-primary/50 ring-1 ring-primary/20"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                          msg.isRead ? "bg-border" : "bg-primary"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-body text-sm font-semibold text-foreground truncate">
                            {msg.name}
                          </span>
                          <span className="font-mono text-[11px] text-text-muted shrink-0 hidden sm:inline">
                            {formatRelativeDate(msg.createdAt)}
                          </span>
                        </div>
                        <span className="font-body text-xs font-medium text-primary truncate block mb-1">
                          {msg.subject}
                        </span>
                        <p className="font-body text-xs text-text-muted truncate">
                          {msg.message}
                        </p>
                      </div>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Message Detail */}
            <AnimatePresence mode="wait">
              {selectedMessage && (
                <motion.div
                  key={selectedMessage._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                  className="lg:col-span-7"
                >
                  {/* Back button - mobile only */}
                  <button
                    onClick={handleBack}
                    className="lg:hidden mb-4 flex items-center gap-1.5 font-body text-sm text-text-muted hover:text-foreground transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_back
                    </span>
                    Back to messages
                  </button>

                  <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="min-w-0">
                        <h2 className="font-display text-lg font-semibold text-foreground truncate">
                          {selectedMessage.subject}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-body text-sm font-medium text-foreground">
                            {selectedMessage.name}
                          </span>
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className="font-mono text-xs text-primary hover:underline truncate"
                          >
                            {selectedMessage.email}
                          </a>
                        </div>
                        <p className="font-mono text-[11px] text-text-muted mt-1.5">
                          {formatDate(selectedMessage.createdAt)}
                        </p>
                      </div>

                      {/* Status badge */}
                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold ${
                          selectedMessage.isRead
                            ? "bg-border/40 text-text-muted"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {selectedMessage.isRead
                            ? "drafts"
                            : "mark_email_unread"}
                        </span>
                        {selectedMessage.isRead ? "Read" : "Unread"}
                      </span>
                    </div>

                    {/* Message body */}
                    <div className="bg-background rounded-xl p-4 sm:p-5 mb-5">
                      <p className="font-body text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {selectedMessage.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 border-t border-border pt-4">
                      <button
                        onClick={() => toggleRead(selectedMessage)}
                        disabled={toggling === selectedMessage._id}
                        className="rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
                      >
                        {toggling === selectedMessage._id ? (
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
                        ) : (
                          <span className="material-symbols-outlined text-[16px]">
                            {selectedMessage.isRead
                              ? "mark_email_unread"
                              : "drafts"}
                          </span>
                        )}
                        {selectedMessage.isRead
                          ? "Mark as unread"
                          : "Mark as read"}
                      </button>

                      <button
                        onClick={() => confirmDelete(selectedMessage)}
                        className="rounded-lg border border-border px-4 py-2.5 font-display text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          delete
                        </span>
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty selection state on desktop when no message selected */}
            {!selectedMessage && messages.length > 0 && (
              <div className="hidden lg:flex lg:col-span-7 items-center justify-center">
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-text-muted text-5xl mb-4 block">
                    mail
                  </span>
                  <p className="font-display text-lg font-semibold text-foreground mb-1">
                    Select a message
                  </p>
                  <p className="font-body text-sm text-text-muted">
                    Choose a message from the list to view its details.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete message"
        message={`Are you sure you want to delete the message from ${deleteDialog.target?.name ?? "this sender"}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, target: null })}
        loading={deleting}
      />
    </div>
  );
}
