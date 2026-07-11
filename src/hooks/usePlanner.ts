import { useMemo } from 'react'
import { useSubjectStore, useAssignmentStore } from '@/stores/AcademicEngine'
import type { Task, TaskDraft, TaskFilter, TaskSort, TaskStatus } from '@/types'
import {
  filterTasks,
  getTaskStats,
  sortTasks,
} from '@/utils/plannerHelpers'

export function usePlanner(filter: TaskFilter = 'all', sort: TaskSort = 'due_date', searchQuery = '') {
  const { subjects: courses } = useSubjectStore()
  const {
    assignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    setAssignmentStatus,
  } = useAssignmentStore()

  // Map Assignment model to Task model for UI compatibility
  const tasks = useMemo<Task[]>(() => {
    return assignments.map((asgn) => {
      const course = courses.find((s) => s.id === asgn.subjectId)
      return {
        id: asgn.id,
        title: asgn.title,
        description: asgn.description || '',
        subject: course ? course.name : 'Object Oriented Programming',
        priority: asgn.priority as any,
        status: asgn.status as any,
        dueDate: asgn.dueDate,
        estimatedHours: asgn.estimatedHours,
        createdAt: asgn.createdAt || new Date().toISOString(),
        updatedAt: asgn.updatedAt || new Date().toISOString(),
      }
    })
  }, [assignments, courses])

  const visibleTasks = useMemo(
    () => sortTasks(filterTasks(tasks, filter, searchQuery), sort),
    [filter, searchQuery, sort, tasks]
  )

  const stats = useMemo(() => getTaskStats(tasks), [tasks])

  const createTask = (draft: TaskDraft) => {
    const course = courses.find((s) => s.name === draft.subject)
    createAssignment({
      title: draft.title,
      subjectId: course ? course.id : 'course-oop-theory',
      dueDate: draft.dueDate,
      priority: draft.priority as any,
      status: draft.status as any,
      estimatedHours: draft.estimatedHours,
      description: draft.description,
    })
  }

  const updateTask = (taskId: string, draft: TaskDraft) => {
    const course = courses.find((s) => s.name === draft.subject)
    updateAssignment(taskId, {
      title: draft.title,
      subjectId: course ? course.id : 'course-oop-theory',
      dueDate: draft.dueDate,
      priority: draft.priority as any,
      status: draft.status as any,
      estimatedHours: draft.estimatedHours,
      description: draft.description,
    })
  }

  const deleteTask = (taskId: string) => {
    deleteAssignment(taskId)
  }

  const setTaskStatusAndSync = (taskId: string, status: TaskStatus) => {
    setAssignmentStatus(taskId, status as any)
  }

  const completeTask = (taskId: string) => setAssignmentStatus(taskId, 'completed')

  const undoCompleteTask = (taskId: string) => setAssignmentStatus(taskId, 'pending')

  const duplicateTask = (taskId: string) => {
    const source = assignments.find((a) => a.id === taskId)
    if (!source) return
    createAssignment({
      title: `${source.title} Copy`,
      subjectId: source.subjectId,
      dueDate: source.dueDate,
      priority: source.priority,
      status: 'pending',
      estimatedHours: source.estimatedHours,
      description: source.description,
    })
  }

  return {
    tasks,
    visibleTasks,
    stats,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    undoCompleteTask,
    duplicateTask,
    setTaskStatus: setTaskStatusAndSync,
  }
}

export function createEmptyTaskDraft(subject = 'Object Oriented Programming'): TaskDraft {
  return {
    title: '',
    description: '',
    subject,
    priority: 'medium',
    status: 'pending',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedHours: 0,
  }
}
