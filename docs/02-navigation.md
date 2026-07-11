# SemesterOS: UX Navigation Architecture & Information Flow
**Internal Design Document | Phase 2**  
**Role:** Principal UX Architect, Product Designer, Information Architect & HCI Expert  

---

## Part 1 — User Mental Model

To build an intuitive Academic Operating System, we must align the navigation architecture with how students naturally structure their term:

```
                  ┌─────────────────────────────────┐
                  │            SEMESTER             │
                  └────────────────┬────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────┐                                 ┌─────────────────┐
│ TIME STRUCTURE  │                                 │ COURSE STRUCTURE│
│ (Months/Weeks)  │                                 │ (Credits/Syllbi)│
└────────┬────────┘                                 └────────┬────────┘
         │                                                   │
         ▼                                                   ▼
┌─────────────────┐                                 ┌─────────────────┐
│      DAYS       │◀───────────────────────────────▶│     MODULES     │
│ (Daily Agenda)  │                                 │ (Topic Groups)  │
└────────┬────────┘                                 └────────┬────────┘
         │                                                   │
         ▼                                                   ▼
┌─────────────────┐                                 ┌─────────────────┐
│ STUDY SESSIONS  │◀───────────────────────────────▶│     TOPICS      │
│ (Active Focus)  │                                 │ (Granular Units)│
└─────────────────┘                                 └────────┬────────┘
                                                             │
                                        ┌────────────────────┴────────────────────┐
                                        ▼                                         ▼
                               ┌─────────────────┐                       ┌─────────────────┐
                               │   DELIVERABLES  │                       │    RESOURCES    │
                               │  (Assignments)  │                       │ (Notes & Links) │
                               └─────────────────┘                       └─────────────────┘
```

Students do not think of their courses in isolation; they mentally navigate along two primary axes:
1.  **The Content Axis (Academics):** `Semester ➔ Courses ➔ Modules ➔ Topics ➔ Notes/Resources.`
2.  **The Execution Axis (Time):** `Deadlines ➔ Weekly Workloads ➔ Daily Agendas ➔ Focused Study Sessions.`

SemesterOS bridges these two axes. An assignment is not just a floating task; it is linked to a **Topic**, which belongs to a **Module**, which belongs to a **Course**, which is active in the current **Semester**.

---

## Part 2 — Application Map

SemesterOS is organized into seven major views. Here is the structural map and the UX rationale for each:

```
[Viewport Container]
 ├── Sidebar (Global Navigation & Context Switches)
 ├── Top Navigation (Quick actions, Global search, Profile)
 └── Main Content Area
      ├── / (Home / Academic Command Center)
      ├── /courses (Syllabus Tracker List)
      │    └── /courses/:id (Course detail tabs: Syllabus, Notes, Resources, Attendance)
      ├── /planner (Assignment Hub)
      ├── /timeline (Unified Deadlines & Agenda Calendar)
      ├── /insights (Performance Analytics & Attendance Margins)
      └── /preferences (Settings & Profile Configuration)
```

### 1. Home (`/`)
*   **Purpose:** The central command center.
*   **UX Rationale:** Eliminates decision fatigue immediately. It serves as a dashboard that answers: *"What is happening today, what needs study right now, and am I safe?"*

### 2. Courses (`/courses`)
*   **Purpose:** High-level summary of active subjects.
*   **UX Rationale:** Provides an index card view of all courses, displaying progress rings, credit weighting, and attendance flags.

### 3. Course Details (`/courses/:id`)
*   **Purpose:** Granular content database for a specific course.
*   **UX Rationale:** A single workspace containing four tabbed modules: Syllabus (Topics checklist), Notes (scratchpad), Resources (links/files), and Attendance (session logs).

### 4. Planner (`/planner`)
*   **Purpose:** Focused task management hub.
*   **UX Rationale:** Academic-specific to-do list. Grouped by status (Pending, In Progress, Completed), allowing students to drag tasks through their completion lifecycle.

### 5. Timeline (`/timeline`)
*   **Purpose:** Unified calendar agenda.
*   **UX Rationale:** Combines academic lectures, exams, and task deadlines into a single timeline. Prevents "midterm blindness" by visualizing week-by-week workload density.

### 6. Insights (`/insights`)
*   **Purpose:** High-fidelity performance analytics.
*   **UX Rationale:** Aggregates data from study logs, attendance buffers, and course completion to show overall progress.

### 7. Preferences (`/preferences`)
*   **Purpose:** System and term setup.
*   **UX Rationale:** Standard portal for settings, dark/light themes, notifications, and resetting database content.

---

## Part 3 — Sidebar Design

Inspired by the structural cleanliness of **Linear** and **Arc**, the sidebar acts as the primary anchor for navigation.

```
┌──────────────────────────────────────┐
│  🎓 SemesterOS                       │ [Header: App Name & Brand Indicator]
├──────────────────────────────────────┤
│  🔍 Search & Command        ⌘K       │ [Global Command Bar Shortcut]
├──────────────────────────────────────┤
│  🏠 Home                             │ [Primary Navigation]
│  📚 Courses                          │
│  📝 Planner                          │
│  📅 Timeline                         │
│  📊 Insights                         │
├──────────────────────────────────────┤
│  📌 FAVORITES                        │ [Pinned Courses Section]
│  • 💻 Data Structures   [72%]        │ (Quick jump with progress indicators)
│  • 🧮 Linear Algebra    [40%]        │
├──────────────────────────────────────┤
│  ⚙️ Preferences                      │ [Footer Utility Navigation]
└──────────────────────────────────────┘
```

### Sidebar Interaction Architecture
*   **Collapsibility:** The sidebar can be collapsed into a compact icon-only rail (72px wide) using `⌘\` or by clicking the toggle button.
*   **Label Behavior:** Labels fade out entirely when collapsed, leaving clean, high-contrast Lucide icons.
*   **Favorites & Pins:** Students can star up to four courses. These appear as quick links with micro-progress rings next to the names.
*   **Active Indicator:** A sleek, vertical pill animates smoothly between active states using spring physics (`layoutId` in framer-motion) to avoid jarring click transitions.

---

## Part 4 — Top Navigation

The top bar is a utility layer that sits above the content, providing global status and fast actions:

```
┌───────────────────────────────────────────────────────────────────────────┐
│ 🏠 Home  /  Syllabus   [Semester Selector: Fall 2026 ▾]    [+ Task]  🔔  👤│
└───────────────────────────────────────────────────────────────────────────┘
```

### Key Elements:
1.  **Breadcrumbs:** Shows current path locator (e.g., `Courses ➔ Data Structures ➔ Syllabus`). Clickable elements allow easy backward navigation.
2.  **Semester Selector:** Context switcher (e.g., `Fall 2026 ▾`). Selecting a different semester filters all courses, tasks, and calendar events dynamically.
3.  **Global Command Shortcut Button:** Visual signpost showing `Search (⌘K)` to prompt keyboard-driven exploration.
4.  **Quick Add Button (`+`):** Global primary CTA. Opens a modal to instantly log a new task or study session from any screen.
5.  **Notification Hub:** Clean, dot-indicator bell icon for safety margin drops and approaching deadlines.
6.  **Profile Avatar:** Access to user details and account status.

---

## Part 5 — Command Palette (⌘K)

The central terminal of SemesterOS. The palette overlay is triggered via `⌘K` (Mac) or `Ctrl+K` (Windows).

```
┌────────────────────────────────────────────────────────┐
│  🔍 Search courses, topics, tasks, or commands...      │
├────────────────────────────────────────────────────────┤
│  NAVIGATE                                              │
│  ↳ Go to Home                                    G→H   │
│  ↳ Go to Courses                                 G→C   │
│  ↳ Go to Planner                                 G→P   │
├────────────────────────────────────────────────────────┤
│  COURSES                                               │
│  ↳ 💻 Data Structures & Algorithms                     │
│  ↳ 🧮 Linear Algebra & Matrices                       │
├────────────────────────────────────────────────────────┤
│  ACTIONS                                               │
│  ↳ Create a New Task                             +T    │
│  ↳ Log a Study Session                           +S    │
└────────────────────────────────────────────────────────┘
```

### Ranking & Search Engine Rules:
*   **Search Behavior:** Fuzzy matching on strings. Querying `"ds"` matches *"Data Structures"*.
*   **Categorization:** Results are strictly categorized: Commands ➔ Courses ➔ Tasks ➔ Help Topics.
*   **Ranking Algorithm Score:**
    $$\text{Score} = (\text{Match Quality}) \times 1.5 + (\text{Recency Weight}) + (\text{Frequency Weight})$$
*   **Quick Execution:** Clicking an action or hitting `Enter` immediately runs the command or navigates to the target page, auto-closing the palette overlay.

---

## Part 6 — Page Hierarchy & Design Layout

### 1. Home Center
*   **Primary Goal:** Direct the student to the next best action.
*   **Secondary Goal:** Alert the student of imminent deadline and attendance risks.
*   **Primary CTA:** `Start Recommended Study Block` (Focal recommendation card).
*   **Secondary CTA:** `Log Study Session` / `Quick Add Task`.
*   **Reading Order:** Z-Pattern. Focal card at top-left ➔ Workload meters top-right ➔ Dynamic schedule list center ➔ Alerts footer.
*   **Exit Paths:** Side navigation, timeline links, course details.

### 2. Courses Directory
*   **Primary Goal:** View overall course performance and syllabus status.
*   **Secondary Goal:** Check attendance health.
*   **Primary CTA:** `Add New Course` (Empty state or Header action).
*   **Secondary CTA:** individual `Course Cards` (Go to Detail).
*   **Reading Order:** Grid layout (Grid-Pattern). Scanning top-left cards to bottom-right.
*   **Exit Paths:** Back to Home, command palette, settings.

### 3. Course Detail Tabs
*   **Primary Goal:** Update syllabus progress (Topics checklist) or access resources.
*   **Secondary Goal:** Review notes and log attendance.
*   **Primary CTA:** `Mark Topic Complete` (Inside Syllabus Checklist).
*   **Secondary CTA:** `New Note Entry` / `Add Resource Link`.
*   **Reading Order:** Left-to-right split screen. Details sidebar on the left (Instructor, credits, attendance) ➔ Tabs navigation and active tab content on the right.
*   **Exit Paths:** Breadcrumbs, back to Courses, sidebar.

---

## Part 7 — Core Navigation User Flows

### Flow 1: First Launch (Onboarding)
```
[Landing] ➔ [Select Term & Weeks] ➔ [Pre-seed Courses Template] ➔ [Auto-navigate to Home]
```
1.  User starts on a clean onboarding welcome screen.
2.  Input basic academic details: Semester name, duration, and credit values.
3.  Click "Generate Semester" ➔ Automatically builds the schema and redirects the user to the empty Home dashboard with guide tips.

### Flow 2: Recording Study Progress (Complete Topic)
```
[Home/Courses] ➔ [Open Course] ➔ [Click Syllabus Tab] ➔ [Check Topic Box] ➔ [Auto-update Progress Rings]
```
1.  From Home, click on the recommended course target.
2.  Go directly to the course detail page (Syllabus tab active by default).
3.  Click the completion checkbox on the specific Topic.
4.  Visual feedback: Progress ring updates dynamically in the sidebar and header.

### Flow 3: Creating a Task (Quick Add)
```
[Any Screen] ➔ [Press +T or Click + Task] ➔ [Fill Modal Fields] ➔ [Save] ➔ [Background sync & close]
```
1.  Press `+` button in the header or `+T` shortcut.
2.  The global add modal slides open with focus pre-set to the Title input field.
3.  Select Course from dropdown (pre-filled if triggered inside a course detail page).
4.  Enter details, press `Ctrl+Enter` to save ➔ Modal closes, toast notification confirms creation.

---

## Part 8 — Breadcrumbs & Context Navigation

To prevent students from feeling lost inside deep nested structures, SemesterOS uses a strict, flat breadcrumb model:

```
[Icon: Home]  /  Courses  /  Data Structures  /  Module 2: Trees  /  Syllabus
   ▲               ▲              ▲                ▲
 (Clickable)  (Clickable)    (Clickable)      (Active Page)
```

*   **Rule 1:** No breadcrumbs on top-level pages (Home, Planner, Timeline, Insights).
*   **Rule 2:** Breadcrumbs only render inside nested hierarchies (like course sub-pages, syllabus module outlines, or detailed note editors).
*   **Rule 3:** The current active node is always styled as static gray text (cannot be clicked).

---

## Part 9 — Mobile Navigation

On screens smaller than 768px, the sidebar is replaced by a hybrid navigation architecture:

```
┌──────────────────────────────────────────────┐
│                    CONTENT                   │
│                                              │
├──────────────────────────────────────────────┤
│ 🏠 Home    📚 Courses    📅 Timeline    ☰ Menu │ [Bottom Navigation Bar]
└──────────────────────────────────────────────┘
```

*   **Primary Destination Anchor (Bottom Bar):** Home, Courses, Timeline, and Menu.
*   **Menu Icon (☰):** Opens a full-screen drawer container containing Preferences, Insights, and secondary links.
*   **Floating Action Button (FAB):** A small, elevated circle (`+`) floats on the bottom-right corner to allow instant task adding.
*   **Touch Targets:** All interactive elements on mobile are padded to a minimum size of 44px x 44px to prevent mis-clicks.

---

## Part 10 — Keyboard-First Experience

SemesterOS is designed to be fully navigable without touching the mouse, optimizing speed for advanced users:

| Key Combination | Action performed | Rationale / Target |
| :--- | :--- | :--- |
| `⌘K` or `Ctrl+K` | Open Command Palette | Global access hub. |
| `G` then `H` | Go to Home | Quick jump to command dashboard. |
| `G` then `C` | Go to Courses | Quick jump to syllabus list. |
| `G` then `P` | Go to Planner | Quick jump to academic tasks. |
| `G` then `T` | Go to Timeline | Quick jump to calendar agenda. |
| `G` then `I` | Go to Insights | Quick jump to analytical summaries. |
| `G` then `S` | Go to Preferences | Quick jump to settings panels. |
| `/` | Focus search fields | Instant input access. |
| `Esc` | Close active overlay | Closes modals, palette, sidebar dropdowns. |
| `⌘\` or `Ctrl+\` | Toggle Sidebar | Collapse or expand navigation rail. |
| `J` / `K` | Move focus Up / Down | Keyboard focus traversal in lists. |
| `Enter` | Activate selected item | Confirms selections or opens detail views. |

---

## Part 11 — Navigation States

To ensure the OS feels reliable, we define four crucial navigation states:

### 1. Loading State
*   Use content skeletons to mirror the structure of the incoming data. Avoid spinner icons, which increase subjective wait time.

### 2. Empty State
*   Every empty view (e.g. no tasks, no courses) must contain a clear, singular illustration and a primary CTA button: *"Add Course"* or *"Create Task."*

### 3. Offline State
*   A clean, top-banner pill notifies the user: *"Working Offline. Changes will sync once reconnected."* The app remains fully functional using local database storage.

### 4. Error & Permission States
*   Full-page recovery states with an explicit recovery CTA: *"Go back to Home"* or *"Refresh Data Engine."*

---

## Part 12 — Click Depth Analysis

No critical action in SemesterOS should take more than three interactions from the Home page. Here is the depth audit:

| Target Action | Navigation Pathway | Clicks required |
| :--- | :--- | :--- |
| **Mark topic complete** | `Home ➔ Course Details ➔ Toggle Checkbox` | **2 Clicks** (Optimized) |
| **Check attendance buffer** | `Home ➔ Courses (Overview page)` | **1 Click** (Optimized) |
| **Log new study session** | `Click Quick Add (+) ➔ Enter Details ➔ Click Save` | **3 Steps** (Optimized) |
| **Check exam timeline** | `Home ➔ Click Timeline` | **1 Click** (Optimized) |
| **Update settings profile** | `Home ➔ Click Preferences` | **1 Click** (Optimized) |
| **Read course lecture notes** | `Home ➔ Course Details ➔ Notes Tab` | **2 Clicks** (Optimized) |

---

## Part 13 — Architecture Justifications & UX Heuristics

*   **Fitts's Law (Command Palette & Shortcuts):** Placing primary navigations inside a keyboard shortcut palette (`⌘K`) minimizes travel time for power users, making navigation feel instantaneous.
*   **Hick’s Law (Simplified Home Page):** Instead of showing all syllabus modules on the landing screen, the Recommendation Engine outputs only the *Next Best Study Block*, reducing cognitive decision time.
*   **Miller’s Law (Sidebar Category Limit):** The primary sidebar is restricted to 5 high-level paths to keep navigation chunking within short-term memory capacity limits (5 ± 2 items).
*   **Jakob’s Law (Standard Navigation Patterns):** We use standard, recognizable patterns (sidebar on left, breadcrumbs in header, tabs for sub-views) so students don't have to learn new UI metaphors.
