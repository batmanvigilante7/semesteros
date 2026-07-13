import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  AlertTriangle,
  ArrowDownUp,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  FileText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Play,
  Pause,
  Award,
  Flame,
  Calendar,
  ChevronDown,
  List,
  Kanban,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedButton, AnimatedCard } from '@/components/ui/MotionSystem'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useCourses } from '@/hooks/useCourses'
import { createEmptyTaskDraft, usePlanner } from '@/hooks/usePlanner'
import type { Course } from '@/models'
import { PageHeader } from '@/components/ui/PageHeader'
import type {
  Task,
  TaskDraft,
  TaskFilter,
  TaskPriority,
  TaskSort,
  TaskStatus,
} from '@/types'
import {
  formatTaskDate,
  getTodayInputValue,
  isOverdue,
  priorityLabels,
  taskFilters,
  taskSorts,
} from '@/utils/plannerHelpers'
import { cn } from '@/utils/cn'
import { useProfile } from '@/hooks/useProfile'

type ModalMode = 'create' | 'edit'

const priorityClasses: Record<TaskPriority, string> = {
  low: 'bg-accent-blue/10 text-accent-blue ring-accent-blue/20',
  medium: 'bg-accent-teal/10 text-accent-teal ring-accent-teal/20',
  high: 'bg-accent-amber/10 text-accent-amber ring-accent-amber/20',
  urgent: 'bg-accent-rose/10 text-accent-rose ring-accent-rose/20',
}

const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 350, damping: 26 } },
  exit: { opacity: 0, y: 8 },
}

const fieldInputClass =
  'w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-4 py-2.5 text-xs text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/10'

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1',
        priorityClasses[priority]
      )}
    >
      {priorityLabels[priority]}
    </span>
  )
}

// Custom Habit interface
interface Habit {
  id: string
  name: string
  icon: string
  streak: number
  history: Record<string, boolean> // date key format 'YYYY-MM-DD'
}

export default function Planner() {
  const { profile } = useProfile()
  const { courses } = useCourses()
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    stats,
    setTaskStatus,
  } = usePlanner()

  // Planner navigation tabs
  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'habits' | 'pomodoro'>('tasks')

  // Database View State
  const [dbView, setDbView] = useState<'list' | 'board' | 'calendar' | 'timeline'>('list')

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<TaskFilter>('all')
  const [sortMode, setSortMode] = useState<TaskSort>('due_date')

  // Modal actions
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [targetTask, setTargetTask] = useState<Task | null>(null)
  const [draft, setDraft] = useState<TaskDraft>(createEmptyTaskDraft())

  // Focus Pomodoro Timer states
  const [pomoTimeLeft, setPomoTimeLeft] = useState(1500) // 25 minutes
  const [pomoRunning, setPomoRunning] = useState(false)
  const [pomoSessions, setPomoSessions] = useState(0)

  // Habits tracker state
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('semesteros.planner.habits')
    if (saved) return JSON.parse(saved)
    return [
      { id: 'h-1', name: 'Syllabus Revision', icon: '📚', streak: 4, history: { '2026-07-11': true, '2026-07-10': true } },
      { id: 'h-2', name: 'Practice Coding', icon: '💻', streak: 7, history: { '2026-07-11': true, '2026-07-10': true } },
      { id: 'h-3', name: 'Stay Hydrated', icon: '💧', streak: 12, history: { '2026-07-11': true, '2026-07-10': true } },
      { id: 'h-4', name: '8 Hours Sleep', icon: '😴', streak: 2, history: { '2026-07-11': true } },
    ]
  })

  useEffect(() => {
    localStorage.setItem('semesteros.planner.habits', JSON.stringify(habits))
  }, [habits])

  // Pomodoro countdown timer runner
  useEffect(() => {
    let interval: any = null
    if (pomoRunning && pomoTimeLeft > 0) {
      interval = setInterval(() => {
        setPomoTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (pomoTimeLeft === 0) {
      setPomoRunning(false)
      setPomoTimeLeft(1500)
      setPomoSessions((s) => s + 1)
      alert('Pomodoro session completed! Take a short break.')
    }
    return () => clearInterval(interval)
  }, [pomoRunning, pomoTimeLeft])

  // Format countdown string
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Toggle habit check for dates
  const handleToggleHabit = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit
        const history = { ...habit.history }
        const checked = !!history[dateStr]
        if (checked) {
          delete history[dateStr]
        } else {
          history[dateStr] = true
        }
        return {
          ...habit,
          history,
          streak: checked ? Math.max(0, habit.streak - 1) : habit.streak + 1,
        }
      })
    )
  }

  // Toggle single task completion status
  const handleToggleTaskStatus = (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    setTaskStatus(taskId, nextStatus)
  }

  // Promote / Demote status on Kanban Board
  const handleMoveStatus = (task: Task, direction: 'forward' | 'backward') => {
    const statusOrder: TaskStatus[] = ['pending', 'in_progress', 'completed']
    const currentIndex = statusOrder.indexOf(task.status)
    let nextIndex = currentIndex + (direction === 'forward' ? 1 : -1)
    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      setTaskStatus(task.id, statusOrder[nextIndex])
    }
  }

  // Task filtering
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const query = searchQuery.toLowerCase()
        const course = courses.find((c: Course) => c.name === task.subject)
        const matchesSearch =
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          course?.code?.toLowerCase().includes(query)

        if (!matchesSearch) return false

        if (filterMode === 'pending') return task.status !== 'completed'
        if (filterMode === 'completed') return task.status === 'completed'
        if (filterMode === 'overdue') return isOverdue(task)
        if (filterMode === 'high_priority') return task.priority === 'high' || task.priority === 'urgent'

        return true
      })
      .sort((a, b) => {
        if (sortMode === 'priority') {
          const ranks = { low: 0, medium: 1, high: 2, urgent: 3 }
          return ranks[b.priority] - ranks[a.priority]
        }
        return a.dueDate.localeCompare(b.dueDate)
      })
  }, [tasks, searchQuery, filterMode, sortMode, courses])

  const openCreateModal = () => {
    setModalMode('create')
    setTargetTask(null)
    setDraft(createEmptyTaskDraft())
    setModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setModalMode('edit')
    setTargetTask(task)
    setDraft({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      subject: task.subject,
      estimatedHours: task.estimatedHours,
    })
    setModalOpen(true)
  }

  useEffect(() => {
    const handleGlobalCreateTask = () => {
      openCreateModal()
    }
    window.addEventListener('open-create-task', handleGlobalCreateTask)
    return () => {
      window.removeEventListener('open-create-task', handleGlobalCreateTask)
    }
  }, [])

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.title.trim()) return

    if (modalMode === 'edit' && targetTask) {
      updateTask(targetTask.id, draft)
    } else {
      createTask(draft)
    }
    setModalOpen(false)
  }

  const handleDelete = (taskId: string) => {
    if (window.confirm('Delete this task?')) {
      deleteTask(taskId)
    }
  }

  return (
    <div className="space-y-8 pb-12 text-left select-none">
      {/* Page Header Primitive */}
      <PageHeader
        title="Planner & Schedule"
        description="Track your daily schedule, habits, and syllabus checkpoints."
        breadcrumbs={[
          { label: "Academic OS" },
          { label: "Planner" }
        ]}
        primaryAction={{
          label: "New Task",
          onClick: openCreateModal,
          icon: Plus
        }}
      />

      {/* 1. TOP FOCUS HERO CARD */}
      <AnimatedCard className="overflow-hidden border border-border-subtle bg-surface shadow-subtle p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-secondary px-3 py-1 text-[10px] font-bold text-primary shadow-subtle uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Planner Mission Control
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                Keep the focus, {profile.name}.
              </h2>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                You have <span className="font-semibold text-text-primary">{stats.pending} pending tasks</span> to track this week. Your midterm examinations start in <span className="font-semibold text-text-primary">14 days</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-bg-secondary/40 border border-border-subtle/50 rounded-2xl p-4 min-w-[260px]">
            <div className="h-10 w-10 shrink-0 bg-accent-amber/10 text-accent-amber flex items-center justify-center rounded-xl font-bold">
              ⏰
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Midterm Exam Countdown</p>
              <h4 className="text-sm font-bold text-text-primary mt-0.5">14 Days Remaining</h4>
              <p className="text-[9px] text-text-secondary mt-0.5">Focus areas: Data Structures & OOP</p>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* 2. PLANNER MODULE TABS */}
      <div className="flex border-b border-border-subtle gap-4">
        {(['tasks', 'calendar', 'habits', 'pomodoro'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-3 text-xs font-bold capitalize transition-all relative cursor-pointer',
              activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="planner-active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: TASKS & LIST PANELS */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* STATS TILES */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-[20px] border border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Total Tasks</p>
                <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{stats.total}</h4>
              </div>
            </Card>

            <Card className="rounded-[20px] border border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
              <div className="rounded-xl bg-accent-amber/10 p-2.5 text-accent-amber">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Pending</p>
                <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{stats.pending}</h4>
              </div>
            </Card>

            <Card className="rounded-[20px] border border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
              <div className="rounded-xl bg-accent-teal/10 p-2.5 text-accent-teal">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary font-semibold">Completed</p>
                <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{stats.completed}</h4>
              </div>
            </Card>

            <Card className="rounded-[20px] border border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
              <div className="rounded-xl bg-accent-rose/10 p-2.5 text-accent-rose">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary font-semibold">Overdue</p>
                <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{stats.overdue}</h4>
              </div>
            </Card>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <Card className="rounded-[20px] border border-border-subtle bg-surface p-4 shadow-subtle space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search tasks, courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 py-2 pl-10 pr-4 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Database Views Switcher - Notion style */}
                <div className="flex rounded-xl border border-border-subtle bg-bg-primary p-0.5 shadow-subtle self-start sm:self-auto select-none">
                  <button
                    onClick={() => setDbView('list')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all',
                      dbView === 'list' ? 'bg-surface text-primary shadow-subtle' : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <List className="h-3.5 w-3.5" /> List
                  </button>
                  <button
                    onClick={() => setDbView('board')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all',
                      dbView === 'board' ? 'bg-surface text-primary shadow-subtle' : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <Kanban className="h-3.5 w-3.5" /> Board
                  </button>
                  <button
                    onClick={() => setDbView('calendar')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all',
                      dbView === 'calendar' ? 'bg-surface text-primary shadow-subtle' : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <Calendar className="h-3.5 w-3.5" /> Calendar
                  </button>
                  <button
                    onClick={() => setDbView('timeline')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all',
                      dbView === 'timeline' ? 'bg-surface text-primary shadow-subtle' : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" /> Timeline
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end lg:self-auto">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <ArrowDownUp className="h-3.5 w-3.5" />
                  <span className="font-semibold">Sort:</span>
                </div>
                <div className="relative">
                  <select
                    value={sortMode}
                    onChange={(e: any) => setSortMode(e.target.value)}
                    className="appearance-none bg-bg-secondary border border-border-subtle rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-text-primary focus:outline-none cursor-pointer"
                  >
                    {taskSorts.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary pointer-events-none" />
                </div>
                <Button onClick={openCreateModal} className="gap-1.5 rounded-xl text-xs bg-primary text-white">
                  <Plus className="h-4 w-4" /> Add Task
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle/50">
              {taskFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterMode(f.value)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer',
                    filterMode === f.value
                      ? 'bg-primary text-white shadow-soft'
                      : 'bg-bg-secondary/60 text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Card>

          {/* DYNAMIC DATABASE VIEWS CONTAINER */}
          <div>
            
            {/* VIEW 1: LIST VIEW */}
            {dbView === 'list' && (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task) => {
                    const matchedCourse = courses.find((c: Course) => c.name === task.subject)
                    const color = matchedCourse?.color || '#2563EB'
                    return (
                      <motion.article
                        key={task.id}
                        variants={cardVariants}
                        layout
                        className="group rounded-2xl border border-border-subtle bg-surface p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-border-medium hover:shadow-soft transition-all duration-200"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <button
                            onClick={() => handleToggleTaskStatus(task.id, task.status)}
                            className={cn(
                              'h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 mt-1 transition-all cursor-pointer',
                              task.status === 'completed'
                                ? 'bg-accent-teal border-accent-teal text-white shadow-soft'
                                : 'border-border-medium hover:border-text-secondary bg-bg-primary'
                            )}
                          >
                            {task.status === 'completed' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </button>

                          <div className="min-w-0 text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={cn(
                                  'text-xs font-bold text-text-primary',
                                  task.status === 'completed' && 'line-through text-text-tertiary font-medium'
                                )}
                              >
                                {task.title}
                              </h4>
                              {matchedCourse?.code && (
                                <span
                                  className="rounded-lg px-2 py-0.5 text-[9px] font-extrabold text-white"
                                  style={{ backgroundColor: color }}
                                >
                                  {matchedCourse.code}
                                </span>
                              )}
                              <PriorityBadge priority={task.priority} />
                            </div>
                            {task.description && (
                              <p className="text-[10px] text-text-secondary mt-1 leading-relaxed line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-border-subtle/50 pt-3 sm:border-0 sm:pt-0 shrink-0">
                          <div className="flex items-center gap-3 text-[10px] font-semibold text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-text-tertiary" /> {task.estimatedHours} hrs
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5 text-text-tertiary" /> {formatTaskDate(task.dueDate)}
                            </span>
                            {task.status !== 'completed' && isOverdue(task) && (
                              <span className="text-accent-rose font-bold uppercase tracking-wider flex items-center gap-0.5">
                                <AlertTriangle className="h-3 w-3" /> Overdue
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(task)}
                              className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="rounded-lg p-1.5 text-accent-rose hover:bg-accent-rose/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    )
                  })}
                </AnimatePresence>

                {filteredTasks.length === 0 && (
                  <Card className="rounded-[24px] border border-dashed border-border-medium p-12 text-center max-w-sm mx-auto">
                    <FileText className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                    <h4 className="text-sm font-bold text-text-primary">No Tasks Found</h4>
                    <p className="text-[10px] text-text-secondary mt-1">Add a new task or adjust filters to see items.</p>
                    <Button onClick={openCreateModal} className="mt-4 text-xs font-semibold rounded-xl">
                      Add New Task
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* VIEW 2: BOARD VIEW (KANBAN) */}
            {dbView === 'board' && (
              <div className="grid gap-4 md:grid-cols-3">
                {([
                  { key: 'pending', label: 'To Do', border: 'border-t-accent-rose/70' },
                  { key: 'in_progress', label: 'In Progress', border: 'border-t-accent-amber/70' },
                  { key: 'completed', label: 'Completed', border: 'border-t-accent-teal/70' },
                ] as const).map((col) => {
                  const colTasks = filteredTasks.filter((t) => t.status === col.key)
                  return (
                    <Card
                      key={col.key}
                      className={cn(
                        'p-4 bg-bg-secondary/20 border-border-subtle border-t-4 flex flex-col space-y-4 shadow-subtle min-h-[450px] transition-colors duration-200',
                        col.border
                      )}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        const taskId = e.dataTransfer.getData('taskId')
                        if (taskId) {
                          setTaskStatus(taskId, col.key)
                        }
                      }}
                    >
                      <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
                        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{col.label}</span>
                        <Badge variant="indigo" className="font-mono font-extrabold">{colTasks.length}</Badge>
                      </div>

                      <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
                        {colTasks.map((task) => {
                          const matchedCourse = courses.find((c: Course) => c.name === task.subject)
                          const color = matchedCourse?.color || '#2563EB'
                          return (
                            <Card
                              key={task.id}
                              className="p-3 bg-surface border border-border-subtle hover:border-border-medium hover:shadow-soft transition-all duration-200 space-y-3 text-left cursor-grab active:cursor-grabbing"
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('taskId', task.id)
                              }}
                            >
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-start gap-2">
                                  <h4 className="text-xs font-bold text-text-primary leading-snug line-clamp-2">
                                    {task.title}
                                  </h4>
                                  <button
                                    onClick={() => handleToggleTaskStatus(task.id, task.status)}
                                    className={cn(
                                      'h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer',
                                      task.status === 'completed'
                                        ? 'bg-accent-teal border-accent-teal text-white'
                                        : 'border-border-medium'
                                    )}
                                  >
                                    {task.status === 'completed' && <Check className="h-3 w-3 stroke-[3]" />}
                                  </button>
                                </div>
                                {matchedCourse?.code && (
                                  <span
                                    className="inline-block rounded-lg px-2 py-0.5 text-[8.5px] font-extrabold text-white"
                                    style={{ backgroundColor: color }}
                                  >
                                    {matchedCourse.code}
                                  </span>
                                )}
                                <PriorityBadge priority={task.priority} />
                                {task.description && (
                                  <p className="text-[10px] text-text-secondary leading-normal line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-2.5 border-t border-border-subtle/50 text-[9px] font-bold text-text-secondary">
                                <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {task.estimatedHours}h</span>
                                <span>{new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                              </div>

                              {/* Kanban quick status movers */}
                              <div className="flex justify-end gap-1 pt-1.5 border-t border-border-subtle/40">
                                <button
                                  onClick={() => openEditModal(task)}
                                  className="p-1 rounded text-text-secondary hover:bg-bg-secondary hover:text-text-primary mr-auto"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveStatus(task, 'backward')}
                                  disabled={task.status === 'pending'}
                                  className="p-1 rounded border border-border-subtle/70 bg-bg-secondary/40 text-text-secondary hover:bg-bg-secondary disabled:opacity-30 cursor-pointer"
                                  title="Move Left"
                                >
                                  <ArrowLeft className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveStatus(task, 'forward')}
                                  disabled={task.status === 'completed'}
                                  className="p-1 rounded border border-border-subtle/70 bg-bg-secondary/40 text-text-secondary hover:bg-bg-secondary disabled:opacity-30 cursor-pointer"
                                  title="Move Right"
                                >
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              </div>
                            </Card>
                          )
                        })}

                        {colTasks.length === 0 && (
                          <div className="py-12 border border-dashed border-border-medium rounded-xl text-center text-[10px] text-text-secondary font-medium">
                            No tasks in this column.
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* VIEW 3: CALENDAR VIEW */}
            {dbView === 'calendar' && (
              <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-6">
                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-text-tertiary border-b border-border-subtle pb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-2.5">
                  {/* July 2026 starts on Wednesday = 3 blank cells */}
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="h-20 bg-bg-secondary/20 rounded-xl border border-dashed border-border-subtle/40" />
                  ))}

                  {Array.from({ length: 31 }).map((_, idx) => {
                    const day = idx + 1
                    const dateStr = `2026-07-${String(day).padStart(2, '0')}`
                    const dayTasks = tasks.filter((t) => t.dueDate === dateStr)

                    return (
                      <div
                        key={day}
                        onClick={() => {
                          setDraft((prev) => ({ ...prev, dueDate: dateStr }))
                          openCreateModal()
                        }}
                        className={cn(
                          'h-20 p-2 rounded-xl border text-left flex flex-col justify-between transition-colors bg-bg-secondary/20 border-border-subtle/50 hover:border-border-medium hover:bg-bg-secondary/40 cursor-pointer',
                          day === 11 && 'bg-primary/5 border-primary shadow-subtle'
                        )}
                      >
                        <span className={cn('text-[10px] font-extrabold font-mono', day === 11 ? 'text-primary' : 'text-text-secondary')}>
                          {day}
                        </span>
                        <div className="space-y-1 overflow-hidden flex-1 mt-1">
                          {dayTasks.slice(0, 2).map((t) => (
                            <div
                              key={t.id}
                              onClick={(e) => { e.stopPropagation(); openEditModal(t); }}
                              className={cn(
                                'text-[8px] px-1 py-0.5 rounded truncate font-bold border',
                                t.status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                  : 'bg-primary/10 text-primary border-primary/20'
                              )}
                              title={t.title}
                            >
                              {t.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <span className="text-[7px] text-text-tertiary block pl-1 font-bold">
                              +{dayTasks.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* VIEW 4: TIMELINE VIEW */}
            {dbView === 'timeline' && (
              <Card className="p-6 border-border-subtle bg-surface shadow-subtle space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-text-primary block">Assignments due timeline by course</span>
                  <div className="border border-border-subtle rounded-2xl overflow-hidden bg-bg-secondary/15">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-bg-secondary/40 border-b border-border-subtle/60 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                          <th className="p-3 w-40">Course Code</th>
                          <th className="p-3">Timeline Deadlines Schedule (July 2026)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {courses.map((course) => {
                          const courseTasks = filteredTasks.filter((t) => t.subject === course.name)
                          return (
                            <tr key={course.id} className="hover:bg-bg-secondary/15 transition-colors">
                              <td className="p-3 font-extrabold flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: course.color }} />
                                {course.code}
                              </td>
                              <td className="p-3">
                                {courseTasks.length > 0 ? (
                                  <div className="flex flex-wrap gap-2.5">
                                    {courseTasks.map((t) => (
                                      <div
                                        key={t.id}
                                        onClick={() => openEditModal(t)}
                                        className={cn(
                                          'px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer shadow-subtle text-[10px] font-bold bg-surface hover:border-border-medium transition-colors',
                                          t.status === 'completed'
                                            ? 'border-emerald-500/20 text-emerald-500'
                                            : 'border-primary/20 text-primary'
                                        )}
                                      >
                                        <span className="font-extrabold font-mono text-[9px]">Due {new Date(t.dueDate).getDate()}:</span>
                                        {t.title}
                                        <Badge variant={t.priority === 'urgent' ? 'rose' : t.priority === 'high' ? 'orange' : 'indigo'}>
                                          {t.priority}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-text-tertiary italic">No active deadlines</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            )}

          </div>

        </div>
      )}

      {/* TAB CONTENT: CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-primary" />
              Calendar Workspace (July 2026)
            </h3>
            <Badge variant="indigo">Monthly View</Badge>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-text-tertiary border-b border-border-subtle pb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2.5">
            {/* Pad calendar start offset days */}
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-20 bg-bg-secondary/20 rounded-xl border border-dashed border-border-subtle/40" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: 31 }).map((_, idx) => {
              const day = idx + 1
              const dateStr = `2026-07-${String(day).padStart(2, '0')}`
              const dayTasks = tasks.filter((t) => t.dueDate === dateStr)

              return (
                <div
                  key={day}
                  className={cn(
                    'h-20 p-2 rounded-xl border text-left flex flex-col justify-between transition-colors bg-bg-secondary/20 border-border-subtle/50 hover:border-border-medium hover:bg-bg-secondary/40',
                    day === 11 && 'bg-primary/5 border-primary shadow-subtle'
                  )}
                >
                  <span className={cn('text-[10px] font-extrabold font-mono', day === 11 ? 'text-primary' : 'text-text-secondary')}>
                    {day}
                  </span>
                  <div className="space-y-1 overflow-hidden flex-1 mt-1">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={cn(
                          'text-[8px] px-1 py-0.5 rounded truncate font-bold',
                          t.status === 'completed'
                            ? 'bg-accent-teal/10 text-accent-teal'
                            : 'bg-accent-blue/10 text-accent-blue'
                        )}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[7px] text-text-tertiary block pl-1 font-bold">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* TAB CONTENT: FOCUS POMODORO TIMER */}
      {activeTab === 'pomodoro' && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* FOCUS CLOCK */}
          <Card className="rounded-[24px] border border-border-subtle bg-surface p-6 shadow-subtle flex flex-col items-center justify-center space-y-6 min-h-[380px]">
            <div className="space-y-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Pomodoro Session</span>
              <h4 className="text-3xl font-extrabold text-text-primary tracking-tight font-mono">{formatTimer(pomoTimeLeft)}</h4>
              <p className="text-[9px] text-text-secondary">Keep focused on the current topic.</p>
            </div>

            {/* Circular Gauge visual indicator */}
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="absolute transform -rotate-90 w-full h-full">
                <circle cx="64" cy="64" r="54" stroke="var(--border-subtle)" strokeWidth="5" fill="transparent" />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="var(--primary)"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - pomoTimeLeft / 1500)}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="text-center space-y-0.5">
                <span className="text-xs font-extrabold text-text-primary font-mono">{pomoSessions}</span>
                <span className="text-[8px] font-bold text-text-tertiary uppercase block">Sessions</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setPomoRunning(!pomoRunning)}
                className="gap-2 rounded-xl font-bold shadow-soft text-xs bg-primary text-white"
              >
                {pomoRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {pomoRunning ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPomoRunning(false)
                  setPomoTimeLeft(1500)
                }}
                className="rounded-xl text-xs"
              >
                Reset
              </Button>
            </div>
          </Card>

          {/* POMODORO RESOURCES SUMMARY */}
          <Card className="rounded-[24px] border border-border-subtle bg-surface p-6 shadow-subtle flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-accent-amber" />
                Focus Milestones
              </h3>
              <div className="space-y-3 text-xs leading-relaxed text-text-secondary">
                <p>Complete consecutive 25-minute study intervals to earn credits and boost your weekly Productivity score.</p>
                <div className="rounded-xl border border-border-subtle bg-bg-secondary/40 p-3 space-y-2">
                  <span className="text-[9px] font-bold uppercase text-accent-indigo">Focus Rule Checklist:</span>
                  <ul className="list-disc pl-4 space-y-1 text-[10px]">
                    <li>Ensure notifications are silenced.</li>
                    <li>Keep one tab active on study resources.</li>
                    <li>Take a mandatory 5-minute break after completion.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-border-subtle/50 pt-4 flex items-center gap-2 text-[10px] text-text-tertiary font-medium">
              <span>Average Daily Focus: 2.4 Hours</span>
            </div>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: HABIT TRACKER */}
      {activeTab === 'habits' && (
        <Card className="rounded-[24px] border border-border-subtle bg-surface p-6 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Flame className="h-4.5 w-4.5 text-accent-rose fill-accent-rose" />
              Weekly Habits Grid
            </h3>
            <Badge variant="indigo">Mon - Sun Tracker</Badge>
          </div>

          <div className="space-y-4">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border-subtle bg-bg-secondary/20 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{habit.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">{habit.name}</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">Active streak: {habit.streak} days</p>
                  </div>
                </div>

                {/* Day completion grid */}
                <div className="flex gap-2.5">
                  {['2026-07-06', '2026-07-07', '2026-07-08', '2026-07-09', '2026-07-10', '2026-07-11', '2026-07-12'].map((dateStr, idx) => {
                    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                    const completed = !!habit.history[dateStr]

                    return (
                      <button
                        key={dateStr}
                        onClick={() => handleToggleHabit(habit.id, dateStr)}
                        className={cn(
                          'h-9 w-9 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer',
                          completed
                            ? 'bg-accent-teal border-accent-teal text-white shadow-soft scale-105'
                            : 'border-border-subtle bg-surface hover:border-text-tertiary text-text-secondary'
                        )}
                      >
                        <span className="text-[9px] font-extrabold uppercase">{dayLabels[idx]}</span>
                        {completed && <Check className="h-2.5 w-2.5 mt-0.5 stroke-[3]" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. TASK CREATE/EDIT MODAL OVERLAY */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-border-subtle bg-surface p-6 shadow-high text-left z-10"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h3 className="text-sm font-bold text-text-primary">
                  {modalMode === 'edit' ? 'Edit Target Task' : 'Create New Task'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-1 text-text-secondary hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Task Title</label>
                  <input
                    type="text"
                    required
                    value={draft.title}
                    onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Read lecture notes, complete homework"
                    className={fieldInputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Task Description</label>
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide guidelines or reference links..."
                    rows={3}
                    className={fieldInputClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Subject Name</label>
                    <select
                      value={draft.subject}
                      onChange={(e) => setDraft((prev) => ({ ...prev, subject: e.target.value }))}
                      className={fieldInputClass}
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Due Date</label>
                    <input
                      type="date"
                      required
                      value={draft.dueDate}
                      onChange={(e) => setDraft((prev) => ({ ...prev, dueDate: e.target.value }))}
                      min={getTodayInputValue()}
                      className={fieldInputClass}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Priority</label>
                    <select
                      value={draft.priority}
                      onChange={(e) => setDraft((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))}
                      className={fieldInputClass}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Status</label>
                    <select
                      value={draft.status}
                      onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}
                      className={fieldInputClass}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Est. Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="24"
                      value={draft.estimatedHours}
                      onChange={(e) => setDraft((prev) => ({ ...prev, estimatedHours: Number(e.target.value) }))}
                      className={fieldInputClass}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle/50">
                  <AnimatedButton variant="outline" type="button" onClick={() => setModalOpen(false)} className="rounded-xl text-xs">
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton type="submit" className="rounded-xl text-xs bg-primary text-white">
                    Save Task
                  </AnimatedButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
