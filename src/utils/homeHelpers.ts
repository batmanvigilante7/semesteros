import type { Course, Topic, Module } from '@/models'

// Helper to get date difference in days
export function getDaysDiff(date1Str: string, date2Str: string): number {
  const d1 = new Date(date1Str)
  const d2 = new Date(date2Str)
  // Reset hours to compare calendar days
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  const diffTime = d1.getTime() - d2.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Get today's date in YYYY-MM-DD format
export function getTodayDateString(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export interface NextStudyCandidate {
  course: Course
  module: Module
  topic: Topic
  score: number
}

/**
 * NEXT STUDY ENGINE:
 * Determines the nearest incomplete topic based on:
 * - Upcoming deadline (closer deadline = higher score)
 * - Module completion (almost completed modules = higher score)
 * - Pending topics (In Progress = higher score)
 */
export function getNextStudyTopic(courses: Course[], todayStr = getTodayDateString()): NextStudyCandidate | null {
  const candidates: NextStudyCandidate[] = []

  courses.forEach((course) => {
    course.modules.forEach((mod) => {
      mod.topics.forEach((top) => {
        if (top.status !== 'Completed') {
          let score = 0

          // 1. Pending status priority
          if (top.status === 'In Progress') {
            score += 25
          }

          // 2. Difficulty weight (harder topics get higher study priority)
          if (top.difficulty === 'hard') score += 30
          else if (top.difficulty === 'medium') score += 15
          else if (top.difficulty === 'easy') score += 5

          // 3. Module Completion bias (prioritize finishing active modules)
          score += (mod.progress || 0) * 0.5

          // 4. Deadline proximity
          if (top.deadline) {
            const daysDiff = getDaysDiff(top.deadline, todayStr)
            if (daysDiff < 0) {
              // Overdue is critical!
              score += 100 + Math.min(50, Math.abs(daysDiff) * 5)
            } else if (daysDiff === 0) {
              // Due today
              score += 85
            } else {
              // Due in future: closer gets higher score
              score += Math.max(0, 60 - daysDiff * 4)
            }
          }

          candidates.push({
            course,
            module: mod,
            topic: top,
            score,
          })
        }
      })
    })
  })

  if (candidates.length === 0) return null

  // Sort descending by score
  candidates.sort((a, b) => b.score - a.score)
  return candidates[0]
}

/**
 * DEADLINE ENGINE (for Topics):
 * Categorize all lesson plan dates into:
 * - Overdue: incomplete topics with deadlines past
 * - Today: topics with deadlines today
 * - Upcoming: incomplete topics with deadlines in future
 */
export interface TopicDeadline {
  course: Course
  module: Module
  topic: Topic
  dueDate: string
  isOverdue: boolean
  isToday: boolean
}

export function getTopicDeadlines(courses: Course[], todayStr = getTodayDateString()) {
  const overdue: TopicDeadline[] = []
  const today: TopicDeadline[] = []
  const upcoming: TopicDeadline[] = []

  courses.forEach((course) => {
    course.modules.forEach((mod) => {
      mod.topics.forEach((top) => {
        if (top.deadline) {
          const daysDiff = getDaysDiff(top.deadline, todayStr)
          const deadlineObj: TopicDeadline = {
            course,
            module: mod,
            topic: top,
            dueDate: top.deadline,
            isOverdue: daysDiff < 0 && top.status !== 'Completed',
            isToday: daysDiff === 0,
          }

          if (top.status !== 'Completed' && daysDiff < 0) {
            overdue.push(deadlineObj)
          } else if (daysDiff === 0) {
            today.push(deadlineObj)
          } else if (top.status !== 'Completed' && daysDiff > 0) {
            upcoming.push(deadlineObj)
          }
        }
      })
    })
  })

  // Sort upcoming by due date ascending
  upcoming.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  // Sort overdue by due date ascending (oldest first)
  overdue.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return {
    overdue,
    today,
    upcoming,
  }
}

/**
 * TIMELINE ENGINE (for Topics):
 * Display:
 * - Today's Topics (due today)
 * - Tomorrow's Topics (due tomorrow)
 * - This Week (due next 7 days, excluding today/tomorrow)
 * - Upcoming Module (first module in any subject with status 'Not Started' or 'In Progress')
 */
export interface TimelineTopic {
  course: Course
  module: Module
  topic: Topic
}

export function getTimelineData(courses: Course[], todayStr = getTodayDateString()) {
  const today: TimelineTopic[] = []
  const tomorrow: TimelineTopic[] = []
  const thisWeek: TimelineTopic[] = []

  courses.forEach((course) => {
    course.modules.forEach((mod) => {
      mod.topics.forEach((top) => {
        if (top.deadline) {
          const daysDiff = getDaysDiff(top.deadline, todayStr)
          const timelineObj: TimelineTopic = {
            course,
            module: mod,
            topic: top,
          }

          if (daysDiff === 0) {
            today.push(timelineObj)
          } else if (daysDiff === 1) {
            tomorrow.push(timelineObj)
          } else if (daysDiff > 1 && daysDiff <= 7 && top.status !== 'Completed') {
            thisWeek.push(timelineObj)
          }
        }
      })
    })
  })

  // Determine Upcoming Module:
  // Find a module that is In Progress first (lowest completion), or Not Started.
  let upcomingModule: { course: Course; module: Module } | null = null
  let bestModScore = -1

  courses.forEach((course) => {
    course.modules.forEach((mod) => {
      if (mod.status !== 'Completed') {
        let score = 0
        if (mod.status === 'In Progress') score += 50
        score += mod.progress || 0
        
        if (score > bestModScore) {
          bestModScore = score
          upcomingModule = { course, module: mod }
        }
      }
    })
  })

  if (!upcomingModule) {
    for (const course of courses) {
      const incompleteMod = course.modules.find(m => m.status !== 'Completed')
      if (incompleteMod) {
        upcomingModule = { course, module: incompleteMod }
        break
      }
    }
  }

  return {
    today,
    tomorrow,
    thisWeek,
    upcomingModule,
  }
}
