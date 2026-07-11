import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Timeline as TimelineIcon, Tag } from 'lucide-react'
import { useCourseStore, useAssignmentStore } from '@/stores/AcademicEngine'
import type { Course, Module, Topic } from '@/models'

interface TimelineEvent {
  id: string
  title: string
  start: string
  end: string
  type: 'lecture' | 'assignment' | 'exam' | 'other'
  courseId?: string
}

export default function Timeline() {
  const { courses } = useCourseStore()
  const { assignments } = useAssignmentStore()
  const [selectedDate, setSelectedDate] = useState<number>(11) // Default to July 11, 2026 (Today)
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'lecture' | 'exam' | 'assignment'>('all')

  // July 2026 starts on Wednesday (index 3). Days in July = 31.
  const startDayOffset = 3
  const totalDays = 31

  // Create Timeline cells array: null for offsets, date numbers for active days
  const TimelineCells = [
    ...Array(startDayOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  // Generate Timeline events dynamically from academic engine database
  const TimelineEvents = useMemo<TimelineEvent[]>(() => {
    const events: TimelineEvent[] = []

    // 1. Map assignments to Timeline
    assignments.forEach((asgn) => {
      events.push({
        id: asgn.id,
        title: asgn.title,
        start: `${asgn.dueDate}T09:00:00`,
        end: `${asgn.dueDate}T10:00:00`,
        type: asgn.priority === 'urgent' ? 'exam' : 'assignment',
        courseId: asgn.subjectId,
      })
    })

    // 2. Map topics with deadlines to Timeline (as lectures)
    courses.forEach((sub: Course) => {
      sub.modules.forEach((mod: Module) => {
        mod.topics.forEach((top: Topic) => {
          if (top.deadline) {
            events.push({
              id: top.id,
              title: `${sub.code} Lecture: ${top.title}`,
              start: `${top.deadline}T10:00:00`,
              end: `${top.deadline}T11:30:00`,
              type: 'lecture',
              courseId: sub.id,
            })
          }
        })
      })
    })

    return events
  }, [assignments, courses])

  const getEventsForDate = (dayNum: number): TimelineEvent[] => {
    const dateStr = `2026-07-${dayNum.toString().padStart(2, '0')}`
    return TimelineEvents.filter((event) => {
      const matchDate = event.start.startsWith(dateStr)
      const matchFilter = eventTypeFilter === 'all' || event.type === eventTypeFilter
      return matchDate && matchFilter
    })
  }

  const selectedDayEvents = getEventsForDate(selectedDate)

  const getEventTypeStyle = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'lecture':
        return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
      case 'exam':
        return 'bg-accent-rose/10 text-accent-rose border-accent-rose/20'
      case 'assignment':
        return 'bg-accent-orange/10 text-accent-orange border-accent-orange/20'
      default:
        return 'bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6 pb-8"
    >
      {/* Timeline Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-accent-blue uppercase tracking-wider">Schedule</p>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Timeline Planner</h2>
          <p className="text-xs text-text-secondary mt-1">Syllabus lectures and assignments mapped on the Timeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-border-subtle bg-bg-primary p-1 shadow-subtle">
            {(['all', 'lecture', 'exam', 'assignment'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setEventTypeFilter(filter)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  eventTypeFilter === filter
                    ? 'bg-bg-secondary text-accent-blue'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {filter}s
              </button>
            ))}
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-blue px-4 py-2 text-xs font-semibold text-white shadow-soft hover:bg-accent-blue/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Task
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Timeline Month View Grid */}
        <div className="lg:col-span-3 rounded-2xl border border-border-subtle bg-bg-primary p-5 shadow-subtle flex flex-col justify-between">
          <div>
            {/* Header controls */}
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-4">
              <span className="text-sm font-bold text-text-primary">July 2026</span>
              <div className="flex items-center gap-1">
                <button className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary" disabled>
                  <ChevronLeft className="h-4 w-4 opacity-50" />
                </button>
                <button className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary" disabled>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-text-secondary mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Timeline Cells */}
            <div className="grid grid-cols-7 gap-2">
              {TimelineCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="aspect-square bg-transparent" />
                }

                const dayEvents = getEventsForDate(day)
                const isSelected = selectedDate === day
                const hasEvents = dayEvents.length > 0

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDate(day)}
                    className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'border-accent-blue bg-accent-blue/5 text-accent-blue shadow-subtle'
                        : 'border-border-subtle hover:border-text-tertiary bg-bg-primary text-text-primary'
                    }`}
                  >
                    <span className={`text-xs font-semibold ${isSelected ? 'font-bold' : ''}`}>
                      {day}
                    </span>
                    {/* Event indicators */}
                    {hasEvents && (
                      <div className="absolute bottom-2 flex gap-1">
                        {dayEvents.slice(0, 3).map((e) => (
                          <span
                            key={e.id}
                            className={`h-1.5 w-1.5 rounded-full ${
                              e.type === 'exam'
                                ? 'bg-accent-rose'
                                : e.type === 'lecture'
                                ? 'bg-accent-blue'
                                : 'bg-accent-orange'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected Day Details Panel */}
        <div className="rounded-2xl border border-border-subtle bg-bg-primary p-5 shadow-subtle flex flex-col justify-between h-full min-h-[380px]">
          <div>
            <div className="flex items-center gap-2 border-b border-border-subtle pb-4 mb-4">
              <TimelineIcon className="h-4 w-4 text-accent-blue" />
              <h3 className="font-bold text-sm text-text-primary">
                July {selectedDate}, 2026
              </h3>
            </div>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {selectedDayEvents.map((event) => {
                  const course = courses.find((s: Course) => s.id === event.courseId)
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`rounded-xl border p-4 text-xs space-y-2.5 transition-all ${getEventTypeStyle(
                        event.type
                      )}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold uppercase tracking-wider text-[9px]">
                          {event.type}
                        </span>
                        {course && (
                          <span className="font-semibold">{course.code}</span>
                        )}
                      </div>
                      <h4 className="font-bold text-text-primary leading-tight">
                        {event.title}
                      </h4>
                      <div className="space-y-1 text-text-secondary font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {new Date(event.start).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[140px]">{course?.faculty ?? 'Faculty TBD'}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {selectedDayEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-text-tertiary">
                  <Tag className="h-8 w-8 opacity-40 mb-2" />
                  <p className="text-xs font-semibold">No Scheduled Events</p>
                  <p className="text-[10px] mt-1">Enjoy your free day!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
