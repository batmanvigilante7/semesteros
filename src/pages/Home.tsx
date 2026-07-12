import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Sparkles,
  Target,
  AlertTriangle,
  Play,
  Check,
  Calendar,
  Bell,
  Activity,
  Flame,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Course } from '@/models'
import {
  useSemesterStore,
  useCourseStore,
  useAssignmentStore,
  useAnalyticsStore,
  useStudyStore,
} from '@/stores/AcademicEngine'
import {
  getStudyRecommendations,
  generateDailySchedule,
  getWorkloadStats,
  getCourseInsights,
  getSmartNotifications,
} from '@/services/StudyEngine'
import { cn } from '@/utils/cn'
import { getTopicDeadlines, getTodayDateString } from '@/utils/homeHelpers'
import { useToast } from '@/components/ui/Toast'
import { useProfile } from '@/hooks/useProfile'

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } as any },
}

function AnimatedCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div variants={cardVariants} whileHover={{ y: -3 }}>
      <Card className={cn('rounded-[24px] border-border-subtle bg-surface p-6 shadow-subtle backdrop-blur-xl', className)}>
        {children}
      </Card>
    </motion.div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-24 flex-col items-center justify-center rounded-2xl border border-dashed border-border-medium bg-bg-secondary/40 px-4 py-6 text-center w-full">
      <p className="text-xs font-semibold text-text-secondary">{message}</p>
    </div>
  )
}

function formatTopicDateStr(dateStr?: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

export default function Home() {
  const { semester } = useSemesterStore()
  const { courses, updateTopicStatus } = useCourseStore()
  const { assignments } = useAssignmentStore()
  const { studySessions, createStudySession } = useStudyStore()
  const { semesterCompletion, currentStreak } = useAnalyticsStore()
  const { toast } = useToast()
  const { profile } = useProfile()

  const getGreeting = () => {
    const hours = new Date().getHours()
    if (hours < 12) return 'Good morning'
    if (hours < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const todayStr = getTodayDateString()

  // 1. Study Recommendations from deterministic algorithm
  const recommendations = getStudyRecommendations(courses, assignments, todayStr)
  const topRec = recommendations[0]

  // 2. Daily Study plan blocks derived from top recommendations and duration
  const studySchedule = generateDailySchedule(recommendations)

  // 3. Workload score & warning analyzer
  const workload = getWorkloadStats(courses, assignments, todayStr)

  // 4. course insights analyzer
  const courseInsights = getCourseInsights(courses)

  // 5. Smart notifications list
  const smartNotifications = getSmartNotifications(courses, assignments, studySessions, todayStr)

  // 6. Deadlines organizer
  const deadlines = getTopicDeadlines(courses)

  const handleStartStudy = (courseId: string, moduleId: string, topicId: string, topicTitle: string) => {
    updateTopicStatus(courseId, moduleId, topicId, 'In Progress')
    toast('Study Started', `Now studying "${topicTitle}"`, 'info')
  }

  const handleCompleteStudy = (courseId: string, moduleId: string, topicId: string, topicTitle: string, duration: number) => {
    updateTopicStatus(courseId, moduleId, topicId, 'Completed')
    // Log study session to global store to update stats and streaks
    createStudySession({
      date: todayStr,
      subject: courses.find((s: Course) => s.id === courseId)?.name || 'Unknown',
      duration: duration * 60,
      completedTopics: [topicId],
    })
    toast('Topic Completed', `Completed "${topicTitle}" (+${duration} hrs)`, 'success')
  }



  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full space-y-6 pb-8 text-left"
    >
      {/* 1. SEMESTER HEADER */}
      <AnimatedCard className="overflow-hidden border border-border-subtle bg-surface shadow-subtle p-6 md:p-8">
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
      </AnimatedCard>

      {/* 2. RECS & PLAN + WORKLOAD & NOTIFICATIONS */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {/* Study Recommendation Widget */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <Card className="rounded-[24px] border-border-subtle bg-surface p-6 shadow-subtle border-l-4 border-l-primary space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Target className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">📚 Study Recommendation</h3>
                    <p className="text-[10px] text-text-secondary">Smart lesson plan prioritization</p>
                  </div>
                </div>
                <Badge variant="indigo">Syllabus Engine</Badge>
              </div>

              {topRec ? (
                <div className="grid gap-6 md:grid-cols-[1fr_auto]">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: topRec.course.color }} />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                        {topRec.course.code} • {topRec.course.name}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">{topRec.module.title}</p>
                      <h4 className="text-base font-bold text-text-primary mt-0.5">{topRec.topic.title}</h4>
                    </div>
                    <p className="text-xs italic text-primary bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
                      &ldquo;{topRec.reason}&rdquo;
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5 text-text-tertiary" />
                        Est. Time: {topRec.estimatedTime} hrs
                      </span>
                      {topRec.deadline && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5 text-text-tertiary" />
                          Due: {formatTopicDateStr(topRec.deadline)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 text-text-tertiary" />
                        Urgency Score: {topRec.urgencyScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row md:flex-col justify-center gap-2">
                    <button
                      onClick={() => handleStartStudy(topRec.course.id, topRec.module.id, topRec.topic.id, topRec.topic.title)}
                      className={cn(
                        'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-subtle border border-border-subtle hover:bg-bg-secondary transition-all cursor-pointer',
                        topRec.topic.status === 'In Progress' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-bg-primary text-text-primary'
                      )}
                    >
                      <Play className="h-3.5 w-3.5" />
                      {topRec.topic.status === 'In Progress' ? 'Studying' : 'Start Study'}
                    </button>
                    <button
                      onClick={() => handleCompleteStudy(topRec.course.id, topRec.module.id, topRec.topic.id, topRec.topic.title, topRec.estimatedTime)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-soft hover:bg-primary-hover transition-colors cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark Completed
                    </button>
                  </div>
                </div>
              ) : (
                <EmptyState message="All topics completed! Enjoy your break." />
              )}
            </Card>
          </motion.div>

          {/* Today's Study Plan Widget */}
          <AnimatedCard>
            <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Chronological Schedule</p>
                <h3 className="text-sm font-bold text-text-primary mt-0.5">Today&apos;s Study Plan</h3>
              </div>
              <Calendar className="h-4.5 w-4.5 text-primary" />
            </div>

            {studySchedule.length > 0 ? (
              <div className="relative border-l border-l-border-medium pl-5 space-y-4 ml-2">
                {studySchedule.map((block, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full border border-surface shadow-subtle ring-4 ring-primary/10" style={{ backgroundColor: block.course.color }} />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg-secondary/40 p-3.5 rounded-xl border border-border-subtle">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase text-text-secondary">{block.course.code}</span>
                          <span className="text-[9px] text-text-tertiary">•</span>
                          <span className="text-[9px] font-bold text-primary">{block.timeSlot}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-text-primary mt-0.5">{block.topic.title}</h4>
                      </div>
                      <Badge variant="indigo">Estimated {block.topic.estimatedStudyTime || 1.5}h</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No study blocks scheduled. You are completely caught up!" />
            )}
          </AnimatedCard>
        </div>

        <div className="space-y-6">
          {/* Workload Score Widget */}
          <AnimatedCard>
            <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Workload Score</p>
                <h3 className="text-sm font-bold text-text-primary mt-0.5">Academic Balance Indicator</h3>
              </div>
              <Activity className="h-4.5 w-4.5 text-primary" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Circular Gauge */}
              <div className="relative h-20 w-20 shrink-0">
                <svg className="h-full w-full -rotate-90">
                  <circle cx="40" cy="40" r="34" className="stroke-border-medium fill-transparent stroke-[5]" />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    className="fill-transparent stroke-[5] transition-all"
                    style={{
                      strokeDasharray: 2 * Math.PI * 34,
                      strokeDashoffset: 2 * Math.PI * 34 - (workload.score / 100) * (2 * Math.PI * 34),
                    }}
                    stroke={`var(--${workload.color})`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-sm font-bold text-text-primary leading-none">{workload.score}%</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-sm font-bold text-text-primary">Status:</span>
                  <Badge
                    variant={
                      workload.color === 'success' ? 'teal' :
                      workload.color === 'danger' ? 'rose' :
                      'orange'
                    }
                  >
                    {workload.label}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary">
                  <strong>{workload.totalStudyHours} hours</strong> of estimated syllabus study due this week.
                </p>
              </div>
            </div>

            {/* Heavy workload Alert */}
            {workload.hasWarning && (
              <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 p-3 text-xs text-danger flex items-start gap-2">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">{workload.warningMessage}</p>
              </div>
            )}
          </AnimatedCard>

          {/* Smart Notifications Widget */}
          <AnimatedCard>
            <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Real-time alerts</p>
                <h3 className="text-sm font-bold text-text-primary mt-0.5">Smart System Notifications</h3>
              </div>
              <Bell className="h-4.5 w-4.5 text-primary" />
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {smartNotifications.map((notif, idx) => (
                <div key={idx} className="rounded-xl border border-border-subtle bg-bg-secondary/40 p-3 text-[11px] leading-relaxed text-text-secondary flex gap-2.5 items-start">
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  <p>{notif}</p>
                </div>
              ))}
              {smartNotifications.length === 0 && (
                <EmptyState message="All notification channels clear." />
              )}
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* 3. TIMELINE & DEADLINE INSIGHTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Deadline Insights */}
        <AnimatedCard>
          <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Deadline Engine</p>
              <h3 className="text-sm font-bold text-text-primary mt-0.5">Topic Deadlines</h3>
            </div>
            <AlertTriangle className="h-4.5 w-4.5 text-danger" />
          </div>

          <div className="space-y-4">
            {/* Overdue */}
            {deadlines.overdue.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-danger block">⚠️ Overdue ({deadlines.overdue.length})</span>
                <div className="space-y-2">
                  {deadlines.overdue.map((dl) => (
                    <div key={dl.topic.id} className="flex justify-between items-center rounded-xl bg-danger/5 border border-danger/10 p-3 text-xs">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-danger">{dl.course.code}</span>
                        <h4 className="font-semibold text-text-primary">{dl.topic.title}</h4>
                      </div>
                      <Badge variant="rose">Overdue</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Today */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-warning block">Today ({deadlines.today.filter(t => t.topic.status !== 'Completed').length})</span>
              {deadlines.today.length > 0 ? (
                <div className="space-y-2">
                  {deadlines.today.map((dl) => (
                    <div key={dl.topic.id} className="flex justify-between items-center rounded-xl bg-bg-secondary/60 border border-border-subtle p-3 text-xs">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-text-secondary">{dl.course.code}</span>
                        <h4 className="font-semibold text-text-primary">{dl.topic.title}</h4>
                      </div>
                      <Badge variant="orange">Today</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-text-secondary pl-2">No topic deadlines due today.</p>
              )}
            </div>

            {/* Upcoming */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-primary block">Upcoming ({deadlines.upcoming.length})</span>
              {deadlines.upcoming.length > 0 ? (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {deadlines.upcoming.map((dl) => (
                    <div key={dl.topic.id} className="flex justify-between items-center rounded-xl bg-bg-secondary/40 border border-border-subtle p-3 text-xs">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-text-secondary">{dl.course.code}</span>
                        <h4 className="font-semibold text-text-primary">{dl.topic.title}</h4>
                      </div>
                      <Badge variant="secondary">{formatTopicDateStr(dl.dueDate)}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-text-secondary pl-2">No upcoming topic deadlines.</p>
              )}
            </div>
          </div>
        </AnimatedCard>

        {/* course Insights */}
        <AnimatedCard>
          <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Overview Analysis</p>
              <h3 className="text-sm font-bold text-text-primary mt-0.5">course Insights</h3>
            </div>
            <Activity className="h-4.5 w-4.5 text-primary" />
          </div>

          <div className="space-y-3 divide-y divide-border-subtle">
            {courseInsights.needingAttention && (
              <div className="flex justify-between items-center py-2.5 first:pt-0">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Needing Attention</h4>
                  <p className="text-[10px] text-text-secondary">Lowest attendance / progress index</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: courseInsights.needingAttention.color }} />
                  <Badge variant="rose">{courseInsights.needingAttention.code}</Badge>
                </div>
              </div>
            )}

            {courseInsights.fastestImproving && (
              <div className="flex justify-between items-center py-2.5">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Leading Syllabus</h4>
                  <p className="text-[10px] text-text-secondary">Highest completed progress</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: courseInsights.fastestImproving.color }} />
                  <Badge variant="teal">{courseInsights.fastestImproving.code}</Badge>
                </div>
              </div>
            )}

            {courseInsights.leastCompleted && (
              <div className="flex justify-between items-center py-2.5">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Least Completed</h4>
                  <p className="text-[10px] text-text-secondary">Lowest syllabus progress</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: courseInsights.leastCompleted.color }} />
                  <Badge variant="orange">{courseInsights.leastCompleted.code}</Badge>
                </div>
              </div>
            )}

            {courseInsights.mostPendingTopics && (
              <div className="flex justify-between items-center py-2.5 last:pb-0">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Most Incomplete Topics</h4>
                  <p className="text-[10px] text-text-secondary">Highest volume of remaining lessons</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: courseInsights.mostPendingTopics.color }} />
                  <Badge variant="indigo">{courseInsights.mostPendingTopics.code}</Badge>
                </div>
              </div>
            )}
          </div>
        </AnimatedCard>
      </div>

      {/* Quick Actions & Showcase Redirect */}
      <AnimatedCard>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider text-[10px]">Component Library Live Preview</h4>
            <p className="text-xs text-text-secondary mt-0.5">Explore the Storybook-like preview catalog page to inspect all components.</p>
          </div>
          <Link to="/showcase" className="shrink-0">
            <Button className="gap-1.5" variant="outline">
              Open Component Showcase <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </AnimatedCard>
    </motion.div>
  )
}
