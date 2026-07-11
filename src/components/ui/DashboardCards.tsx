import { motion } from 'framer-motion'
import { CalendarDays, MoreHorizontal, Check, TrendingUp } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

// 1. ProgressRing Component (Radial Syllabus Progress)
export interface ProgressRingProps {
  percentage: number
  color?: string
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

export function ProgressRing({
  percentage,
  color = '#2563EB',
  size = 96,
  strokeWidth = 6,
  label = 'Status',
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-bg-secondary/40 rounded-2xl p-4 border border-border-subtle shrink-0',
        className
      )}
      style={{ width: size + 32 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="h-full w-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-border-medium fill-transparent"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-transparent transition-all"
            strokeWidth={strokeWidth}
            stroke={color}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-text-primary leading-none">{percentage}%</span>
          {label && <span className="text-[8px] font-bold text-text-tertiary uppercase mt-1">{label}</span>}
        </div>
      </div>
    </div>
  )
}

// 2. ProgressBar Component (Linear Progress indicator)
export interface ProgressBarProps {
  percentage: number
  color?: string
  className?: string
}

export function ProgressBar({ percentage, color = '#2563EB', className }: ProgressBarProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary border border-border-subtle">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// 3. StatCard Component (Dashboard top rows stats widgets)
export interface StatCardProps {
  title: string
  value: string
  trend?: string
  trendType?: 'up' | 'down' | 'neutral'
  icon?: any
  color?: string
  className?: string
}

export function StatCard({ title, value, trend, trendType = 'neutral', icon: Icon, color = '#2563EB', className }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} className="h-full">
      <Card className={cn('group h-full rounded-[24px] border-border-subtle bg-surface p-5 shadow-subtle flex flex-col justify-between text-left', className)}>
        <div className="flex items-start justify-between gap-4">
          <div
            className="rounded-xl p-2.5 border border-border-subtle"
            style={{ backgroundColor: `${color}10`, color: color }}
          >
            {Icon && <Icon className="h-4.5 w-4.5" />}
          </div>
          {trendType === 'up' && (
            <TrendingUp className="h-3.5 w-3.5 text-success opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          )}
        </div>
        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-text-primary">{value}</p>
          {trend && <p className="mt-2 text-[10px] font-semibold text-text-tertiary">{trend}</p>}
        </div>
      </Card>
    </motion.div>
  )
}

// 4. TimelineCard Component (Course Timeline Log row)
export interface TimelineCardProps {
  subjectCode: string
  subjectColor: string
  moduleTitle: string
  topicTitle: string
  status: 'Completed' | 'In Progress' | 'Not Started'
  dueDate?: string
  className?: string
}

export function TimelineCard({
  subjectCode,
  subjectColor,
  moduleTitle,
  topicTitle,
  status,
  dueDate,
  className,
}: TimelineCardProps) {
  return (
    <div className={cn('flex gap-3 rounded-xl bg-bg-secondary p-3.5 border border-border-subtle text-left', className)}>
      <span className="h-2.5 w-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: subjectColor }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-bold uppercase text-text-secondary">{subjectCode}</span>
          <span className="text-[9px] text-text-tertiary">•</span>
          <span className="text-[9px] font-semibold text-text-tertiary truncate max-w-[150px]">
            {moduleTitle.split(':')[0]}
          </span>
        </div>
        <h4 className="text-xs font-semibold text-text-primary mt-0.5">{topicTitle}</h4>
        {dueDate && (
          <p className="text-[9px] font-semibold text-text-tertiary mt-1 flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3" /> Due: {dueDate}
          </p>
        )}
      </div>
      <div className="shrink-0 flex items-center">
        <Badge
          variant={
            status === 'Completed' ? 'teal' : status === 'In Progress' ? 'orange' : 'secondary'
          }
        >
          {status}
        </Badge>
      </div>
    </div>
  )
}

// 5. AssignmentCard / TaskCard Component
export interface AssignmentCardProps {
  title: string
  dueDate: string
  subjectName: string
  subjectColor: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed'
  onCompleteToggle?: () => void
  onMenuClick?: () => void
  className?: string
}

export function AssignmentCard({
  title,
  dueDate,
  subjectName,
  subjectColor,
  priority,
  status,
  onCompleteToggle,
  onMenuClick,
  className,
}: AssignmentCardProps) {
  const isCompleted = status === 'completed'

  return (
    <div
      className={cn(
        'flex gap-4 items-start rounded-[24px] border border-border-subtle bg-surface p-4 shadow-subtle hover:shadow-soft transition-all duration-200 text-left',
        isCompleted && 'opacity-70',
        className
      )}
    >
      {onCompleteToggle && (
        <button
          onClick={onCompleteToggle}
          className={cn(
            'mt-1 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer outline-none',
            isCompleted
              ? 'border-success bg-success text-white'
              : 'border-border-medium bg-bg-primary hover:border-primary'
          )}
        >
          {isCompleted && <Check className="h-3 w-3 stroke-[3]" />}
        </button>
      )}

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-text-primary">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: subjectColor }} />
            {subjectName}
          </span>
          <Badge
            variant={priority === 'urgent' || priority === 'high' ? 'rose' : priority === 'medium' ? 'orange' : 'teal'}
          >
            {priority}
          </Badge>
        </div>

        <h4 className={cn('text-xs font-semibold text-text-primary truncate', isCompleted && 'line-through text-text-muted')}>{title}</h4>

        <div className="flex items-center gap-3 pt-1 text-[9px] font-bold text-text-secondary">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5 text-text-tertiary" />
            Due {dueDate}
          </span>
        </div>
      </div>

      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1 text-text-muted hover:bg-bg-secondary hover:text-text-primary transition-all cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
