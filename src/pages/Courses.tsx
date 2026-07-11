import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Plus, RotateCcw, Shield } from 'lucide-react'
import { useState } from 'react'
import { CourseCard } from '@/components/courses/CourseCard'
import { CourseModal } from '@/components/courses/CourseModal'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useCourseStore, useAssignmentStore } from '@/stores/AcademicEngine'
import type { Course, CourseDraft } from '@/models'

export default function Courses() {
  const {
    courses,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCourseStore()
  
  const { assignments } = useAssignmentStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<Course | null>(null)

  const openCreateModal = () => {
    setEditingCourse(null)
    setModalOpen(true)
  }

  const openEditModal = (course: Course) => {
    setEditingCourse(course)
    setModalOpen(true)
  }

  const handleSubmit = (draft: CourseDraft) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, draft)
    } else {
      createCourse(draft)
    }
    setModalOpen(false)
    setEditingCourse(null)
  }

  const confirmDelete = () => {
    if (!deleteCandidate) return
    deleteCourse(deleteCandidate.id)
    setDeleteCandidate(null)
  }

  // Calculate task counts dynamically
  const coursesWithTaskCounts = courses.map((sub) => {
    const subAsgns = assignments.filter((a) => a.subjectId === sub.id)
    const completedTasks = subAsgns.filter((a) => a.status === 'completed').length
    const pendingTasks = subAsgns.filter((a) => a.status !== 'completed').length

    return {
      ...sub,
      completedTasks,
      pendingTasks,
    }
  })

  const restoreDefaultCourses = () => {
    if (window.confirm('Are you sure you want to reset all courses to defaults? This will erase your current topic progress.')) {
      localStorage.removeItem('semesteros.subjects.v1')
      window.location.reload()
    }
  }

  const defaultCount = coursesWithTaskCounts.filter((course) => course.isDefault).length
  const customCount = coursesWithTaskCounts.length - defaultCount
  const averageAttendance =
    coursesWithTaskCounts.length > 0
      ? Math.round(
          coursesWithTaskCounts.reduce((total, course) => total + course.attendance, 0) /
            coursesWithTaskCounts.length
        )
      : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6 pb-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
            SemesterOS Courses
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-[#111827] md:text-4xl">
            Courses
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
            Manage semester courses, attendance, credits, and planner progress for the current term.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            onClick={restoreDefaultCourses}
            className="gap-2 rounded-2xl"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Defaults
          </Button>
          <Button onClick={openCreateModal} size="lg" className="gap-2 rounded-2xl">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Courses" value={String(coursesWithTaskCounts.length)} icon={BookOpen} />
        <SummaryCard label="Default Courses" value={String(defaultCount)} icon={Shield} />
        <SummaryCard label="Custom Courses" value={String(customCount)} icon={Plus} />
        <SummaryCard label="Avg Attendance" value={`${averageAttendance}%`} icon={BookOpen} />
      </div>

      {coursesWithTaskCounts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {coursesWithTaskCounts.map((course) => (
              <CourseCard
                key={course.id}
                course={course as any}
                onEdit={openEditModal}
                onDelete={setDeleteCandidate}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-[32px] border border-dashed border-border-medium bg-white/80 p-8 text-center">
          <BookOpen className="mb-4 h-10 w-10 text-[#2563EB]" />
          <h3 className="text-2xl font-semibold tracking-tight text-[#111827]">No courses yet.</h3>
          <p className="mt-3 text-sm text-[#6B7280]">Restore the default semester courses or create a custom one.</p>
          <Button onClick={restoreDefaultCourses} className="mt-6 rounded-2xl">
            Restore Default Courses
          </Button>
        </div>
      )}

      <CourseModal
        isOpen={modalOpen}
        course={editingCourse}
        courses={courses}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-premium border border-border-subtle"
            >
              <h3 className="text-xl font-bold text-[#111827]">Delete Course</h3>
              <p className="mt-3 text-sm text-[#6B7280]">
                Are you sure you want to delete <span className="font-semibold text-[#111827]">{deleteCandidate.name}</span>?
                This will permanently delete all associated topics, notes, and study sessions.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setDeleteCandidate(null)} className="rounded-2xl">
                  Cancel
                </Button>
                <Button onClick={confirmDelete} className="bg-[#EF4444] text-white hover:bg-[#DC2626] rounded-2xl">
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: any
}) {
  return (
    <Card className="flex items-center gap-4 rounded-[24px] border-border-subtle bg-white p-5 shadow-subtle text-left">
      <div className="rounded-2xl bg-[#F7F8FA] p-3 text-[#2563EB]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">{value}</p>
      </div>
    </Card>
  )
}
