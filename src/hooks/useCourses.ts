import { useMemo } from 'react'
import { useSubjectStore, useAssignmentStore } from '@/stores/AcademicEngine'
import type { CourseDraft } from '@/models'

export function useCourses() {
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
  } = useSubjectStore()

  const { assignments } = useAssignmentStore()

  const coursesWithTaskCounts = useMemo(() => {
    return courses.map((sub) => {
      const subAsgns = assignments.filter((a) => a.subjectId === sub.id)
      const completedTasks = subAsgns.filter((a) => a.status === 'completed').length
      const pendingTasks = subAsgns.filter((a) => a.status !== 'completed').length

      return {
        ...sub,
        completedTasks,
        pendingTasks,
        attendancePercentage: sub.attendance, // compatibility mapping
      }
    })
  }, [courses, assignments])

  const restoreDefaultCourses = () => {
    if (window.confirm('Reset all courses to defaults? Your current topic progress will be erased.')) {
      localStorage.removeItem('semesteros.subjects.v1')
      window.location.reload()
    }
  }

  return {
    courses,
    coursesWithTaskCounts,
    createCourse: (draft: CourseDraft) => {
      createCourse(draft)
    },
    updateCourse,
    deleteCourse,
    updateTopicStatus,
    addResource,
    deleteResource,
    updateNotes: (courseId: string, notesContent: string) => {
      const sub = courses.find((s) => s.id === courseId)
      const existingScratchpad = (sub?.notes || []).find((n) => n.title === 'Class Scratchpad')
      if (existingScratchpad) {
        updateNote(courseId, existingScratchpad.id, notesContent)
      } else {
        addNote(courseId, 'Class Scratchpad', notesContent)
      }
    },
    restoreDefaultCourses,
  }
}
