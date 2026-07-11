# SemesterOS: Frontend Engineering Architecture
**Internal Technical Document | Phase 11**  
**Role:** Staff Frontend Engineer, Software Architect, React & TypeScript Expert & Technical Lead  

---

## Part 1 — Technology Decisions & Rationale

SemesterOS utilizes a modern, performance-oriented frontend stack to ensure fast execution and long-term codebase maintainability:

```
🚀 SEMESTEROS FRONTEND ENGINE
├── Bundler & Core: Vite + React 18 + TypeScript ➔ Sub-50ms HMR, compile-time safety
├── Styling: TailwindCSS ➔ Utility-first style tokens, zero CSS runtime overhead
├── State Store: Zustand ➔ Lightweight, atomic state slices without React context renders
├── Animations: Framer Motion ➔ Spring-physics micro-interactions & layout animations
├── Validation: React Hook Form + Zod ➔ Schema-based input validation
└── Testing: Vitest + Playwright ➔ Fast unit testing & cross-browser E2E integration
```

### Rationale:
*   **Vite vs. Next.js:** SemesterOS is designed as a local-first client application running in the browser. Vite provides a lightweight, highly efficient SPA bundler without the server-side complexity of Next.js.
*   **Zustand vs. Redux/React Context:** Zustand provides a clean, hook-based store that keeps states outside the React render tree, preventing unnecessary re-renders.
*   **Zod:** Used to validate task inputs and verify local storage database schemas during app initialization.

---

## Part 2 — Project Directory Structure

The codebase is organized into modular directories:

```
semesteros/
├── public/                  # Static assets & SVG icons
├── src/
│   ├── app/                 # Routing declarations & global providers
│   ├── assets/              # Static image imports
│   ├── components/
│   │    ├── ui/             # Reusable primitives (Buttons, inputs)
│   │    └── layout/         # Shell components (Sidebar, Top nav)
│   ├── features/            # Domain-specific feature modules
│   ├── hooks/               # Custom React hooks (useCourses, usePlanner)
│   ├── models/              # TypeScript interface schemas
│   ├── services/            # Pure business engines (Study recommendation engine)
│   ├── stores/              # State stores (AcademicEngine.tsx)
│   ├── styles/              # Global css imports
│   ├── types/               # Utility Type declarations
│   └── utils/               # Helper utilities (date formatters, sort helpers)
```

---

## Part 3 — Feature Architecture & Module Boundaries

Features are organized into self-contained modules. Each feature folder has a strict public API exposed via an `index.ts` file:

1.  **Home Dashboard (`features/home`):** Responsible for assembling study recommendation cards and workload gauges.
2.  **Courses (`features/courses`):** Handles course overview cards, syllabus trees, notes, and attendance buffer calculations.
3.  **Planner (`features/planner`):** Manages task lists, status transitions, and priority matrices.
4.  **Timeline (`features/timeline`):** Renders chronological schedules and deadline calendars.
5.  **Insights (`features/insights`):** Generates time heatmaps and performance comparison charts.
6.  **Command Palette (`features/command-palette`):** Provides global fuzzy search and shortcut execution.

---

## Part 4 — Declarative Routing Specification

Routing uses **React Router v6**'s declarative path mappings:

```
[BrowserRouter]
  └── MainLayout (Shell with Sidebar & Header)
       ├── / (Home Page - lazy loaded)
       ├── /courses (Courses Directory - lazy loaded)
       ├── /courses/:id (Course Detail Workspace - lazy loaded)
       ├── /planner (Task Planner Page - lazy loaded)
       ├── /timeline (Timeline & Journey Page - lazy loaded)
       ├── /insights (Analytics Page - lazy loaded)
       └── /preferences (Preferences Settings - lazy loaded)
```

*   **Code Splitting:** Page components are loaded asynchronously using `React.lazy()` and wrapped in `React.Suspense` fallback skeletons.

---

## Part 5 — Local-First Data Flow

To ensure the OS is highly responsive, data flow utilizes a **Local-First caching strategy**:

```
[Local IndexedDB / LocalStorage]
              ▲
              │ (Syncs / Restores)
              ▼
    [Zustand State Store]
              ▲
              │ (Reads / Writes via Selectors)
              ▼
       [Custom Hooks]
              ▲
              │ (Consumed by)
              ▼
      [React Components] ➔ [DOM Interaction / UI updates]
```

*   **Direct Writes:** When a user completes a task or study session, changes are written to the local Zustand store immediately, triggering local storage persistence in under 5ms.
*   **Offline Sync:** If a server connection is available in the future, a sync queue processes background synchronization in the background.

---

## Part 6 — Performance Optimization Guidelines

*   **Layout Thrashing Prevention:** Avoid calling `getBoundingClientRect` inside render loops.
*   **Memoization Rules:** Use `useMemo` for heavy sorting and filtering calculations (such as syllabus recommendations or calendar event aggregations).
*   **Viewport Virtualization:** Planner and note lists exceeding 50 items utilize virtualized lists (`react-window`) to maintain 60 FPS scrolling performance.

---

## Part 7 — Component Classifications

1.  **Primitives (`components/ui`):** Stateless design components (e.g. Buttons, Checkboxes, Dialog overlays).
2.  **Layouts (`components/layout`):** Viewport scaffolding components (e.g., Sidebar, main wrapper).
3.  **Feature Components (`features/*/components`):** Domain-specific blocks containing logic (e.g. `CourseCard`, `SyllabusTree`).
4.  **Pages (`pages/*`):** Root route layouts that orchestrate feature components.

---

## Part 8 — Error Boundaries & Fallback Systems

*   **Global Error Boundary:** Wraps the entire application layout, catching rendering exceptions and displaying a recovery layout with a database export option to protect student data.
*   **Feature Error Boundary:** Wraps individual widgets. If the Insights chart fails, only the chart component displays a fallback layout, allowing the rest of the dashboard to remain interactive.

---

## Part 9 — Quality Assurance & Testing Strategy

*   **Unit & Engine Testing (Vitest):** Core mathematical engines (like study recommendations and attendance buffer calculations) are tested using comprehensive mock inputs.
*   **Component Testing (React Testing Library):** Verifies interactive components (like checkboxes and input modals) capture events correctly.
*   **End-to-End Testing (Playwright):** Cross-browser automation tests that simulate core user paths (Onboarding ➔ Course Setup ➔ Syllabus Checkoffs).
*   **Accessibility Testing:** Cypress-axe integration to verify keyboard focus traps and color contrast ratios.

---

## Part 10 — Naming & Code Style Conventions

*   **File Naming:** React components use PascalCase (`CourseCard.tsx`). Custom hooks use camelCase starting with "use" (`useCourses.ts`). Utility helper files use camelCase (`plannerHelpers.ts`).
*   **TypeScript Types:** Interfaces use PascalCase and are named after the domain (`Course`, `Task`, `StudySession`). Avoid prefixing interfaces with "I".
*   **Relative Path Aliases:** Code uses absolute aliases (`@/components/*`, `@/hooks/*`, `@/models/*`) configured in `tsconfig.json` to prevent complex relative path imports (e.g. `../../../../components`).

---

## Part 11 — Engineering Implementation Roadmap

```
🚀 IMPLEMENTATION ROADMAP
├── Week 1: Core Foundation ➔ Setup routing, Zustand stores, local caching, and UI primitives
├── Week 2: Course & Syllabus ➔ Build Syllabus Tree, note scratchpads, and attendance meters
├── Week 3: Planner & Timeline ➔ Deploy task board, weekly agenda, and recommendation cards
└── Week 4: Optimization & QA ➔ Refine spring transitions, E2E tests, and loading skeletons
```
