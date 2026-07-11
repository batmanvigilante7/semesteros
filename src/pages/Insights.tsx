import { motion } from 'framer-motion'
import { Award, BookOpen, Clock, CheckCircle } from 'lucide-react'
import { useCourses } from '@/hooks/useCourses'
import { useAnalyticsStore } from '@/stores/AcademicEngine'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Course, Module, Topic } from '@/models'

export default function Insights() {
  const { courses } = useCourses()
  const InsightsStats = useAnalyticsStore()
  
  const stats = {
    progress: InsightsStats.semesterCompletion,
    completedTopics: InsightsStats.topicsCompleted,
    remainingTopics: InsightsStats.topicsRemaining,
    inProgressTopics: courses.reduce(
      (sum: number, sub: Course) =>
        sum +
        sub.modules.reduce(
          (mSum: number, mod: Module) => mSum + mod.topics.filter((t: Topic) => t.status === 'In Progress').length,
          0
        ),
      0
    ),
  }

  // Calculate credits
  const totalCredits = courses.reduce((sum: number, sub: Course) => sum + sub.credits, 0)
  const completedCredits = courses
    .filter((sub: Course) => sub.progress === 100)
    .reduce((sum: number, sub: Course) => sum + sub.credits, 0)

  // Calculate average attendance
  const averageAttendance =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum: number, sub: Course) => sum + sub.attendance, 0) / courses.length
        )
      : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-8 pb-8"
    >
      {/* Page Header */}
      <div>
        <p className="text-xs font-semibold text-accent-blue uppercase tracking-wider">Reports</p>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Performance Insights</h2>
        <p className="text-xs text-text-secondary mt-1">Real-time statistics computed from topic progress and attendance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Cumulative GPA */}
        <div className="rounded-2xl border border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary font-medium">Est. Semester GPA</p>
            <p className="text-2xl font-bold text-text-primary mt-1">3.92</p>
            <p className="text-[9px] text-text-tertiary">Based on credit weights</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
            <Award className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Average Attendance */}
        <div className="rounded-2xl border border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary font-medium">Avg Attendance</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{averageAttendance}%</p>
            <p className="text-[9px] text-text-tertiary">Across all 9 courses</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-indigo/10 text-accent-indigo">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Semester Syllabus Completion */}
        <div className="rounded-2xl border border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary font-medium">Syllabus Completion</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{stats.progress}%</p>
            <p className="text-[9px] text-[#10B981] font-semibold">{stats.completedTopics} topics done</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-teal/10 text-accent-teal">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Credits Earned */}
        <div className="rounded-2xl border border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary font-medium">Completed Credits</p>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {completedCredits} / {totalCredits}
            </p>
            <p className="text-[9px] text-text-tertiary">Credits from finished courses</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-orange/10 text-accent-orange">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* GPA Progression (SVG Area Chart) */}
        <div className="rounded-2xl border border-border-subtle bg-bg-primary p-6 shadow-subtle">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
            <h3 className="text-sm font-bold text-text-primary">GPA Progression</h3>
            <span className="text-[10px] font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full">
              +1.8% vs Sem 1
            </span>
          </div>

          <div className="relative h-48 w-full mt-4">
            {/* Custom SVG Line Area Graph */}
            <svg viewBox="0 0 400 150" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="var(--border-subtle)" strokeWidth="1" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="var(--border-subtle)" strokeWidth="1" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="var(--border-subtle)" strokeWidth="1" />

              {/* Area path */}
              <path
                d="M 10 120 L 100 100 L 200 60 L 300 45 L 390 35 L 390 120 Z"
                fill="url(#gpaGrad)"
              />

              {/* Line path */}
              <path
                d="M 10 120 L 100 100 L 200 60 L 300 45 L 390 35"
                fill="none"
                stroke="var(--accent-blue)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="10" cy="120" r="4.5" fill="var(--bg-primary)" stroke="var(--accent-blue)" strokeWidth="2" />
              <circle cx="100" cy="100" r="4.5" fill="var(--bg-primary)" stroke="var(--accent-blue)" strokeWidth="2" />
              <circle cx="200" cy="60" r="4.5" fill="var(--bg-primary)" stroke="var(--accent-blue)" strokeWidth="2" />
              <circle cx="300" cy="45" r="4.5" fill="var(--bg-primary)" stroke="var(--accent-blue)" strokeWidth="2" />
              <circle cx="390" cy="35" r="4.5" fill="var(--bg-primary)" stroke="var(--accent-blue)" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-text-secondary font-semibold mt-4 px-2">
            <span>Semester I</span>
            <span>Semester II</span>
            <span>Semester III (Midterm)</span>
            <span>Semester III (Endterm)</span>
            <span>Est. Final</span>
          </div>
        </div>

        {/* Daily Study rhythm (SVG Bar Chart) */}
        <div className="rounded-2xl border border-border-subtle bg-bg-primary p-6 shadow-subtle">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
            <h3 className="text-sm font-bold text-text-primary">Daily Study Hours</h3>
            <span className="text-[10px] font-bold text-accent-indigo bg-accent-indigo/10 px-2 py-0.5 rounded-full">
              Avg: 3.5 hrs/day
            </span>
          </div>

          <div className="relative h-48 w-full mt-4 flex items-end justify-between px-2">
            {/* Custom SVG Bar Graph */}
            {[
              { label: 'Mon', hrs: 4.2, height: '80%' },
              { label: 'Tue', hrs: 3.0, height: '58%' },
              { label: 'Wed', hrs: 5.5, height: '100%' },
              { label: 'Thu', hrs: 2.1, height: '40%' },
              { label: 'Fri', hrs: 1.5, height: '28%' },
              { label: 'Sat', hrs: 3.8, height: '72%' },
              { label: 'Sun', hrs: 4.5, height: '86%' },
            ].map((day, i) => (
              <div key={day.label} className="flex flex-col items-center gap-2 w-8">
                <span className="text-[9px] font-semibold text-text-secondary">{day.hrs}h</span>
                <div className="w-4 rounded-t-md bg-accent-indigo/20 relative group overflow-hidden h-32 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: day.height }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="w-full bg-accent-indigo rounded-t-md"
                  />
                </div>
                <span className="text-[10px] font-bold text-text-secondary">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course grades/progress detailed overview */}
      <Card className="rounded-3xl border-border-subtle bg-bg-primary p-6 shadow-subtle">
        <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-4 mb-4">
          Course Performance & Syllabus Index
        </h3>

        <div className="space-y-5">
          {courses.map((sub: Course) => (
            <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-border-subtle/40 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                <div>
                  <h4 className="font-semibold text-text-primary text-xs">{sub.name}</h4>
                  <div className="flex gap-2 items-center text-[10px] text-text-secondary mt-0.5">
                    <span>{sub.code}</span>
                    <span>•</span>
                    <span>{sub.credits} Credits</span>
                    <span>•</span>
                    <Badge variant="indigo">{sub.type}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-text-secondary text-[10px] uppercase font-bold">Attendance</span>
                  <div className="w-24 bg-bg-secondary rounded-full h-1.5 overflow-hidden border border-border-subtle">
                    <div
                      className="bg-accent-indigo h-full rounded-full"
                      style={{ width: `${sub.attendance}%` }}
                    />
                  </div>
                  <span className="font-bold text-text-primary w-8 text-right">
                    {sub.attendance}%
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-text-secondary text-[10px] uppercase font-bold">Syllabus</span>
                  <div className="w-24 bg-bg-secondary rounded-full h-1.5 overflow-hidden border border-border-subtle">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${sub.progress}%`, backgroundColor: sub.color }}
                    />
                  </div>
                  <span className="font-bold text-text-primary w-8 text-right">
                    {sub.progress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
