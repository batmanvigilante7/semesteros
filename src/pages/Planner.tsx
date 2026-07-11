import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowDownUp,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Edit3,
  FileText,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useCourses } from '@/hooks/useCourses'
import { createEmptyTaskDraft, usePlanner } from '@/hooks/usePlanner'
import type { Course } from '@/models'
import type {
  Task,
  TaskDraft,
  TaskFilter,
  TaskPriority,
  TaskSort as Plannerort,
  TaskStatus as Plannertatus,
} from '@/types'
import {
  formatTaskDate,
  getRelativeDueLabel,
  getTodayInputValue,
  isOverdue,
  isPastDate,
  priorityLabels,
  statusLabels,
  taskFilters,
  taskSorts as Plannerorts,
} from '@/utils/plannerHelpers'
import { getCourseColor as getcourseColor } from '@/utils/courseHelpers'
import { cn } from '@/utils/cn'

type ModalMode = 'create' | 'edit'

const priorityClasses: Record<TaskPriority, string> = {
  low: 'bg-[#2563EB]/10 text-[#2563EB] ring-[#2563EB]/15',
  medium: 'bg-[#10B981]/10 text-[#10B981] ring-[#10B981]/15',
  high: 'bg-[#F59E0B]/10 text-[#B45309] ring-[#F59E0B]/15',
  urgent: 'bg-[#EF4444]/10 text-[#EF4444] ring-[#EF4444]/15',
}

const statusClasses: Record<Plannertatus, string> = {
  pending: 'bg-[#F59E0B]/10 text-[#B45309] ring-[#F59E0B]/15',
  in_progress: 'bg-[#2563EB]/10 text-[#2563EB] ring-[#2563EB]/15',
  completed: 'bg-[#10B981]/10 text-[#10B981] ring-[#10B981]/15',
}

const cardVariants = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.97 },
}

const fieldInputClass =
  'w-full rounded-2xl border border-border-subtle bg-[#F7F8FA] px-4 py-3 text-sm text-[#111827] outline-none transition-all placeholder:text-[#6B7280] focus:border-[#2563EB]/30 focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10'

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1',
        priorityClasses[priority]
      )}
    >
      {priorityLabels[priority]}
    </span>
  )
}

function StatusBadge({ status }: { status: Plannertatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1',
        statusClasses[status]
      )}
    >
      {statusLabels[status]}
    </span>
  )
}

function Plannertats({ stats }: { stats: ReturnType<typeof usePlanner>['stats'] }) {
  const items = [
    { label: 'Total Planner', value: stats.total, icon: FileText, tone: 'text-[#2563EB] bg-[#2563EB]/10' },
    { label: 'Pending', value: stats.pending, icon: Clock3, tone: 'text-[#F59E0B] bg-[#F59E0B]/10' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, tone: 'text-[#10B981] bg-[#10B981]/10' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, tone: 'text-[#EF4444] bg-[#EF4444]/10' },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <motion.div key={item.label} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 380, damping: 26 }}>
            <Card className="rounded-3xl border-white/80 bg-white/90 p-5 shadow-[0_18px_45px_-36px_rgba(17,24,39,0.55)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#6B7280]">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">{item.value}</p>
                </div>
                <div className={cn('rounded-2xl p-3', item.tone)}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

function Plannerearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative min-w-0 flex-1">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search title, course, or description..."
        className="h-12 w-full rounded-2xl border border-border-subtle bg-white/90 pl-11 pr-4 text-sm text-[#111827] shadow-subtle outline-none transition-all placeholder:text-[#6B7280] focus:border-[#2563EB]/30 focus:ring-4 focus:ring-[#2563EB]/10"
      />
    </div>
  )
}

function TaskFilters({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}: {
  filter: TaskFilter
  sort: Plannerort
  onFilterChange: (filter: TaskFilter) => void
  onSortChange: (sort: Plannerort) => void
}) {
  return (
    <Card className="rounded-3xl border-white/80 bg-white/90 p-4 shadow-[0_18px_45px_-36px_rgba(17,24,39,0.55)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <motion.div layout className="flex flex-wrap gap-2">
          {taskFilters.map((item) => (
            <motion.button
              key={item.value}
              layout
              onClick={() => onFilterChange(item.value)}
              className={cn(
                'rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200',
                filter === item.value
                  ? 'bg-[#111827] text-white shadow-soft'
                  : 'bg-[#F7F8FA] text-[#6B7280] hover:bg-white hover:text-[#111827]'
              )}
            >
              {item.label}
            </motion.button>
          ))}
        </motion.div>

        <label className="flex items-center gap-2 rounded-2xl border border-border-subtle bg-[#F7F8FA] px-3 py-2 text-xs font-semibold text-[#6B7280]">
          <ArrowDownUp className="h-3.5 w-3.5" />
          Sort
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as Plannerort)}
            className="bg-transparent text-[#111827] outline-none"
          >
            {Plannerorts.map((item: any) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </Card>
  )
}

function TaskCard({
  task,
  menuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
  onComplete,
  onUndoComplete,
  onDuplicate,
  onStatusChange,
  courses,
}: {
  task: Task
  menuOpen: boolean
  onMenuToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onComplete: () => void
  onUndoComplete: () => void
  onDuplicate: () => void
  onStatusChange: (status: Plannertatus) => void
  courses: Course[]
}) {
  const overdue = isOverdue(task)
  const completed = task.status === 'completed'
  const courseColor = getcourseColor(courses, task.subject)

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-visible rounded-[28px] border border-white/80 bg-white/95 p-5 shadow-[0_20px_55px_-38px_rgba(17,24,39,0.65)] backdrop-blur-xl transition-all duration-300',
        completed && 'opacity-75'
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <button
            onClick={completed ? onUndoComplete : onComplete}
            className={cn(
              'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
              completed
                ? 'border-[#10B981] bg-[#10B981] text-white'
                : 'border-border-medium bg-white hover:border-[#2563EB] hover:text-[#2563EB]'
            )}
            aria-label={completed ? 'Undo complete task' : 'Complete task'}
          >
            {completed && <Check className="h-3.5 w-3.5" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#111827]">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: courseColor }}
                />
                {task.subject}
              </span>
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
              {overdue && (
                <span className="inline-flex items-center rounded-full bg-[#EF4444]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EF4444] ring-1 ring-[#EF4444]/15">
                  Overdue
                </span>
              )}
            </div>

            <h3
              className={cn(
                'text-base font-semibold tracking-tight text-[#111827] transition-all md:text-lg',
                completed && 'text-[#6B7280] line-through'
              )}
            >
              {task.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7280]">
              {task.description || 'No description added.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#6B7280]">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {getRelativeDueLabel(task)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {task.estimatedHours}h
              </span>
              <span>Updated {formatTaskDate(task.updatedAt.slice(0, 10))}</span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-end gap-2">
          {task.status !== 'completed' && (
            <select
              value={task.status}
              onChange={(event) => onStatusChange(event.target.value as Plannertatus)}
              className="rounded-xl border border-border-subtle bg-[#F7F8FA] px-3 py-2 text-xs font-semibold text-[#111827] outline-none focus:border-[#2563EB]/30"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
            </select>
          )}
          <button
            onClick={onMenuToggle}
            className="rounded-xl p-2 text-[#6B7280] transition-all hover:bg-[#F7F8FA] hover:text-[#111827]"
            aria-label="Open task actions"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                className="absolute right-0 top-11 z-20 w-48 rounded-2xl border border-border-subtle bg-white p-2 shadow-premium"
              >
                <TaskMenuButton icon={Edit3} label="Edit" onClick={onEdit} />
                {completed ? (
                  <TaskMenuButton icon={RotateCcw} label="Undo Complete" onClick={onUndoComplete} />
                ) : (
                  <TaskMenuButton icon={CheckCircle2} label="Complete" onClick={onComplete} />
                )}
                <TaskMenuButton icon={Copy} label="Duplicate" onClick={onDuplicate} />
                <TaskMenuButton icon={Trash2} label="Delete" danger onClick={onDelete} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  )
}

function TaskMenuButton({
  icon: Icon,
  label,
  danger = false,
  onClick,
}: {
  icon: LucideIcon
  label: string
  danger?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors',
        danger
          ? 'text-[#EF4444] hover:bg-[#EF4444]/10'
          : 'text-[#111827] hover:bg-[#F7F8FA]'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function TaskList({
  Planner,
  openMenuId,
  onOpenMenu,
  onEdit,
  onDelete,
  onComplete,
  onUndoComplete,
  onDuplicate,
  onStatusChange,
  onCreateFirst,
  courses,
}: {
  Planner: Task[]
  openMenuId: string | null
  onOpenMenu: (taskId: string | null) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onComplete: (taskId: string) => void
  onUndoComplete: (taskId: string) => void
  onDuplicate: (taskId: string) => void
  onStatusChange: (taskId: string, status: Plannertatus) => void
  onCreateFirst: () => void
  courses: Course[]
}) {
  if (Planner.length === 0) {
    return <EmptyState onCreate={onCreateFirst} />
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {Planner.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            menuOpen={openMenuId === task.id}
            onMenuToggle={() => onOpenMenu(openMenuId === task.id ? null : task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task)}
            onComplete={() => onComplete(task.id)}
            onUndoComplete={() => onUndoComplete(task.id)}
            onDuplicate={() => onDuplicate(task.id)}
            onStatusChange={(status) => onStatusChange(task.id, status)}
            courses={courses}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-96 flex-col items-center justify-center rounded-[32px] border border-dashed border-border-medium bg-white/80 p-8 text-center shadow-subtle"
    >
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-[32px] bg-[#2563EB]/10" />
        <div className="absolute -right-4 -top-3 rounded-2xl bg-white p-3 text-[#10B981] shadow-soft">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 h-2 rounded-full bg-[#2563EB]/20" />
        <div className="absolute bottom-9 left-4 h-2 w-14 rounded-full bg-[#F59E0B]/30" />
      </div>
      <h3 className="text-2xl font-semibold tracking-tight text-[#111827]">No Planner yet.</h3>
      <p className="mt-3 max-w-sm text-sm leading-6 text-[#6B7280]">
        Create your first task and Acadence will keep it saved on this device automatically.
      </p>
      <Button onClick={onCreate} className="mt-6 gap-2 rounded-2xl px-5 py-3">
        <Plus className="h-4 w-4" />
        Create First Task
      </Button>
    </motion.div>
  )
}

function TaskModal({
  mode,
  task,
  isOpen,
  onClose,
  onSubmit,
  courses,
}: {
  mode: ModalMode
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (draft: TaskDraft) => void
  courses: Course[]
}) {
  const initialDraft = useMemo<TaskDraft>(() => {
    if (!task) return createEmptyTaskDraft(courses[0]?.name)
    return {
      title: task.title,
      description: task.description,
      subject: task.subject,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
    }
  }, [courses, task])

  const [draft, setDraft] = useState<TaskDraft>(initialDraft)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setDraft(initialDraft)
      setErrors({})
    }
  }, [initialDraft, isOpen])

  const updateField = <Key extends keyof TaskDraft>(key: Key, value: TaskDraft[Key]) => {
    setDraft((current: TaskDraft) => ({ ...current, [key]: value }))
    setErrors((current: Record<string, string>) => ({ ...current, [key]: '' }))
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (!draft.title.trim()) nextErrors.title = 'Title is required.'
    if (!draft.dueDate) nextErrors.dueDate = 'Due date is required.'
    if (draft.dueDate && isPastDate(draft.dueDate)) nextErrors.dueDate = 'Due date cannot be in the past.'
    if (Number(draft.estimatedHours) < 0) nextErrors.estimatedHours = 'Estimated hours must be 0 or higher.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit({
      ...draft,
      estimatedHours: Number(draft.estimatedHours),
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/25 p-4 backdrop-blur-sm"
        >
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 330, damping: 28 }}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-white/80 bg-white p-6 shadow-premium"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                  {mode === 'create' ? 'Create Task' : 'Edit Task'}
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#111827]">
                  {mode === 'create' ? 'Plan a new task' : 'Update task details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl p-2 text-[#6B7280] transition-colors hover:bg-[#F7F8FA] hover:text-[#111827]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Title" error={errors.title}>
                <input
                  value={draft.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  placeholder="e.g. Complete OOP lab record"
                  className={fieldInputClass}
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={draft.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  rows={4}
                  placeholder="Add useful context, links, or notes..."
                  className={cn(fieldInputClass, 'resize-none')}
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Course">
                  <select
                    value={draft.subject}
                    onChange={(event) => updateField('subject', event.target.value)}
                    className={fieldInputClass}
                  >
                    {courses.map((course: Course) => (
                      <option key={course.id} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Priority">
                  <select
                    value={draft.priority}
                    onChange={(event) => updateField('priority', event.target.value as TaskPriority)}
                    className={fieldInputClass}
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Status">
                  <select
                    value={draft.status}
                    onChange={(event) => updateField('status', event.target.value as Plannertatus)}
                    className={fieldInputClass}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Due Date" error={errors.dueDate}>
                  <input
                    type="date"
                    min={getTodayInputValue()}
                    value={draft.dueDate}
                    onChange={(event) => updateField('dueDate', event.target.value)}
                    className={fieldInputClass}
                  />
                </Field>

                <Field label="Estimated Hours" error={errors.estimatedHours}>
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={draft.estimatedHours}
                    onChange={(event) => updateField('estimatedHours', Number(event.target.value))}
                    className={fieldInputClass}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={onClose} className="rounded-2xl">
                Cancel
              </Button>
              <Button type="submit" className="gap-2 rounded-2xl">
                <Check className="h-4 w-4" />
                {mode === 'create' ? 'Create Task' : 'Save Changes'}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-semibold text-[#EF4444]">{error}</span>}
    </label>
  )
}

function DeleteDialog({
  task,
  onCancel,
  onConfirm,
}: {
  task: Task | null
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <AnimatePresence>
      {task && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/25 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="w-full max-w-md rounded-[28px] border border-white/80 bg-white p-6 shadow-premium"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EF4444]/10 text-[#EF4444]">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-[#111827]">Delete this task?</h3>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              This will permanently remove <span className="font-semibold text-[#111827]">{task.title}</span> from local storage.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={onCancel} className="rounded-2xl">
                Cancel
              </Button>
              <Button onClick={onConfirm} className="rounded-2xl bg-[#EF4444] hover:bg-[#DC2626]">
                Delete Task
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Planner() {
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [sort, setSort] = useState<Plannerort>('due_date')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<Task | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const {
    visibleTasks: visiblePlanner,
    stats,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    undoCompleteTask,
    duplicateTask,
    setTaskStatus: setPlannertatus,
  } = usePlanner(filter, sort, searchQuery)
  const { coursesWithTaskCounts } = useCourses()

  const openCreateModal = () => {
    setModalMode('create')
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setOpenMenuId(null)
    setModalMode('edit')
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleSubmit = (draft: TaskDraft) => {
    if (modalMode === 'edit' && editingTask) {
      updateTask(editingTask.id, draft)
    } else {
      createTask(draft)
    }
    setModalOpen(false)
    setEditingTask(null)
  }

  const confirmDelete = () => {
    if (!deleteCandidate) return
    deleteTask(deleteCandidate.id)
    setDeleteCandidate(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6 pb-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">Task Management</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-[#111827] md:text-4xl">
            Plan, track, finish.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
            A fast local task system for assignments, deadlines, and focused study sessions.
          </p>
        </div>
        <Button onClick={openCreateModal} size="lg" className="gap-2 rounded-2xl">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <Plannertats stats={stats} />

      <div className="flex flex-col gap-3 lg:flex-row">
        <Plannerearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <TaskFilters
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />

      <TaskList
        Planner={visiblePlanner}
        openMenuId={openMenuId}
        onOpenMenu={setOpenMenuId}
        onEdit={openEditModal}
        onDelete={(task) => {
          setOpenMenuId(null)
          setDeleteCandidate(task)
        }}
        onComplete={(taskId) => {
          setOpenMenuId(null)
          completeTask(taskId)
        }}
        onUndoComplete={(taskId) => {
          setOpenMenuId(null)
          undoCompleteTask(taskId)
        }}
        onDuplicate={(taskId) => {
          setOpenMenuId(null)
          duplicateTask(taskId)
        }}
        onStatusChange={setPlannertatus}
        onCreateFirst={openCreateModal}
        courses={coursesWithTaskCounts}
      />

      <TaskModal
        mode={modalMode}
        task={editingTask}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        courses={coursesWithTaskCounts}
      />

      <DeleteDialog
        task={deleteCandidate}
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={confirmDelete}
      />
    </motion.div>
  )
}
