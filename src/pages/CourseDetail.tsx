import { Navigate, useParams } from 'react-router-dom'
import { CourseDetailContent } from '@/components/courses/CourseDetailContent'
import { useCourseStore, useAssignmentStore } from '@/stores/AcademicEngine'

export default function CourseDetail() {
  const { subjectId } = useParams()
  const { courses } = useCourseStore()
  const { assignments } = useAssignmentStore()

  const Course = courses.find((s) => s.id === subjectId || s.code === subjectId)

  if (!Course) {
    return <Navigate to="/courses" replace />
  }

  return <CourseDetailContent Course={Course} assignments={assignments} />
}
