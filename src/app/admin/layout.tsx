"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Verify session
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [pathname, router, isLoginPage]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-spin">
            progress_activity
          </span>
          <p className="font-mono text-xs text-text-muted">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Projects", href: "/admin/projects", icon: "folder" },
    { name: "Certificates", href: "/admin/certificates", icon: "workspace_premium" },
    { name: "Skills", href: "/admin/skills", icon: "bolt" },
    { name: "Experience", href: "/admin/experience", icon: "business_center" },
    { name: "Achievements", href: "/admin/achievements", icon: "military_tech" },
    { name: "Resume", href: "/admin/resume", icon: "description" },
    { name: "Messages", href: "/admin/messages", icon: "mail" },
    { name: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col py-8 px-4 z-40">
        <div className="mb-4 px-4">
          <h1 className="font-display font-extrabold text-xl text-primary tracking-tight">Admin Console</h1>
          <p className="font-mono text-[10px] text-text-muted mt-1 uppercase tracking-widest">Mohammed Asim</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mt-3 font-body text-xs text-text-muted hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Home
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? "bg-primary text-white ink-shadow-sm" 
                    : "text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-border space-y-4">
          {/* Theme switcher */}
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-text-muted hover:text-foreground rounded-lg"
          >
            <span className="material-symbols-outlined text-lg">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sticky Header */}
      <header className="md:hidden sticky top-0 left-0 w-full bg-card border-b border-border z-50 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-display font-extrabold text-primary text-base">Admin Panel</h1>
          <p className="font-mono text-[8px] text-text-muted uppercase">Mohammed Asim</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined text-primary text-sm font-bold">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-full border border-border">
            <span className="material-symbols-outlined text-primary">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-[65px] left-0 w-full bg-card border-b border-border p-6 flex flex-col space-y-2 z-40 shadow-lg"
          >
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold ${
                    isActive ? "bg-primary text-white" : "text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="flex items-center gap-3 px-4 py-3.5 text-red-500 font-bold rounded-xl text-sm"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Pane */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 max-w-6xl w-full">
        {children}
      </main>

    </div>
  );
}
