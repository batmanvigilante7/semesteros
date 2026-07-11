export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskFilter =
  | 'all'
  | 'today'
  | 'this_week'
  | 'completed'
  | 'pending'
  | 'high_priority'
  | 'overdue'

export type TaskSort = 'due_date' | 'priority' | 'alphabetical' | 'recently_added'

export interface Task {
  id: string
  title: string
  description: string
  subject: string // subject/course name
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  estimatedHours: number
  createdAt: string
  updatedAt: string
}

export type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
