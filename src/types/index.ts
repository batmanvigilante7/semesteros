export type {
  Task,
  TaskDraft,
  TaskFilter,
  TaskPriority,
  TaskSort,
  TaskStatus,
} from './planner'

export type { Course, CourseDraft, CourseType } from './course'

export interface TimelineEvent {
  id: string
  title: string
  start: string
  end: string
  type: 'lecture' | 'assignment' | 'exam' | 'other'
  subjectId?: string
}

// Backward compatibility alias
export type CalendarEvent = TimelineEvent

export interface Semester {
  id: string
  name: string
  startDate: string
  endDate: string
  gpa?: number
  current: boolean
}
