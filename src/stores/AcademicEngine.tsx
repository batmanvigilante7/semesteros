import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { Semester, Subject, Assignment, StudySession, Topic, Module, SubjectResource, SubjectNote } from '@/models'
import { defaultSemester } from '@/data/semester'

// Storage Keys
const SEMESTER_KEY = 'semesteros.semester.v1'
const SUBJECTS_KEY = 'semesteros.subjects.v1'
const ASSIGNMENTS_KEY = 'semesteros.assignments.v1'
const STUDY_KEY = 'semesteros.study.v1'

// Initial Seeds
const initialAssignments: Assignment[] = []
const initialStudySessions: StudySession[] = []

// Helper: Recalculate module progress & status and subject progress
export function recalculateSubject(subject: Subject): Subject {
  let totalHours = 0
  let completedHours = 0

  const updatedModules = (subject.modules || []).map((mod) => {
    const topics = mod.topics || []
    
    let mTotalHours = 0
    let mCompletedHours = 0

    topics.forEach((t) => {
      const tHours = t.estimatedStudyTime || t.duration || 1
      mTotalHours += tHours
      if (t.status === 'Completed') {
        mCompletedHours += tHours
      } else if (t.status === 'In Progress') {
        mCompletedHours += tHours * 0.5
      }
    })

    totalHours += mTotalHours
    completedHours += mCompletedHours

    const progress = mTotalHours > 0 ? Math.round((mCompletedHours / mTotalHours) * 100) : 0
    
    const mCompletedCount = topics.filter((t) => t.status === 'Completed').length
    const mInProgressCount = topics.filter((t) => t.status === 'In Progress').length

    let status: Module['status'] = 'Not Started'
    if (mCompletedCount === topics.length && topics.length > 0) {
      status = 'Completed'
    } else if (mCompletedCount > 0 || mInProgressCount > 0) {
      status = 'In Progress'
    }

    return {
      ...mod,
      hours: mTotalHours,
      progress,
      status,
    }
  })

  const progress = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0

  return {
    ...subject,
    modules: updatedModules,
    progress,
  }
}

// Initial Subjects compilation
const initialSubjectsCompiled: Subject[] = []

// Streak Calculator
function calculateStreak(sessionDates: string[], todayStr: string): number {
  if (sessionDates.length === 0) return 0

  const uniqueDates = Array.from(new Set(sessionDates)).sort((a, b) => b.localeCompare(a))

  const today = new Date(todayStr)
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const mostRecentDateStr = uniqueDates[0]
  const mostRecentDate = new Date(mostRecentDateStr)
  mostRecentDate.setHours(0, 0, 0, 0)

  if (mostRecentDate.getTime() !== today.getTime() && mostRecentDate.getTime() !== yesterday.getTime()) {
    return 0
  }

  let streak = 0
  const checkDate = new Date(mostRecentDate)

  while (true) {
    const checkDateStr = checkDate.toISOString().split('T')[0]
    if (uniqueDates.includes(checkDateStr)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// Centralized Context Type
interface AcademicEngineContextType {
  semester: Semester
  updateSemester: (draft: Partial<Semester>) => void

  subjects: Subject[]
  createSubject: (draft: Omit<Subject, 'id' | 'modules' | 'assignments' | 'resources' | 'notes' | 'progress'>) => void
  updateSubject: (subjectId: string, draft: Partial<Subject>) => void
  deleteSubject: (subjectId: string) => void
  importCourseDirectly: (course: Subject) => void
  updateTopicStatus: (subjectId: string, moduleId: string, topicId: string, status: Topic['status']) => void
  addResource: (subjectId: string, title: string, type: SubjectResource['type'], url: string) => void
  deleteResource: (subjectId: string, resourceId: string) => void
  addNote: (subjectId: string, title: string, content: string) => void
  updateNote: (subjectId: string, noteId: string, content: string) => void
  deleteNote: (subjectId: string, noteId: string) => void

  assignments: Assignment[]
  createAssignment: (draft: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAssignment: (assignmentId: string, draft: Partial<Assignment>) => void
  deleteAssignment: (assignmentId: string) => void
  setAssignmentStatus: (assignmentId: string, status: Assignment['status']) => void

  studySessions: StudySession[]
  createStudySession: (session: Omit<StudySession, 'id'>) => void
  deleteStudySession: (sessionId: string) => void
}

const AcademicEngineContext = createContext<AcademicEngineContextType | undefined>(undefined)

export const AcademicEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Load Semester
  const [semester, setSemesterState] = useState<Semester>(() => {
    const stored = localStorage.getItem(SEMESTER_KEY)
    return stored ? JSON.parse(stored) : defaultSemester
  })

  // 2. Load Subjects
  const [subjects, setSubjectsState] = useState<Subject[]>(() => {
    const stored = localStorage.getItem(SUBJECTS_KEY)
    return stored ? JSON.parse(stored) : initialSubjectsCompiled
  })

  // 3. Load Assignments
  const [assignments, setAssignmentsState] = useState<Assignment[]>(() => {
    const stored = localStorage.getItem(ASSIGNMENTS_KEY)
    return stored ? JSON.parse(stored) : initialAssignments
  })

  // 4. Load Study Sessions
  const [studySessions, setStudySessionsState] = useState<StudySession[]>(() => {
    const stored = localStorage.getItem(STUDY_KEY)
    return stored ? JSON.parse(stored) : initialStudySessions
  })

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem(SEMESTER_KEY, JSON.stringify(semester))
  }, [semester])

  useEffect(() => {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects))
  }, [subjects])

  useEffect(() => {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments))
  }, [assignments])

  useEffect(() => {
    localStorage.setItem(STUDY_KEY, JSON.stringify(studySessions))
  }, [studySessions])

  // Semester Operations
  const updateSemester = (draft: Partial<Semester>) => {
    setSemesterState((prev) => ({ ...prev, ...draft }))
  }

  // Subject Operations
  const createSubject = (draft: Omit<Subject, 'id' | 'modules' | 'assignments' | 'resources' | 'notes' | 'progress'>) => {
    const newSubject: Subject = {
      ...draft,
      id: `subj-${draft.code.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${crypto.randomUUID()}`,
      progress: 0,
      modules: [
        {
          id: `mod-1-${crypto.randomUUID()}`,
          title: 'Module 1: Introduction',
          hours: 6,
          progress: 0,
          status: 'Not Started',
          topics: [
            { id: `top-1-${crypto.randomUUID()}`, title: 'Course Overview', duration: 1.5, deadline: new Date().toISOString().split('T')[0], status: 'Not Started', difficulty: 'easy', estimatedStudyTime: 1.5 }
          ]
        }
      ],
      assignments: [],
      resources: [],
      notes: []
    }
    setSubjectsState((prev) => [...prev, recalculateSubject(newSubject)])
  }

  const updateSubject = (subjectId: string, draft: Partial<Subject>) => {
    setSubjectsState((prev) =>
      prev.map((sub) => (sub.id === subjectId ? recalculateSubject({ ...sub, ...draft }) : sub))
    )
  }

  const deleteSubject = (subjectId: string) => {
    setSubjectsState((prev) => prev.filter((sub) => sub.id !== subjectId))
  }

  const importCourseDirectly = (course: Subject) => {
    setSubjectsState((prev) => [...prev, recalculateSubject(course)])
  }

  const updateTopicStatus = (subjectId: string, moduleId: string, topicId: string, status: Topic['status']) => {
    setSubjectsState((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub

        const updatedModules = sub.modules.map((mod) => {
          if (mod.id !== moduleId) return mod

          const updatedTopics = mod.topics.map((top) => {
            if (top.id !== topicId) return top
            return {
              ...top,
              status,
              completedAt: status === 'Completed' ? new Date().toISOString().split('T')[0] : undefined,
            }
          })

          return { ...mod, topics: updatedTopics }
        })

        return recalculateSubject({ ...sub, modules: updatedModules })
      })
    )
  }

  const addResource = (subjectId: string, title: string, type: SubjectResource['type'], url: string) => {
    setSubjectsState((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub
        const newRes: SubjectResource = {
          id: `res-${crypto.randomUUID()}`,
          title: title.trim(),
          type,
          url: url.trim() || '#',
        }
        return { ...sub, resources: [...(sub.resources || []), newRes] }
      })
    )
  }

  const deleteResource = (subjectId: string, resourceId: string) => {
    setSubjectsState((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub
        return { ...sub, resources: (sub.resources || []).filter((r) => r.id !== resourceId) }
      })
    )
  }

  const addNote = (subjectId: string, title: string, content: string) => {
    setSubjectsState((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub
        const newNote: SubjectNote = {
          id: `note-${crypto.randomUUID()}`,
          title: title.trim(),
          content: content.trim(),
          updatedAt: new Date().toISOString(),
        }
        return { ...sub, notes: [...(sub.notes || []), newNote] }
      })
    )
  }

  const updateNote = (subjectId: string, noteId: string, content: string) => {
    setSubjectsState((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub
        return {
          ...sub,
          notes: (sub.notes || []).map((n) =>
            n.id === noteId ? { ...n, content: content.trim(), updatedAt: new Date().toISOString() } : n
          ),
        }
      })
    )
  }

  const deleteNote = (subjectId: string, noteId: string) => {
    setSubjectsState((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub
        return { ...sub, notes: (sub.notes || []).filter((n) => n.id !== noteId) }
      })
    )
  }

  // Assignment Operations
  const createAssignment = (draft: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString()
    const newAsgn: Assignment = {
      ...draft,
      id: `asgn-${crypto.randomUUID()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    setAssignmentsState((prev) => [newAsgn, ...prev])
  }

  const updateAssignment = (assignmentId: string, draft: Partial<Assignment>) => {
    setAssignmentsState((prev) =>
      prev.map((asgn) =>
        asgn.id === assignmentId ? { ...asgn, ...draft, updatedAt: new Date().toISOString() } : asgn
      )
    )
  }

  const deleteAssignment = (assignmentId: string) => {
    setAssignmentsState((prev) => prev.filter((asgn) => asgn.id !== assignmentId))
  }

  const setAssignmentStatus = (assignmentId: string, status: Assignment['status']) => {
    setAssignmentsState((prev) =>
      prev.map((asgn) =>
        asgn.id === assignmentId ? { ...asgn, status, updatedAt: new Date().toISOString() } : asgn
      )
    )
  }

  // Study Session Operations
  const createStudySession = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: `sess-${crypto.randomUUID()}`,
    }
    setStudySessionsState((prev) => [...prev, newSession])
  }

  const deleteStudySession = (sessionId: string) => {
    setStudySessionsState((prev) => prev.filter((sess) => sess.id !== sessionId))
  }

  const value = useMemo(
    () => ({
      semester,
      updateSemester,
      subjects,
      createSubject,
      updateSubject,
      deleteSubject,
      importCourseDirectly,
      updateTopicStatus,
      addResource,
      deleteResource,
      addNote,
      updateNote,
      deleteNote,
      assignments,
      createAssignment,
      updateAssignment,
      deleteAssignment,
      setAssignmentStatus,
      studySessions,
      createStudySession,
      deleteStudySession,
    }),
    [semester, subjects, assignments, studySessions]
  )

  return <AcademicEngineContext.Provider value={value}>{children}</AcademicEngineContext.Provider>
}

// Unified Context hook
export function useAcademicEngine() {
  const context = useContext(AcademicEngineContext)
  if (!context) {
    throw new Error('useAcademicEngine must be used within an AcademicEngineProvider')
  }
  return context
}

// Slice 1: Semester Store
export function useSemesterStore() {
  const { semester, updateSemester } = useAcademicEngine()
  return { semester, updateSemester }
}

// Slice 2: Course Store
export function useCourseStore() {
  const {
    subjects: courses,
    createSubject: createCourse,
    updateSubject: updateCourse,
    deleteSubject: deleteCourse,
    updateTopicStatus,
    addResource,
    deleteResource,
    addNote,
    updateNote,
    deleteNote,
  } = useAcademicEngine()

  return {
    courses,
    Courses: courses, // casing alias
    createCourse,
    updateCourse,
    deleteCourse,
    updateTopicStatus,
    addResource,
    deleteResource,
    addNote,
    updateNote,
    deleteNote,
    // compatibility mappings
    subjects: courses,
    createSubject: createCourse,
    updateSubject: updateCourse,
    deleteSubject: deleteCourse,
  }
}

export const useSubjectStore = useCourseStore

// Slice 3: Assignment Store
export function useAssignmentStore() {
  const {
    assignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    setAssignmentStatus,
  } = useAcademicEngine()

  return {
    assignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    setAssignmentStatus,
  }
}

// Slice 4: Study Session Store
export function useStudyStore() {
  const { studySessions, createStudySession, deleteStudySession } = useAcademicEngine()
  return {
    studySessions,
    createStudySession,
    deleteStudySession,
  }
}

// Slice 5: Computed Analytics Store (Zustand style computed values)
export function useAnalyticsStore() {
  const { subjects, assignments, studySessions } = useAcademicEngine()

  return useMemo(() => {
    // 1. Topic calculations
    let totalTopics = 0
    let completedTopics = 0
    let inProgressTopics = 0
    let semesterTotalHours = 0
    let semesterCompletedHours = 0

    subjects.forEach((sub) => {
      sub.modules.forEach((mod) => {
        mod.topics.forEach((top) => {
          totalTopics++
          if (top.status === 'Completed') completedTopics++
          else if (top.status === 'In Progress') inProgressTopics++

          const tHours = top.estimatedStudyTime || top.duration || 1
          semesterTotalHours += tHours
          if (top.status === 'Completed') {
            semesterCompletedHours += tHours
          } else if (top.status === 'In Progress') {
            semesterCompletedHours += tHours * 0.5
          }
        })
      })
    })

    const semesterCompletion = semesterTotalHours > 0 ? Math.round((semesterCompletedHours / semesterTotalHours) * 100) : 0
    const topicsRemaining = totalTopics - completedTopics

    // 2. Assignment calculations
    const todayStr = new Date().toISOString().split('T')[0]
    
    // Calculate week boundary (7 days from now)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    const sevenDaysFromNowStr = sevenDaysFromNow.toISOString().split('T')[0]

    const incompleteAssignments = assignments.filter((a) => a.status !== 'completed')
    const assignmentsDueToday = incompleteAssignments.filter((a) => a.dueDate === todayStr).length
    const assignmentsOverdue = incompleteAssignments.filter((a) => a.dueDate < todayStr).length
    const assignmentsThisWeek = incompleteAssignments.filter(
      (a) => a.dueDate > todayStr && a.dueDate <= sevenDaysFromNowStr
    ).length

    // 3. Attendance calculations
    const attendanceAverage =
      subjects.length > 0
        ? Math.round(subjects.reduce((sum, s) => sum + s.attendance, 0) / subjects.length)
        : 0

    // 4. Study Session calculations
    const totalSessions = studySessions.length
    const totalDuration = studySessions.reduce((sum, s) => sum + s.duration, 0)
    const averageStudyTime = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0

    // 5. Study Streak
    const sessionDates = studySessions.map((s) => s.date)
    const currentStreak = calculateStreak(sessionDates, todayStr)

    // 6. Upcoming deadlines
    const upcomingDeadlines = [...assignments]
      .filter((a) => a.status !== 'completed')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

    return {
      semesterCompletion,
      topicsCompleted: completedTopics,
      topicsRemaining,
      assignmentsDueToday,
      assignmentsOverdue,
      assignmentsThisWeek,
      attendanceAverage,
      averageStudyTime,
      currentStreak,
      upcomingDeadlines,
    }
  }, [subjects, assignments, studySessions])
}
