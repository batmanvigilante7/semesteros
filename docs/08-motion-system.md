# SemesterOS: Motion Design & Micro-interactions
**Internal Design Document | Phase 8**  
**Role:** Principal Motion Designer, UX Animation Specialist, HCI Researcher & Creative Director  

---

## Part 1 — Motion Philosophy

SemesterOS uses animation to clarify system state, reduce cognitive load, and orient the student. All motion conforms to five core principles:

### I. Motion Explains
Animation is used to show relationships. When a student clicks a course card, the card expands smoothly into the details workspace, establishing a physical connection between views rather than presenting a jarring flash.

### II. Motion Guides Attention
We use movement to direct focus. New notifications or warning flags slide into view with a low-impact ease-out, drawing the user's eyes without distracting them from active study blocks.

### III. Motion Never Delays
User performance is our priority. Animations are fast ($150\text{ms} - 280\text{ms}$). The interface is fully interactive immediately; we do not force the user to wait for an animation to finish before they can click or type.

### IV. Motion Communicates Hierarchy
Floating layers (such as modals and popovers) slide in along the Z-axis (scaling up from 96% to 100%), while flat content switches slide horizontally, using spatial physics to reflect layout depth.

---

## Part 2 — Application Entry Experience

The initial load experience is designed to feel calm and organized:

```
[Splash/Blank Canvas] ➔ [Skeletons Fade In] ➔ [Navbar Slides Down] ➔ [Greeting Fade-up]
   (0ms - 150ms)           (150ms - 300ms)         (300ms - 450ms)         (450ms - 600ms)
```

1.  **Splash Stage:** A clean, blank canvas fades in.
2.  **Layout Structure Reveal:** Page layout containers and skeleton cards fade in (`opacity: 0 ➔ 1`, `y: 8px ➔ 0px`) over 250ms using a smooth ease-out curve.
3.  **Navigation Slide:** The top header bar and sidebar slide down from the top edge.
4.  **Greeting & Stats Reveal:** Greeting text and stats count up smoothly from 0.

---

## Part 3 — Page Transitions Specs

To avoid layout shifts, all main page transitions use a shared coordinate fade-in-place animation:

```
┌───────────────────┬───────────┬───────────┬──────────────────────────────────┐
│ View Transition   │ Direction │ Duration  │ Easing Curve / Spring            │
├───────────────────┼───────────┼───────────┼──────────────────────────────────┤
│ Home ➔ Courses    │ Horizontal│ 240ms     │ cubic-bezier(0.16, 1, 0.3, 1)    │
│ Courses ➔ Detail  │ Scale-Up  │ 280ms     │ spring(mass: 1, stiffness: 180)  │
│ Open Planner      │ Slide-Up  │ 220ms     │ cubic-bezier(0.22, 1, 0.36, 1)   │
│ Open Preferences  │ Fade-Only │ 180ms     │ ease-out                         │
└───────────────────┴───────────┴───────────┴──────────────────────────────────┘
```

*   **Directional Rule:** Navigating deeper into a course slides content leftward. Navigating backward via breadcrumbs slides content rightward, reinforcing spatial mapping.

---

## Part 4 — Component Motion specs

*   **Buttons:** On press, scale down (`scale: 0.97`) over 80ms, returning to `1.0` over 120ms with spring physics.
*   **Checkbox Toggle:** The checkmark outline draws itself using SVG dash-offset over 180ms; the checkbox background color scales up using bounce physics.
*   **Syllabus Accordions:** Expanding modules slides content down over 250ms using a layout ease-out, avoiding sudden layout shifts.
*   **Progress Rings:** SVG dash-offset animates from current value to next over 600ms, using a slow ease-out curve to make progress feel deliberate and rewarding.

---

## Part 5 — Micro-Interactions

### 1. Hover State (Lift)
*   **Trigger:** Cursor enters card boundary.
*   **Animation:** Translate card by `y: -4px` and scale up shadow from subtle to medium depth over 180ms (`ease-out`).

### 2. Task Completed (Strikethrough)
*   **Trigger:** Clicking checkbox.
*   **Animation:** A dark horizontal line draws across the task title over 200ms while the text opacity fades to 50% concurrently.

### 3. Undo Toast (Slide & Fade)
*   **Trigger:** Task deletion or progress reset.
*   **Animation:** Toast slides up from bottom edge (`y: 40px ➔ 0px`) and fades in over 220ms, remaining fixed for 8 seconds.

---

## Part 6 — Feedback & Celebrations

SemesterOS uses subtle celebrations to acknowledge academic achievements:

### I. Module Syllabus Mastered
*   **Action:** Marking the final topic in a module complete.
*   **Animation:** A subtle burst of micro-confetti particles shoots outward from the module header, fading within 1.2 seconds. The module progress badge glows teal.

### II. Study Streak Milestone
*   **Action:** Logging study sessions on consecutive days.
*   **Animation:** The streak flame icon pulses size (`scale: 1 ➔ 1.25 ➔ 1`) and glows amber over 450ms.

---

## Part 7 — Loading Experience (Optimistic UI)

*   **Pulsing Skeletons:** Cards use structural loading skeletons. Opacity pulses from 45% to 80% every 1.5 seconds using a soft sine ease-in-out curve.
*   **Optimistic Checkboxes:** When a student checks a topic or task, the checkbox updates immediately, and notes update in the background. If the database update fails, the UI reverts with a toast notification: *"Sync failed. Retrying... [Retry]"*.

---

## Part 8 — Command Palette Motion Spec

```
[Palette Pressed: ⌘K] ➔ [Backdrop Blurs] ➔ [Palette Slides Down] ➔ [Scale 97% ➔ 100%]
                            (0ms - 220ms)          (50ms - 250ms)          (80ms - 250ms)
```

*   **Search Input Pulse:** As the user types in the search field, a tiny loading indicator inside the input bar rotates smoothly when searching local indexes.

---

## Part 9 — Attention Management (Motion Priority)

To avoid cognitive overload, motion is strictly prioritized:

1.  **Primary Motion (Immediate User Interaction):** Checklist toggles, button presses, command palette. Triggers instantly under 100ms.
2.  **Secondary Motion (Status Feedback):** Progress ring count-ups, warning toasts. Slides in over 200ms - 300ms.
3.  **Passive Motion (System States):** Skeleton pulsing, offline alerts. Low-impact animations that run in the background.
4.  **Prohibited Motion:** Flashing text, looping scroll items, and decorative screen shakes are banned.

---

## Part 10 — Animation Accessibility

*   **Reduced Motion Preference:** If `prefers-reduced-motion` is active at the OS level, all slide, scale, and spring animations are disabled. Page transitions switch instantly, and checkmarks toggle without animation.
*   **Screen Readers:** Animations do not interfere with screen readers. ARIA status attributes are updated instantly on state changes, before animations complete.

---

## Part 11 — Performance & Rendering Budgets

*   **60 FPS Standard:** All animations must run at 60 FPS. 
*   **GPU Promotion:** Complex animations use hardware-accelerated CSS properties (`transform: translate3d`, `opacity`, `scale`) to avoid layout recalculations.
*   **Duration Cap:** No user-flow animation exceeds 300ms, ensuring the interface feels fast and responsive.

---

## Part 12 — Motion Design Tokens Strategy

Animations are configured using global design tokens:

```
🚀 MOTION TOKENS SPEC
├── Ease-Out: cubic-bezier(0.16, 1, 0.3, 1) ➔ Standard page slide
├── Spring-Focus: mass: 1, stiffness: 210, damping: 20 ➔ Scale elements
├── Spring-Soft: mass: 1, stiffness: 120, damping: 15 ➔ Progress rings
└── Duration-Fast: 150ms | Duration-Base: 250ms | Duration-Slow: 500ms
```

---

## Part 13 — Delight Milestones & Emotional Rationale

*   **First Study Session Logged:**
    *   *Animation:* The study gauge lights up with a subtle outline particle glow.
    *   *Rationale:* Establishes early success and encourages continued engagement.
*   **100% Course Syllabus Completion:**
    *   *Animation:* A subtle full-page success screen overlay with progress metrics, fading after 3 seconds.
    *   *Rationale:* Marks the successful completion of a course's learning path.

---

## Part 14 — Motion Audit Checklist

Before implementing an animation, verify:
1.  **Does it communicate system state?** (Yes, e.g., showing a task is completed).
2.  **Is it faster than 300ms?** (Yes, to ensure performance remains high).
3.  **Can the user bypass it?** (Yes, interactions are never blocked by animations).
4.  **Does it respect accessibility settings?** (Yes, reduced-motion preferences are honored).
