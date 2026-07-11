# SemesterOS

> **Your Academic Operating System**

A beautiful Academic Operating System (AOS) built for students to manage semesters, courses, planner items, deadlines, and study progress with Notion-like simplicity and Linear-like performance.

---

## 🌟 Features

SemesterOS is designed around an operating system metaphor to give you a unified workspace for everything academic:

*   **Home (Dashboard):** Your academic command center featuring a smart recommendation engine that highlights what to study next, workload analysis, and intelligent notifications.
*   **Planner (Tasks):** A high-performance planner to manage assignments, project checkpoints, and study tasks with priority controls and progress metrics.
*   **Courses (Subjects):** A structured tracker for credits, syllabus modules, attendance status, and lecture notes.
*   **Timeline (Calendar):** An interactive agenda view to visualize deadlines, lectures, and upcoming exam dates.
*   **Insights (Analytics):** Visual reports on study session durations, syllabus completion rates, and learning streaks.
*   **Preferences (Settings):** Configuration dashboard to customize your current academic term dates and targets.

---

## 🛠️ Technology Stack

*   **Framework:** React 19 + TypeScript + Vite 8
*   **Styling:** Tailwind CSS v4 (native CSS variables support)
*   **Animations:** Framer Motion 12 (smooth 60fps micro-animations)
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
