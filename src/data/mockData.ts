export interface ProjectData {
  _id?: string;
  title: string;
  description: string;
  bannerImage: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  isFeatured: boolean;
  order: number;
}

export interface CertificateData {
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  pdf: string;
}

export interface SkillData {
  _id?: string;
  name: string;
  category: "Programming Languages" | "Frontend Development" | "Backend Development" | "Database Technologies" | "AI & Machine Learning" | "Development Tools";
  level: number;
}

export interface ExperienceData {
  _id?: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  type: "internship" | "leadership" | "job";
}

export interface AchievementData {
  _id?: string;
  title: string;
  date: string;
  description: string;
  category: "hackathon" | "competition" | "achievement";
}

export const initialProjects: ProjectData[] = [
  {
    title: "Quantum Finance Platform",
    description: "Next-generation asset management with high-performance real-time data visualizers and predictive AI modeling.",
    bannerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgTBFzoyxJZEVC_yxpLBwxs7hKayRrPz0g-QdM33t46cemsW9xuIYxw2ArOLQtxpbiSWQVrHTWUuNpiMReceZRkIUk9uoxm0RReJRKHdLj8tkzlmmw7eIPKQjxyQXtw2S-y2uksibtKyvUAwhUsip__5TyLuEEupGpMxIksizN-HJjQwxIEmEoxFkEFNRIuUk4wcFlGmiktcXlaiJnI-97jJT7FncwirPts9foHiE7VmbpORIK0ZVKcn5ig36t6603byOmjXYEiT0e",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "MongoDB", "Framer Motion"],
    githubLink: "https://github.com/mohammedasim/quantum-finance",
    liveLink: "https://quantum-finance.demo",
    isFeatured: true,
    order: 1,
  },
  {
    title: "LuxeRetail Experience",
    description: "Ultra-fast headless e-commerce store utilizing modern UX paradigms and micro-animations for luxury retail.",
    bannerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuASXOt51fgrjeme3cU8BcajxwLGbNxiS8CNuIkwZfa4D_NseB8y7I_FQ5DuwD2S28r39FwnQbNcAfv44QQZOEO0VwV-uhx2TBTq9W8rNfIlbm226hVcQo98KFNAz-EWygcMS1c1UzCWMGmqZGWQ-MHvZpJkpzv9P1APApEyv4U2IOo2SiaXf-pzIQiSBJUufh7qWwCj_pRMjmgdc0UENYft8v2BCH-rNkFMGLPuRLznNZvoV9DUoJe-dWGRIotDh7U_gx5v7-65OeK1",
    techStack: ["React", "Vite", "Node.js", "Tailwind CSS", "Mongoose"],
    githubLink: "https://github.com/mohammedasim/luxeretail",
    liveLink: "https://luxeretail.demo",
    isFeatured: false,
    order: 2,
  },
  {
    title: "Nexus Project Suite",
    description: "A secure, data-rich team collaboration dashboard designed for high-end SaaS productivity.",
    bannerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqkDqGqb5UnCswwWKwKA2uAKqVnGh3pEEPpJbyQHgRsdxF2NXP1pfxLISApt746Qjt2RCBXM02BKLdfVW2Bs5oprVsGG0zU0VvVouJH4cMmaemI5_h6o2iOXTWww8fC3e_YYE9o0kps15H3i59UWcTiWN3_Lf98Zxgyex43x-G46vZGAPYzLfG1XV53V8LNOWtMMN7w4gPPXLuad5WkaS7ta9R9Q4-L_nT3suJRfLfJfuyzmxu85CxDeiG6lrhETAd0dVhpwqHdYjW",
    techStack: ["Next.js", "Express", "TypeScript", "Tailwind CSS", "MongoDB"],
    githubLink: "https://github.com/mohammedasim/nexus-suite",
    liveLink: "https://nexus-suite.demo",
    isFeatured: false,
    order: 3,
  },
  {
    title: "EduScale Portal",
    description: "Adaptive learning system using specialized AI models to calibrate content difficulty dynamically for teams.",
    bannerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrTYIM1gLTzd_JhEdFPnE9gdfh-WL1z6qQV82ATuMNuUYvUqgJDm1FjE0VFTcuT92Y5kmayLkW6Su-f42h7xiDjTV5RpsaShkS4UHsYTqnqBdzZbkzv9W4wZ2gffUS1P5ZWODPEXq7QFthaCJjEaQf4JFKMo53mOzL0t0noQwAkk7QvhyL2DiMV-bNik8lsae9k20HXI6u4Yb_tNllQsmFDvFraIKAew62QrSZsIYBE312_vG_Ir6ZmaPqIkXaAkGFpNG9rbAm7PJZ",
    techStack: ["React", "FastAPI", "Python", "Tailwind CSS", "MongoDB"],
    githubLink: "https://github.com/mohammedasim/eduscale",
    liveLink: "https://eduscale.demo",
    isFeatured: true,
    order: 4,
  },
];

export const initialSkills: SkillData[] = [
  { name: "JavaScript", category: "Programming Languages", level: 95 },
  { name: "TypeScript", category: "Programming Languages", level: 90 },
  { name: "Python", category: "Programming Languages", level: 85 },
  { name: "C++", category: "Programming Languages", level: 80 },
  
  { name: "React", category: "Frontend Development", level: 95 },
  { name: "Next.js", category: "Frontend Development", level: 90 },
  { name: "Tailwind CSS", category: "Frontend Development", level: 95 },
  { name: "Framer Motion", category: "Frontend Development", level: 85 },

  { name: "Node.js", category: "Backend Development", level: 90 },
  { name: "Express", category: "Backend Development", level: 90 },
  { name: "REST APIs", category: "Backend Development", level: 95 },
  { name: "GraphQL", category: "Backend Development", level: 80 },

  { name: "MongoDB", category: "Database Technologies", level: 90 },
  { name: "Mongoose", category: "Database Technologies", level: 90 },
  { name: "PostgreSQL", category: "Database Technologies", level: 80 },
  { name: "Redis", category: "Database Technologies", level: 75 },

  { name: "Neural Networks", category: "AI & Machine Learning", level: 70 },
  { name: "TensorFlow", category: "AI & Machine Learning", level: 65 },
  { name: "Prompt Engineering", category: "AI & Machine Learning", level: 85 },
  { name: "LLM Orchestration", category: "AI & Machine Learning", level: 75 },

  { name: "Git & GitHub", category: "Development Tools", level: 95 },
  { name: "Docker", category: "Development Tools", level: 75 },
  { name: "VS Code", category: "Development Tools", level: 95 },
  { name: "Figma", category: "Development Tools", level: 80 },
];

export const initialCertificates: CertificateData[] = [
  {
    title: "Advanced Full-Stack Engineering",
    issuer: "Coursera / Meta",
    date: "2025-09-12",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgTBFzoyxJZEVC_yxpLBwxs7hKayRrPz0g-QdM33t46cemsW9xuIYxw2ArOLQtxpbiSWQVrHTWUuNpiMReceZRkIUk9uoxm0RReJRKHdLj8tkzlmmw7eIPKQjxyQXtw2S-y2uksibtKyvUAwhUsip__5TyLuEEupGpMxIksizN-HJjQwxIEmEoxFkEFNRIuUk4wcFlGmiktcXlaiJnI-97jJT7FncwirPts9foHiE7VmbpORIK0ZVKcn5ig36t6603byOmjXYEiT0e",
    pdf: "/uploads/meta-fullstack.pdf",
  },
  {
    title: "MongoDB Certified Developer",
    issuer: "MongoDB University",
    date: "2025-05-15",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqkDqGqb5UnCswwWKwKA2uAKqVnGh3pEEPpJbyQHgRsdxF2NXP1pfxLISApt746Qjt2RCBXM02BKLdfVW2Bs5oprVsGG0zU0VvVouJH4cMmaemI5_h6o2iOXTWww8fC3e_YYE9o0kps15H3i59UWcTiWN3_Lf98Zxgyex43x-G46vZGAPYzLfG1XV53V8LNOWtMMN7w4gPPXLuad5WkaS7ta9R9Q4-L_nT3suJRfLfJfuyzmxu85CxDeiG6lrhETAd0dVhpwqHdYjW",
    pdf: "/uploads/mongodb-developer.pdf",
  },
];

export const initialExperiences: ExperienceData[] = [
  {
    title: "Full Stack Developer Intern",
    company: "Tech Solutions Inc.",
    location: "Remote",
    startDate: "2025-06",
    endDate: "2025-08",
    description: [
      "Built custom Next.js modules saving 15% loading overhead.",
      "Maintained Mongoose database architectures and integrated REST APIs.",
      "Partnered with project designers to create smooth, pixel-perfect user flows.",
    ],
    type: "internship",
  },
  {
    title: "Open Source Contributor",
    company: "GitHub Community",
    location: "Global",
    startDate: "2024-01",
    endDate: "Present",
    description: [
      "Contributed to Tailwind plugins and local UI component systems.",
      "Optimized documentation and fixed security dependencies.",
    ],
    type: "leadership",
  },
];

export const initialAchievements: AchievementData[] = [
  {
    title: "1st Place Winner - HackGenesis",
    date: "2025-11",
    description: "Led a team of 4 to construct an AI-driven educational portal inside a 36-hour sprint.",
    category: "hackathon",
  },
  {
    title: "Smart India Hackathon Finalist",
    date: "2025-08",
    description: "Proposed and built a robust file verification system for government records using encryption.",
    category: "competition",
  },
];
