import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  ArrowRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Sparkles,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useCourseStore, useAssignmentStore } from '@/stores/AcademicEngine'

// Summary Stats Card inside Courses page
function SummaryCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <Card className="rounded-[20px] border border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
      <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">{label}</p>
        <h4 className="text-lg font-extrabold text-text-primary mt-0.5 font-mono">{value}</h4>
      </div>
    </Card>
  )
}

// Course Grid variants
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 350, damping: 26 },
  },
}

export default function Courses() {
  const navigate = useNavigate()
  const { courses } = useCourseStore()
  const { assignments } = useAssignmentStore()

  // Local storage lists
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('semesteros.favorites') || '[]')
  })
  const [recentlyOpened, setRecentlyOpened] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('semesteros.recently_opened') || '[]')
  })

  // Sync favorites
  const toggleFavorite = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setFavorites((prev) => {
      const next = prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
      localStorage.setItem('semesteros.favorites', JSON.stringify(next))
      return next
    })
  }

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'All' | 'Theory' | 'Lab' | 'Completed' | 'In Progress' | 'Favorites'>('All')
  const [sortBy, setSortBy] = useState<'Name' | 'Progress' | 'Recently Opened'>('Name')

  // Restore default subjects
  const restoreDefaultCourses = () => {
    if (window.confirm('Are you sure you want to reset all courses to defaults? This will erase your current topic progress.')) {
      localStorage.removeItem('semesteros.subjects.v1')
      window.location.reload()
    }
  }

  // Format Course list with metadata
  const coursesWithMetadata = useMemo(() => {
    return courses.map((course) => {
      const courseAssignments = assignments.filter((a) => a.subjectId === course.id)
      const nextDeadline = [...courseAssignments]
        .filter((a) => a.status !== 'completed')
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]

      return {
        ...course,
        nextDeadline,
        isFavorite: favorites.includes(course.id),
      }
    })
  }, [courses, assignments, favorites])

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return coursesWithMetadata
      .filter((course) => {
        // Search query filter
        const matchSearch =
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.code.toLowerCase().includes(searchQuery.toLowerCase())

        if (!matchSearch) return false

        // Category filter
        if (activeFilter === 'Theory') return course.type === 'Theory'
        if (activeFilter === 'Lab') return course.type === 'Lab'
        if (activeFilter === 'Completed') return course.progress === 100
        if (activeFilter === 'In Progress') return course.progress > 0 && course.progress < 100
        if (activeFilter === 'Favorites') return course.isFavorite

        return true
      })
      .sort((a, b) => {
        // Sorting logic
        if (sortBy === 'Progress') return b.progress - a.progress
        if (sortBy === 'Recently Opened') {
          const idxA = recentlyOpened.indexOf(a.id)
          const idxB = recentlyOpened.indexOf(b.id)
          if (idxA === -1 && idxB === -1) return a.name.localeCompare(b.name)
          if (idxA === -1) return 1
          if (idxB === -1) return -1
          return idxA - idxB
        }
        return a.name.localeCompare(b.name)
      })
  }, [coursesWithMetadata, searchQuery, activeFilter, sortBy, recentlyOpened])

  const averageAttendance = useMemo(() => {
    if (courses.length === 0) return 0
    return Math.round(courses.reduce((sum, c) => sum + c.attendance, 0) / courses.length)
  }, [courses])

  const totalCredits = useMemo(() => {
    return courses.reduce((sum, c) => sum + c.credits, 0)
  }, [courses])

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-12 text-left"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Academic Modules
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Courses Workspace
          </h2>
          <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-text-secondary">
            Manage semester course lists, track attendance compliance, view syllabus completions, and study module topics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={restoreDefaultCourses}
            className="gap-2 rounded-xl text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </Button>
        </div>
      </div>

      {/* OVERVIEW STATS SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Enrolled Subjects" value={String(courses.length)} icon={BookOpen} />
        <SummaryCard label="Average Attendance" value={`${averageAttendance}%`} icon={Sparkles} />
        <SummaryCard label="Term Credits" value={String(totalCredits)} icon={Sparkles} />
        <SummaryCard label="Completed courses" value={String(courses.filter((c) => c.progress === 100).length)} icon={BookOpen} />
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="rounded-2xl border border-border-subtle bg-surface/75 backdrop-blur-md p-4 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Fuzzy Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by code or subject name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 py-2 pl-10 pr-4 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Sort selection drop dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <SlidersHorizontal className="h-3.5 w-3.5 text-text-secondary" />
            <span className="text-xs font-semibold text-text-secondary">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="appearance-none bg-bg-secondary border border-border-subtle rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="Name">Name</option>
                <option value="Progress">Progress</option>
                <option value="Recently Opened">Recently Opened</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-text-secondary pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle/50">
          {(['All', 'Theory', 'Lab', 'Completed', 'In Progress', 'Favorites'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-bg-secondary/60 text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* SUBJECTS CARDS GRID */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <motion.article
                key={course.id}
                variants={cardVariants}
                layout
                whileHover={{ y: -4 }}
                className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-border-subtle bg-surface/75 backdrop-blur-md p-5 shadow-subtle hover:border-border-medium hover:shadow-premium transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top line badges & Star */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-tertiary">
                        {course.code}
                      </span>
                      <span className="rounded-lg bg-bg-secondary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                        {course.type}
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(course.id, e)}
                      className={`rounded-lg p-1 transition-colors cursor-pointer ${
                        course.isFavorite
                          ? 'text-accent-amber bg-accent-amber/10'
                          : 'text-text-muted hover:bg-bg-secondary hover:text-text-secondary'
                      }`}
                      aria-label="Add to favorites"
                    >
                      <Star className={`h-4 w-4 ${course.isFavorite ? 'fill-accent-amber' : ''}`} />
                    </button>
                  </div>

                  {/* Header Title */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                      {course.name}
                    </h4>
                    <p className="text-[10px] text-text-secondary">Instructor: {course.faculty}</p>
                  </div>

                  {/* Syllabus Completion Ring */}
                  <div className="flex items-center gap-4 bg-bg-secondary/30 rounded-2xl p-3 border border-border-subtle/50">
                    <div className="relative h-11 w-11 shrink-0 flex items-center justify-center">
                      <svg className="absolute transform -rotate-90 w-full h-full">
                        <circle
                          cx="22"
                          cy="22"
                          r="18"
                          stroke="var(--border-subtle)"
                          strokeWidth="3.5"
                          fill="transparent"
                        />
                        <circle
                          cx="22"
                          cy="22"
                          r="18"
                          stroke={course.color}
                          strokeWidth="3.5"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 18}
                          strokeDashoffset={2 * Math.PI * 18 * (1 - course.progress / 100)}
                        />
                      </svg>
                      <span className="text-[10px] font-extrabold text-text-primary">{course.progress}%</span>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Progress</p>
                      <p className="text-[10px] text-text-secondary truncate">
                        {course.nextDeadline
                          ? `Next: ${course.nextDeadline.title}`
                          : 'No pending targets'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-border-subtle/50 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Log to recently opened list
                      setRecentlyOpened((prev) => {
                        const next = [course.id, ...prev.filter((id) => id !== course.id)].slice(0, 10)
                        localStorage.setItem('semesteros.recently_opened', JSON.stringify(next))
                        return next
                      })
                      navigate(`/courses/${course.id}`)
                    }}
                    className="w-full justify-between hover:bg-bg-secondary text-[11px] font-semibold"
                  >
                    Continue Learning
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="rounded-[24px] border border-dashed border-border-medium bg-surface p-12 text-center max-w-md mx-auto">
          <BookOpen className="mx-auto h-12 w-12 text-text-tertiary mb-4" />
          <h4 className="text-base font-bold text-text-primary">No Matching Courses Found</h4>
          <p className="text-xs text-text-secondary mt-1 max-w-[30ch] mx-auto text-wrap-pretty leading-relaxed">
            Try adjusting your search query or filter tags to reveal courses.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setActiveFilter('All')
            }}
            className="mt-6 text-xs font-semibold rounded-xl"
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </motion.div>
  )
}
