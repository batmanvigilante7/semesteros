import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Course, CourseDraft } from '@/models'
import {
  createCourseDraft,
  courseAccentColors,
  validateCourseDraft,
} from '@/utils/courseHelpers'
import { cn } from '@/utils/cn'

const fieldClass =
  'w-full rounded-2xl border border-border-subtle bg-[#F7F8FA] px-4 py-3 text-sm text-[#111827] outline-none transition-all placeholder:text-[#6B7280] focus:border-[#2563EB]/30 focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10'

export function CourseModal({
  isOpen,
  course,
  courses,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  course: Course | null
  courses: Course[]
  onClose: () => void
  onSubmit: (draft: CourseDraft) => void
}) {
  const initialDraft = useMemo(() => createCourseDraft(course ?? undefined), [course])
  const [draft, setDraft] = useState<CourseDraft>(initialDraft)
  const [errors, setErrors] = useState<Partial<Record<keyof CourseDraft, string>>>({})

  useEffect(() => {
    if (isOpen) {
      setDraft(initialDraft)
      setErrors({})
    }
  }, [initialDraft, isOpen])

  const updateField = <Key extends keyof CourseDraft>(key: Key, value: CourseDraft[Key]) => {
    setDraft((current: CourseDraft) => ({ ...current, [key]: value }))
    setErrors((current: Partial<Record<keyof CourseDraft, string>>) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateCourseDraft(draft, courses, course?.id)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit(draft)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/25 p-4 backdrop-blur-sm"
        >
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 330, damping: 28 }}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-white/80 bg-white p-6 shadow-premium"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                  {course ? 'Edit Course' : 'Add Course'}
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#111827]">
                  {course ? 'Update course details' : 'Create a custom course'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl p-2 text-[#6B7280] transition-colors hover:bg-[#F7F8FA] hover:text-[#111827]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Course Name" error={errors.name}>
                <input
                  value={draft.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="e.g. Operating Systems"
                  className={fieldClass}
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Course Code" error={errors.code}>
                  <input
                    value={draft.code}
                    onChange={(event) => updateField('code', event.target.value)}
                    placeholder="e.g. 24CSEN3001"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Type">
                  <select
                    value={draft.type}
                    onChange={(event) => updateField('type', event.target.value as CourseDraft['type'])}
                    className={fieldClass}
                  >
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                  </select>
                </Field>
              </div>

              <Field label="Faculty">
                <input
                  value={draft.faculty}
                  onChange={(event) => updateField('faculty', event.target.value)}
                  placeholder="Faculty TBD"
                  className={fieldClass}
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Attendance %" error={errors.attendance}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={draft.attendance}
                    onChange={(event) => updateField('attendance', Number(event.target.value))}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Credits" error={errors.credits}>
                  <input
                    type="number"
                    min="0"
                    value={draft.credits}
                    onChange={(event) => updateField('credits', Number(event.target.value))}
                    className={fieldClass}
                  />
                </Field>
              </div>

              <Field label="Accent Color">
                <div className="flex flex-wrap gap-2">
                  {courseAccentColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateField('color', color)}
                      className={cn(
                        'h-9 w-9 rounded-full border-4 transition-transform hover:scale-105',
                        draft.color === color ? 'border-[#111827]' : 'border-white'
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Choose color ${color}`}
                    />
                  ))}
                </div>
              </Field>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={onClose} className="rounded-2xl">
                Cancel
              </Button>
              <Button type="submit" className="gap-2 rounded-2xl">
                <Check className="h-4 w-4" />
                {course ? 'Save Changes' : 'Create Course'}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-semibold text-[#EF4444]">{error}</span>}
    </label>
  )
}
