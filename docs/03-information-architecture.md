# SemesterOS: Information Architecture & Content Hierarchy
**Internal Design Document | Phase 3**  
**Role:** Principal Information Architect, Senior UX Strategist, Cognitive Psychologist & Product Designer  

---

## Part 1 — Information Principles

To prevent SemesterOS from becoming another bloated task manager, all information structuring is governed by six cognitive information architecture principles:

### I. Single Source of Truth (SSOT)
Every piece of information has exactly one canonical home. An assignment's due date is defined once in the database; any calendar view, dashboard alert, or syllabus list that displays it simply references that single source. This guarantees zero sync mismatches.

### II. Contextual Relevance (Zero Duplication)
We display information only where it is actionable. Notes and reference materials belong inside their respective course and topic boundaries, not on global lists where they clutter the user's field of view.

### III. Algorithmic Surfacing
The student should never have to manually dig for what is urgent. The system automatically elevates high-risk variables (such as attendance approaching 75% or a heavy-weighted assignment due in 48 hours) to the global dashboard.

### IV. Progressive Disclosure
Information is shown in layers. A user is presented with a high-level summary first, then details on demand. We avoid displaying detailed sub-metrics, notes metadata, or logs until the student explicitly clicks to drill down.

### V. One Primary Question per Screen
Each view is designed to resolve exactly one core academic query:
*   **Home:** *"What should I focus on right now?"*
*   **Courses:** *"How am I performing across all subjects?"*
*   **Course Details:** *"What do I need to finish to master this course?"*
*   **Planner:** *"What are my concrete deliverables?"*
*   **Timeline:** *"How is my workload distributed over time?"*

### VI. Predictable Navigation Paths
Students should never have to guess where an item lives. We use a nested taxonomy matching academic hierarchies: `Semesters ➔ Courses ➔ Modules ➔ Topics ➔ Tasks/Resources/Notes`.

---

## Part 2 — Domain Model & Entity Definitions

The core of the SemesterOS database consists of seven primary entities. Their definitions, lifecycles, and dependencies are detailed below:

```
┌────────────────────────────────────────────────────────┐
│                        SEMESTER                        │
└───────────────────────────┬────────────────────────────┘
                            │ (Has many)
┌───────────────────────────▼────────────────────────────┐
│                         COURSE                         │
└───────────────────────────┬────────────────────────────┘
                            ├────────────────────────────┐
                            │ (Has many)                 │ (Has many)
┌───────────────────────────▼────────────────────┐       │
│                         MODULE                 │       │
└───────────────────────────┬────────────────────┘       │
                            │ (Has many)                 │
┌───────────────────────────▼────────────────────┐       │
│                          TOPIC                 │       │
└───────────────────────────┬────────────────────┘       │
      ┌─────────────────────┴─────────────────────┐      │
      ▼                                           ▼      ▼
┌───────────┐                               ┌───────────┐
│ STUDY LOG │                               │    TASK   │
└───────────┘                               └───────────┘
```

### 1. Semester
*   **Purpose:** The top-level bounding context. Defines the active academic term.
*   **Ownership:** Global. System-wide context.
*   **Lifecycle:** Setup at term start ➔ Active (daily tracking) ➔ Archived (read-only history at term end).
*   **Dependencies:** None.

### 2. Course
*   **Purpose:** A specific subject representing a class (e.g. Data Structures, Linear Algebra).
*   **Ownership:** Owned by a Semester.
*   **Lifecycle:** Created ➔ Progressing (0-99% syllabus completion) ➔ Completed (100% syllabus progress).
*   **Dependencies:** Must belong to a Semester. Contains Modules, Tasks, Notes, and Resources.

### 3. Module
*   **Purpose:** A conceptual unit of a course syllabus (e.g. Module 1: Binary Trees).
*   **Ownership:** Owned by a Course.
*   **Lifecycle:** Static once syllabus is seeded. Automatically calculates its progress from child Topics.
*   **Dependencies:** Must belong to a Course.

### 4. Topic
*   **Purpose:** A granular, single learning objective (e.g. "AVL Tree Balancing"). The fundamental unit of academic tracking.
*   **Ownership:** Owned by a Module.
*   **Lifecycle:** Pending (Not studied) ➔ In Progress (actively reading) ➔ Completed (mastered).
*   **Dependencies:** Must belong to a Module.

### 5. Task (Assignment / Deliverable)
*   **Purpose:** A graded or non-graded task with a hard deadline (e.g., Homework 3, Lab Report).
*   **Ownership:** Owned by a Course. Optionally linked to a Topic.
*   **Lifecycle:** Pending ➔ In Progress ➔ Completed.
*   **Dependencies:** Must belong to a Course.

### 6. Study Session
*   **Purpose:** An active time block logged by the student studying a specific Topic.
*   **Ownership:** Linked to a Topic and Course.
*   **Lifecycle:** Active (timer running) ➔ Saved (written to history logs).
*   **Dependencies:** Must reference a Topic and Course.

### 7. Attendance Log
*   **Purpose:** Record of class presence or absence.
*   **Ownership:** Owned by a Course.
*   **Lifecycle:** Logged (Present/Absent/Cancelled) ➔ Constant buffer recalculation.
*   **Dependencies:** Must belong to a Course.

---

## Part 3 — Content Hierarchy & Layout Structure

To enforce visual balance, information on every view is grouped into five structural priority tiers:

| View Page | Primary Info (Focal Point) | Secondary Info | Supporting Info | Hidden Info (Disclosure) | Contextual Info |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Home (`/`)** | Next recommended study topic card. | Urgent deadlines (next 48h), attendance drop warnings. | Current daily schedule, overall semester progress ring. | Past study sessions, historical notifications list. | Current active semester context tag. |
| **Courses (`/courses`)** | Course cards with progress rings. | Current attendance safety indicators. | Credit weights, pending task counts, faculty names. | Individual topic lists, historical notes counts. | Semester GPA target goals. |
| **Course Details** | Syllabus module accordion tree. | Attendance buffer margin logs, credit value. | Linked note links, textbook resources list. | Detailed study session timestamps. | Active selected course ID and name. |
| **Planner (`/planner`)** | Overdue and pending assignments. | Priority badge tags, due dates. | Estimated hours duration, grade weighting %. | Detailed description text, sub-task lists. | Filters applied indicator. |
| **Timeline (`/timeline`)** | Month calendar grid with date markers. | Focus day agenda cards. | Course indicator colors. | Event creation details. | Current highlighted date. |

---

## Part 4 — Page Information Structure Blueprints

### 1. Home Dashboard
Designed to answer: **"What should I do right now to maintain momentum and stay safe?"**

```
┌────────────────────────────────────────────────────────────────────────┐
│ [GREETING] "Good Morning, Hemanth."                                    │
│ [SEMESTER FOCUS PROGRESS] ══════════════ 45% Complete                  │
├────────────────────────────────────────────────────────────────────────┤
│ 💡 SMART RECOMMENDATION                                                 │
│ Next Topic: "Red-Black Tree Insertion" in Data Structures              │
│ Reason: "Linked to Assignment due in 3 days. Focus for 45 mins."       │
│ [Start Study Session CTA]                                              │
├────────────────────────────────────────────────────────────────────────┤
│ ⚠️ URGENT ATTENTION (Proactive Warnings)                                │
│ • Attendance in Math IV at 74.8% (Must attend tomorrow's class)        │
│ • Quiz 2 (Data Structures) due tomorrow at 11:59 PM (Weight: 10%)      │
├────────────────────────────────────────────────────────────────────────┤
│ 📅 TODAY'S AGENDA                                                      │
│ • 09:30 AM - Lecture: Computer Networks                                │
│ • 11:00 AM - Lab: Hardware Architecture                                │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Courses Directory
Designed to answer: **"How am I performing across all subjects?"**

```
┌────────────────────────────────────────────────────────────────────────┐
│ COURSES DIRECTORY                                       [+ Add Course] │
├────────────────────────────────────────────────────────────────────────┤
│ 💻 DATA STRUCTURES                                       [Syllabus: 72%]│
│ Attendance: 82% (4-class safety margin)                  [Tasks: 2 Due]│
│ Faculty: Dr. Gupta • Credits: 4                          [Diff: Hard]  │
├────────────────────────────────────────────────────────────────────────┤
│ 🧮 LINEAR ALGEBRA                                        [Syllabus: 40%]│
│ Attendance: 76% (1-class safety margin - WARNING!)       [Tasks: 0 Due]│
│ Faculty: Prof. Sen • Credits: 3                          [Diff: Medium]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## Part 5 — Content Priority Matrix

We restrict visual data by mapping information to a strict four-tier priority index:

```
┌────────────────────────────────────────────────────────┐
│                        CRITICAL                        │
│  - Assignment due in < 24 hours.                       │
│  - Attendance percentage below 75%.                    │
│  - Active study session recommendation.                │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                        IMPORTANT                       │
│  - Syllabus progress indicators.                       │
│  - Upcoming class schedule events.                     │
│  - Priority assignment tasks list.                     │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                         USEFUL                         │
│  - Target GPA calculators.                             │
│  - Textbook and online resource URLs.                  │
│  - Study history streak count.                         │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                        OPTIONAL                        │
│  - Creation timestamps.                                │
│  - Completed archived courses.                         │
│  - Non-academic personal notes.                        │
└────────────────────────────────────────────────────────┘
```

---

## Part 6 — Progressive Disclosure Strategy

To avoid cognitive overload, information is revealed sequentially using clear layout boundaries:

1.  **Always Visible:** Current active task titles, overall course progress rings, course names, and attendance warning states.
2.  **Visible in Accordion Dropdowns:** Detailed topic syllabus checklists inside Modules. (Modules remain collapsed by default to save vertical scroll space).
3.  **Visible in Side Panels:** Note editors and resource creation cards slide out from the right side of the screen when clicked, maintaining core page context.
4.  **Visible in Dialog Modals:** "Quick Add" task forms, delete confirmations, and course creation forms. Kept hidden until a CTA is clicked.
5.  **Visible on Hover (Tooltip):** Exact attendance values (e.g. *"14 out of 18 classes attended"* is disclosed when hovering over the *"82% Attendance"* badge).

---

## Part 7 — Searchable Content Index & Ranking

All searchable components are indexed using specific search-ranking weights:

1.  **Priority 1: Course Codes & Titles (Weight: 1.0)**
    *   *Example:* Querying `"CS201"` or `"Data"` immediately highlights the **CS201 Course Detail Page**.
2.  **Priority 2: Planner Tasks (Weight: 0.8)**
    *   *Example:* Querying `"report"` surfaces the **Lab Report 2 Assignment**.
3.  **Priority 3: Syllabus Topics (Weight: 0.6)**
    *   *Example:* Querying `"trees"` matches the **Binary Trees Topic** inside Module 2.
4.  **Priority 4: Resources & Links (Weight: 0.4)**
    *   *Example:* Querying `"drive"` matches saved Google Drive links.
5.  **Priority 5: Scratchpad Notes Content (Weight: 0.2)**
    *   *Example:* Searches note text for keyword matches.

---

## Part 8 — Dashboard Priority Engine Logic

The Home Dashboard organizes information dynamically by evaluating data using a five-step priority engine:

```
[Is there an assignment due in < 24h OR attendance below 75%?]
        ├── YES ➔ Elevate to Tier 1: "Critical Alerts Bar"
        └── NO  ➔ Proceed
                 │
[Identify next incomplete topic linked to upcoming deadlines]
        └── Elevate to Tier 2: "Smart Recommendation Card"
                 │
[Query active classes scheduled for the current day]
        └── Elevate to Tier 3: "Today's Agenda Timeline"
                 │
[Query tasks due in the next 7 days]
        └── Elevate to Tier 4: "Upcoming Deadlines List"
                 │
[Query overall semester completion metrics]
        └── Elevate to Tier 5: "Semester Progress summary"
```

---

## Part 9 — Attention System States

To guide a student's focus, items shift across six visual urgency states as deadlines approach or attendance levels drop:

*   **Normal:** Standard layout state. High contrast, clean text. Used for items with > 7 days margin.
*   **Highlighted:** Subtle primary color background. Applied to the recommended topic or today's active classes.
*   **Warning:** Amber markers. Triggered when attendance drops to $75\% - 78\%$ or a task is due in $24 - 48\text{ hours}$.
*   **Critical:** High-contrast red/rose details. Triggered when attendance drops below $75\%$ or a task is due in $< 24\text{ hours}$.
*   **Completed:** De-emphasized state. Elements are struck through and opacity is reduced to 60% to draw focus away to pending work.
*   **Archived:** Hidden from main lists. Accessible only via filters or history logs.

---

## Part 10 — Empty Information States

When no user data is loaded, the interface acts as a guide, providing clear next actions:

### No Courses Setup
*   **Messaging:** *"Your semester is a blank canvas. Let's seed your courses to initialize the Operating System."*
*   **Action CTA:** `Seed Core Courses` (Launches quick-start templates).

### No Planner Tasks
*   **Messaging:** *"All clear! No pending deliverables on your radar. Spend some time reviewing syllabus topics."*
*   **Action CTA:** `Add Assignment` / `Review Syllabus`.

### No Study History
*   **Messaging:** *"Your study logs are empty. Start a recommended study session to begin tracking your streaks."*
*   **Action CTA:** `Start Recommended Session`.

---

## Part 11 — Feature Inventory & Prioritization (MVP Checkpoint)

To ensure focus and prevent feature creep, all functionality is categorized using the MoSCoW framework:

```
┌───────────────────────────────────────┐
│              MUST HAVE                │
│  - Syllabus recommendation engine    │
│  - Modular Course syllabus tree       │
│  - Attendance buffer calculator       │
│  - Assignment planner & list          │
│  - Unified calendar Timeline agenda   │
└──────────────────┬────────────────────┘
                   │
┌──────────────────▼────────────────────┐
│             SHOULD HAVE               │
│  - Course library (resource manager)  │
│  - Markdown notes scratchpad          │
│  - Real-time Insights statistics      │
│  - Smart notification system          │
└──────────────────┬────────────────────┘
                   │
┌──────────────────▼────────────────────┐
│             COULD HAVE                │
│  - Pomodoro timer integration         │
│  - Local PDF/syllabus parser          │
│  - Placement-prep tracking modules    │
│  - Quick command palette (⌘K)         │
└──────────────────┬────────────────────┘
                   │
┌──────────────────▼────────────────────┐
│             WON'T HAVE                │
│  - Leaderboards / social features    │
│  - Chat rooms / study lobbies         │
│  - Grading center / grade submissions │
└───────────────────────────────────────┘
```

---

## Part 12 — Future Scalability Architecture

SemesterOS uses a modular data schema designed to scale easily. Here is how new modules integrate without breaking the existing core structure:

```
┌──────────────────────────────────────────────┐
│                  SemesterOS                  │
│                (App Container)               │
├───────┬──────────────────────────────┬───────┤
│ Core  │           Pluggable          │ Core  │
│ Store │            Modules           │ Store │
│ (Zustand)                           │ (Zustand)
│       │  ┌────────────────────────┐  │       │
│       │  │       AI Tutor         │  │       │
│       │  ├────────────────────────┤  │       │
│       │  │      Flashcards        │  │       │
│       │  ├────────────────────────┤  │       │
│       │  │   Placement Tracker    │  │       │
│       │  └────────────────────────┘  │       │
└───────┴──────────────────────────────┴───────┘
```

1.  **AI Tutor Integration:** Mapped directly to the `Topic` entity. The AI Tutor reads the topic title and description, opening a side panel with relevant study prompts.
2.  **Flashcards Module:** Linked to specific `Modules` as study materials. Flashcard decks leverage the existing `StudySession` database to track flashcard review intervals.
3.  **Placement Tracker:** Integrates as a separate root route (`/placements`) that acts like a Course entity, where LeetCode topics and interview prep track alongside academic syllabus topics.

---

## Part 13 — Cognitive Load Analysis

An audit of the layout reveals cognitive load vectors and recommendations for mitigation:

### 1. Visual Load (Visual Noise)
*   *Potential Issue:* Too many progress rings, tags, and badges rendering concurrently.
*   *Mitigation:* Limit progress indicators to 1 per course on the dashboard. Use muted slate colors for tags, reserving high-contrast colors (amber/rose) exclusively for items requiring attention.

### 2. Information Load (Density)
*   *Potential Issue:* Displaying a course’s entire 40-topic syllabus list in a single view.
*   *Mitigation:* Group topics under collapsible Module accordions. Keep all modules collapsed by default, letting the user open them one by one.

### 3. Decision Load (Choice Paralysis)
*   *Potential Issue:* Showing a long, flat list of 25 pending tasks on the home screen.
*   *Mitigation:* Hide the full task list behind the `Planner` route. The home dashboard displays only the top 3 urgent tasks.

### 4. Memory Load (Cognitive Recall)
*   *Potential Issue:* Requiring students to remember where a study link was saved.
*   *Mitigation:* Keep a dedicated "Resources" tab inside the course details workspace, ensuring study materials live next to the syllabus topics they cover.
