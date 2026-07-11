export type CourseType = 'Theory' | 'Lab'

export interface Topic {
  id: string
  name: string
  status: 'Not Started' | 'In Progress' | 'Completed'
  dueDate?: string
  estimatedHours?: number
  priority?: 'low' | 'medium' | 'high' | 'urgent'
}

export interface Module {
  id: string
  title: string
  topics: Topic[]
  hours: number
  completionPercentage: number
  status: 'Not Started' | 'In Progress' | 'Completed'
}

export interface CourseResource {
  id: string
  title: string
  type: 'link' | 'pdf' | 'doc' | 'video'
  url: string
}

export interface Course {
  id: string
  name: string
  code: string
  type: CourseType
  color: string
  faculty: string
  attendancePercentage: number
  completedTasks: number
  pendingTasks: number
  credits: number
  isDefault?: boolean
  progress: number
  completedTopics: number
  remainingTopics: number
  nextTopic: string | null
  resources: CourseResource[]
  modules: Module[]
  notes?: string
}

export type CourseDraft = Omit<
  Course,
  | 'id'
  | 'completedTasks'
  | 'pendingTasks'
  | 'isDefault'
  | 'progress'
  | 'completedTopics'
  | 'remainingTopics'
  | 'nextTopic'
  | 'resources'
  | 'modules'
  | 'notes'
>
