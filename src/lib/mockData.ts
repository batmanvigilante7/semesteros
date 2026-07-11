import type { Task, CalendarEvent, Semester } from '@/types'
import type { Subject } from '@/models'
import { defaultCourses } from '@/utils/courseHelpers'

export const mockSemesters: Semester[] = [
  {
    id: 's1',
    name: 'Fall 2025',
    startDate: '2025-09-01',
    endDate: '2025-12-18',
    gpa: 3.85,
    current: false,
  },
  {
    id: 's2',
    name: 'Spring 2026',
    startDate: '2026-01-10',
    endDate: '2026-05-15',
    gpa: 3.92,
    current: true,
  },
]

export const mockSubjects: Subject[] = defaultCourses

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Implement Red-Black Tree Rotation',
    description: 'Implement insertion and deletion balancing rotations in C++.',
    subject: 'Object Oriented Programming',
    dueDate: '2026-07-12',
    priority: 'high',
    status: 'in_progress',
    estimatedHours: 2,
    createdAt: '2026-07-01T09:00:00.000Z',
    updatedAt: '2026-07-08T09:00:00.000Z',
  },
  {
    id: 't2',
    title: 'Neural Networks Assignment 2',
    description: 'Build a basic MLP from scratch using Numpy and train on MNIST.',
    subject: 'Data Structures',
    dueDate: '2026-07-18',
    priority: 'high',
    status: 'pending',
    estimatedHours: 3,
    createdAt: '2026-07-02T09:00:00.000Z',
    updatedAt: '2026-07-08T09:00:00.000Z',
  },
  {
    id: 't3',
    title: 'Read Chapters 4 and 5 (Eigenvalues)',
    description: 'Prepare notes for class discussion on vector spaces.',
    subject: 'Probability and Statistics For Engineering',
    dueDate: '2026-07-10',
    priority: 'medium',
    status: 'pending',
    estimatedHours: 1.5,
    createdAt: '2026-07-03T09:00:00.000Z',
    updatedAt: '2026-07-08T09:00:00.000Z',
  },
  {
    id: 't4',
    title: 'Figma Lo-fi Prototypes',
    description: 'Create low-fidelity wireframes for the user onboarding flow.',
    subject: 'Object Oriented Programming Lab',
    dueDate: '2026-07-15',
    priority: 'medium',
    status: 'completed',
    estimatedHours: 2.5,
    createdAt: '2026-07-04T09:00:00.000Z',
    updatedAt: '2026-07-08T09:00:00.000Z',
  },
  {
    id: 't5',
    title: 'Final Term Project Proposal',
    description: 'Submit a 2-page PDF proposal detailing the project scope and team members.',
    subject: 'Computer Organization and Architecture',
    dueDate: '2026-07-22',
    priority: 'urgent',
    status: 'pending',
    estimatedHours: 4,
    createdAt: '2026-07-05T09:00:00.000Z',
    updatedAt: '2026-07-08T09:00:00.000Z',
  },
]

export const mockEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'CS 401: Advanced Algorithms Lecture',
    start: '2026-07-13T10:00:00',
    end: '2026-07-13T11:30:00',
    type: 'lecture',
    subjectId: 'course-oop-theory',
  },
  {
    id: 'e2',
    title: 'CS 482: Machine Learning Lecture',
    start: '2026-07-14T13:00:00',
    end: '2026-07-14T14:30:00',
    type: 'lecture',
    subjectId: 'course-ds-theory',
  },
  {
    id: 'e3',
    title: 'MATH 310: Quiz 2 (Eigenvalues)',
    start: '2026-07-15T09:00:00',
    end: '2026-07-15T09:50:00',
    type: 'exam',
    subjectId: 'course-math',
  },
]
