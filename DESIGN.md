# Design System: Mohammed Asim Portfolio CMS

## 1. Visual Theme & Atmosphere
A premium, modern developer portfolio balanced with a data-dense admin cockpit. The atmosphere is **Apple-inspired Minimalism meets Developer SaaS** — combining expansive negative space, razor-sharp outlines, high-contrast typography, and fluid perpetual motion.

## 2. Color Palette & Roles

### Light Theme
- **Background** (`#F8FAFC`) — Soft canvas white
- **Cards/Containers** (`#FFFFFF`) — Pure surface cards
- **Primary Text** (`#0F172A`) — Slate-900 typography
- **Secondary Text** (`#475569`) — Slate-600 descriptions and labels
- **Border** (`#E2E8F0`) — Light structural lines
- **Primary Accent** (`#2563EB`) — Blue-600 for high-intent actions
- **Secondary Accent** (`#7C3AED`) — Purple-600 for sub-actions and highlight states

### Dark Theme
- **Background** (`#0F172A`) — Deep space background
- **Cards/Containers** (`#1E293B`) — Muted slate surface cards
- **Primary Text** (`#FFFFFF`) — High contrast white
- **Secondary Text** (`#94A3B8`) — Slate-400 descriptions and labels
- **Border** (`#334155`) — Dark slate structural lines
- **Primary Accent** (`#3B82F6`) — Blue-500 for actions and active tabs
- **Secondary Accent** (`#8B5CF6`) — Purple-500 for active states and gradients

---

## 3. Typography Rules
- **Display/Headlines**: `Plus Jakarta Sans` — Track-tight (`tracking-tight`), heavy weight-driven (`font-extrabold` / `font-bold`), scale responsive via Tailwind.
- **Body & Labels**: `Inter` — Precise, readable, systematic, regular weight (`font-normal` / `font-medium`).
- **Monospace**: `JetBrains Mono` or `monospace` — Used for code syntax, dates, timeline timestamps, database stats, and unique metadata labels.

---

## 4. Component Stylings
* **Buttons**:
  - Primary: Solid background (Primary Accent), track-tight text, subtle shadow, 150ms transition. Focus ring in Accent. Active: scales down (`active:scale-95`).
  - Secondary/Ghost: Outlined with borders matching the current theme, transitions to low opacity background on hover.
* **Cards**:
  - Roundness: 0.75rem (`rounded-xl`) or 1rem (`rounded-2xl`).
  - Shadow: Ink Shadow (`0px 4px 20px rgba(15, 23, 42, 0.05)` in light mode, soft glow in dark mode).
  - Outlines: 1px border. No heavy drop-shadows.
* **Forms/Inputs**:
  - Label above, error below.
  - Border: 1px border. Focus state transforms to 2px primary accent border with outline-none.
* **Loaders**:
  - Custom skeleton structures matching exact layout dimensions. No generic spinners.

---

## 5. Layout & Spacing
- **8px Grid**: Spacing intervals of 8px (padding, margin, gap).
- **Responsive Container**: Maximum width `1280px` (`max-w-container-max`), centered with fluid desktop padding.
- **Bento Grid**: Projects section utilizes a bento grid structure combining large 2/3 cards with 1/3 cards.
- **Asymmetric Balance**: Content is offset to create a premium, editorial showcase feel. Single-column collapse below `768px`.

---

## 6. Motion & Animations
- **Physics**: Weighty spring animations (Framer Motion: `stiffness: 100, damping: 20`).
- **Orchestration**: Staggered cascading animations for loading sections, projects lists, and dashboard widgets.
- **Perpetual Loops**: Floating cards, breathing glows, and pulsing online status badges to keep the interface feeling active.
