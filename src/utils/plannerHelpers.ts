import type { Task, TaskFilter, TaskPriority, TaskSort, TaskStatus } from '@/types'

export const PLANNER_STORAGE_KEY = 'semesteros.tasks.v1'

export const priorityWeight: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const taskFilters: Array<{ label: string; value: TaskFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'this_week' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'High Priority', value: 'high_priority' },
  { label: 'Overdue', value: 'overdue' },
]

export const taskSorts: Array<{ label: string; value: TaskSort }> = [
  { label: 'Due Date', value: 'due_date' },
  { label: 'Priority', value: 'priority' },
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'Recently Added', value: 'recently_added' },
]

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export function getTodayInputValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function isPastDate(dateValue: string) {
  if (!dateValue) return false
  return startOfDay(new Date(`${dateValue}T00:00:00`)) < startOfDay(new Date())
}

export function isToday(dateValue: string) {
  const date = startOfDay(new Date(`${dateValue}T00:00:00`))
  return date.getTime() === startOfDay(new Date()).getTime()
}

export function isThisWeek(dateValue: string) {
  const today = startOfDay(new Date())
  const day = today.getDay()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - day)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const date = startOfDay(new Date(`${dateValue}T00:00:00`))
  return date >= weekStart && date <= weekEnd
}

export function isOverdue(task: Task) {
  return task.status !== 'completed' && isPastDate(task.dueDate)
}

export function formatTaskDate(dateValue: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateValue}T00:00:00`))
}

export function getRelativeDueLabel(task: Task) {
  if (isOverdue(task)) return 'Overdue'
  if (isToday(task.dueDate)) return 'Today'
  return formatTaskDate(task.dueDate)
}

export function filterTasks(tasks: Task[], filter: TaskFilter, searchQuery: string) {
  const query = searchQuery.trim().toLowerCase()

  return tasks.filter((task) => {
    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.subject.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)

    if (!matchesSearch) return false

    switch (filter) {
      case 'today':
        return isToday(task.dueDate)
      case 'this_week':
        return isThisWeek(task.dueDate)
      case 'completed':
        return task.status === 'completed'
      case 'pending':
        return task.status === 'pending'
      case 'high_priority':
        return task.priority === 'high' || task.priority === 'urgent'
      case 'overdue':
        return isOverdue(task)
      case 'all':
      default:
        return true
    }
  })
}

export function sortTasks(tasks: Task[], sort: TaskSort) {
  return [...tasks].sort((a, b) => {
    switch (sort) {
      case 'priority':
        return priorityWeight[b.priority] - priorityWeight[a.priority]
      case 'alphabetical':
        return a.title.localeCompare(b.title)
      case 'recently_added':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'due_date':
      default:
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
  })
}

export function getTaskStats(tasks: Task[]) {
  const pending = tasks.filter((task) => task.status === 'pending').length
  const inProgress = tasks.filter((task) => task.status === 'in_progress').length
  const completed = tasks.filter((task) => task.status === 'completed').length
  const today = tasks.filter((task) => isToday(task.dueDate)).length
  const overdue = tasks.filter(isOverdue).length
  const estimatedHours = tasks
    .filter((task) => task.status !== 'completed')
    .reduce((total, task) => total + task.estimatedHours, 0)

  return {
    total: tasks.length,
    pending,
    inProgress,
    completed,
    today,
    overdue,
    estimatedHours,
  }
}
