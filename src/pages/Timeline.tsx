import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Compass,
  BookOpen,
  CheckCircle2,
} from 'lucide-react'
import { useCourseStore, useAssignmentStore } from '@/stores/AcademicEngine'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

// Semester timeline week configuration
interface SemesterWeek {
  weekNum: number
  month: 'July' | 'August' | 'September' | 'October' | 'November'
  label: string
  isCurrent: boolean
}

const SEMESTER_WEEKS: SemesterWeek[] = [
  { weekNum: 1, month: 'July', label: 'Week 1', isCurrent: false },
  { weekNum: 2, month: 'July', label: 'Week 2', isCurrent: true }, // Current Week (July 11, 2026)
  { weekNum: 3, month: 'July', label: 'Week 3', isCurrent: false },
  { weekNum: 4, month: 'July', label: 'Week 4', isCurrent: false },
  { weekNum: 5, month: 'August', label: 'Week 5', isCurrent: false },
  { weekNum: 6, month: 'August', label: 'Week 6', isCurrent: false },
  { weekNum: 7, month: 'August', label: 'Week 7', isCurrent: false },
  { weekNum: 8, month: 'August', label: 'Week 8', isCurrent: false }, // Midterms
  { weekNum: 9, month: 'September', label: 'Week 9', isCurrent: false },
  { weekNum: 10, month: 'September', label: 'Week 10', isCurrent: false },
  { weekNum: 11, month: 'September', label: 'Week 11', isCurrent: false },
  { weekNum: 12, month: 'September', label: 'Week 12', isCurrent: false }, // Lab Review
  { weekNum: 13, month: 'October', label: 'Week 13', isCurrent: false },
  { weekNum: 14, month: 'October', label: 'Week 14', isCurrent: false },
  { weekNum: 15, month: 'October', label: 'Week 15', isCurrent: false },
  { weekNum: 16, month: 'October', label: 'Week 16', isCurrent: false }, // Finals Prep
  { weekNum: 17, month: 'November', label: 'Week 17', isCurrent: false }, // Finals Week
  { weekNum: 18, month: 'November', label: 'Week 18', isCurrent: false },
  { weekNum: 19, month: 'November', label: 'Week 19', isCurrent: false },
  { weekNum: 20, month: 'November', label: 'Week 20', isCurrent: false },
]

export default function Timeline() {
  const { courses } = useCourseStore()
  const { assignments } = useAssignmentStore()

  const [selectedWeek, setSelectedWeek] = useState<number>(2) // Default to current week

  // Calculate month boundaries for horizontal layout grid span
  const monthSpans = {
    July: 4,
    August: 4,
    September: 4,
    October: 4,
    November: 4,
  }

  // Milestones & Exams Lane definition
  const milestones = [
    { startWeek: 8, endWeek: 8, title: 'Midterm Exams', type: 'exam', color: '#EF4444', desc: 'Syllabus coverage from Module 1 & 2' },
    { startWeek: 12, endWeek: 12, title: 'Practical Lab Review', type: 'lab', color: '#EC4899', desc: 'Review sheets, submissions & viva checks' },
    { startWeek: 16, endWeek: 16, title: 'Finals Preparation', type: 'prep', color: '#F59E0B', desc: 'Revision checklists & self-testing' },
    { startWeek: 17, endWeek: 18, title: 'Semester Finals', type: 'exam', color: '#DC2626', desc: 'End term examinations' },
  ]

  // Dynamic modules pacing mapped across the 18 semester weeks
  const coursePacing = useMemo(() => {
    return courses.map((course) => {
      const numModules = course.modules?.length || 1
      const weeksPerModule = Math.max(2, Math.floor(16 / numModules))
      
      const lanes = (course.modules || []).map((mod, idx) => {
        const startWeek = idx * weeksPerModule + 1
        const endWeek = Math.min(18, (idx + 1) * weeksPerModule)
        return {
          startWeek,
          endWeek,
          title: mod.title || `Module ${idx + 1}`
        }
      })

      return {
        courseCode: course.code,
        color: course.color,
        lanes
      }
    })
  }, [courses])

  // Group assignments by week due (approximation for timeline display)
  const assignmentsByWeek = useMemo(() => {
    return assignments.map((asgn) => {
      // Approximate week based on due date (e.g. today July 11 -> Week 2)
      // We will parse the due date and map it:
      // July 1 - 7 = Week 1, July 8 - 14 = Week 2, July 15 - 21 = Week 3, July 22 - 28 = Week 4, etc.
      const date = new Date(asgn.dueDate)
      const month = date.getMonth() // 6 = July
      const day = date.getDate()

      let targetWeek = 1
      if (month === 6) { // July
        targetWeek = Math.min(4, Math.floor((day - 1) / 7) + 1)
      } else if (month === 7) { // Aug
        targetWeek = Math.min(8, Math.floor((day - 1) / 7) + 5)
      } else if (month === 8) { // Sept
        targetWeek = Math.min(12, Math.floor((day - 1) / 7) + 9)
      } else if (month === 9) { // Oct
        targetWeek = Math.min(16, Math.floor((day - 1) / 7) + 13)
      } else if (month === 10) { // Nov
        targetWeek = Math.min(20, Math.floor((day - 1) / 7) + 17)
      }

      return {
        ...asgn,
        weekNum: targetWeek,
      }
    })
  }, [assignments])

  // Get deliverables for selected week
  const selectedWeekDeliverables = useMemo(() => {
    return assignmentsByWeek.filter(a => a.weekNum === selectedWeek)
  }, [assignmentsByWeek, selectedWeek])

  const selectedWeekModules = useMemo(() => {
    const active: any[] = []
    coursePacing.forEach(course => {
      course.lanes.forEach(lane => {
        if (selectedWeek >= lane.startWeek && selectedWeek <= lane.endWeek) {
          active.push({
            courseCode: course.courseCode,
            color: course.color,
            title: lane.title,
            span: `${lane.startWeek} - ${lane.endWeek}`,
          })
        }
      })
    })
    return active
  }, [selectedWeek])

  const selectedWeekMilestones = useMemo(() => {
    return milestones.filter(m => selectedWeek >= m.startWeek && selectedWeek <= m.endWeek)
  }, [selectedWeek])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-8 pb-12 text-left select-none"
    >
      {/* 1. TOP FOCUS HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <p className="text-xs font-semibold text-accent-rose uppercase tracking-wider">Semester Roadmap</p>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary mt-1">Semester Timeline</h2>
          <p className="text-xs text-text-secondary mt-0.5">Visualize course modules, practical lab reviews, and assignment deadlines in one timeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="rose" className="font-bold">July 2026</Badge>
          <Badge variant="indigo">Week 2 of 20</Badge>
        </div>
      </div>

      {/* 2. TIMELINE GRAPH BLOCK (HORIZONTALLY SCROLLABLE - DESKTOP ONLY) */}
      <Card className="hidden lg:block p-6 border-border-subtle bg-surface shadow-subtle overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-text-secondary border-b border-border-subtle/50 pb-2">
            <span className="font-bold text-text-primary">Horizontal Term Gantt Pacing</span>
            <span className="text-[10px] text-text-tertiary">Scroll horizontally to view future months & weeks. Click a week block to view details.</span>
          </div>

          {/* Horizontal scroll container */}
          <div className="overflow-x-auto pb-4 pt-2 scrollbar-thin">
            <div className="min-w-[1200px] grid grid-cols-20 gap-2 relative">
              
              {/* MONTH LABELS ROW */}
              {Object.entries(monthSpans).map(([month, span]) => (
                <div
                  key={month}
                  className="text-[11px] font-bold text-text-tertiary text-center border-b border-border-subtle/30 pb-1 uppercase tracking-wider"
                  style={{ gridColumn: `span ${span}` }}
                >
                  {month}
                </div>
              ))}

              {/* WEEK HEADER ROW */}
              {SEMESTER_WEEKS.map((week) => (
                <button
                  key={week.weekNum}
                  onClick={() => setSelectedWeek(week.weekNum)}
                  className={cn(
                    'p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer select-none',
                    week.isCurrent ? 'bg-accent-rose/5 border-accent-rose text-accent-rose shadow-soft' : '',
                    selectedWeek === week.weekNum ? 'bg-primary/5 border-primary text-primary shadow-subtle' : 'border-border-subtle bg-bg-secondary/20 hover:border-border-medium hover:bg-bg-secondary/40'
                  )}
                >
                  <span className="text-[10px] font-extrabold font-mono leading-none">{week.weekNum}</span>
                  <span className="text-[8px] text-text-secondary mt-1 font-bold">{week.label}</span>
                  {week.isCurrent && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-rose mt-1" />
                  )}
                </button>
              ))}

              {/* TIMELINE LANES */}
              
              {/* Lane 1: Exams & Milestones */}
              <div className="col-span-full h-10 border-t border-border-subtle/30 mt-4 relative">
                <span className="absolute -top-3 left-0 text-[8px] font-bold text-text-tertiary uppercase tracking-wider">Milestones & Exams</span>
                <div className="absolute inset-0 grid grid-cols-20 gap-2 items-center">
                  {milestones.map((m, idx) => {
                    const colStart = m.startWeek
                    const colSpan = m.endWeek - m.startWeek + 1
                    return (
                      <div
                        key={idx}
                        className="rounded-lg h-7 px-2 text-[9px] font-bold text-white flex items-center justify-center shadow-subtle truncate select-none"
                        style={{
                          gridColumnStart: colStart,
                          gridColumnEnd: colStart + colSpan,
                          backgroundColor: m.color
                        }}
                        title={m.desc}
                      >
                        {m.title}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Lanes for each Course Modules */}
              {coursePacing.map((course) => (
                <div key={course.courseCode} className="col-span-full h-10 border-t border-border-subtle/30 mt-2 relative">
                  <span className="absolute -top-3 left-0 text-[8px] font-extrabold uppercase tracking-wider" style={{ color: course.color }}>
                    {course.courseCode} syllabus
                  </span>
                  <div className="absolute inset-0 grid grid-cols-20 gap-2 items-center">
                    {course.lanes.map((lane, lIdx) => {
                      const colStart = lane.startWeek
                      const colSpan = lane.endWeek - lane.startWeek + 1
                      return (
                        <div
                          key={lIdx}
                          className="rounded-lg h-7 px-2 text-[8.5px] font-bold text-text-primary flex items-center border border-border-subtle hover:border-border-medium shadow-subtle truncate bg-surface"
                          style={{
                            gridColumnStart: colStart,
                            gridColumnEnd: colStart + colSpan,
                            borderLeft: `3px solid ${course.color}`
                          }}
                          title={lane.title}
                        >
                          {lane.title}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Lane 5: Assignments Lane */}
              <div className="col-span-full h-10 border-t border-border-subtle/30 mt-2 relative">
                <span className="absolute -top-3 left-0 text-[8px] font-bold text-text-tertiary uppercase tracking-wider">Deadlines Tracker</span>
                <div className="absolute inset-0 grid grid-cols-20 gap-2 items-center">
                  {assignmentsByWeek.map((asgn) => {
                    const matchedCourse = courses.find((c) => c.id === asgn.subjectId)
                    return (
                      <div
                        key={asgn.id}
                        className={cn(
                          'h-6 rounded-md px-1.5 text-[8px] font-bold border flex items-center justify-center truncate cursor-pointer select-none bg-surface shadow-subtle',
                          asgn.status === 'completed'
                            ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                            : asgn.priority === 'urgent'
                            ? 'border-rose-500/20 text-rose-500 bg-rose-500/5'
                            : 'border-blue-500/20 text-blue-500 bg-blue-500/5'
                        )}
                        style={{
                          gridColumnStart: asgn.weekNum,
                        }}
                        onClick={() => setSelectedWeek(asgn.weekNum)}
                        title={`${asgn.title} (${asgn.status})`}
                      >
                        {matchedCourse?.code || 'ASGN'}: {asgn.title}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Current Week indicator overlay line */}
              <div className="absolute top-0 bottom-0 w-[2px] bg-accent-rose/50 border border-dashed border-accent-rose pointer-events-none" style={{ left: 'calc((100% / 20) * 1.5 - 1px)' }} />

            </div>
          </div>
        </div>
      </Card>

      {/* MOBILE TIMELINE BLOCK (VERTICAL VIEWPORT - ON PORTRAIT/PHONES) */}
      <div className="block lg:hidden space-y-4">
        <div className="flex items-center justify-between text-xs text-text-secondary px-1 pb-1">
          <span className="font-bold text-text-primary">Vertical Roadmap Timeline</span>
          <span className="text-[10px] text-text-tertiary">Select a week card below to drill into details.</span>
        </div>
        
        <div className="max-h-[460px] overflow-y-auto pr-2 space-y-4 border border-border-subtle/50 rounded-[28px] p-4 bg-surface/20 backdrop-blur-md scrollbar-thin">
          {SEMESTER_WEEKS.map((week) => {
            const weekDeliverables = assignmentsByWeek.filter(a => a.weekNum === week.weekNum)
            const weekModules: { courseCode: string; color: string; title: string }[] = []
            
            coursePacing.forEach(course => {
              course.lanes.forEach(lane => {
                if (week.weekNum >= lane.startWeek && week.weekNum <= lane.endWeek) {
                  weekModules.push({
                    courseCode: course.courseCode,
                    color: course.color,
                    title: lane.title
                  })
                }
              })
            })
            
            const weekMilestones = milestones.filter(m => week.weekNum >= m.startWeek && week.weekNum <= m.endWeek)
            const isSelected = selectedWeek === week.weekNum
            
            return (
              <div 
                key={week.weekNum} 
                onClick={() => setSelectedWeek(week.weekNum)}
                className="flex gap-4 relative group cursor-pointer"
              >
                {/* Vertical node circle & connection line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={cn(
                    "h-7 w-7 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold transition-all z-10",
                    week.isCurrent
                      ? "bg-accent-rose border-accent-rose text-white shadow-soft scale-110"
                      : isSelected
                      ? "bg-primary border-primary text-white"
                      : "bg-surface border-border-subtle text-text-secondary"
                  )}>
                    {week.weekNum}
                  </div>
                  {week.weekNum < 20 && (
                    <div className={cn(
                      "w-[2px] grow my-1",
                      week.weekNum < selectedWeek
                        ? "bg-primary/50"
                        : "bg-border-subtle"
                    )} />
                  )}
                </div>

                {/* Week card summary content */}
                <Card className={cn(
                  "flex-1 p-4 border transition-all text-left",
                  isSelected 
                    ? "border-primary shadow-subtle bg-primary/5" 
                    : "border-border-subtle bg-surface hover:border-border-medium"
                )}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-text-tertiary">
                        {week.month} • {week.label}
                      </span>
                      {week.isCurrent && (
                        <Badge variant="rose" className="ml-2 font-extrabold text-[8px] tracking-wide">
                          Current
                        </Badge>
                      )}
                    </div>
                    {weekDeliverables.length > 0 && (
                      <Badge variant="indigo" className="font-extrabold text-[8px]">
                        {weekDeliverables.length} Deliverables
                      </Badge>
                    )}
                  </div>

                  {/* Inline Expanded summary for selected week on mobile */}
                  {isSelected && (
                    <div className="mt-3 space-y-2 border-t border-border-subtle/50 pt-3 text-[10px] text-text-secondary">
                      {weekMilestones.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold uppercase text-accent-rose tracking-wider block">Milestones:</span>
                          {weekMilestones.map((m, i) => (
                            <div key={i} className="font-bold text-text-primary flex items-center gap-1.5">
                              <span>🚩</span> {m.title}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {weekModules.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold uppercase text-text-tertiary tracking-wider block mt-1">Syllabus pacing:</span>
                          <div className="grid gap-1.5">
                            {weekModules.map((m, i) => (
                              <div key={i} className="flex items-center gap-1.5 min-w-0">
                                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                                <span className="font-bold text-text-primary uppercase text-[9px]">{m.courseCode}</span>
                                <span className="truncate">{m.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. WEEK DETAIL DISPLAY PANEL */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left side: General study target */}
        <Card className="p-5 border-border-subtle bg-surface shadow-subtle space-y-4">
          <div className="border-b border-border-subtle pb-2 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-accent-rose" />
              Week {selectedWeek} Milestones
            </h3>
            <Badge variant={selectedWeek === 2 ? 'rose' : 'secondary'}>
              {selectedWeek === 2 ? 'Active Week' : 'Target View'}
            </Badge>
          </div>

          <div className="space-y-4 text-xs">
            {selectedWeekMilestones.length > 0 ? (
              <div className="space-y-2">
                {selectedWeekMilestones.map((m, idx) => (
                  <div key={idx} className="p-3 border border-border-subtle rounded-xl bg-bg-secondary/15 flex items-start gap-2.5">
                    <span className="text-base">🚩</span>
                    <div>
                      <h4 className="font-bold text-text-primary">{m.title}</h4>
                      <p className="text-[10px] text-text-secondary mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-border-medium rounded-xl text-center text-text-secondary text-[10px]">
                No special exams or milestones scheduled this week. Keep up with daily self-paced study.
              </div>
            )}

            <div className="rounded-xl border border-border-subtle bg-bg-secondary/40 p-4 space-y-2">
              <span className="text-[9px] font-bold uppercase text-accent-rose tracking-wider">Roadmap checklist:</span>
              <ul className="list-disc pl-4 space-y-1.5 text-[10px] text-text-secondary leading-relaxed">
                <li>Read and cover the scheduled syllabus modules.</li>
                <li>Check assignments and log study hours.</li>
                <li>Review bookmarks & resource folders.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Middle: Course Modules actively taught this week */}
        <Card className="p-5 border-border-subtle bg-surface shadow-subtle space-y-4 col-span-1 md:col-span-2">
          <div className="border-b border-border-subtle pb-2 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              Syllabus Coverage (Active Lectures)
            </h3>
            <Badge variant="indigo">{selectedWeekModules.length} courses</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* Active syllabus modules */}
            <div className="space-y-3">
              <span className="text-[9px] font-bold uppercase text-text-tertiary tracking-wider block">Class Module Targets</span>
              {selectedWeekModules.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 border border-border-subtle rounded-xl bg-bg-secondary/10 flex flex-col justify-between"
                  style={{ borderLeft: `3.5px solid ${m.color}` }}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[9.5px] font-extrabold text-text-secondary">{m.courseCode}</span>
                    <span className="text-[8px] font-semibold text-text-tertiary bg-bg-secondary px-1.5 py-0.5 rounded-md">Weeks {m.span}</span>
                  </div>
                  <h4 className="font-bold text-text-primary text-[11px] mt-1.5 leading-tight">{m.title}</h4>
                </div>
              ))}
            </div>

            {/* Assignments & Deliverables due this week */}
            <div className="space-y-3">
              <span className="text-[9px] font-bold uppercase text-text-tertiary tracking-wider block">Assignment Deliverables</span>
              
              {selectedWeekDeliverables.length > 0 ? (
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedWeekDeliverables.map((asgn) => {
                    const matchedCourse = courses.find((c) => c.id === asgn.subjectId)
                    return (
                      <div key={asgn.id} className="p-3 border border-border-subtle rounded-xl bg-bg-secondary/15 flex items-center justify-between gap-3 hover:border-border-medium transition-colors">
                        <div>
                          <h4 className="text-xs font-bold text-text-primary leading-tight">{asgn.title}</h4>
                          <span className="text-[9px] text-text-secondary mt-1 block uppercase font-semibold">
                            {matchedCourse?.code || 'ASGN'} • due {new Date(asgn.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <Badge
                          variant={
                            asgn.status === 'completed'
                              ? 'teal'
                              : asgn.priority === 'urgent'
                              ? 'rose'
                              : 'indigo'
                          }
                          className="shrink-0"
                        >
                          {asgn.status === 'completed' ? 'done' : asgn.priority}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-border-medium rounded-xl flex flex-col items-center justify-center h-32">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 opacity-60 mb-1" />
                  <p className="text-[10px] font-bold text-text-primary">No deadlines due</p>
                  <p className="text-[9px] text-text-secondary mt-0.5">Keep studying at a steady pace.</p>
                </div>
              )}

            </div>

          </div>
        </Card>

      </div>

    </motion.div>
  )
}
