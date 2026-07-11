import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Edit3, Shield, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Course } from '@/models'
import { cn } from '@/utils/cn'

export function CourseCard({
  course,
  onEdit,
  onDelete,
}: {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_22px_60px_-42px_rgba(17,24,39,0.75)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: course.color }}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              {course.code}
            </span>
            <span className="rounded-full bg-[#F7F8FA] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#111827]">
              {course.type}
            </span>
            {course.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2563EB]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                <Shield className="h-3 w-3" />
                Default
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-[#111827] transition-colors group-hover:text-[#2563EB]">
            {course.name}
          </h3>
          <p className="mt-2 text-sm text-[#6B7280]">{course.faculty}</p>
        </div>
        <div className="rounded-2xl p-3 text-white shadow-soft" style={{ backgroundColor: course.color }}>
          <BookOpen className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Metric label="Attendance" value={`${course.attendance}%`} />
        <Metric label="Syllabus" value={`${course.progress}%`} />
        <Metric label="Credits" value={String(course.credits)} />
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#F7F8FA]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${course.progress}%`, backgroundColor: course.color }}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
        <Link
          to={`/courses/${course.id}`}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#111827] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#2563EB]"
        >
          Open
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(course)}
            className="rounded-xl p-2 text-[#6B7280] transition-colors hover:bg-[#F7F8FA] hover:text-[#111827]"
            aria-label={`Edit ${course.name}`}
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(course)}
            disabled={course.isDefault}
            className={cn(
              'rounded-xl p-2 transition-colors',
              course.isDefault
                ? 'cursor-not-allowed text-[#6B7280]/35'
                : 'text-[#EF4444] hover:bg-[#EF4444]/10'
            )}
            aria-label={`Delete ${course.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  const Icon = label === 'Done' ? CheckCircle2 : label === 'Pending' ? Clock3 : BookOpen

  return (
    <div className="rounded-2xl bg-[#F7F8FA] p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[#6B7280]">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-lg font-semibold tracking-tight text-[#111827]">{value}</p>
    </div>
  )
}
