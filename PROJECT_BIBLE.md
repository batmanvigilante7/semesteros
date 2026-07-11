# SemesterOS: Project Bible
**The Single Source of Truth (SSOT) for SemesterOS Development**  
**Version:** 1.0.0  

---

## 🌟 1. Vision & Mission
*   **Vision:** To establish the world's most trusted cognitive workspace for university students, transforming academic chaos into a calm, structured, and predictable daily flow.
*   **Mission:** SemesterOS reduces student academic anxiety by offloading cognitive load, providing real-time clarity on:
    *   *What to study next* (algorithmic recommendations).
    *   *What is due* (unified timeline agenda).
    *   *How much progress has been made* (syllabus progress trackers).
    *   *Where they stand* (attendance buffer calculators).

---

## 🏗️ 2. Core Architecture & Tech Stack
*   **Frontend:** React 18 + Vite (SPA) + TypeScript.
*   **Styling:** TailwindCSS + Custom CSS utility tokens.
*   **Global State Store:** Zustand (Atomic, decoupled state slices).
*   **Animations:** Framer Motion (Spring physics under 250ms).
*   **Database:** Supabase PostgreSQL + PgVector (semantic embeddings).
*   **Storage:** Supabase Storage buckets.
*   **Local Caching:** IndexedDB persistence layer.
*   **AI Integration:** Ollama (Local LLM fallback) + Google Gemini / OpenAI (Cloud fallback).

---

## 🎨 3. Design System DNA
*   **Mood:** Warm-minimalist. Neutral warm-gray bases (`#F8F9FA`) and white cards (`#FFFFFF`).
*   **Typography:** Outfit (Display/Headings) + Inter (Body/Labels) + JetBrains Mono (Numbers).
*   **Shapes:** Balanced rounded corners (12px buttons/inputs, 24px cards, 28px dialogs).
*   **Spacing Scale:** Strict 4px modular spacing grid.
*   **Semantic Color Code:** Slate (Neutral), Deep Indigo (Focus), Calm Teal (Success), Muted Amber (Warning), Soft Rose (Critical).

---

## 📂 4. Repository Folder Schema
*   `public/` - Static assets, SVG sprites.
*   `src/app/` - Router mappings, global providers.
*   `src/components/ui/` - Stateless primitives (buttons, badges).
*   `src/components/layout/` - Viewport shell layout wrappers (sidebar, header).
*   `src/features/` - Self-contained feature modules (home, courses, planner, timeline).
*   `src/hooks/` - Custom React hooks.
*   `src/models/` - TypeScript interface schemas.
*   `src/services/` - Pure domain logic engines (recommendation engine).
*   `src/stores/` - Global stores (Zustand).

---

## 🧪 5. Quality Standards & Release Gate
1.  **Build Safety:** `npm run build` must complete with zero warnings.
2.  **Lint Check:** Clean check outputs from ESLint & Prettier.
3.  **Test Coverage:** Core math engines (streaks, recommended study weight, attendance buffers) require $\ge 90\%$ Vitest coverage.
4.  **A11y Check:** Meets WCAG AA contrast standards, keyboard focus outline support, and reduced-motion preferences.
5.  **Offline Support:** Session cache persists to IndexedDB locally in under 10ms.
