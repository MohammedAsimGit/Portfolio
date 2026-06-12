'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DailyVisitor {
  date: string;
  count: number;
}

interface RecentActivityItem {
  type: string;
  title: string;
  time: string;
}

interface AnalyticsData {
  totalProjects: number;
  totalCertificates: number;
  totalSkills: number;
  totalMessages: number;
  totalVisitors: number;
  dailyVisitors: DailyVisitor[];
  recentActivity: RecentActivityItem[];
}

const ACTIVITY_ICON_MAP: Record<string, string> = {
  project: 'code',
  certificate: 'workspace_premium',
  skill: 'psychology',
  message: 'mail',
  visitor: 'person',
};

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

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const json: AnalyticsData = await res.json();
          setData(json);
        }
      } catch {
        // silently fail — dashboard will show skeleton
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const stats = data
    ? [
        {
          label: 'Total Projects',
          value: data.totalProjects,
          icon: 'folder_special',
          color: 'text-primary',
          bg: 'bg-primary/10',
        },
        {
          label: 'Total Certificates',
          value: data.totalCertificates,
          icon: 'workspace_premium',
          color: 'text-secondary',
          bg: 'bg-secondary/10',
        },
        {
          label: 'Total Skills',
          value: data.totalSkills,
          icon: 'psychology',
          color: 'text-primary',
          bg: 'bg-primary/10',
        },
        {
          label: 'Total Messages',
          value: data.totalMessages,
          icon: 'mail',
          color: 'text-secondary',
          bg: 'bg-secondary/10',
        },
      ]
    : [];

  const maxDailyCount = data?.dailyVisitors
    ? Math.max(...data.dailyVisitors.map((d) => d.count), 1)
    : 1;

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
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground ink-shadow-sm">
            Welcome back
          </h1>
          <p className="font-body text-text-muted mt-1 text-sm sm:text-base">
            {formatDate(new Date())}
          </p>
        </motion.div>

        {loading ? (
          <SkeletonGrid />
        ) : data ? (
          <>
            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={cardVariants}
                  className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex items-start gap-4 group hover:border-primary/30 transition-colors"
                >
                  <div
                    className={`${stat.bg} rounded-xl w-12 h-12 flex items-center justify-center shrink-0`}
                  >
                    <span
                      className={`material-symbols-outlined ${stat.color} text-[22px]`}
                    >
                      {stat.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-bold text-foreground leading-none mb-1">
                      {stat.value}
                    </p>
                    <p className="font-body text-xs text-text-muted">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Chart + Activity Row */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {/* Visitor Analytics Chart */}
              <motion.div
                variants={cardVariants}
                className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground ink-shadow-sm">
                      Visitor Analytics
                    </h2>
                    <p className="font-body text-xs text-text-muted mt-0.5">
                      Daily visitors over the last period
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-primary/10 rounded-lg px-3 py-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      trending_up
                    </span>
                    <span className="font-mono text-xs font-semibold text-primary">
                      {data.totalVisitors}
                    </span>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="flex items-end gap-1.5 sm:gap-2 h-40 sm:h-48">
                  {data.dailyVisitors.map((day, i) => {
                    const heightPct = (day.count / maxDailyCount) * 100;
                    return (
                      <motion.div
                        key={day.date}
                        className="flex-1 flex flex-col items-center gap-1.5 group"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{
                          delay: 0.4 + i * 0.04,
                          duration: 0.5,
                           ease: [0.22, 1, 0.36, 1] as const,
                        }}
                        style={{ transformOrigin: 'bottom' }}
                      >
                        {/* Tooltip */}
                        <span className="font-mono text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.count}
                        </span>
                        {/* Bar */}
                        <div
                          className="w-full rounded-t-md bg-primary/20 group-hover:bg-primary/40 transition-colors relative overflow-hidden"
                          style={{ height: `${Math.max(heightPct, 4)}%` }}
                        >
                          <div
                            className="absolute inset-x-0 bottom-0 bg-primary rounded-t-md transition-all"
                            style={{ height: `${Math.min(heightPct, 100)}%` }}
                          />
                        </div>
                        {/* Label */}
                        <span className="font-mono text-[9px] sm:text-[10px] text-text-muted truncate w-full text-center">
                          {day.date.slice(-2)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                variants={cardVariants}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6"
              >
                <h2 className="font-display text-lg font-semibold text-foreground ink-shadow-sm mb-5">
                  Recent Activity
                </h2>

                {data.recentActivity.length === 0 ? (
                  <p className="font-body text-sm text-text-muted">
                    No recent activity
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {data.recentActivity.map((item, i) => (
                      <motion.li
                        key={`${item.type}-${item.title}-${i}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.6 + i * 0.06,
                          duration: 0.4,
                        }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-[16px]">
                            {ACTIVITY_ICON_MAP[item.type] || 'info'}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-body text-sm text-foreground truncate">
                            {item.title}
                          </p>
                          <p className="font-mono text-[11px] text-text-muted mt-0.5">
                            {item.time}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-text-muted text-4xl mb-3 block">
              cloud_off
            </span>
            <p className="font-body text-text-muted">
              Failed to load analytics data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Skeleton loader ---- */
function SkeletonGrid() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl p-6 h-24"
          >
            <div className="w-12 h-4 bg-border rounded mb-3" />
            <div className="w-20 h-6 bg-border rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 h-64" />
        <div className="bg-card border border-border rounded-2xl p-6 h-64" />
      </div>
    </div>
  );
}
