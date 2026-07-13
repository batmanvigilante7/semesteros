import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Sparkles,
  CheckSquare,
  BookOpen,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  useSemesterStore,
  useCourseStore,
  useAssignmentStore,
  useAnalyticsStore,
  useStudyStore,
} from '@/stores/AcademicEngine'
import { useProfile } from '@/hooks/useProfile'

// Animation presets
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 350, damping: 26 },
  },
}

export default function Home() {
  const navigate = useNavigate()
  const { semester } = useSemesterStore()
  const { courses } = useCourseStore()
  const { assignments } = useAssignmentStore()
  const { studySessions } = useStudyStore()
  const { semesterCompletion, currentStreak } = useAnalyticsStore()
  const { profile } = useProfile()

  // Calculate dynamic stats
  const coursesEnrolled = courses.length
  const completedAssignmentsCount = assignments.filter((a) => a.status === 'completed').length
  const pendingAssignmentsCount = assignments.filter((a) => a.status !== 'completed').length
  const totalStudyMinutes = studySessions.reduce((sum, s) => sum + s.duration, 0)
  const totalStudyHours = Math.round((totalStudyMinutes / 60) * 10) / 10

  // Filter next 3 deadlines
  const upcomingDeadlines = [...assignments]
    .filter((a) => a.status !== 'completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3)

  // Dynamic study steps recommendation
  const nextStudySteps = courses
    .flatMap((c) => 
      (c.modules || []).flatMap((m) => 
        (m.topics || []).map((t) => ({ ...t, courseName: c.name, courseColor: c.color, courseId: c.id }))
      )
    )
    .filter((t) => t.status !== 'Completed')
    .slice(0, 3)

  // Dynamic lagging subjects (progress < 70)
  const weakSubjects = courses.filter((c) => c.progress < 70)

  // Dynamic productivity calculations
  const totalTopics = courses.reduce((sum, c) => sum + (c.modules || []).reduce((msum, m) => msum + (m.topics?.length || 0), 0), 0)
  const completedTopics = courses.reduce((sum, c) => sum + (c.modules || []).reduce((msum, m) => msum + (m.topics?.filter(t => t.status === 'Completed').length || 0), 0), 0)
  const inProgressTopics = courses.reduce((sum, c) => sum + (c.modules || []).reduce((msum, m) => msum + (m.topics?.filter(t => t.status === 'In Progress').length || 0), 0), 0)
  const completionRatio = totalTopics > 0 ? (completedTopics + inProgressTopics * 0.5) / totalTopics : 0
  const productivityScore = Math.max(10, Math.min(100, Math.round(completionRatio * 80 + (completedAssignmentsCount / Math.max(1, assignments.length)) * 20)))

  // Dynamic greeting
  const getGreeting = () => {
    const hours = new Date().getHours()
    if (hours < 12) return 'Good morning'
    if (hours < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12 text-left"
    >
      {/* 1. TOP HERO SECTION */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border border-border-subtle bg-surface shadow-subtle p-6 md:p-8">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-secondary px-3 py-1 text-[10px] font-bold text-primary shadow-subtle uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                Academic Command Center
              </div>
              <div className="flex items-center gap-4">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-12 w-12 rounded-full object-cover border border-border-medium shadow-subtle shrink-0 hidden sm:block"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-accent-indigo text-white flex items-center justify-center font-bold text-lg shadow-subtle shrink-0 hidden sm:block">
                    {profile.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                    {getGreeting()}, {profile.name}.
                  </h2>
                  <p className="mt-1 text-xs text-text-secondary max-w-[55ch] text-wrap-pretty leading-relaxed">
                    You have completed <span className="font-semibold text-text-primary">{semesterCompletion}%</span> of your semester targets. Keep pushing your <span className="font-semibold text-text-primary">{currentStreak}-day</span> streak!
                  </p>
                </div>
              </div>
            </div>

            <div className="min-w-[240px] sm:min-w-[300px] rounded-2xl border border-border-subtle bg-bg-secondary/40 p-5 shadow-subtle">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                  Semester Completion
                </p>
                <span className="text-xs font-bold text-text-primary">{semesterCompletion}%</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${semesterCompletion}%` }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
              <div className="mt-2.5 flex justify-between text-[9px] font-bold text-text-secondary">
                <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>Term {semester.semester} (AY {semester.academicYear})</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 2. QUICK STATS GRID */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-[20px] border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center gap-4">
          <div className="rounded-xl bg-accent-blue/10 p-2.5 text-accent-blue">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Courses</p>
            <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{coursesEnrolled}</h4>
          </div>
        </Card>

        <Card className="rounded-[20px] border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center gap-4">
          <div className="rounded-xl bg-accent-indigo/10 p-2.5 text-accent-indigo">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Done Tasks</p>
            <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{completedAssignmentsCount}</h4>
          </div>
        </Card>

        <Card className="rounded-[20px] border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center gap-4">
          <div className="rounded-xl bg-accent-rose/10 p-2.5 text-accent-rose">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Upcoming Deadlines</p>
            <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{pendingAssignmentsCount}</h4>
          </div>
        </Card>

        <Card className="rounded-[20px] border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center gap-4">
          <div className="rounded-xl bg-accent-teal/10 p-2.5 text-accent-teal">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Study Hours</p>
            <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{totalStudyHours}h</h4>
          </div>
        </Card>
      </motion.div>

      {/* 3. CORE CONTENT GRID */}
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        
        {/* LEFT COLUMN: COURSE PROGRESS & DEADLINES */}
        <div className="space-y-6">
          {/* COURSE PROGRESS SECTION */}
          <motion.div variants={containerVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Active Course Progress
              </h3>
              <Link to="/courses" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {courses.length === 0 ? (
                <div className="col-span-2 rounded-[24px] border border-dashed border-border-medium bg-bg-secondary/20 p-8 text-center flex flex-col items-center justify-center space-y-4">
                  <BookOpen className="h-8 w-8 text-text-tertiary" />
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">No courses imported yet</h4>
                    <p className="text-xs text-text-secondary mt-1 max-w-[40ch] mx-auto">Import your university lesson plan to bootstrap your academic command center.</p>
                  </div>
                  <Button onClick={() => navigate('/import')} size="sm">
                    Import Lesson Plan
                  </Button>
                </div>
              ) : (
                courses.map((course) => {
                  let totalTopics = 0
                  let doneTopics = 0
                  course.modules.forEach((m) => {
                    m.topics.forEach((t) => {
                      totalTopics++
                      if (t.status === 'Completed') doneTopics++
                    })
                  })

                  return (
                    <motion.div 
                      key={course.id} 
                      variants={itemVariants}
                      whileHover={{ y: -3 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                      <Card
                        className="group rounded-2xl border border-border-subtle bg-surface/75 p-5 shadow-subtle flex flex-col justify-between space-y-4 hover:border-border-medium hover:shadow-premium transition-all duration-300 animate-fade-in"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: course.color }} />
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-secondary">
                              {course.code}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                              {course.name}
                            </h4>
                            <p className="text-[10px] text-text-secondary mt-0.5">Faculty: {course.faculty}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-text-secondary">
                            <span>Syllabus Progress</span>
                            <span className="font-bold text-text-primary">{course.progress}%</span>
                          </div>
                          <div className="h-1 bg-bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-text-tertiary font-medium">
                            <span>{doneTopics} of {totalTopics} topics</span>
                            <span>Attendance: {course.attendance}%</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="w-full justify-between group-hover:border-primary/20 hover:bg-bg-secondary text-[11px] font-semibold"
                        >
                          Continue Learning
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </Card>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>

          {/* UPCOMING DEADLINES SECTION */}
          <motion.div variants={containerVariants} className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent-rose" />
              Upcoming Planner Deadlines
            </h3>

            <Card className="rounded-[24px] border-border-subtle bg-surface/75 p-5 shadow-subtle space-y-4">
              {upcomingDeadlines.length > 0 ? (
                <div className="divide-y divide-border-subtle">
                  {upcomingDeadlines.map((deadline) => {
                    const matchedCourse = courses.find((c) => c.id === deadline.subjectId)
                    return (
                      <motion.div 
                        key={deadline.id} 
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="h-3 w-3 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: matchedCourse?.color || '#2563EB' }}
                          />
                          <div>
                            <h4 className="text-xs font-bold text-text-primary">{deadline.title}</h4>
                            <p className="text-[10px] text-text-secondary mt-0.5">
                              {matchedCourse?.name} • {deadline.estimatedHours}h estimated
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3.5 self-end sm:self-center">
                          <Badge
                            variant={
                              deadline.priority === 'urgent'
                                ? 'rose'
                                : deadline.priority === 'high'
                                ? 'orange'
                                : 'indigo'
                            }
                          >
                            {deadline.priority}
                          </Badge>
                          <span className="text-[11px] font-semibold text-text-secondary">
                            {new Date(deadline.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-text-secondary">
                  No upcoming deadlines due.
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: RECOMMENDED NEXT, FOCUS, AND LAGGING SUBJECTS */}
        <div className="space-y-6">
          {/* STUDY RECOMMENDATIONS */}
          <motion.div variants={containerVariants} className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent-indigo" />
              Recommended Study Steps
            </h3>

            <Card className="rounded-[24px] border-border-subtle bg-surface/75 p-5 shadow-subtle space-y-4">
              {nextStudySteps.length > 0 ? (
                <div className="relative pl-5 border-l border-border-medium space-y-5">
                  {nextStudySteps.map((step, idx) => (
                    <motion.div key={idx} variants={itemVariants} className="relative cursor-pointer" onClick={() => navigate(`/courses/${step.courseId}`)}>
                      <div className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-bg-primary" style={{ backgroundColor: step.courseColor }} />
                      <div className="flex justify-between items-start text-xs">
                        <div>
                          <h4 className="font-bold text-text-primary hover:text-primary transition-colors line-clamp-1">{step.title}</h4>
                          <p className="text-[10px] text-text-secondary mt-0.5">{step.courseName} • Est: {step.estimatedStudyTime || step.duration || 1}h</p>
                        </div>
                        <span className="text-[9px] font-semibold text-text-secondary bg-bg-secondary px-1.5 py-0.5 rounded-lg shrink-0">
                          {step.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-text-secondary">
                  {courses.length === 0 ? "Import a lesson plan to view recommended next study steps." : "Excellent! All syllabus topics are completed. 🎉"}
                </div>
              )}
            </Card>
          </motion.div>

          {/* WEAK SUBJECTS / LAGGING */}
          {courses.length > 0 && weakSubjects.length > 0 && (
            <motion.div variants={containerVariants} className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Flame className="h-4 w-4 text-accent-rose" />
                Needs Attention (Lagging)
              </h3>

              <Card className="rounded-[24px] border-border-subtle bg-surface/75 p-5 shadow-subtle space-y-3">
                {weakSubjects.slice(0, 3).map((sub) => (
                  <div key={sub.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                      <span className="font-bold text-text-primary truncate max-w-[150px]">{sub.name}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-accent-rose bg-accent-rose/10 px-2 py-0.5 rounded border border-accent-rose/10">
                      {sub.progress}% Complete
                    </span>
                  </div>
                ))}
              </Card>
            </motion.div>
          )}

          {/* PRODUCTIVITY & HABIT PANEL */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Award className="h-4 w-4 text-accent-amber" />
              Focus & Productivity
            </h3>

            <Card className="rounded-[24px] border-border-subtle bg-surface p-5 shadow-subtle space-y-4">
              <div className="flex items-center gap-4 justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Productivity Score</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-text-primary font-mono">{productivityScore}</span>
                    <span className="text-xs font-semibold text-accent-teal flex items-center gap-0.5">
                      <TrendingUp className="h-3.5 w-3.5" /> On Track
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary">Based on lesson completions & streaks.</p>
                </div>
                <div className="relative h-16 w-16 shrink-0 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="var(--border-subtle)"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="var(--primary)"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - productivityScore / 100)}
                    />
                  </svg>
                  <span className="text-xs font-extrabold text-primary">{productivityScore}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-border-subtle pt-4">
                <div className="bg-bg-secondary/40 rounded-xl p-3 text-center">
                  <p className="text-[9px] uppercase font-bold text-text-tertiary tracking-wider">Active Streak</p>
                  <p className="text-base font-extrabold text-text-primary mt-1 flex items-center justify-center gap-1">
                    <Flame className="h-4 w-4 text-accent-rose fill-accent-rose" /> {currentStreak} days
                  </p>
                </div>
                <div className="bg-bg-secondary/40 rounded-xl p-3 text-center">
                  <p className="text-[9px] uppercase font-bold text-text-tertiary tracking-wider">Study Sessions</p>
                  <p className="text-base font-extrabold text-text-primary mt-1 font-mono">
                    {studySessions.length}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  )
}
