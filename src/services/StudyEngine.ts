import type { Course, Topic, Module, Assignment, StudySession } from '@/models'
import { getDaysDiff, getTodayDateString } from '@/utils/homeHelpers'

export interface StudyRecommendation {
  course: Course
  module: Module
  topic: Topic
  reason: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedTime: number
  deadline?: string
  difficulty: 'easy' | 'medium' | 'hard'
  urgencyScore: number
}

export interface DailyScheduleBlock {
  timeSlot: string
  course: Course
  topic: Topic
}

export interface WorkloadStats {
  score: number // 0 - 100
  label: 'Balanced' | 'Busy' | 'Heavy' | 'Overloaded'
  color: 'success' | 'warning' | 'orange' | 'danger'
  totalStudyHours: number
  hasWarning: boolean
  warningMessage?: string
}

export interface CourseInsights {
  needingAttention: Course | null
  fastestImproving: Course | null
  leastCompleted: Course | null
  mostPendingTopics: Course | null
}

// 1. RECOMMENDATION ENGINE
export function getStudyRecommendations(
  courses: Course[],
  assignments: Assignment[],
  todayStr = getTodayDateString()
): StudyRecommendation[] {
  const recommendations: StudyRecommendation[] = []

  courses.forEach((course) => {
    course.modules.forEach((mod) => {
      mod.topics.forEach((top) => {
        if (top.status !== 'Completed') {
          let score = 0
          let reason = 'Recommended study topic for this week.'

          // A. Days Remaining Factor (Deadlines)
          let daysDiff = 999
          if (top.deadline) {
            daysDiff = getDaysDiff(top.deadline, todayStr)
            if (daysDiff < 0) {
              score += 120 + Math.min(60, Math.abs(daysDiff) * 5)
              reason = `This topic is overdue by ${Math.abs(daysDiff)} days.`
            } else if (daysDiff === 0) {
              score += 100
              reason = 'This topic is due today.'
            } else if (daysDiff === 1) {
              score += 85
              reason = 'This topic is due tomorrow.'
            } else if (daysDiff <= 3) {
              score += 65
              reason = `You have only ${daysDiff} days remaining before the deadline.`
            } else if (daysDiff <= 7) {
              score += 45
              reason = `This topic is scheduled for review this week.`
            } else {
              score += Math.max(0, 20 - daysDiff)
            }
          }

          // B. Status bonus
          if (top.status === 'In Progress') {
            score += 25
            if (daysDiff > 3) {
              reason = 'Active study topic. Keep up the momentum!'
            }
          }

          // C. Difficulty Factor
          if (top.difficulty === 'hard') {
            score += 30
          } else if (top.difficulty === 'medium') {
            score += 15
          } else {
            score += 5
          }

          // D. Module Completion Bias (prioritize finishing active modules)
          if (mod.progress > 0 && mod.progress < 100) {
            score += mod.progress * 0.4
            if (mod.progress >= 75 && daysDiff > 1) {
              reason = `Finishing this topic will complete ${mod.title.split(':')[0]}!`
            }
          }

          // E. Course Completion Bias (prioritize courses with lower progress)
          if (course.progress < 30) {
            score += 15
          }

          // F. Assignment Proximity (if an assignment in this course is due within 3 days)
          const pendingCourseAsgns = assignments.filter(
            (a) => a.subjectId === course.id && a.status !== 'completed'
          )
          let nearestAsgnDays = 999
          pendingCourseAsgns.forEach((a) => {
            const diff = getDaysDiff(a.dueDate, todayStr)
            if (diff >= 0 && diff < nearestAsgnDays) {
              nearestAsgnDays = diff
            }
          })

          if (nearestAsgnDays <= 3) {
            score += 25
            reason = `An assignment for ${course.code} is due in ${nearestAsgnDays} days.`
          }

          // Determine priority category based on score
          let priority: StudyRecommendation['priority'] = 'low'
          if (score >= 120) priority = 'critical'
          else if (score >= 85) priority = 'high'
          else if (score >= 50) priority = 'medium'

          recommendations.push({
            course,
            module: mod,
            topic: top,
            reason,
            priority,
            estimatedTime: top.estimatedStudyTime || 1.5,
            deadline: top.deadline,
            difficulty: top.difficulty || 'medium',
            urgencyScore: Math.round(score),
          })
        }
      })
    })
  })

  // Sort descending by urgency score
  return recommendations.sort((a, b) => b.urgencyScore - a.urgencyScore)
}

// 2. DAILY STUDY PLAN GENERATOR
export function generateDailySchedule(
  recommendations: StudyRecommendation[],
  startTimeStr = '09:00'
): DailyScheduleBlock[] {
  const schedule: DailyScheduleBlock[] = []
  if (recommendations.length === 0) return []

  // Take up to 3 highest priority recommendations
  const topRecs = recommendations.slice(0, 3)

  // Helper to add minutes to time string HH:MM
  const addMinutesToTime = (time: string, minsToAdd: number): string => {
    const [hrs, mins] = time.split(':').map(Number)
    let totalMins = hrs * 60 + mins + minsToAdd
    
    // Cap in 24 hours format
    totalMins = totalMins % (24 * 60)
    
    const newHrs = String(Math.floor(totalMins / 60)).padStart(2, '0')
    const newMins = String(totalMins % 60).padStart(2, '0')
    return `${newHrs}:${newMins}`
  }

  let currentTime = startTimeStr

  topRecs.forEach((rec, idx) => {
    // Map durations (hrs) to minutes
    const durationMins = Math.round(rec.estimatedTime * 60)
    const blockEnd = addMinutesToTime(currentTime, durationMins)

    schedule.push({
      timeSlot: `${currentTime}–${blockEnd}`,
      course: rec.course,
      topic: rec.topic,
    })

    // Add a 15-minute buffer break between blocks, and a 2-hour lunch/study gap after block 2
    const breakMins = idx === 1 ? 120 : 15
    currentTime = addMinutesToTime(blockEnd, breakMins)
  })

  return schedule
}

// 3. WORKLOAD SCORE & ANALYSIS
export function getWorkloadStats(
  courses: Course[],
  assignments: Assignment[],
  todayStr = getTodayDateString()
): WorkloadStats {
  const recommendations = getStudyRecommendations(courses, assignments, todayStr)

  // Sum estimated study hours for all incomplete topics due in the next 7 days
  let totalStudyHours = 0
  recommendations.forEach((rec) => {
    if (rec.deadline) {
      const days = getDaysDiff(rec.deadline, todayStr)
      // Only sum workloads due within this week
      if (days >= 0 && days <= 7) {
        totalStudyHours += rec.estimatedTime
      }
    }
  })

  // Normalize workload score (cap at 100)
  const score = Math.min(100, Math.round((totalStudyHours / 30) * 100))

  let label: WorkloadStats['label'] = 'Balanced'
  let color: WorkloadStats['color'] = 'success'

  if (score > 85) {
    label = 'Overloaded'
    color = 'danger'
  } else if (score > 60) {
    label = 'Heavy'
    color = 'orange'
  } else if (score > 35) {
    label = 'Busy'
    color = 'warning'
  }

  // Heavy day check: if the study hours for today (topics due today or tomorrow) exceed 6 hours
  let hoursToday = 0
  recommendations.forEach((rec) => {
    if (rec.deadline) {
      const days = getDaysDiff(rec.deadline, todayStr)
      if (days === 0 || days === 1) {
        hoursToday += rec.estimatedTime
      }
    }
  })

  const hasWarning = hoursToday > 6
  const warningMessage = hasWarning
    ? '⚠️ Heavy Study Day: You have more than 6 hours of estimated study due. Consider rescheduling lower priority topics.'
    : undefined

  return {
    score,
    label,
    color,
    totalStudyHours: Math.round(totalStudyHours * 10) / 10,
    hasWarning,
    warningMessage,
  }
}

// 4. COURSE INSIGHTS GENERATION
export function getCourseInsights(courses: Course[]): CourseInsights {
  if (courses.length === 0) {
    return { needingAttention: null, fastestImproving: null, leastCompleted: null, mostPendingTopics: null }
  }

  // A. Least Completed & Course Needing Attention (attendance < 75 gets attention first, otherwise lowest progress)
  let leastCompleted = courses[0]
  let needingAttention = courses[0]

  courses.forEach((course) => {
    if (course.progress < leastCompleted.progress) {
      leastCompleted = course
    }
    // Attendance warning trigger takes highest priority for needing attention
    if (course.attendance < needingAttention.attendance) {
      needingAttention = course
    }
  })

  // Fallback needing attention to lowest progress if all attendances are equal/good
  if (needingAttention.attendance >= 90) {
    needingAttention = leastCompleted
  }

  // B. Fastest Improving (Course with the highest progress percentage)
  let fastestImproving = courses[0]
  courses.forEach((course) => {
    if (course.progress > fastestImproving.progress && course.progress < 100) {
      fastestImproving = course
    }
  })

  // C. Most Pending Topics
  let mostPendingTopics = courses[0]
  let maxPendingCount = -1

  courses.forEach((course) => {
    let pendingCount = 0
    course.modules.forEach((m) => {
      m.topics.forEach((t) => {
        if (t.status !== 'Completed') pendingCount++
      })
    })

    if (pendingCount > maxPendingCount) {
      maxPendingCount = pendingCount
      mostPendingTopics = course
    }
  })

  return {
    needingAttention,
    fastestImproving: fastestImproving.progress > 0 ? fastestImproving : null,
    leastCompleted,
    mostPendingTopics,
  }
}

// 5. SMART NOTIFICATIONS
export function getSmartNotifications(
  courses: Course[],
  assignments: Assignment[],
  studySessions: StudySession[],
  todayStr = getTodayDateString()
): string[] {
  const notifications: string[] = []

  // 1. Topic milestones (e.g. Completed 80% of OOP)
  courses.forEach((course) => {
    if (course.progress >= 75 && course.progress < 100) {
      notifications.push(`You've completed ${course.progress}% of ${course.name}! You're close to finishing this course.`)
    }
  })

  // 2. Upcoming Assignment deadlines in courses
  const pendingAsgns = assignments.filter((a) => a.status !== 'completed')
  pendingAsgns.forEach((a) => {
    const days = getDaysDiff(a.dueDate, todayStr)
    const course = courses.find((s) => s.id === a.subjectId)
    if (days >= 0 && days <= 2 && course) {
      notifications.push(`${course.code} has an upcoming assignment deadline ("${a.title}") in ${days} days.`)
    }
  })

  // 3. Stale study gaps (Course hasn't been studied in 5 days)
  courses.forEach((course) => {
    // Find latest study session date for this course
    const subSessions = studySessions.filter((s) => s.subject === course.name || s.subject === course.id)
    if (subSessions.length > 0) {
      const sorted = subSessions.map((s) => s.date).sort((a, b) => b.localeCompare(a))
      const latestStudyDate = sorted[0]
      const gapDays = getDaysDiff(todayStr, latestStudyDate)
      if (gapDays >= 5) {
        notifications.push(`${course.name} hasn't been studied in ${gapDays} days. Consider revising a pending module.`)
      }
    } else {
      // Never studied
      notifications.push(`${course.code} hasn't been studied yet. Add a study session or mark a topic complete.`)
    }
  })

  return notifications
}
