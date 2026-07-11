export interface Topic {
  id: string
  title: string
  duration: number // hours
  deadline: string // YYYY-MM-DD
  status: 'Not Started' | 'In Progress' | 'Completed'
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedStudyTime: number // hours
  completedAt?: string
}

export interface Module {
  id: string
  title: string
  hours: number
  progress: number // completion percentage (0-100)
  status: 'Not Started' | 'In Progress' | 'Completed'
  topics: Topic[]
}

export interface CourseResource {
  id: string
  title: string
  type: 'link' | 'pdf' | 'doc' | 'video'
  url: string
}

export interface CourseNote {
  id: string
  title: string
  content: string
  updatedAt: string
}

export interface Course {
  id: string
  name: string
  code: string
  type: 'Theory' | 'Lab'
  credits: number
  faculty: string
  color: string
  attendance: number // attendance percentage (0-100)
  progress: number // syllabus completion percentage (0-100)
  icon?: string
  description?: string
  modules: Module[]
  assignments: string[] // array of assignment IDs
  resources: CourseResource[]
  notes: CourseNote[]
  isDefault?: boolean
}

// Backward compatibility aliases
export type Subject = Course
export type SubjectResource = CourseResource
export type SubjectNote = CourseNote
export type SubjectDraft = CourseDraft

export interface Semester {
  id: string
  academicYear: string // "2026-27"
  semester: string // "III"
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  completionPercentage: number // 0-100
}

export interface Assignment {
  id: string
  title: string
  subjectId: string // links to Course.id
  dueDate: string // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed'
  estimatedHours: number
  marks?: number
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface StudySession {
  id: string
  date: string // YYYY-MM-DD
  subject: string // course name or ID
  duration: number // minutes
  completedTopics: string[] // array of topic IDs
}

export type CourseDraft = Omit<
  Course,
  'id' | 'progress' | 'modules' | 'assignments' | 'resources' | 'notes'
>
