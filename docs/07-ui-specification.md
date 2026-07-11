# SemesterOS: High-Fidelity UI Specification
**Internal Design Document | Phase 7**  
**Role:** Principal Product Designer, Senior UI Designer, Design Systems Architect & Creative Director  

---

## Part 1 — Global Application Style & Design Language

SemesterOS uses a visual style centered on **calmness, clarity, and structural balance**:

```
🎨 APP SYSTEM STYLING TOKENS
├── Background Canvas: Warm Gray (#F8F9FA) ➔ Mimics physical paper
├── Component Cards: Neutral White (#FFFFFF) ➔ Structured float
├── Borders: Thin (#E5E7EB) ➔ 1px solid slate border lines
├── Shadow Layer: Perceptual Depth ➔ y: 2px, blur: 8px (opacity: 0.04)
└── Typography Color: Deep Ink (#111827) ➔ Maximum high contrast
```

*   **Overall Mood:** Warm-minimalist. Surfaces are styled to feel like physical paper, avoiding flat dark-grays and stark white neon colors.
*   **Visual Rhythm & Whitespace:** Generous vertical padding ($32\text{px}$ on desktop, $20\text{px}$ on mobile) separates layout sections. Layout alignment relies on a strict 8px modular spacing system.
*   **Card Philosophy:** Cards float on the base canvas, styled with rounded corners ($24\text{px}$), thin borders ($1\text{px}$, `#E5E7EB`), and subtle shadows to establish depth.

---

## Part 2 — Home Dashboard (The Command Center)

The dashboard is the central point of the application, designed to give the student immediate clarity:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Greeting: "Good Morning, Hemanth." (Display: Outfit 28px, Ink)         │
│ Weekly Study Goal Gauge: 8.5 / 12 Hours Logged  [========-----] 70%    │
├────────────────────────────────────────────────────────────────────────┤
│ RECOMMENDED STUDY BLOCK (Primary focus card)                           │
│ Background: Deep Indigo (#1E1B4B), Text: Soft Cream (#F5F3FF)          │
│ • "Next: AVL Tree Rotations in Data Structures"                        │
│ • Reason: "Linked to Assignment due in 3 days. Focus for 45 mins."     │
│ [Start Session CTA - White Filled Button]                              │
├────────────────────────────────────────────────────────────────────────┤
│ URGENT WARNING BAR                                                     │
│ Background: Amber Alert Tint (#FFFBEB), Border: (#FDE68A)              │
│ • Attendance in Math IV is at 74.8%. (1 class miss allowed)            │
├────────────────────────────────────────────────────────────────────────┤
│ TODAY'S CLASSES TIMELINE (Linear vertical track)                      │
│ • 09:30 AM | Computer Networks (Lecture Hall A)                        │
│ • 11:30 AM | Hardware Lab (Lab Room 302)                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Part 3 — Courses Directory

A grid layout is used to display active subjects, providing a clear overview of overall course health:

*   **Filter Bar:** Contains a Search input, Semester Selector dropdown, and Sort toggle (by Progress, Attendance, or Credits).
*   **Grid vs. List Layout Verdict:** **Grid Layout** is selected as the primary view. It groups courses as cards, making progress rings and attendance buffers easier to read at a glance.
*   **Course Card Specification:**

```
┌────────────────────────────────────────────────────────────────────────┐
│ 💻 DATA STRUCTURES & ALGORITHMS                      [Credits: 4]      │
│ Faculty: Dr. Gupta • Diff: Hard                      [Progress: 72%]   │
├────────────────────────────────────────────────────────────────────────┤
│ Progress Ring: SVG, Diameter: 64px, Stroke: 6px Teal (#10B981)         │
│ Attendance Buffer: "82% Attendance • +4 Class Buffer (Safe)"           │
│ [Open Workspace Button - Outline Slate]                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Part 4 — Course Details Workspace

A single-page workspace utilizing tabbed panels to group relevant course materials:

*   **Course Header:** Displays course title, code, and overall progress ring.
*   **Sticky Sub-Navigation Bar:** Sticky tabs bar (`#FFFFFF` with backdrop blur) containing: `[Syllabus Checklist]` ➔ `[Notes Workspace]` ➔ `[Library Resources]` ➔ `[Attendance Logs]`.
*   **Syllabus tab (Topic Checklist):**
    *   Syllabus modules are organized as collapsible accordions.
    *   Topics are displayed as checklist rows: unchecked items show a slate gray border; checked items display a teal checkbox with strike-through text.
*   **Notes tab (Scratchpad):**
    *   Split-pane layout: Left pane lists saved notes, right pane displays the active markdown text editor.

---

## Part 5 — Planner

A task planner designed specifically for academic deliverables:

```
┌────────────────────────────────────────────────────────────────────────┐
│ PLANNER                                                    [+ Task]    │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ PENDING           │ IN PROGRESS       │ COMPLETED                      │
│                   │                   │                                │
│ • Lab Report 2    │ • Study for Quiz  │ • Homework 1 (Struck-through)  │
│   Due: July 14    │   Due: July 15    │   Completed: July 10           │
│   [Priority: High]│   [Priority: Mid] │                                │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

*   **Priority Tags:** High (Rose), Mid (Amber), Low (Slate).
*   **Interactions:** Tasks can be dragged across columns, or updated using inline checkboxes.

---

## Part 6 — Semester Journey (Timeline Roadmap)

A vertical weekly roadmap visualizing the distribution of the semester's workload:

```
▼ WEEK 3: CURRENT (JULY 12 - JULY 18)  [Syllabus Completion: 45%]
  ├── 📅 Monday: Lecture - Graphs Overview (Networks)
  ├── 📝 Wednesday: Submit Homework 3 (Math IV)
  └── 🔬 Thursday: Lab Session - Hardware Prototyping
▶ WEEK 4: UPCOMING (JULY 19 - JULY 25)
▶ WEEK 5: UPCOMING (JULY 26 - AUGUST 01)
```

*   **Interactions:** Clicking a week expands its list of topics, deadlines, and milestones.

---

## Part 7 — Insights (Analytics Center)

A centralized portal for tracking long-term study trends and habits:

*   **Study Heatmap:** A grid of micro-squares displaying daily study hours logged over the last 16 weeks (similar to GitHub's contribution graph, using shades of deep indigo).
*   **Time Distribution Chart:** Bar chart showing total study hours logged per course.
*   **Attendance Safety Matrix:** Table displaying active attendance percentages, total classes attended vs. conducted, and buffer margins for each course.

---

## Part 8 — Library & Resource Hub

A storage vault for course assets and references:

*   **Resource Cards:** Grid of files and links categorized by type: `[PDF Library]`, `[Videos]`, `[Web Links]`, `[Downloads]`.
*   **Metadata Display:** Each card shows file size, tag markers, and download anchors.

---

## Part 9 — Preferences & Settings

*   **Appearance Toggle:** Clean switch to toggle between Light and Dark themes.
*   **Keyboard Shortcuts Map:** Grid layout displaying command shortcuts (e.g. `⌘K` for search, `G` + `H` for home).
*   **Data Portability CTAs:** Buttons to `Export Database (JSON)` and `Import Database`.

---

## Part 10 — State Interface Designs

### 1. Skeleton Loading State
*   Cards display a light-gray skeleton overlay. Skeletons pulse opacity from 40% to 80% every 1.5 seconds.

### 2. Error States
*   **Offline Mode:** A floating rose-tinted banner surfaces at the top of the viewport: *"Working Offline. Edits will sync once connection is restored."*
*   **Server Error:** Full-screen error container with a retry button: `[Retry Connection]`.

### 3. Empty States
*   **Empty State Layout:** Styled with a centered line illustration, bold message, description text, and a primary CTA button:

```
┌────────────────────────────────────────────────────────┐
│                   [ LINE ILLUSTRATION ]                │
│                     NO COURSES ADDED                   │
│         Your semester workspace is currently empty.    │
│            Let's seed your academic courses.           │
│                  [ + Seed Semester CTA ]               │
└────────────────────────────────────────────────────────┘
```

---

## Part 11 — Accessibility Specifications (WCAG AAA)

*   **Text Contrast:** Contrast meets WCAG AAA standards (minimum 4.5:1 for body text, 3:1 for headers).
*   **Motion Control:** Page transitions respect the user's browser-level reduced motion preferences.
*   **Focus Ring:** Interactive elements display a distinct focus outline ring when navigated via keyboard.

---

## Part 12 — Visual Hierarchy & Layout Audit

*   **Visual Balance:** Verified alignment and consistent spacing margins ($32\text{px}$ on desktop, $20\text{px}$ on mobile) across all screens.
*   **Cognitive Load:** Confirmed that secondary page details are hidden behind tabs and accordions to prevent visual clutter.
*   **Accessibility:** Checked contrast ratios and verified keyboard navigation flows across the entire layout.
*   **Performance:** Interface layouts use standard CSS flex and grid components to ensure smooth rendering and rapid loading.
