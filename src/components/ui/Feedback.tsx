import * as React from 'react'
import { AlertCircle, RotateCcw, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'

// 1. EmptyState Component
export interface EmptyStateProps {
  type: 'tasks' | 'subjects' | 'notes' | 'assignments' | 'calendar' | 'generic'
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ type, title, description, action, className }: EmptyStateProps) {
  const defaults = {
    tasks: {
      title: 'No Tasks Yet',
      description: 'Create your first study task. SemesterOS will track your progress and notify you before it is due.',
    },
    subjects: {
      title: 'No Courses Tracked',
      description: 'Restore the default courses or add your custom study courses to initialize the planner.',
    },
    notes: {
      title: 'No Notes Folders',
      description: 'Your notes library is currently empty. Start drafting lecture formulas or revisal scratchpads.',
    },
    assignments: {
      title: 'No Assignments Due',
      description: 'Excellent work! You have no outstanding homework, project proposals, or lab assignments.',
    },
    calendar: {
      title: 'No Scheduled Events',
      description: 'Your calendar is completely clear for this date. Take a break or plan some self-study time!',
    },
    generic: {
      title: 'No Data Available',
      description: 'There is nothing here yet. Tap the button below to get started.',
    },
  }

  const active = defaults[type] || defaults.generic
  const activeTitle = title || active.title
  const activeDescription = description || active.description

  return (
    <div
      className={cn(
        'flex min-h-80 flex-col items-center justify-center rounded-[28px] border border-dashed border-border-medium bg-surface/50 p-8 text-center shadow-subtle',
        className
      )}
    >
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary" />
        <div className="absolute -right-3 -top-2 rounded-xl bg-surface p-2 text-success shadow-soft">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>
      <h3 className="text-lg font-bold tracking-tight text-text-primary">{activeTitle}</h3>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-text-secondary">
        {activeDescription}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// 2. ErrorState Component
export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this section. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-60 flex-col items-center justify-center rounded-3xl border border-danger/10 bg-danger/5 p-6 text-center',
        className
      )}
    >
      <div className="rounded-2xl bg-danger/10 p-3 text-danger mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h4 className="text-sm font-bold text-text-primary">{title}</h4>
      <p className="mt-1.5 max-w-xs text-xs text-text-secondary leading-relaxed">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-danger text-white px-4 py-2 text-xs font-semibold shadow-soft hover:bg-danger/90 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </div>
  )
}

// 3. SkeletonLoader Component
export interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'text'
  rows?: number
  className?: string
}

export function SkeletonLoader({ variant = 'text', rows = 3, className }: SkeletonLoaderProps) {
  return (
    <div className={cn('space-y-3 w-full', className)}>
      {variant === 'text' &&
        Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="h-3.5 bg-bg-tertiary rounded-md animate-pulse first:w-full last:w-[65%]"
            style={{ width: idx % 2 === 0 ? '85%' : '95%' }}
          />
        ))}

      {variant === 'list' &&
        Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface p-4"
          >
            <div className="h-8 w-8 rounded-xl bg-bg-tertiary animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="h-3 w-1/3 bg-bg-tertiary rounded-md animate-pulse" />
              <div className="h-2.5 w-1/2 bg-bg-tertiary rounded-md animate-pulse" />
            </div>
          </div>
        ))}

      {variant === 'card' &&
        Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-[24px] border border-border-subtle bg-surface p-6 space-y-4 shadow-subtle"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-bg-tertiary animate-pulse shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-[45%] bg-bg-tertiary rounded-md animate-pulse" />
                <div className="h-2.5 w-[30%] bg-bg-tertiary rounded-md animate-pulse" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-2.5 w-full bg-bg-tertiary rounded-md animate-pulse" />
              <div className="h-2.5 w-[85%] bg-bg-tertiary rounded-md animate-pulse" />
            </div>
          </div>
        ))}
    </div>
  )
}
