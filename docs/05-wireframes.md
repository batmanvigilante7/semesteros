# SemesterOS: Wireframe & Layout Specification
**Internal Design Document | Phase 5**  
**Role:** Principal Product Designer, UX Architect, Information Architect & Design Systems Lead  

---

## Part 1 — Global Layout System

SemesterOS uses an adaptive, responsive viewport shell. Below is the structural layout blueprint for the global container:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: Path Breadcrumbs | Context Switcher                [+ Task] 👤 │ (Fixed height: 64px)
├───────────┬──────────────────────────────────────────────────────────────┤
│ COLLAPSE  │ MAIN CONTENT WORKSPACE                                       │
│ SIDEBAR   │ (Scrollable. Padding: 32px on desktop)                       │
│           │                                                              │
│ Width:    │ Max Width Limit: 1280px (Centered inside content viewport)   │
│ - Expand  │                                                              │
│   240px   │                                                              │
│ - Compact │                                                              │
│   72px    │                                                              │
└───────────┴──────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints & Viewport Behavior
*   **Desktop Breakpoint ($\ge 1024\text{px}$):** Left Sidebar is docked and visible (240px wide). The top utility bar is fixed (64px high). The content area takes remaining width with a maximum layout limit of 1280px and 32px margins.
*   **Tablet Breakpoint ($768\text{px} - 1023\text{px}$):** Left Sidebar is collapsed into a compact icon rail (72px wide). Main content margins contract to 20px. Side panels slide over content instead of pushing it.
*   **Mobile Breakpoint ($< 768\text{px}$):** Left Sidebar is hidden. Navigation moves to a fixed Bottom Bar (56px high) and a top Menu drawer. Content margin shrinks to 16px.

---

## Part 2 — Grid & Spacing System

All pages are aligned to a 4px modular spacing grid:

```
┌───────────────────┬───────────────────┬───────────────────┬───────────────────┐
│     Desktop (12-Col)                  │      Tablet (8-Col)                   │
│ Col Width: ~80px  │ Gutter: 24px      │ Col Width: ~76px  │ Gutter: 16px      │
├───────────────────┴───────────────────┼───────────────────┴───────────────────┤
│     Mobile (4-Col)                    │      Vertical Rhythm Metrics          │
│ Col Width: ~82px  │ Gutter: 16px      │ Card Padding: 20px│ Row Gap: 16px     │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

*   **Grid Rules:** Spacing scale relies on multiple-of-4 rules: `4px (micro), 8px (small), 16px (medium), 24px (large), 32px (extra large), 48px (section gap)`.
*   **Vertical Rhythm:** Page header elements are separated by 32px from content. Consecutive section card panels have a vertical gap of 24px. Card internals use 20px padding on all sides.

---

## Part 3 — Dashboard & Page Blueprints

### 1. Home Dashboard Page Map
*   **Primary User Question:** *"What should I study right now and what is due today?"*
*   **Layout Blueprint:**

```
┌──────────────────────────────────────────────────────────────────────────┐
│ GREETING & SEMESTER PROGRESS BAR                                         │ (Columns: 12)
│ "Good Morning, Hemanth." [==================== 45% ]                     │ (Height: 80px)
├────────────────────────────────────────┬─────────────────────────────────┤
│ COLUMN A (Width: 8 Cols)               │ COLUMN B (Width: 4 Cols)        │
│                                        │                                 │
│ ┌────────────────────────────────────┐ │ ┌─────────────────────────────┐ │
│ │ 💡 FOCUS RECOMMENDATION CARD        │ │ │ ⚠️ URGENT ALERTS            │ │
│ │ Next Topic: AVL trees (Math)       │ │ │ • Attendance in Algo: 74.8% │ │
│ │ [Start Study Block CTA]            │ │ │ • Quiz 2: tomorrow 11:59PM │ │
│ └────────────────────────────────────┘ │ └─────────────────────────────┘ │
│                                        │                                 │
│ ┌────────────────────────────────────┐ │ ┌─────────────────────────────┐ │
│ │ 📅 TODAY'S AGENDA TIMELINE         │ │ │ 📈 STUDY STATS              │ │
│ │ • 09:30 AM - Computer Networks     │ │ │ Streak: 7 Days              │ │
│ │ • 11:00 AM - Hardware Lab          │ │ │ Covered Topics: 12          │ │
│ └────────────────────────────────────┘ │ └─────────────────────────────┘ │
└────────────────────────────────────────┴─────────────────────────────────┘
```

*   **Reading Flow:** Z-Pattern. Greeting ➔ Alert notifications panel ➔ Recommended study block ➔ Today's agenda list ➔ Streak statistics.

---

### 2. Course Details Page Map
*   **Primary User Question:** *"What is remaining in this syllabus and how is my progress?"*
*   **Layout Blueprint:**

```
┌──────────────────────────────────────────────────────────────────────────┐
│ BREADCRUMBS: Courses / Data Structures                                   │
│ TITLE: CS201: Data Structures & Algorithms                               │
├────────────────────────────────────────┬─────────────────────────────────┤
│ LEFT PANEL: COURSE METADATA (3 Cols)   │ RIGHT PANEL: CONTENT TABS (9 Cols)│
│                                        │                                 │
│ ┌────────────────────────────────────┐ │ ┌─────────────────────────────┐ │
│ │ Progress: 72% Complete             │ │ │ [Syllabus] [Notes] [Library]│ │
│ │ Attendance: 82% (Safe buffer: +4)  │ │ ├─────────────────────────────┤ │
│ │ Credits: 4                         │ │ │ MODULE 1: TREES (75% Complete│ │
│ │ Faculty: Dr. R. Gupta              │ │ │  [x] Binary Trees           │ │
│ └────────────────────────────────────┘ │ │  [x] AVL Trees              │ │
│                                        │ │  [ ] Red-Black Trees        │ │
│                                        │ │                               │ │
│                                        │ │ MODULE 2: GRAPH ALGORITHMS  │ │
│                                        │ │  [ ] Breadth First Search   │ │
│                                        │ └─────────────────────────────┘ │
└────────────────────────────────────────┴─────────────────────────────────┘
```

*   **Reading Flow:** Split-Pane. Left panel meta-cards (Credits, progress, attendance buffer) ➔ Tab select header ➔ Tab content layout on the right.

---

## Part 4 — Semester Journey (Timeline Layout)

We compare two layout options for displaying the semester journey timeline:

### Option A: Horizontal Weekly Flow
```
[Week 1] ➔ [Week 2] ➔ [Week 3 (Current)] ➔ [Week 4] ➔ [Week 5]
```
*   *Pros:* Natural left-to-right chronological progression match. Shows the entire semester span on broad monitors.
*   *Cons:* Requires horizontal scrolling on smaller viewports. Truncates course name text, making nested detail lists hard to read.

### Option B: Vertical Weekly Flow (Recommended)
```
▼ Week 3: Current (Jul 12 - Jul 18)
  ├── 📅 Mon: Computer Networks Lab Report Due
  ├── 💻 Data Structures: Module 2 (Trees) Syllabus Block
  └── 📚 Math: Linear Algebra Midterm Exam
▶ Week 4: Upcoming (Jul 19 - Jul 25)
▶ Week 5: Upcoming (Jul 26 - Aug 01)
```
*   *Pros:* Vertical flow scale wraps naturally on mobile. Easy to expand and collapse weeks as accordions. Consistent reading order.
*   *Cons:* Less visual mapping of a "linear path" than a horizontal chart.
*   *Verdict:* **Option B (Vertical Weekly Flow)** is selected as the primary structural design. It conforms to responsive wrapping rules and prevents scrolling conflict issues.

---

## Part 5 — Insights Page Map

Designed to answer: **"Am I on track to meet my semester CGPA goals?"**

```
┌──────────────────────────────────────────────────────────────────────────┐
│ TITLE: Semester Performance Insights                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. STUDY HEATMAP (12 Columns)                                            │
│ [ Jan ■■□■■■■ Feb ■■■■■■■ Mar ■■■□■■■ Apr ■■■■■■■ ]                      │ (Height: 140px)
├────────────────────────────────────────┬─────────────────────────────────┤
│ 2. TIME ALLOCATION (6 Columns)         │ 3. COURSE PROGRESS (6 Columns)  │
│ • Data Structures: 14.5 hrs            │ • Data Structures: 72%  [|||||·]│
│ • Linear Algebra: 8.0 hrs              │ • Linear Algebra: 40%   [||····]│
│ • Computer Networks: 11.2 hrs          │ • Comp Networks:  55%   [|||···]│
├────────────────────────────────────────┴─────────────────────────────────┤
│ 4. ATTENDANCE REGULATION MARGINS (12 Columns)                            │
│ • Math IV: 76.2% (1-class buffer warning!)                               │
│ • Computer Networks: 85.0% (Safe buffer: +6 classes)                     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Part 6 — Empty Layout Wireframe Spec

Empty states are structured to maintain balanced proportions and prevent visual layout collapse:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                       ┌────────────────────────┐                         │
│                       │    [ ILLUSTRATION ]    │                         │ (Height: 120px)
│                       └────────────────────────┘                         │
│                           NO ACTIVE COURSES                              │
│                Your academic workspace is currently empty.               │
│               Let's import your semester syllabus plan.                  │
│                                                                          │
│                     ┌────────────────────────────┐                       │
│                     │     [+ Seed Semester]      │                       │ (Primary CTA)
│                     └────────────────────────────┘                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Part 7 — Responsive Structural Adaptations

```
DESKTOP (12 Cols)                  TABLET (8 Cols)              MOBILE (4 Cols)
┌─────────┬──────────────┐         ┌───┬──────────────┐         ┌──────────────┐
│ Sidebar │ Main Content │         │ S │ Main Content │         │ Main Content │
│ (240px) │ (Max 1280px) │ ➔       │ B │ (Flex Col)   │ ➔       │ (Flex Col)   │
│         │              │         │(72│              │         ├──────────────┤
│         │ [ColA][ColB] │         │ px│ [ColA]       │         │ Bottom Nav   │
│         │              │         │   │ [ColB]       │         │ (56px)       │
└─────────┴──────────────┘         └───┴──────────────┘         └──────────────┘
```

*   **Responsive Transformation Rules:**
    1.  **Sidebar:** Collapses to 72px icon strip on Tablet, moves to drawer overlay/bottom bar on Mobile.
    2.  **Dashboard Columns:** Column A (8 cols) and Column B (4 cols) sit side-by-side on Desktop. On Tablet and Mobile, Column B collapses beneath Column A into a single vertical stack.
    3.  **Form Fields:** Double-column forms on desktop (e.g. Due Date next to Priority selection) collapse into a single-column layout on Mobile viewports.

---

## Part 8 — Visual Hierarchy & Elements Classification

### Home Dashboard Page
1.  **Primary Element:** The Recommended Study Card. Occupies the largest visual area, situated top-left in Column A.
2.  **Secondary Element:** The Urgent Alerts Bar. Small, high-contrast container on the right column.
3.  **Supporting Element:** Today's Agenda list and study streak meters. Small text labels with low visual weight.

### Course Syllabus Checklist
1.  **Primary Element:** Module Accordion Headers. Thick border dividers, bold titles, and progress percent labels.
2.  **Secondary Element:** Topic row checkboxes and titles. indented within Module sections.
3.  **Supporting Element:** Topic estimated hours metadata tags. Low contrast, small font size, right-aligned.

---

## Part 9 — Spatial Design System Rules

*   **Grouping Rules (Law of Proximity):** Connected elements (like a topic title and its estimated study time) are grouped inside a single row container with a maximum gap of 8px.
*   **Card Internals:** Cards use a consistent padding of 20px on desktop and 16px on mobile. 
*   **Alignment Principles:** All text labels are left-aligned to mirror natural reading behaviors. Numerical stats and indicators align to the right to maintain vertical column tracking.

---

## Part 10 — UX Walkthrough (First Interaction Scenario)

1.  **Landing Point:** The student opens the Home screen. Their eye lands first on the **Syllabus Recommendation Card** due to its scale and top-left alignment (F-Pattern scan).
2.  **Second Point:** The gaze shifts right to the **Urgent Alerts Box** to verify if there are any immediate deadlines or attendance buffer drops.
3.  **Third Point:** The student scrolls down to **Today's Agenda** to plan travel or locate their next class details.
4.  **Fourth Point:** They click `Start Study` on the Recommended Card, triggering the study timer overlay.

---

## Part 11 — Structural Design Audit

*   **Jakob's Law Check:** Standard layouts (sidebar navigation, top toolbar breadcrumbs, settings tabs) ensure the user has zero friction learning the interface.
*   **Hick's Law Check:** Long lists of 30+ syllabus topics are nested under collapsible Module containers, reducing the initial options visible.
*   **Fitts' Law Check:** The primary CTA inside dialogs and overlays spans the full width of the container footer, ensuring a large, easy-to-click target.
*   **Doherty Threshold Check:** Navigational elements use clean HTML skeletal containers, preventing layout layout shifts during asynchronous state transitions.
