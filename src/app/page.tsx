"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Preloader from "@/components/Preloader";
import { useTheme } from "@/components/ThemeProvider";
import {
  ProjectData,
  SkillData,
  CertificateData,
  ExperienceData,
  AchievementData,
  initialProjects,
  initialSkills,
  initialCertificates,
  initialExperiences,
  initialAchievements,
} from "@/data/mockData";

export default function PortfolioHome() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"projects" | "experience" | "certificates" | "contact">("projects");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // DB Data states (fallback to initial mock data)
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [skills, setSkills] = useState<SkillData[]>(initialSkills);
  const [certificates, setCertificates] = useState<CertificateData[]>(initialCertificates);
  const [experiences, setExperiences] = useState<ExperienceData[]>(initialExperiences);
  const [achievements, setAchievements] = useState<AchievementData[]>(initialAchievements);

  const titles = [
    "Software Engineer",
    "Full Stack Developer",
    "AI Enthusiast",
    "Technology Innovator",
  ];

  useEffect(() => {
    // Rotate titles every 3 seconds
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 1. Trigger database seed endpoint just in case it's a fresh database
    fetch("/api/seed").catch((err) => console.log("Seeding check failed:", err));

    // 2. Fetch live data from API routes
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {});

    fetch("/api/skills")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setSkills(data);
      })
      .catch(() => {});

    fetch("/api/certificates")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCertificates(data);
      })
      .catch(() => {});

    fetch("/api/experience")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setExperiences(data);
      })
      .catch(() => {});

    fetch("/api/achievements")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAchievements(data);
      })
      .catch(() => {});

    // 3. Track page visit analytics
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "portfolio" }),
    }).catch(() => {});
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormError("All fields are required.");
      return;
    }
    setFormLoading(true);
    setFormError("");
    setFormSuccess(false);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setFormSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormError(data.error || "Failed to send message.");
      }
    } catch {
      setFormError("A network error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Floating Stack elements
  const techStack = [
    { name: "React", icon: "code", top: "10%", left: "12%", delay: 0 },
    { name: "Next.js", icon: "developer_board", top: "22%", left: "85%", delay: 0.4 },
    { name: "MongoDB", icon: "database", top: "60%", left: "82%", delay: 0.8 },
    { name: "Node.js", icon: "terminal", top: "72%", left: "15%", delay: 0.2 },
    { name: "TypeScript", icon: "data_object", top: "45%", left: "7%", delay: 0.6 },
    { name: "JavaScript", icon: "javascript", top: "80%", left: "75%", delay: 1 },
    { name: "GitHub", icon: "cloud", top: "5%", left: "70%", delay: 1.2 },
  ];

  return (
    <>
      <Preloader />
      
      {/* Sticky Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-display text-2xl font-black text-primary tracking-tighter">
            MA.OS
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              onClick={() => setActiveTab("projects")} 
              href="#projects" 
              className={`font-body font-semibold text-sm cursor-pointer transition-colors duration-200 ${
                activeTab === "projects" ? "text-primary border-b-2 border-primary pb-1" : "text-text-muted hover:text-primary"
              }`}
            >
              Projects
            </a>
            <a 
              onClick={() => setActiveTab("experience")} 
              href="#experience" 
              className={`font-body font-semibold text-sm cursor-pointer transition-colors duration-200 ${
                activeTab === "experience" ? "text-primary border-b-2 border-primary pb-1" : "text-text-muted hover:text-primary"
              }`}
            >
              Experience
            </a>
            <a 
              onClick={() => setActiveTab("certificates")} 
              href="#certificates" 
              className={`font-body font-semibold text-sm cursor-pointer transition-colors duration-200 ${
                activeTab === "certificates" ? "text-primary border-b-2 border-primary pb-1" : "text-text-muted hover:text-primary"
              }`}
            >
              Certificates
            </a>
            <a 
              onClick={() => setActiveTab("contact")} 
              href="#contact" 
              className={`font-body font-semibold text-sm cursor-pointer transition-colors duration-200 ${
                activeTab === "contact" ? "text-primary border-b-2 border-primary pb-1" : "text-text-muted hover:text-primary"
              }`}
            >
              Contact
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-sm font-bold text-primary">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>

            <a 
              href="#contact" 
              className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold ink-shadow-sm hover:brightness-110 transition-all active:scale-95"
            >
              Hire Me
            </a>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 rounded-full border border-border"
            >
              <span className="material-symbols-outlined text-primary font-bold">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[70px] left-0 w-full z-40 bg-background border-b border-border flex flex-col p-6 space-y-4 md:hidden shadow-lg"
          >
            <a 
              href="#projects" 
              onClick={() => { setActiveTab("projects"); setMobileMenuOpen(false); }} 
              className="text-lg font-semibold text-foreground"
            >
              Projects
            </a>
            <a 
              href="#experience" 
              onClick={() => { setActiveTab("experience"); setMobileMenuOpen(false); }} 
              className="text-lg font-semibold text-foreground"
            >
              Experience
            </a>
            <a 
              href="#certificates" 
              onClick={() => { setActiveTab("certificates"); setMobileMenuOpen(false); }} 
              className="text-lg font-semibold text-foreground"
            >
              Certificates
            </a>
            <a 
              href="#contact" 
              onClick={() => { setActiveTab("contact"); setMobileMenuOpen(false); }} 
              className="text-lg font-semibold text-foreground"
            >
              Contact
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative overflow-x-hidden pt-24">
        
        {/* Animated Gradient Mesh & Floating Background Effects */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-primary/10 blur-[130px] rounded-full" />
          <div className="absolute top-[50%] left-[-5%] w-[350px] h-[350px] bg-secondary/15 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-primary/8 blur-[150px] rounded-full" />
        </div>

        {/* Hero Section */}
        <header className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
                AVAILABLE FOR NEW OPPORTUNITIES
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-foreground leading-[1.15]">
              Hello, I&apos;m <br />
              {/* Character by character name reveal */}
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-primary block font-black mt-2"
              >
                Mohammed Asim
              </motion.span>
            </h1>

            <div className="h-10 flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={titleIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="text-2xl font-display font-semibold text-secondary"
                >
                  {titles[titleIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="font-body text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
              Computer Science Engineering Student passionate about Full Stack Development, Artificial Intelligence, Modern Web Technologies, and building impactful digital solutions.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="#projects" 
                className="px-8 py-4 bg-primary text-white rounded-xl font-semibold text-sm ink-shadow-lg flex items-center gap-2 hover:-translate-y-0.5 hover:brightness-110 active:scale-95 transition-all"
              >
                View Projects
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
              <a 
                href="#contact" 
                className="px-8 py-4 border border-border text-foreground hover:bg-card bg-background/50 rounded-xl font-semibold text-sm hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* Interactive Tech Stack & Portait Column */}
          <div className="md:col-span-5 relative mt-8 md:mt-0 flex justify-center items-center h-[450px]">
            {/* Main Portrait Card */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative w-72 h-72 rounded-3xl border border-border/80 bg-card p-4 ink-shadow-lg z-10 overflow-hidden"
            >
              <div className="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                <img 
                  alt="Mohammed Asim portrait" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVZFFYoi_jQ_CjkEX0a1a5l7wMTvcA5SB-9DHxqdC9Ybp7b4KHaAuDoL3xLJ_JHKCtFvxGKIwEXCyesbVlsl-W4uBvaPeJQ5K4die0S6EYLZJDr7V3eT_kSQi93GUhCvp3ggsEDVjoq6QQznrnktoPdNK_WjVRxyeChV00FBzsXhi18U3dcIzCOFOuSojJjcuFfF1nmeW_qfSQHC78vP4ZOQ0E-z9gjrZbGfpxz1Jdg759ucrIZmVtdl1yjleLTcyfHaO7t5DV37zg"
                />
              </div>
            </motion.div>

            {/* Floating Tech Stack Icons */}
            {techStack.map((tech) => (
              <motion.div
                key={tech.name}
                style={{ top: tech.top, left: tech.left }}
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  delay: tech.delay,
                  ease: "easeInOut",
                }}
                className="absolute z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/60 backdrop-blur-md border border-border/70 text-xs font-mono font-bold text-foreground ink-shadow-sm pointer-events-none"
              >
                <span className="material-symbols-outlined text-primary text-sm font-bold">
                  {tech.icon}
                </span>
                {tech.name}
              </motion.div>
            ))}

            {/* Circular background decorator */}
            <div className="absolute w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />
          </div>
        </header>

        {/* About Section */}
        <section className="py-24 bg-card border-y border-border/40">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-display font-extrabold text-foreground">
                Strategic Mindset. <br />
                Flawless Engineering.
              </h2>
              <p className="font-body text-base text-text-muted leading-relaxed">
                I am a passionate software engineer currently pursuing my Computer Science Engineering degree. I specialize in bootstrapping clean, functional, full-stack systems that merge high performance with responsive visual structures.
              </p>
              <p className="font-body text-base text-text-muted leading-relaxed">
                From micro-interactions using Framer Motion to designing robust relational and non-relational database architectures with Mongoose and MongoDB Atlas, I build secure digital experiences that look expensive and perform optimally.
              </p>
              
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/80">
                <div>
                  <h4 className="text-3xl font-black text-primary font-display">20+</h4>
                  <p className="text-[10px] tracking-widest font-bold font-mono text-secondary uppercase mt-1">Completed Devs</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-primary font-display">12+</h4>
                  <p className="text-[10px] tracking-widest font-bold font-mono text-secondary uppercase mt-1">Technologies</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-primary font-display">5+</h4>
                  <p className="text-[10px] tracking-widest font-bold font-mono text-secondary uppercase mt-1">Certifications</p>
                </div>
              </div>
            </div>

            <div className="space-y-8 bg-background border border-border p-8 rounded-3xl ink-shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold">
                  <span className="material-symbols-outlined">architecture</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-1">Architecture Objective</h3>
                  <p className="text-sm text-text-muted">Creating scalable server routes, clean REST API endpoints, and modular reusable React components for production-grade platforms.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-secondary/10 rounded-xl text-secondary font-bold">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-1">AI Integration Focus</h3>
                  <p className="text-sm text-text-muted">Applying machine learning principles, dynamic LLM integrations, and optimized prompts to deliver intelligent systems.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-display font-extrabold text-foreground">Core Competencies</h2>
            <p className="text-text-muted text-sm font-body">Structured categories showing my comfort level with frontend, backend, databases, and development toolchains.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(["Programming Languages", "Frontend Development", "Backend Development", "Database Technologies", "AI & Machine Learning", "Development Tools"] as const).map((cat) => (
              <div key={cat} className="p-6 bg-card border border-border rounded-2xl ink-shadow-sm space-y-4">
                <h3 className="font-display font-bold text-base text-primary tracking-tight">{cat}</h3>
                <div className="space-y-4">
                  {skills
                    .filter((s) => s.category === cat)
                    .map((skill) => (
                      <div key={skill.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono font-bold text-foreground">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 bg-card border-t border-border/40">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-extrabold text-foreground">Featured Projects</h2>
                <p className="text-text-muted text-sm font-body">Detailed case logs of responsive apps built with MongoDB Atlas and Next.js.</p>
              </div>
              <a 
                href="https://github.com/mohammedasim"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-primary text-xs font-bold font-mono tracking-widest uppercase hover:opacity-85"
              >
                VIEW FULL GITHUB PORTFOLIO
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {projects.map((project, idx) => {
                const isLarge = idx === 0 || idx === 3;
                return (
                  <motion.div
                    key={project.title}
                    viewport={{ once: true }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    className={`bg-background border border-border/80 rounded-3xl overflow-hidden hover:border-primary/50 transition-colors ink-shadow-sm cursor-pointer group ${
                      isLarge ? "md:col-span-8" : "md:col-span-4"
                    }`}
                  >
                    <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                      <img 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={project.bannerImage}
                      />
                      {project.isFeatured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-white text-[10px] font-bold font-mono tracking-wider py-1 px-3 rounded-full ink-shadow-sm uppercase">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-text-muted mt-1 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">
                          north_east
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="bg-card text-text-muted font-mono font-semibold text-[10px] px-2.5 py-1 rounded-md border border-border">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-border/80">
                        {project.githubLink && (
                          <a 
                            href={project.githubLink}
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs font-mono font-bold text-foreground hover:text-primary flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm font-bold">code</span> Code
                          </a>
                        )}
                        {project.liveLink && (
                          <a 
                            href={project.liveLink}
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs font-mono font-bold text-foreground hover:text-primary flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm font-bold">visibility</span> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Certificates Showcase Section */}
        <section id="certificates" className="py-24 max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-display font-extrabold text-foreground">Certifications Showcase</h2>
            <p className="text-text-muted text-sm font-body">Verified credentials certifying my technical capabilities in web and database environments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certificates.map((cert) => (
              <div 
                key={cert.title} 
                onClick={() => setSelectedCert(cert)}
                className="bg-card border border-border/80 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 hover:border-primary/50 transition-colors ink-shadow-sm cursor-pointer group"
              >
                <div className="w-full sm:w-36 aspect-video sm:aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0">
                  <img 
                    alt={cert.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={cert.image}
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-widest">{cert.issuer}</span>
                    <h3 className="font-display font-extrabold text-lg text-foreground mt-1 group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-2 font-mono">Issued: {cert.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold font-mono tracking-wider uppercase mt-4">
                    VIEW DETAILS
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certificate Modal Viewer */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-card border border-border max-w-2xl w-full rounded-3xl p-6 ink-shadow-lg relative overflow-hidden"
              >
                <button 
                  onClick={() => setSelectedCert(null)} 
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-border"
                >
                  <span className="material-symbols-outlined text-foreground">close</span>
                </button>

                <h3 className="font-display font-black text-xl text-foreground mb-1">{selectedCert.title}</h3>
                <p className="text-sm text-text-muted mb-6 font-mono">Issuer: {selectedCert.issuer} | {selectedCert.date}</p>
                
                <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-border mb-6">
                  <img 
                    alt={selectedCert.title} 
                    className="w-full h-full object-cover" 
                    src={selectedCert.image} 
                  />
                </div>

                <div className="flex justify-end gap-4">
                  {selectedCert.pdf && (
                    <a 
                      href={selectedCert.pdf} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-6 py-3 border border-border text-sm font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Download PDF
                    </a>
                  )}
                  <button 
                    onClick={() => setSelectedCert(null)}
                    className="px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:brightness-110"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experience & Achievements Section */}
        <section id="experience" className="py-24 bg-card border-t border-border/40">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl font-display font-extrabold text-foreground">Experience & Achievements</h2>
              <p className="text-text-muted text-sm font-body">My professional progression, leadership activities, hackathons, and competitions.</p>
            </div>

            {/* Vertical Timeline */}
            <div className="relative border-l border-border pl-8 space-y-12 ml-4">
              {experiences.map((exp) => (
                <div key={exp.title} className="relative group">
                  {/* Timeline bullet */}
                  <span className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-primary group-hover:bg-primary transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary group-hover:bg-background" />
                  </span>
                  
                  <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase bg-primary/10 py-1 px-3 rounded-full">
                    {exp.startDate} - {exp.endDate}
                  </span>
                  
                  <h3 className="font-display font-extrabold text-lg text-foreground mt-3">
                    {exp.title} <span className="text-primary text-base font-semibold">@ {exp.company}</span>
                  </h3>
                  
                  {exp.location && (
                    <p className="text-xs text-text-muted mt-1 font-mono">{exp.location}</p>
                  )}

                  <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-text-muted font-body">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Achievements timeline insertion */}
              {achievements.map((ach) => (
                <div key={ach.title} className="relative group">
                  <span className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-secondary group-hover:bg-secondary transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary group-hover:bg-background" />
                  </span>
                  
                  <span className="text-[10px] font-mono font-bold tracking-widest text-secondary uppercase bg-secondary/10 py-1 px-3 rounded-full">
                    {ach.date}
                  </span>

                  <h3 className="font-display font-extrabold text-lg text-foreground mt-3">
                    {ach.title}
                  </h3>
                  
                  <p className="mt-2 text-sm text-text-muted leading-relaxed font-body">
                    {ach.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GitHub Analytics Section */}
        <section className="py-24 max-w-6xl mx-auto px-6">
          <div className="bg-card border border-border rounded-3xl p-8 ink-shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">GITHUB INSIGHTS</span>
              <h2 className="text-2xl font-display font-extrabold text-foreground">Open-Source Activity</h2>
              <p className="text-sm text-text-muted font-body leading-relaxed">
                I participate in active open-source contribution loops. I build custom layout modules, publish reusable hooks, and support community repositories.
              </p>
              
              <div className="flex gap-6">
                <div>
                  <h4 className="text-2xl font-black text-foreground">450+</h4>
                  <p className="text-[9px] font-mono font-bold text-text-muted uppercase tracking-wider">Contributions</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-foreground">24</h4>
                  <p className="text-[9px] font-mono font-bold text-text-muted uppercase tracking-wider">Repositories</p>
                </div>
              </div>
            </div>

            {/* Grid Mockup for GitHub Contribution Graph */}
            <div className="lg:col-span-7 bg-background border border-border p-6 rounded-2xl overflow-x-auto space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-text-muted mb-2">
                <span>Contribution Grid</span>
                <span className="text-primary font-bold">@mohammedasim</span>
              </div>
              <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-1.5 min-w-[360px]">
                {Array.from({ length: 144 }).map((_, i) => {
                  const levels = ["bg-slate-100 dark:bg-slate-800", "bg-blue-100 dark:bg-blue-950", "bg-blue-300 dark:bg-blue-800", "bg-blue-600 dark:bg-blue-500", "bg-purple-600 dark:bg-purple-500"];
                  const idx = Math.floor(Math.sin(i * 0.15) * 2 + 2);
                  const color = levels[idx] || levels[0];
                  return (
                    <div key={i} className={`aspect-square w-full rounded-sm ${color} transition-colors hover:brightness-110`} />
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-text-muted pt-2 border-t border-border/50">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="py-24 bg-card border-t border-border/40">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-display font-extrabold text-foreground">Get In Touch</h2>
              <p className="text-text-muted text-sm font-body">Have an upcoming application, design loop, or opportunity? Let&apos;s discuss it.</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6 bg-background border border-border p-8 rounded-3xl ink-shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-mono font-bold text-foreground uppercase tracking-widest">Your Name</label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-mono font-bold text-foreground uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-mono font-bold text-foreground uppercase tracking-widest">Subject</label>
                <input 
                  type="text" 
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What is this about?" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-mono font-bold text-foreground uppercase tracking-widest">Message</label>
                <textarea 
                  id="message" 
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Explain your project scope..." 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              {formError && (
                <p className="text-xs font-mono text-red-500 font-bold">{formError}</p>
              )}

              {formSuccess && (
                <p className="text-xs font-mono text-green-500 font-bold">Message sent successfully! Thank you for reaching out.</p>
              )}

              <button 
                type="submit" 
                disabled={formLoading}
                className="w-full py-4 bg-primary hover:brightness-110 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                {formLoading ? "Sending message..." : "Send Message"}
                <span className="material-symbols-outlined text-sm font-bold">send</span>
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 bg-card border-t border-border/40">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="font-display text-lg font-black text-foreground uppercase tracking-widest">MA.OS</div>
              <p className="font-body text-xs text-text-muted mt-2">© 2026 Mohammed Asim. All rights reserved.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <a href="https://github.com/mohammedasim" target="_blank" rel="noreferrer" className="text-sm font-body text-text-muted hover:text-primary transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/mohammedasim" target="_blank" rel="noreferrer" className="text-sm font-body text-text-muted hover:text-primary transition-colors">LinkedIn</a>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
