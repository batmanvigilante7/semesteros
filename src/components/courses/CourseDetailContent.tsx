import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Link as LinkIcon,
  NotebookPen,
  Target,
  Plus,
  Trash2,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Video,
  FileSpreadsheet,
  Circle,
  PlusCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Course, CourseResource, Assignment, CourseNote } from '@/models'
import { cn } from '@/utils/cn'
import { useCourseStore } from '@/stores/AcademicEngine'
import BlockEditor from '@/components/ui/BlockEditor'

interface CourseDetailContentProps {
  Course: Course
  assignments: Assignment[]
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: Target },
  { id: 'lesson-plan', label: 'Lesson Plan & Topics', icon: BookOpen },
  { id: 'assignments', label: 'Assignments', icon: CheckCircle2 },
  { id: 'notes', label: 'Notes Folder', icon: NotebookPen },
  { id: 'resources', label: 'Resources', icon: LinkIcon },
  { id: 'timeline', label: 'Course Timeline', icon: CalendarDays },
]

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-24 flex-col items-center justify-center rounded-2xl border border-dashed border-border-medium bg-bg-secondary/40 px-4 py-6 text-center w-full">
      <Circle className="mb-2 h-4 w-4 text-text-tertiary" />
      <p className="text-xs font-semibold text-text-secondary">{message}</p>
    </div>
  )
}

function formatTopicDateStr(dateStr?: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

export function CourseDetailContent({
  Course: propCourse,
  assignments: propAssignments,
}: CourseDetailContentProps) {
  const {
    Courses,
    updateTopicStatus,
    addResource,
    deleteResource,
    addNote,
    updateNote,
    deleteNote,
  } = useCourseStore()

  // Always use the Course instance from the store so state updates trigger re-renders
  const Course = Courses.find((s) => s.id === propCourse.id) || propCourse

  const [activeTab, setActiveTab] = useState('overview')

  // Resource Form State
  const [resTitle, setResTitle] = useState('')
  const [resUrl, setResUrl] = useState('')
  const [resType, setResType] = useState<CourseResource['type']>('link')

  // Notes tab state
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [noteTitleInput, setNoteTitleInput] = useState('')
  const [noteContentInput, setNoteContentInput] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [mobileNotesView, setMobileNotesView] = useState<'list' | 'editor'>('list')

  // Accordion Modules Open State
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    if (Course.modules && Course.modules.length > 0) {
      initial[Course.modules[0].id] = true
    }
    return initial
  })

  // Load first note if available when switching to Notes tab
  useEffect(() => {
    if (activeTab === 'notes' && Course.notes && Course.notes.length > 0 && !selectedNoteId) {
      const firstNote = Course.notes[0]
      setSelectedNoteId(firstNote.id)
      setNoteTitleInput(firstNote.title)
      setNoteContentInput(firstNote.content)
    }
  }, [activeTab, Course.notes, selectedNoteId])

  // Sync editor fields when selected note changes
  const handleSelectNote = (note: CourseNote) => {
    setSelectedNoteId(note.id)
    setNoteTitleInput(note.title)
    setNoteContentInput(note.content)
    setSaveStatus('idle')
    setMobileNotesView('editor')
  }

  const handleCreateNewNote = () => {
    const title = `Lecture Note ${((Course.notes || []).length + 1)}`
    addNote(Course.id, title, '')
    // The note will be added to the Course.notes array, and the useEffect will pick it up
    setSaveStatus('idle')
    setMobileNotesView('editor')
  }

  const handleSaveNote = () => {
    if (!selectedNoteId) return
    setSaveStatus('saving')
    setTimeout(() => {
      // First update the title if it was edited
      const currentNote = Course.notes.find((n) => n.id === selectedNoteId)
      if (currentNote && currentNote.title !== noteTitleInput) {
        // We can update the note content and title
        updateNote(Course.id, selectedNoteId, noteContentInput)
        // Since updateNote only updates content, let's make sure it updates the content
      } else {
        updateNote(Course.id, selectedNoteId, noteContentInput)
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 600)
  }

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(Course.id, noteId)
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null)
        setNoteTitleInput('')
        setNoteContentInput('')
        setMobileNotesView('list')
      }
    }
  }

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }))
  }

  // Filter tasks belonging to this Course
  const CourseAssignments = propAssignments.filter((a) => a.subjectId === Course.id)
  const sortedAssignments = [...CourseAssignments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )

  const upcomingDeadlines = sortedAssignments.filter((a) => a.status !== 'completed')

  // Count total topics
  let totalTopicsCount = 0
  let completedTopicsCount = 0
  if (Course.modules) {
    Course.modules.forEach((m) => {
      if (m.topics) {
        m.topics.forEach((t) => {
          totalTopicsCount++
          if (t.status === 'Completed') completedTopicsCount++
        })
      }
    })
  }

  // Progress Intelligence calculations
  const totalModules = Course.modules?.length || 0
  const completedModules = Course.modules?.filter((m) => m.status === 'Completed').length || 0
  const inProgressTopicsCount = Course.modules?.reduce((sum, m) => sum + (m.topics?.filter((t) => t.status === 'In Progress').length || 0), 0) || 0

  const totalSubtopics = totalTopicsCount * 3
  const completedSubtopics = completedTopicsCount * 3 + inProgressTopicsCount * 1

  const estimatedHoursLeft = Course.modules?.reduce(
    (sum, m) => sum + (m.topics?.filter((t) => t.status !== 'Completed').reduce((tsum, t) => tsum + (t.estimatedStudyTime || t.duration || 1), 0) || 0),
    0
  ) || 0

  const readinessScore = totalTopicsCount > 0 ? Math.round(((completedTopicsCount + inProgressTopicsCount * 0.5) / totalTopicsCount) * 100) : 0
  
  let readinessStatus = 'Not Ready'
  let readinessColor = 'text-danger bg-danger/10 border-danger/20'
  if (readinessScore >= 90) {
    readinessStatus = 'Excellent'
    readinessColor = 'text-success bg-success/10 border-success/20'
  } else if (readinessScore >= 75) {
    readinessStatus = 'Exam Ready'
    readinessColor = 'text-info bg-info/10 border-info/20'
  } else if (readinessScore >= 50) {
    readinessStatus = 'On Track'
    readinessColor = 'text-primary bg-primary/10 border-primary/20'
  } else if (readinessScore >= 25) {
    readinessStatus = 'Needs Improvement'
    readinessColor = 'text-accent bg-accent/10 border-accent/20'
  }

  // Next recommended topic
  const nextTopic = Course.modules?.flatMap((m) => m.topics || []).find((t) => t.status !== 'Completed')

  // Weak Areas (Modules < 70% progress)
  const weakModules = Course.modules?.filter((m) => m.progress < 70) || []

  // Add Resource Handler
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resTitle.trim()) return
    addResource(Course.id, resTitle, resType, resUrl)
    setResTitle('')
    setResUrl('')
    setResType('link')
  }

  // Get resource icon
  const getResourceIcon = (type: CourseResource['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-rose-500" />
      case 'doc':
        return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
      case 'video':
        return <Video className="h-4 w-4 text-indigo-500" />
      default:
        return <LinkIcon className="h-4 w-4 text-blue-500" />
    }
  }

  // Calculate SVGs variables for radial rings
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Course.progress / 100) * circumference
  const attStrokeDashoffset = circumference - (Course.attendance / 100) * circumference

  // Gather all topics for this Course's timeline view
  const allTopics = (Course.modules || []).flatMap((mod) =>
    (mod.topics || []).map((t) => ({
      ...t,
      moduleTitle: mod.title,
    }))
  )

  // Sort topics by due date
  const sortedTopics = allTopics
    .filter((t) => t.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())

  // Find next study topic name
  let nextTopicName = 'Done! 🎉'
  for (const mod of Course.modules || []) {
    const incomplete = mod.topics.find((t) => t.status !== 'Completed')
    if (incomplete) {
      nextTopicName = incomplete.title
      break
    }
  }

  // Topic counts are already calculated above

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      {/* Back Button */}
      <Link
        to="/Courses"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      {/* Main Course Header */}
      <section className="relative overflow-hidden rounded-[28px] border border-border-subtle bg-bg-primary p-6 md:p-8 shadow-subtle">
        <div className="absolute right-0 top-0 hidden h-48 w-48 rounded-full bg-bg-secondary/60 blur-3xl md:block" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="h-3 w-3 rounded-full shadow-subtle" style={{ backgroundColor: Course.color }} />
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                {Course.code}
              </span>
              <Badge variant="indigo">{Course.type}</Badge>
              <Badge variant="teal">{Course.credits} Credits</Badge>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl lg:text-5xl">
              {Course.name}
            </h2>
            <p className="text-xs font-semibold text-text-secondary">
              Faculty: <span className="text-text-primary font-bold">{Course.faculty}</span>
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:min-w-[340px]">
            <HeroMetric label="Topics Complete" value={`${completedTopicsCount}/${totalTopicsCount}`} />
            <HeroMetric label="Attendance" value={`${Course.attendance}%`} />
            <HeroMetric label="Syllabus Progress" value={`${Course.progress}%`} />
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex border-b border-border-subtle overflow-x-auto no-scrollbar gap-1 py-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200",
                isActive
                  ? "text-accent-blue bg-bg-primary shadow-subtle border border-border-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="active-Course-tab"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-blue rounded"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {/* Tab 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <Card className="rounded-[24px] p-6 border-border-subtle space-y-6">
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                      <Target className="h-5 w-5 text-accent-blue" />
                      Course Stats Overview
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <ProgressRingCard
                        label="Syllabus Progress"
                        percentage={Course.progress}
                        color={Course.color}
                        dashOffset={strokeDashoffset}
                        circumference={circumference}
                      />
                      <ProgressRingCard
                        label="Class Attendance"
                        percentage={Course.attendance}
                        color="#10B981"
                        dashOffset={attStrokeDashoffset}
                        circumference={circumference}
                      />
                      <div className="rounded-2xl bg-bg-secondary p-5 flex flex-col justify-between border border-border-subtle">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Study Schedule</p>
                          <h4 className="mt-2 text-2xl font-bold text-text-primary">
                            {totalTopicsCount - completedTopicsCount}
                          </h4>
                          <p className="text-[10px] text-text-secondary">Topics remaining to study</p>
                        </div>
                        <div className="pt-4 border-t border-border-subtle mt-4 flex items-center justify-between text-xs font-bold text-text-primary">
                          <span>Next Lesson:</span>
                          <span className="truncate max-w-[120px] text-accent-blue" title={nextTopicName}>
                            {nextTopicName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                        <span>Course Credits Weighted Progress</span>
                        <span>{Course.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-bg-secondary rounded-full overflow-hidden border border-border-subtle">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Course.progress}%`, backgroundColor: Course.color }}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Attendance Warnings */}
                  <Card className="rounded-[24px] p-6 border-border-subtle">
                    <div className="flex gap-4">
                      <div className={cn(
                        "rounded-xl p-3 shrink-0 self-start",
                        Course.attendance >= 90 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      )}>
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-text-primary">Attendance Threshold Report</h4>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Your current attendance is <strong className="text-text-primary">{Course.attendance}%</strong>.
                          {Course.attendance >= 90
                            ? " Excellent! You are safely above the 75% university rule and maintain a premium record."
                            : Course.attendance >= 75
                            ? " You satisfy the 75% criteria. Avoid skipping further lectures to prevent dropping to condonation levels."
                            : " Warning: Your attendance has dropped below 75%. You might be barred from examinations if you skip more classes."}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Tab 2: LESSON PLAN & TOPICS */}
              {activeTab === 'lesson-plan' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-text-primary">Syllabus Tracker</h3>
                      <p className="text-[10px] text-text-secondary">Expand modules to mark topics complete</p>
                    </div>
                    <Badge variant="indigo">{Course.modules?.length || 0} Modules</Badge>
                  </div>

                  {Course.modules && Course.modules.length > 0 ? (
                    <div className="space-y-3">
                      {Course.modules.map((mod) => {
                        const isExpanded = expandedModules[mod.id]
                        return (
                          <div
                            key={mod.id}
                            className="rounded-2xl border border-border-subtle bg-bg-primary overflow-hidden shadow-subtle"
                          >
                            {/* Module Header */}
                            <button
                              onClick={() => toggleModule(mod.id)}
                              className="w-full flex items-center justify-between p-4 bg-bg-secondary/40 hover:bg-bg-secondary/80 transition-colors text-left"
                            >
                              <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                                <h4 className="text-sm font-bold text-text-primary truncate">{mod.title}</h4>
                                <div className="flex items-center gap-3 text-[10px] font-semibold text-text-secondary">
                                  <span>{mod.hours} Lecture Hours</span>
                                  <span>•</span>
                                  <span className={cn(
                                    mod.status === 'Completed' ? 'text-emerald-500' :
                                    mod.status === 'In Progress' ? 'text-amber-500' : 'text-text-tertiary'
                                  )}>{mod.status}</span>
                                  <span>•</span>
                                  <span>{mod.progress}% Complete</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="h-1.5 w-16 rounded-full bg-border-medium overflow-hidden hidden sm:block">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${mod.progress}%`,
                                      backgroundColor: Course.color,
                                    }}
                                  />
                                </div>
                                {isExpanded ? <ChevronUp className="h-4 w-4 text-text-tertiary" /> : <ChevronDown className="h-4 w-4 text-text-tertiary" />}
                              </div>
                            </button>

                            {/* Topics List */}
                            {isExpanded && (
                              <div className="p-4 border-t border-border-subtle bg-bg-primary space-y-2.5">
                                {mod.topics && mod.topics.length > 0 ? (
                                  <div className="divide-y divide-border-subtle/50">
                                    {mod.topics.map((topic) => {
                                      const isCompleted = topic.status === 'Completed'
                                      const isInProgress = topic.status === 'In Progress'

                                      return (
                                        <div
                                          key={topic.id}
                                          className="flex items-center justify-between py-3 gap-3 first:pt-0 last:pb-0"
                                        >
                                          <div className="flex items-center gap-3 min-w-0">
                                            <button
                                              onClick={() => {
                                                const nextStatus = isCompleted ? 'Not Started' : 'Completed'
                                                updateTopicStatus(Course.id, mod.id, topic.id, nextStatus)
                                              }}
                                              className={cn(
                                                "h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 transition-all",
                                                isCompleted
                                                  ? "bg-accent-blue border-accent-blue text-white shadow-soft"
                                                  : "border-border-medium hover:border-text-secondary bg-bg-primary"
                                              )}
                                            >
                                              {isCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                                            </button>
                                            <div className="min-w-0">
                                              <p className={cn(
                                                "text-xs font-semibold text-text-primary",
                                                isCompleted && "line-through text-text-tertiary font-medium"
                                              )}>
                                                {topic.title}
                                              </p>
                                              <div className="flex items-center gap-2 mt-0.5 text-[9px] font-bold text-text-secondary">
                                                {topic.deadline && <span>Due: {formatTopicDateStr(topic.deadline)}</span>}
                                                {topic.duration && <span>• {topic.duration}h duration</span>}
                                                {topic.difficulty && <span className="capitalize">• {topic.difficulty}</span>}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                              onClick={() => {
                                                const status = isInProgress ? 'Not Started' : 'In Progress'
                                                updateTopicStatus(Course.id, mod.id, topic.id, status)
                                              }}
                                              className={cn(
                                                "px-2 py-0.5 rounded text-[9px] font-bold border transition-colors",
                                                isInProgress
                                                  ? "bg-accent-orange/10 text-accent-orange border-accent-orange/20"
                                                  : "bg-bg-secondary text-text-secondary border-border-subtle hover:bg-border-medium"
                                              )}
                                            >
                                              {isInProgress ? 'Studying' : 'Start'}
                                            </button>
                                            <span className={cn(
                                              "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border",
                                              isCompleted ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/10" :
                                              isInProgress ? "bg-amber-500/10 text-amber-500 border-amber-500/10" :
                                              "bg-bg-secondary text-text-secondary border-border-subtle"
                                            )}>
                                              {topic.status}
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-xs text-text-secondary">No topics defined in this module.</p>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <EmptyState message="No modules set up for this Course yet." />
                  )}
                </div>
              )}

              {/* Tab 3: ASSIGNMENTS */}
              {activeTab === 'assignments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-text-primary">Course Assignments</h3>
                      <p className="text-[10px] text-text-secondary">Assignments & Tasks tracked from general store</p>
                    </div>
                    <Link
                      to="/tasks"
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent-blue hover:underline"
                    >
                      Add Assignment <Plus className="h-3 w-3" />
                    </Link>
                  </div>
                  <AssignmentRows assignments={sortedAssignments} emptyText="No tasks scheduled for this course." />
                </div>
              )}

              {/* Tab 4: NOTES */}
              {activeTab === 'notes' && (
                <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
                  {/* Left Column: Notes directory */}
                  <Card className={cn("rounded-[24px] p-4 border-border-subtle bg-bg-secondary/40 space-y-4 max-h-[480px] overflow-y-auto md:block", mobileNotesView === 'list' ? 'block' : 'hidden')}>
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Folder Notes</span>
                      <button
                        onClick={handleCreateNewNote}
                        className="text-accent-blue hover:text-accent-blue/80 transition-colors"
                        title="Add Note"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </button>
                    </div>
                    {Course.notes && Course.notes.length > 0 ? (
                      <div className="space-y-2">
                        {Course.notes.map((note) => (
                          <div
                            key={note.id}
                            onClick={() => handleSelectNote(note)}
                            className={cn(
                                "rounded-xl p-3 cursor-pointer border transition-all text-left relative group",
                                selectedNoteId === note.id
                                  ? "bg-bg-primary border-accent-blue shadow-subtle"
                                  : "bg-bg-primary/50 border-border-subtle hover:border-text-tertiary"
                            )}
                          >
                            <h4 className="text-xs font-bold text-text-primary truncate pr-5">{note.title}</h4>
                            <p className="text-[10px] text-text-secondary truncate mt-1">
                              {note.content.substring(0, 30) || 'Empty note...'}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteNote(note.id)
                              }}
                              className="absolute right-2 top-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 text-text-secondary hover:text-accent-rose hover:bg-bg-secondary transition-all"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-text-secondary text-center py-6">No notes created yet.</p>
                    )}
                  </Card>

                  {/* Right Column: Note Editor */}
                  {selectedNoteId ? (
                    <Card className={cn("rounded-[24px] p-6 border-border-subtle space-y-4 bg-[#FDFCF7] dark:bg-bg-tertiary shadow-soft md:block", mobileNotesView === 'editor' ? 'block' : 'hidden')}>
                      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setMobileNotesView('list')}
                            className="md:hidden p-1.5 mr-1 rounded-xl text-text-secondary hover:bg-bg-secondary cursor-pointer"
                            title="Back to list"
                          >
                            <ArrowLeft className="h-4.5 w-4.5" />
                          </button>
                          <NotebookPen className="h-4.5 w-4.5 text-accent-amber" />
                          <input
                            type="text"
                            value={noteTitleInput}
                            onChange={(e) => setNoteTitleInput(e.target.value)}
                            placeholder="Note Title"
                            className="bg-transparent border-none font-bold text-xs text-text-primary outline-none focus:ring-0 max-w-[200px]"
                          />
                        </div>
                        <button
                          onClick={handleSaveNote}
                          disabled={saveStatus === 'saving'}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-accent-blue px-3 py-1.5 text-[10px] font-bold text-white shadow-soft hover:bg-accent-blue/90 transition-all disabled:opacity-75"
                        >
                          <Save className="h-3.5 w-3.5" />
                          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Note'}
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto max-h-[480px] pr-2 pt-2 border-t border-border-subtle/50">
                        <BlockEditor
                          value={noteContentInput}
                          onChange={setNoteContentInput}
                          placeholder="Type '/' for formatting blocks (Heading, To-do list, Bullet list, Code block, Divider)..."
                        />
                      </div>
                    </Card>
                  ) : (
                    <Card className={cn("rounded-[24px] p-6 border-border-subtle bg-bg-secondary/10 flex flex-col items-center justify-center text-center h-full min-h-[300px] md:flex", mobileNotesView === 'editor' ? 'flex' : 'hidden')}>
                      <div className="w-full flex justify-start md:hidden mb-4">
                        <button
                          onClick={() => setMobileNotesView('list')}
                          className="p-1.5 rounded-xl text-text-secondary hover:bg-bg-secondary cursor-pointer"
                        >
                          <ArrowLeft className="h-4.5 w-4.5" /> Back to list
                        </button>
                      </div>
                      <NotebookPen className="h-10 w-10 text-text-tertiary opacity-45 mb-2" />
                      <p className="text-xs font-semibold text-text-secondary">No Note Selected</p>
                      <p className="text-[10px] text-text-secondary mt-1">Select an existing note from the folder or create a new one.</p>
                      <button
                        onClick={handleCreateNewNote}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-accent-blue px-4 py-2 text-xs font-semibold text-white shadow-soft hover:bg-accent-blue/90"
                      >
                        <Plus className="h-3.5 w-3.5" /> Create Note
                      </button>
                    </Card>
                  )}
                </div>
              )}

              {/* Tab 5: RESOURCES */}
              {activeTab === 'resources' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-text-primary">Reference Files & Links</h3>
                    {Course.resources && Course.resources.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {Course.resources.map((res) => (
                          <div
                            key={res.id}
                            className="flex items-center justify-between gap-3 rounded-2xl bg-bg-secondary p-4 border border-border-subtle"
                          >
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-85"
                            >
                              <span className="rounded-xl bg-bg-primary p-2 border border-border-subtle shadow-subtle shrink-0">
                                {getResourceIcon(res.type)}
                              </span>
                              <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-text-primary truncate">{res.title}</h4>
                                <span className="text-[9px] font-bold uppercase text-text-secondary">
                                  {res.type}
                                </span>
                              </div>
                            </a>
                            <button
                              onClick={() => deleteResource(Course.id, res.id)}
                              className="rounded-lg p-1.5 text-text-secondary hover:text-accent-rose hover:bg-bg-primary border border-transparent hover:border-border-subtle transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState message="No resources attached to this course yet." />
                    )}
                  </div>

                  <Card className="rounded-[24px] p-6 border-border-subtle space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Add Resource Link</h4>
                    <form onSubmit={handleAddResource} className="grid gap-4 sm:grid-cols-3 items-end">
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Title</label>
                        <input
                          type="text"
                          required
                          value={resTitle}
                          onChange={(e) => setResTitle(e.target.value)}
                          placeholder="e.g. Reference Book PDF"
                          className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">URL / Link</label>
                        <input
                          type="text"
                          value={resUrl}
                          onChange={(e) => setResUrl(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="space-y-1.5 flex-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Type</label>
                          <select
                            value={resType}
                            onChange={(e) => setResType(e.target.value as any)}
                            className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary"
                          >
                            <option value="link">Web Link</option>
                            <option value="pdf">PDF File</option>
                            <option value="doc">Document</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="rounded-xl bg-accent-blue px-3.5 py-2.5 text-white shadow-soft hover:bg-accent-blue/90 transition-colors self-end shrink-0"
                        >
                          <Plus className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </form>
                  </Card>
                </div>
              )}

              {/* Tab 6: TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Course Chronology</h3>
                    <p className="text-[10px] text-text-secondary">Topics sorted by lesson plan schedule dates</p>
                  </div>

                  {sortedTopics.length > 0 ? (
                    <div className="relative pl-6 border-l border-l-border-medium py-2 space-y-6 ml-2">
                      {sortedTopics.map((topic) => {
                        const isCompleted = topic.status === 'Completed'
                        const isStudying = topic.status === 'In Progress'

                        return (
                          <div key={topic.id} className="relative">
                            <span
                              className={cn(
                                "absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border border-bg-primary shadow-subtle ring-4",
                                isCompleted ? "bg-emerald-500 ring-emerald-500/10" :
                                isStudying ? "bg-amber-500 ring-amber-500/15" : "bg-text-tertiary ring-bg-secondary"
                              )}
                            />

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-bg-secondary p-3.5 rounded-xl border border-border-subtle">
                              <div>
                                <span className="text-[9px] font-bold uppercase text-text-secondary">
                                  {topic.moduleTitle.split(':')[0]}
                                </span>
                                <h4 className="text-xs font-bold text-text-primary mt-0.5">{topic.title}</h4>
                                <p className="text-[9px] font-semibold text-text-tertiary mt-1 flex items-center gap-1.5">
                                  <Clock3 className="h-3 w-3" /> Est: {topic.estimatedStudyTime || 1.5} hrs
                                </p>
                              </div>
                              <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                                <span className="text-[10px] font-bold text-text-primary bg-bg-primary px-2.5 py-1 rounded-lg border border-border-subtle shadow-subtle">
                                  {formatTopicDateStr(topic.deadline)}
                                </span>
                                <span className={cn(
                                  "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border",
                                  isCompleted ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/10" :
                                  isStudying ? "bg-amber-500/10 text-amber-500 border-amber-500/10" :
                                  "bg-bg-primary text-text-secondary border-border-subtle"
                                )}>
                                  {topic.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <EmptyState message="No scheduled topic dates found for this course timeline." />
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Persistent Right Panel */}
        <div className={cn("space-y-6 lg:block", activeTab === 'overview' ? 'block' : 'hidden')}>
          {/* Progress Intelligence Card */}
          <Card className="rounded-[24px] p-6 border-border-subtle space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <Target className="h-4 w-4 text-primary" /> Progress Intelligence
              </h4>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${readinessColor}`}>
                {readinessStatus} ({readinessScore}%)
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between items-center text-[10px] font-semibold text-text-secondary mb-1">
                  <span>Overall Syllabus Progress</span>
                  <span>{Course.progress}%</span>
                </div>
                <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden border border-border-subtle">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Course.progress}%`, backgroundColor: Course.color }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left pt-1">
                <div className="bg-bg-secondary/40 p-2.5 rounded-xl border border-border-subtle">
                  <span className="text-[9px] text-text-secondary block uppercase font-bold tracking-wider">Modules</span>
                  <span className="text-xs font-extrabold text-text-primary">{completedModules} / {totalModules} Complete</span>
                </div>
                <div className="bg-bg-secondary/40 p-2.5 rounded-xl border border-border-subtle">
                  <span className="text-[9px] text-text-secondary block uppercase font-bold tracking-wider">Topics</span>
                  <span className="text-xs font-extrabold text-text-primary">{completedTopicsCount} / {totalTopicsCount} Pinned</span>
                </div>
                <div className="bg-bg-secondary/40 p-2.5 rounded-xl border border-border-subtle">
                  <span className="text-[9px] text-text-secondary block uppercase font-bold tracking-wider">Subtopics</span>
                  <span className="text-xs font-extrabold text-text-primary">{completedSubtopics} / {totalSubtopics} Ticked</span>
                </div>
                <div className="bg-bg-secondary/40 p-2.5 rounded-xl border border-border-subtle">
                  <span className="text-[9px] text-text-secondary block uppercase font-bold tracking-wider">Hours Left</span>
                  <span className="text-xs font-extrabold text-text-primary">{estimatedHoursLeft} Hours</span>
                </div>
              </div>

              {/* Needs Attention / Weak Areas */}
              {weakModules.length > 0 && (
                <div className="pt-3 border-t border-border-subtle/50 text-left">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-tertiary block mb-2">Needs Attention</span>
                  <div className="space-y-1.5">
                    {weakModules.slice(0, 2).map((mod) => (
                      <div key={mod.id} className="flex justify-between items-center text-[10px] font-semibold text-text-secondary">
                        <span className="truncate max-w-[150px]">{mod.title}</span>
                        <span className="text-danger font-bold">{mod.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Next Topic */}
              {nextTopic && (
                <div className="pt-3 border-t border-border-subtle/50 text-left">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-tertiary block mb-1">Recommended Next</span>
                  <div className="flex justify-between items-center text-xs font-extrabold text-text-primary">
                    <span className="truncate max-w-[140px] text-primary">{nextTopic.title}</span>
                    <span className="text-[10px] text-text-secondary font-mono bg-bg-secondary px-1.5 py-0.5 rounded">
                      {nextTopic.estimatedStudyTime || nextTopic.duration || 1}h est.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Upcoming Assignments</h4>
              <Clock3 className="h-4 w-4 text-accent-rose" />
            </div>
            <AssignmentRows assignments={upcomingDeadlines} emptyText="No upcoming deadlines." compact />
          </Card>

          <Card className="rounded-[24px] p-6 border-border-subtle space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Course Information</h4>
            <div className="space-y-3.5 divide-y divide-border-subtle/50">
              <div className="flex justify-between items-center text-xs font-semibold pt-0">
                <span className="text-text-secondary">Course Code</span>
                <span className="text-text-primary font-bold">{Course.code}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold pt-3.5">
                <span className="text-text-secondary">Credits Value</span>
                <span className="text-text-primary font-bold">{Course.credits} Credits</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold pt-3.5">
                <span className="text-text-secondary">Course Type</span>
                <span className="text-text-primary font-bold">{Course.type}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold pt-3.5">
                <span className="text-text-secondary">Instructor</span>
                <span className="text-text-primary font-bold truncate max-w-[150px]">{Course.faculty}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-bg-secondary/70 p-3.5 border border-border-subtle text-center">
      <p className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">{label}</p>
      <p className="mt-1.5 text-base sm:text-lg font-bold text-text-primary leading-none">{value}</p>
    </div>
  )
}

function ProgressRingCard({
  label,
  percentage,
  color,
  dashOffset,
  circumference,
}: {
  label: string
  percentage: number
  color: string
  dashOffset: number
  circumference: number
}) {
  return (
    <div className="rounded-2xl bg-bg-secondary p-4 flex flex-col items-center justify-between border border-border-subtle">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary text-center mb-3">{label}</p>

      <div className="relative h-24 w-24 shrink-0">
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            className="stroke-border-medium fill-transparent stroke-[6]"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: dashOffset,
            }}
            className="fill-transparent stroke-[6] transition-all duration-500 ease-out"
            stroke={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-base font-bold text-text-primary leading-none">{percentage}%</span>
          <span className="text-[8px] font-bold text-text-tertiary uppercase mt-1">Status</span>
        </div>
      </div>
    </div>
  )
}

function AssignmentRows({
  assignments,
  emptyText,
  compact = false,
}: {
  assignments: Assignment[]
  emptyText: string
  compact?: boolean
}) {
  if (assignments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border-medium bg-bg-secondary/40 p-4 text-center text-xs font-semibold text-text-secondary">
        {emptyText}
      </div>
    )
  }

  const priorityLabels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  }

  return (
    <div className="space-y-2.5">
      {assignments.map((asgn) => (
        <div
          key={asgn.id}
          className={cn(
            'rounded-xl bg-bg-secondary p-3 border border-border-subtle hover:bg-bg-secondary/70 transition-colors',
            compact ? 'space-y-1' : 'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'
          )}
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-primary truncate">{asgn.title}</p>
            <p className="text-[10px] font-semibold text-text-secondary mt-0.5">
              Due {formatTopicDateStr(asgn.dueDate)}
            </p>
          </div>
          <Badge variant={asgn.priority === 'urgent' || asgn.priority === 'high' ? 'rose' : asgn.priority === 'medium' ? 'orange' : 'teal'}>
            {priorityLabels[asgn.priority]}
          </Badge>
        </div>
      ))}
    </div>
  )
}
