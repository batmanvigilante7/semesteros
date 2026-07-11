# SemesterOS: UX Flow & Interaction Design
**Internal Design Document | Phase 4**  
**Role:** Principal UX Designer, HCI Expert, Product Strategist & Behavioral Psychologist  

---

## Part 1 — Experience Principles (UX Philosophy)

SemesterOS follows an opinionated interaction model designed to keep students calm and focused:

### I. One Clear Action at a Time
To combat choice paralysis, interfaces display a singular, high-priority primary action. Secondary inputs are visually de-emphasized or hidden behind progressive disclosure points.

### II. Undo Over Interruption
Confirmations disrupt flow. Instead of modal boxes asking *"Are you sure?"* for common actions, SemesterOS executes the action immediately and opens a persistent **Undo Snackbar** at the bottom of the screen.

### III. Protect User Data
User inputs are saved automatically. Drafts are written locally on every keystroke. The user never loses their notes, task forms, or logged study sessions due to accidental page navigation or connection drops.

### IV. Predict Intentions
The system reduces friction. For example, if a student clicks *"Start Study"* on a topic, the application automatically launches a background study session timer, targets notes, and silences notifications.

### V. Celebrate Progress Gracefully
Academic achievements (like completing a module or maintaining a streak) are acknowledged with subtle, spring-based micro-interactions rather than loud, disruptive modals.

---

## Part 2 — Primary User Flows

SemesterOS interactions follow strict, predictable step sequences:

```
[Trigger Event] ➔ [Immediate Feedback (Skeleton/Optimistic UI)] ➔ [Action Executed] ➔ [Undo Option Surface]
```

### 1. First Launch Onboarding
*   `Landing Screen` ➔ Click `Setup Semester` ➔ Input semester parameters (weeks, courses) ➔ Click `Generate OS` ➔ Background generation of mock database ➔ Smooth navigation transition to `Home`.

### 2. Navigating to a Course Detail View
*   Click `Course Card` on Courses list ➔ URL transitions to `/courses/:id` ➔ Left sidebar details load instantly ➔ Right pane displays loading skeleton, then reveals syllabus module list.

### 3. Topic Completion Flow
*   Open Course Syllabus ➔ Hover over Topic checkbox ➔ Click Checkbox ➔ Immediate check indicator animation ➔ Sidebar progress ring ticks forward with spring ease ➔ Floating toast: *"Topic Completed (+1.5 hrs progress) • Undo"*.

### 4. Running a Study Session
*   Hover over recommended topic card on Home ➔ Click `Start Study` ➔ Card transforms into a minimized floating timer in the header ➔ Navigates page context to the course notes tab.
*   Click `Finish Study` ➔ Timer stops ➔ Pop-up form: *"Log study session?"* with pre-filled duration ➔ Save ➔ Progress indicator updates.

### 5. Creating a Task
*   Press `+T` shortcut or Click `+ Task` ➔ Overlay modal opens, inputs auto-focus ➔ Select Course, Priority, and Due Date ➔ Press `Ctrl+Enter` ➔ Modal slides out, task slides into list ➔ Undo banner appears.

### 6. Command Palette Exploration
*   Press `⌘K` ➔ Search overlay opens ➔ Type `"Math"` ➔ Search highlights Math course ➔ Press `Down Arrow` ➔ Press `Enter` ➔ Palette closes, UI navigates to `/courses/math`.

---

## Part 3 — Secondary Flows

*   **Theme Switching:** Click theme selector in Preferences (or use palette command) ➔ Page transition fades theme variables over 300ms.
*   **Archiving notes:** Open note list ➔ Slide item left (mobile) or hover and click `Archive` icon ➔ Item slides out of list ➔ Floating alert: *"Note archived. Undo"*.
*   **Resetting Progress:** Open Preferences ➔ Click `Reset Data` ➔ Opens a safety dialog box requiring the user to type *"RESET"* to confirm.

---

## Part 4 — Micro-Interactions Spec Sheet

| Interaction Target | Trigger | Animation / Behavior | Duration | Success State Feedback | Failure State | Loading State |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hover Card** | Cursor enters card box. | Lift card by `y: -4px`, shadow changes from subtle to medium depth. | 180ms | Card highlights. | None. | None. |
| **Button Press** | Mouse click or keydown. | Scale down slightly to `0.97` to mimic physical button depress. | 100ms | Scale returns to `1.0`. | Red borders on error. | Pulse opacity. |
| **Checkbox Toggle** | Mouse click on checkbox element. | Inner checkmark scales up using bounce physics. | 220ms | Checkbox fills with Teal; item text opacity drops. | None. | Spinner inside checkbox. |
| **Progress Ring** | Syllabus completion state updates. | SVG stroke offset draws from current value to next. | 600ms | Progress ring value text counts up. | None. | Pulsing gradient ring. |
| **Subject Completed** | Syllabus reaches 100%. | A subtle confetti splash bursts from the course card. | 1.2s | Card acquires a glowing success outline. | None. | None. |
| **Command Palette** | Press `⌘K` or `Ctrl+K`. | Dialog backdrop blurs and palette slides down from the top edge. | 250ms | Input focuses automatically. | Overlay shake on no results. | Skeleton results lines. |

---

## Part 5 — Entity State Machines

### 1. Task State Machine
```
[Draft] ➔ (Save) ➔ [Pending] ➔ (Due date passed) ➔ [Overdue]
                       │               │
                  (Start Work)     (Complete)
                       │               │
                       ▼               ▼
                 [In Progress] ➔ ➔ [Completed] ➔ (Archive) ➔ [Archived]
```

### 2. Topic State Machine
```
[Locked] ➔ (Prerequisites met) ➔ [Available] ➔ (Study started) ➔ [Studying]
                                      ▲                              │
                                (Flag Revision)                 (Complete)
                                      │                              │
                                      └──────── [Needs Revision] ◀───┴──➔ [Completed]
```

### 3. Study Session State Machine
```
[Idle] ➔ (Start Session) ➔ [Running] ➔ (Pause) ➔ [Paused]
                              │                     │
                          (Complete)            (Cancel)
                              │                     │
                              ▼                     ▼
                        [Completed]             [Cancelled]
```

---

## Part 6 — Educative Empty States

### No Courses
*   **Visual Element:** Graphic of a blank book stack.
*   **Instructional Copy:** *"Welcome to your new semester! Seed your active courses to initialize the syllabus tracking system."*
*   **Secondary Action:** `Add Course` / `Import Template`.

### No Planner Tasks
*   **Visual Element:** Clean desk workspace graphic.
*   **Instructional Copy:** *"You're all caught up! No active deliverables on your planner. Take a look at your syllabus recommendations."*
*   **Secondary Action:** `Add Task` / `Study Recommended Topic`.

---

## Part 7 — Error Recovery Flows

### Accidental Deletions (Critical Recovery)
*   **Interaction:** User clicks delete icon on a Task, Note, or Resource.
*   **Recovery Flow:** The item is removed from view instantly. A snackbar surfaces at the bottom: *"Item deleted. [Undo]"*. The snackbar remains visible for 8 seconds. If the user clicks `Undo`, the item returns to its exact position with no loss of content.

### Offline & Connection Loss
*   **Interaction:** Network disconnects.
*   **Recovery Flow:** Global header surfaces a small offline status badge. The application caches all edits in local storage. When the network reconnects, background sync updates the server database quietly.

---

## Part 8 — Search Ranking Matrix

Search matches are evaluated and sorted using query weight parameters:

$$\text{Search Rank Score} = (\text{Title Match}) \times 1.0 + (\text{Category Match}) \times 0.8 + (\text{Fuzzy Match}) \times 0.5$$

1.  **Direct Title Match:** Score is prioritized. (e.g. searching `"Networks"` places **Computer Networks Course** at result position 1).
2.  **Category Sorting:** Commands matching the query are grouped into a top navigation shortcut block.
3.  **Recent Searches:** The command palette pre-populates the last 3 clicked results before the user begins typing.

---

## Part 9 — Command Palette Interaction Specs

*   **Keyboard Focus Loops:** Pressing `Down Arrow` moves selection from item to item. Pressing `Up Arrow` moves it backward. Focus remains locked inside the palette modal.
*   **Context-Aware Actions:** If a user triggers the palette inside a specific Course Detail page, the palette surfaces actions specific to that course (e.g., *"Create task for this course"*, *"Go to this course's attendance log"*).

---

## Part 10 — Feedback & Validation Systems

*   **Toasts:** Small notifications (e.g. task saved) slide in from the top-right corner. Toasts fade out automatically after 4 seconds unless hovered over.
*   **Inline Input Validation:** Form validation triggers on input blur. Fields with missing values display a subtle red border and help text beneath the input: *"This field is required."*
*   **Loading Skeletons:** Pages use structural skeletons during load events. Skeletons pulse opacity from 40% to 80% to indicate active loading.

---

## Part 11 — Accessibility Experience (WCAG AAA)

*   **Keyboard Navigation:** All interactive elements have visible focus ring indicators. Tabbing traverses fields from top-left to bottom-right.
*   **Reduced Motion:** If `prefers-reduced-motion` is active in the OS, all page slide transitions are replaced with instant display states, and button scale micro-interactions are disabled.
*   **Contrast & Scalability:** Layout supports page zoom up to 200% without breaking text wraps. All text meets a minimum contrast ratio of 4.5:1 against backgrounds.

---

## Part 12 — Delight Moments

SemesterOS introduces subtle rewards to reinforce positive study habits:

```
[Master Module] ➔ [Subtle Confetti Splash] ➔ [Progress Ring Glows Teal] ➔ [Toast: "Module Mastered!"]
```

*   **Weekly Goal Achievement:** When a user completes their scheduled study hours for the week, the workload scorecard lights up with a subtle gold gradient outline.
*   **Consistency Badges:** Users receive small milestone badges (e.g., *7-Day Study Streak*) displayed in the Insights tab.

---

## Part 13 — Edge Cases & Limits

*   **Hundreds of Tasks:** When a user has 100+ tasks in their planner, lists implement virtualized rendering to maintain 60 FPS scrolling performance.
*   **Extremely Long Names:** Long course names wrap to double lines on mobile or truncate with an ellipsis (`...`) in the sidebar, revealing the full name on hover.
*   **Semester Rollover:** At semester end, the active database is marked read-only and archived, opening a fresh, empty workspace for the incoming term.

---

## Part 14 — UX Heuristics & System Audit

Evaluating our interaction design against standard cognitive principles:

1.  **Visibility of System Status (Heuristic #1):** Skeletons, toasts, and offline banners ensure students always know the state of the app.
2.  **Match Between System & Real World (Heuristic #2):** Core terms match the academic experience (Semesters, Modules, Credits).
3.  **User Control & Freedom (Heuristic #3):** The robust Undo Snackbar provides freedom to reverse mistakes without complex menus.
4.  **Error Prevention (Heuristic #5):** Form inputs validate on blur to prevent saving invalid task configurations.
5.  **Flexibility and Efficiency of Use (Heuristic #7):** Keyboard shortcuts and the command palette allow advanced students to navigate instantly.
6.  **Peak-End Rule:** Celebrations at the end of study sessions and module completion reinforce a positive association with study habits.
7.  **Doherty Threshold:** All transitions occur under 250ms, maintaining the user's attention loop.
