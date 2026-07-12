# SemesterOS

> **Your Academic Operating System**

A beautiful Academic Operating System (AOS) built for students to manage semesters, courses, planner items, deadlines, and study progress with Notion-like simplicity and Linear-like performance.

---

## 🌟 Features

SemesterOS is designed around an operating system metaphor to give you a unified workspace for everything academic:

*   **Home (Dashboard):** Your academic command center featuring a smart recommendation engine that highlights what to study next, workload analysis, and intelligent notifications.
*   **Planner (Tasks):** A high-performance planner to manage assignments, project checkpoints, and study tasks with priority controls, study session logs, and Pomodoro timers.
*   **Courses (Academic Hub):** A structured tracker for credits, syllabus modules, attendance status, and course details matching computer science curricula (OOP, DSA, COA).
*   **Knowledge Hub (Resources):** A personal academic library featuring folder trees, tag filters, file drawers, and a drag-and-drop file upload zone.
*   **AI Workspace (Academic Intelligence):** Context-aware syllabus tutors, interactive revision flashcards, customizable quizzes, and study schedule generators.
*   **Analytics & Insights:** Visual reports containing area, bar, and line charts tracking study durations, attendance rates, activity contribution heatmaps, and term GPA predictions.
*   **Profile & Identity Hub:** Cover customizations, SVG profile completion rings, editable skill tag containers, checklist milestones, and personalization switches.
*   **Global Command Center:** Universal search command palette (`Ctrl+K`) and slide-over notification drawer center.
*   **Onboarding & Authentication:** Fullscreen welcome screen, switchable login/signup cards, password strength indicators, and a 7-step setup assistant.

---

## 🛠️ Technology Stack

*   **Framework:** React 19 + TypeScript + Vite 8
*   **Styling:** Tailwind CSS v4 (native CSS variables support)
*   **Animations:** Framer Motion 12 (smooth 60fps micro-animations)
*   **Charts:** Recharts
*   **Icons:** Lucide React

---

## 📂 Repository Structure

```text
semesteros/
│
├── public/              # Static assets (favicons, etc.)
├── src/                 # Application source code
│   ├── app/             # Application config and setup
│   ├── assets/          # Static media assets
│   ├── components/      # UI components & layout sections
│   ├── data/            # Local data models and seeds
│   ├── features/        # Feature-specific logic
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # App layouts
│   ├── lib/             # Shared libraries and utils
│   ├── pages/           # Pages (Home, Planner, Courses, etc.)
│   ├── services/        # Business logic & services (StudyEngine)
│   ├── stores/          # State management (AcademicEngine)
│   ├── styles/          # Global CSS styles
│   ├── types/           # TypeScript interface definitions
│   └── utils/           # Utility helpers
│
├── docs/                # Project documentation
│   ├── screenshots/     # Showcase screenshots
│   ├── design-system/   # Design guidelines
│   └── architecture/    # High-level architecture docs
│
├── README.md
├── LICENSE
├── CHANGELOG.md
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///C:/Users/G%20BHARGAVI/Downloads/semesterOS/LICENSE) file for details.
