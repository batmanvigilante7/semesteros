import type { Course, CourseDraft } from '@/models'
import type { Task } from '@/types'
import { defaultSubjectsRaw, subjectAccentColors } from '@/data/subjects'
import { recalculateSubject } from '@/stores/AcademicEngine'

export const courseAccentColors = subjectAccentColors

// Recalculate helper using the new central store function
export const defaultCourses: Course[] = defaultSubjectsRaw.map((sub) => recalculateSubject(sub))

export function createCourseDraft(course?: Course): CourseDraft {
  return {
    name: course?.name ?? '',
    code: course?.code ?? '',
    type: course?.type ?? 'Theory',
    color: course?.color ?? courseAccentColors[0],
    faculty: course?.faculty ?? 'Faculty TBD',
    attendance: course?.attendance ?? 90,
    credits: course?.credits ?? 3,
  }
}

export function getCourseTaskCounts(course: Course, tasks: Task[]) {
  const courseTasks = tasks.filter((task) => task.subject === course.name)
  return {
    completedTasks: courseTasks.filter((task) => task.status === 'completed').length,
    pendingTasks: courseTasks.filter((task) => task.status !== 'completed').length,
  }
}

export function withCourseTaskCounts(courses: Course[], tasks: Task[]) {
  return courses.map((course) => ({
    ...course,
    ...getCourseTaskCounts(course, tasks),
  }))
}

export function getCourseBySlug(courses: Course[], slug: string | undefined) {
  if (!slug) return undefined
  return courses.find((course) => course.id === slug || course.code === slug)
}

export function getCourseColor(courses: Course[], courseName: string) {
  return courses.find((course) => course.name === courseName)?.color ?? '#2563EB'
}

export function validateCourseDraft(draft: CourseDraft, courses: Course[], editingId?: string) {
  const errors: Partial<Record<keyof CourseDraft, string>> = {}
  const normalizedCode = draft.code.trim().toLowerCase()

  if (!draft.name.trim()) errors.name = 'Course name is required.'
  if (!draft.code.trim()) errors.code = 'Course code is required.'
  if (
    normalizedCode &&
    courses.some((course) => course.id !== editingId && course.code.toLowerCase() === normalizedCode)
  ) {
    errors.code = 'A course with this code already exists.'
  }
  if (draft.attendance < 0 || draft.attendance > 100) {
    errors.attendance = 'Attendance must be between 0 and 100.'
  }
  if (draft.credits < 0) errors.credits = 'Credits must be 0 or higher.'

  return errors
}
