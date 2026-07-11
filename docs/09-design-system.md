# SemesterOS: Design System & Component Library Specification
**Internal Design Document | Phase 9**  
**Role:** Principal Design Systems Architect, Senior UI Engineer, Product Designer & Accessibility Specialist  

---

## Part 1 — Design System Philosophy

The SemesterOS design system is built to ensure **consistency, accessibility, and high performance** across all devices. It is guided by three core concepts:

### I. Token-Driven Architecture
Design tokens are the atomic values of the design system. Color hex codes, padding dimensions, corner radii, and animation easings are represented as variables. This isolates design decisions from the codebase, allowing updates to propagate instantly without refactoring.

### II. Composable Elements
Component structures are modular. UI primitives (like buttons, tags, and inputs) are combined to form layout blocks (like course cards or recommendation widgets). This prevents code duplication and keeps rendering performance high.

### III. Accessibility-First (A11y)
Accessibility is integrated into the design system from the start. Contrast targets, keyboard navigation focus states, and screen reader labels are specified as core components, rather than being added as retrofits.

---

## Part 2 — Design Tokens Taxonomy

We use a three-tier design token taxonomy to structure layout variables:

```
┌────────────────────────────────────────────────────────┐
│                   TOKEN HIERARCHY                      │
├───────────────┬────────────────────────────────────────┤
│ Global Tokens │ Basic raw values (e.g. gray-50, 16px)  │
├───────────────┼────────────────────────────────────────┤
│ Alias Tokens  │ Semantic purpose (e.g. background-base)│
├───────────────┼────────────────────────────────────────┤
│ Component     │ Component-specific (e.g. card-padding) │
└───────────────┴────────────────────────────────────────┘
```

### Token Categories Structure:
*   **Color Tokens:** `color.brand.*`, `color.text.*`, `color.surface.*`, `color.border.*`, `color.semantic.*` (success, warning, danger).
*   **Spacing & Padding:** `spacing.1` (4px) to `spacing.16` (64px).
*   **Corner Radius:** `radius.none` (0px) to `radius.full` (999px).
*   **Typography Scale:** `font-family.*`, `font-size.*`, `font-weight.*`, `line-height.*`, `letter-spacing.*`.
*   **Elevation Shadows:** `shadow.flat`, `shadow.subtle`, `shadow.medium`, `shadow.large`.
*   **Motion Dynamics:** `motion.duration.*`, `motion.easing.ease-out`, `motion.spring.soft`, `motion.spring.stiff`.
*   **Layout Z-Index:** `z-index.base` (1), `z-index.header` (10), `z-index.overlay` (100).

---

## Part 3 — Foundational Grids & Layout Scales

*   **12-Column Grid:** Standard desktop layout grid. 24px gutters, max-width set to 1280px.
*   **Vertical Spacing Rhythm:** Padding scales by multiples of 8px. Headers are separated from content by 32px; consecutive cards have a vertical gap of 24px.
*   **Border Weights:** Thin 1px solid borders are used to separate cards and list elements, avoiding heavy dividers.

---

## Part 4 — Component Inventory & Custom Academic Components

The component library is split into standard UI Primitives and custom Academic Components:

```
┌───────────────────────────────────────┐
│             UI PRIMITIVES             │
│  - Button, Icon Button, FAB           │
│  - Input, Textarea, Search Bar        │
│  - Dropdown, Checkbox, Switch         │
│  - Badge, Tooltip, Avatar, Chip       │
│  - Accordion, Modal, Toast, Snackbar  │
└──────────────────┬────────────────────┘
                   │
┌──────────────────▼────────────────────┐
│          ACADEMIC COMPONENTS          │
│  - Semester Progress Ring             │
│  - Course Health Card                 │
│  - Attendance Meter                   │
│  - GPA Predictor Card                 │
│  - Study Session Timer                │
│  - Weekly Focus Widget                │
│  - Smart Recommendation Card          │
│  - Deadline Timeline Agenda           │
│  - Module Completion Tree             │
│  - Learning Streak Calendar           │
│  - Subject Heatmap Grid               │
│  - Knowledge Graph                    │
│  - Exam Countdown                     │
│  - Assignment Priority Matrix         │
│  - Weekly Study Planner               │
│  - Credit Tracker                     │
│  - Academic Calendar Strip            │
│  - Semester Journey Timeline          │
│  - AI Study Coach Panel               │
│  - Smart Insights Widget              │
└───────────────────────────────────────┘
```

### Detailed Academic Component Specifications:
1.  **Syllabus Recommendation Card:** A dashboard card displaying the recommended study topic, estimated duration, and the reason for the recommendation. Features a prominent primary button to start the study session.
2.  **Attendance safety Buffer Meter:** A progress meter showing attendance percentage, total classes attended vs. conducted, and a safe buffer index showing how many classes can be missed before falling below 75%.
3.  **Semester Progress Ring:** Global SVG circle tracking overall completion of syllabus modules.
4.  **Learning Streak Calendar:** Grid display showing consecutive active study days.
5.  **Subject Heatmap Grid:** A contribution-style grid tracking daily study hours logged over the term.

---

## Part 5 — Component State Matrix

Components must support twelve functional states:

```
[Default] ➔ [Hover] ➔ [Focus] ➔ [Active / Pressed] ➔ [Disabled]
   │
[Loading / Skeleton] ➔ [Success / Warning / Error]
   │
[Selected / Completed / Archived]
```

*   **Focus State:** Displays a 2px offset border ring (`#2563EB`) to support keyboard navigation.
*   **Disabled State:** Opacity fades to 40%; interactive events (`pointer-events: none`) are disabled.

---

## Part 6 — Component Composition & Nesting Rules

*   **Nesting Limit:** Nested cards are capped at two levels (e.g. a Task Card can nest inside a Module Accordion, but the Task Card cannot contain nested sub-cards).
*   **Visual Rhythm:** Child components inside cards must use consistent internal spacing (e.g. 12px vertical gaps).
*   **Card Separation:** Cards must never overlap. Adjacent cards are separated by a minimum 16px gutter.

---

## Part 7 — Icon System Rules

*   **Icon Library:** Lucide icons are used for visual consistency.
*   **Stroke Weight:** Icons are styled with a consistent 1.75px stroke width.
*   **Corner Rounding:** Outlines use softly rounded edges, matching the shape language of UI components.
*   **Filled vs Outline:** Outlines are used by default; filled shapes are reserved for active toggle states (e.g. a starred favorite course).

---

## Part 8 — Data Visualization Standards

*   **Colors:** Chart lines and bars use low-saturation color tokens (`#1E1B4B` for primary, `#10B981` for success, `#FFFBEB` for warning).
*   **Progress Rings:** SVG elements using thin stroke paths to ensure clean rendering.
*   **Heatmap Grid:** Contribution squares transition through 4 shades of deep indigo, representing study duration intensity.

---

## Part 9 — Accessibility Conformance (WCAG AA)

*   **Contrast Ratio:** Text-to-background contrast matches WCAG AA requirements (minimum 4.5:1 for body copy).
*   **Touch Targets:** Mobile touch targets are padded to a minimum size of 44px x 44px.
*   **Keyboard Traps:** Focus overlays (like Modals or the Command Palette) lock keyboard focus loops within the dialog until closed.

---

## Part 10 — Responsive Component Layouts

*   **Column Stacking:** Double-column widgets stack vertically on mobile viewports.
*   **Input Fields:** Multi-column form layouts fold into a single vertical grid on smaller screens.
*   **Sidebar:** Left sidebar collapses to a compact 72px icon rail on tablet, and moves to a bottom navigation bar on mobile.

---

## Part 11 — Component Documentation Standard

For every component in the design system library, we document:
1.  **Purpose:** What is the component used for?
2.  **Variants:** Button styles (Filled, Outline, Text), Card layouts, Badge sizes.
3.  **States:** Hover, Focus, Active, Disabled, Loading.
4.  **Best Practices:** Guidelines for proper usage.
5.  **Anti-patterns:** What to avoid (e.g., nesting cards deeper than 2 levels).

---

## Part 12 — Design Governance & Versioning

*   **Naming Convention:** Components use BEM naming conventions (Block-Element-Modifier, e.g. `c-card`, `c-card__header`, `c-card--warning`).
*   **Contribution Workflow:** New components are proposed to the PM team, reviewed for usability and accessibility compliance, and added to the design system library.
*   **Deprecation Cycle:** Deprecated components are marked with a warning label, kept for 1 minor version, and removed in the next major version release.

---

## Part 13 — Design System Audit

*   **Consistency Check:** Verification that all layout elements share the same fonts, corners, borders, and margins.
*   **Developer Experience (DX):** Design tokens are exported as JSON/CSS variables to allow developers to reference styling definitions easily.
*   **Maintainability:** The modular structure ensures components can be updated in a single file, with changes propagating across the entire application workspace.
