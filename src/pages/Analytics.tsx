import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Award,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  Download,
  Flame,
  PieChart as PieIcon,
  CheckCircle,
  FileText,
  Sparkles,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useCourses } from '@/hooks/useCourses'

// Mock data structures
const studyTimeData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.8 },
  { day: 'Wed', hours: 1.2 },
  { day: 'Thu', hours: 4.5 },
  { day: 'Fri', hours: 2.8 },
  { day: 'Sat', hours: 5.0 },
  { day: 'Sun', hours: 3.2 },
]

const subjectPerformanceData = [
  { name: 'OOP', completion: 82, hours: 24 },
  { name: 'Data Structures', completion: 65, hours: 32 },
  { name: 'Computer Org', completion: 45, hours: 18 },
  { name: 'Probability & Stats', completion: 70, hours: 20 },
  { name: 'Environmental', completion: 90, hours: 8 },
  { name: 'Additive Mfg', completion: 50, hours: 12 },
]

const productivityTrendData = [
  { week: 'Wk 1', focus: 15 },
  { week: 'Wk 2', focus: 18 },
  { week: 'Wk 3', focus: 22 },
  { week: 'Wk 4', focus: 19 },
  { week: 'Wk 5', focus: 25 },
]

const assignmentStatusData = [
  { name: 'Completed', value: 8, color: '#10B981' },
  { name: 'Pending', value: 3, color: '#3B82F6' },
  { name: 'Overdue', value: 1, color: '#EF4444' },
]

// Mock learning contribution values (GitHub style)
const heatmapData = Array.from({ length: 98 }).map((_, idx) => {
  const intensity = [0, 0, 1, 2, 0, 3, 1, 0, 2, 4, 1][idx % 11]
  const date = new Date()
  date.setDate(date.getDate() - (97 - idx))
  return {
    date: date.toISOString().split('T')[0],
    intensity,
  }
})

interface BadgeItem {
  id: string
  name: string
  desc: string
  icon: string
  unlocked: boolean
}

const initialBadges: BadgeItem[] = [
  { id: 'b-1', name: '12-Day Streak', desc: 'Study daily for more than a week', icon: '🔥', unlocked: true },
  { id: 'b-2', name: 'Early Bird', desc: 'Log focus sessions before 8:00 AM', icon: '🌅', unlocked: true },
  { id: 'b-3', name: 'Night Owl', desc: 'Log focus sessions after 11:00 PM', icon: '🦉', unlocked: false },
  { id: 'b-4', name: 'Assignment Master', desc: 'Complete 5 assignments early', icon: '🎓', unlocked: true },
  { id: 'b-5', name: 'Quiz Champion', desc: 'Score 100% in a syllabus quiz', icon: '🏆', unlocked: false },
  { id: 'b-6', name: 'Perfect Week', desc: 'Complete all planned weekly targets', icon: '✨', unlocked: true },
]

export default function Analytics() {
  const { courses } = useCourses()
  const [filterMode, setFilterMode] = useState<'week' | 'month' | 'semester'>('week')
  const [badges] = useState<BadgeItem[]>(initialBadges)

  // Calculate attendance averages
  const avgAttendance = useMemo(() => {
    if (courses.length === 0) return 0
    const sum = courses.reduce((acc, c) => acc + c.attendance, 0)
    return Math.round(sum / courses.length)
  }, [courses])

  // Mock export action
  const handleExport = (format: 'pdf' | 'csv') => {
    alert(`Exporting insights in ${format.toUpperCase()} format...`)
  }

  return (
    <div className="space-y-8 pb-12 text-left">
      {/* 1. TOP HERO WIDGET */}
      <Card className="overflow-hidden border border-border-subtle bg-surface shadow-subtle p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-secondary px-3 py-1 text-[10px] font-bold text-primary shadow-subtle uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Analytics & Insights
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                Syllabus Performance & Metrics.
              </h2>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                Analyze your study streaks, attendance averages, and overall syllabus completion gauges. You are performing in the top <span className="font-semibold text-text-primary">8% of your branch class</span>.
              </p>
            </div>
          </div>

          {/* GPA and Attendance Cards */}
          <div className="flex items-center gap-4 bg-bg-secondary/40 border border-border-subtle/50 rounded-2xl p-4 min-w-[280px]">
            <div className="h-10 w-10 shrink-0 bg-primary/10 text-primary flex items-center justify-center rounded-xl font-bold">
              📈
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Cumulative Grade (CGPA)</p>
              <h4 className="text-sm font-extrabold text-text-primary mt-0.5">9.12 / 10.0</h4>
              <p className="text-[9px] text-text-secondary mt-0.5">Estimated based on active assessments</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. STATS OVERVIEW GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-[20px] border border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
          <div className="rounded-xl bg-accent-blue/10 p-2.5 text-accent-blue">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Weekly Focus Hours</p>
            <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">23.0h</h4>
          </div>
        </Card>

        <Card className="rounded-[20px] border border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
          <div className="rounded-xl bg-accent-teal/10 p-2.5 text-accent-teal">
            <CheckCircle className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Topic Completion</p>
            <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">68%</h4>
          </div>
        </Card>

        <Card className="rounded-[20px] border border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
          <div className="rounded-xl bg-accent-rose/10 p-2.5 text-accent-rose">
            <Flame className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Study Streak</p>
            <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">12 Days</h4>
          </div>
        </Card>

        <Card className="rounded-[20px] border border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
          <div className="rounded-xl bg-accent-amber/10 p-2.5 text-accent-amber">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Avg Attendance</p>
            <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{avgAttendance}%</h4>
          </div>
        </Card>
      </div>

      {/* 3. CHARTS ROW (STUDY TIME & SUBJECT COMPARISONS) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Study Time Area Chart */}
        <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Weekly Focus Distribution</h3>
            <div className="flex gap-1 bg-bg-secondary rounded-lg p-0.5">
              {(['week', 'month'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-bold capitalize cursor-pointer transition-all ${
                    filterMode === mode ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)', borderRadius: '12px' }}
                  labelStyle={{ fontSize: '10px', color: 'var(--text-primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="hours" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subject Performance Bar Chart */}
        <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-4">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Subject Syllabus Completion (%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)', borderRadius: '12px' }}
                  labelStyle={{ fontSize: '10px', color: 'var(--text-primary)', fontWeight: 'bold' }}
                />
                <Bar dataKey="completion" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 4. GITHUB CONTRIBUTION HEATMAP */}
      <Card className="rounded-[24px] border border-border-subtle bg-surface p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            Study Session Activity Graph
          </h3>
          <span className="text-[10px] text-text-secondary font-semibold">Past 14 Weeks</span>
        </div>

        <div className="flex flex-wrap gap-1 justify-start">
          {heatmapData.map((item, idx) => (
            <div
              key={idx}
              className={`h-4.5 w-4.5 rounded-md transition-colors ${
                item.intensity === 0
                  ? 'bg-bg-secondary/40 border border-border-subtle/30'
                  : item.intensity === 1
                  ? 'bg-primary/20'
                  : item.intensity === 2
                  ? 'bg-primary/45'
                  : item.intensity === 3
                  ? 'bg-primary/70'
                  : 'bg-primary'
              }`}
              title={`${item.date}: ${item.intensity} focus sessions`}
            />
          ))}
        </div>
      </Card>

      {/* 5. TRENDS & DONUT CHARTS (PRODUCTIVITY TRENDS & ASSIGNMENTS) */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        {/* Productivity line chart */}
        <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-4">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Weekly Focus Trends</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="week" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)', borderRadius: '12px' }}
                  labelStyle={{ fontSize: '10px', color: 'var(--text-primary)', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="focus" stroke="var(--primary)" strokeWidth={3} dot={{ stroke: 'var(--primary)', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Assignments Donut Chart */}
        <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-4 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <PieIcon className="h-4 w-4 text-primary" />
            Assignment Status
          </h3>
          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assignmentStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={65} paddingAngle={4} dataKey="value">
                  {assignmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-lg font-extrabold text-text-primary font-mono">12</span>
              <span className="text-[8px] font-bold text-text-secondary uppercase block">Total</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            {assignmentStatusData.map((status) => (
              <div key={status.name} className="space-y-1">
                <span className="block h-1.5 w-1.5 rounded-full mx-auto" style={{ backgroundColor: status.color }} />
                <span>{status.name}: {status.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 6. ACHIEVEMENT BADGES GRID */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Award className="h-4.5 w-4.5 text-accent-amber" />
          Achievement Badges
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={`rounded-2xl border p-4 text-center flex flex-col items-center justify-center space-y-3 transition-all ${
                badge.unlocked
                  ? 'border-border-subtle bg-surface shadow-subtle hover:scale-105'
                  : 'border-dashed border-border-medium bg-bg-secondary/25 opacity-55'
              }`}
            >
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-text-primary">{badge.name}</h4>
                <p className="text-[9px] text-text-secondary mt-0.5 leading-relaxed">{badge.desc}</p>
              </div>
              <Badge variant={badge.unlocked ? 'teal' : 'secondary'} className="text-[8px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                {badge.unlocked ? 'Unlocked' : 'Locked'}
              </Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* 7. RADAR AND PREDICTIONS ALERT SECTION */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Alerts & Suggestion Predictions */}
        <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-4 text-left">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-4.5 w-4.5 text-accent-amber" />
            Performance Risk Alerts
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-accent-amber/10 border border-accent-amber/20 rounded-xl flex items-start gap-2.5">
              <span className="text-base shrink-0 mt-0.5">⚠️</span>
              <div>
                <h4 className="text-[11px] font-bold text-text-primary">COA Syllabus Lagging</h4>
                <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
                  Your Computer Organization syllabus completion is only at 45%. You need ~4 hours of focus to stay on track.
                </p>
              </div>
            </div>

            <div className="p-3 bg-accent-rose/10 border border-accent-rose/20 rounded-xl flex items-start gap-2.5">
              <span className="text-base shrink-0 mt-0.5">🚨</span>
              <div>
                <h4 className="text-[11px] font-bold text-text-primary">OOP Assignment Due Soon</h4>
                <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
                  Unit 3 Polymorphism Assignment is due in 36 hours. Average completion time is 1.8 hours.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Export & Actions Card */}
        <Card className="rounded-[24px] border border-border-subtle bg-surface p-6 shadow-subtle flex flex-col justify-between text-left">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Academic Report Export</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Generate detailed performance PDF summaries or spreadsheet reports to share with academic advisors.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button onClick={() => handleExport('pdf')} className="gap-1.5 rounded-xl text-xs">
              <Download className="h-4 w-4" /> PDF Report
            </Button>
            <Button onClick={() => handleExport('csv')} variant="outline" className="gap-1.5 rounded-xl text-xs">
              <FileText className="h-4 w-4" /> CSV Export
            </Button>
          </div>
        </Card>
      </div>

    </div>
  )
}
