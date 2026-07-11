import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckSquare,
  Award,
  Clock,
  Upload,
  Trash2,
  Edit,
  Save,
  Download,
} from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useCourseStore, useAssignmentStore } from '@/stores/AcademicEngine'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// Animation presets
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

// Achievements list with metadata
const BADGES = {
  Consistency: {
    title: 'Consistency',
    desc: 'Unlocks by active daily study streaks.',
    icon: Sparkles,
    color: 'bg-accent-indigo text-white border-accent-indigo',
  },
  'Early Bird': {
    title: 'Early Bird',
    desc: 'Complete tasks at least 3 days before deadlines.',
    icon: Clock,
    color: 'bg-accent-blue text-white border-accent-blue',
  },
  'Assignment Slayer': {
    title: 'Assignment Slayer',
    desc: 'Complete 10 tasks in the planner.',
    icon: CheckSquare,
    color: 'bg-accent-rose text-white border-accent-rose',
  },
  'Quiz Master': {
    title: 'Quiz Master',
    desc: 'Attain a syllabus completion score > 80%.',
    icon: Award,
    color: 'bg-accent-teal text-white border-accent-teal',
  },
  '7-Day Streak': {
    title: '7-Day Streak',
    desc: 'Achieve a 7-day studying streak.',
    icon: Award,
    color: 'bg-accent-amber text-white border-accent-amber',
  },
  '30-Day Streak': {
    title: '30-Day Streak',
    desc: 'Achieve a 30-day studying streak.',
    icon: Award,
    color: 'bg-purple-600 text-white border-purple-600',
  },
}

export default function Profile() {
  const {
    profile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    completionPercentage,
    analytics,
  } = useProfile()

  const { courses } = useCourseStore()
  const { assignments } = useAssignmentStore()

  // Local state for editing profile
  const [isEditing, setIsEditing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Edit form state
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio,
    email: profile.email,
    phone: profile.phone,
    university: profile.university,
    department: profile.department,
    semester: profile.semester,
    branch: profile.branch,
    rollNumber: profile.rollNumber,
    section: profile.section,
    academicYear: profile.academicYear,
    expectedGraduation: profile.expectedGraduation,
    careerGoal: profile.careerGoal,
  })

  // Calculations
  const coursesEnrolled = courses.length
  const completedAssignmentsCount = assignments.filter((a) => a.status === 'completed').length

  // Calculate completed topics count
  let totalTopicsCount = 0
  let completedTopicsCount = 0
  courses.forEach((c) => {
    c.modules.forEach((m) => {
      m.topics.forEach((t) => {
        totalTopicsCount++
        if (t.status === 'Completed') completedTopicsCount++
      })
    })
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadAvatar(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadAvatar(e.target.files[0])
    }
  }

  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
  }

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `${profile.name}_semesteros_profile.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12 text-left"
    >
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-blue">Student Hub</p>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary mt-0.5">My Profile</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> Export JSON
          </Button>
          {!isEditing ? (
            <Button variant="primary" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="gap-2">
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" /> Save
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: AVATAR & ACADEMIC HIGHLIGHT */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-[24px] border-border-subtle bg-bg-primary p-6 shadow-subtle flex flex-col items-center text-center space-y-5 relative overflow-hidden">
            {/* Completion indicator wrap */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-secondary px-2.5 py-1 text-[10px] font-bold text-accent-blue">
              <span>Profile Completion</span>
              <span className="font-extrabold">{completionPercentage}%</span>
            </div>

            {/* Large Avatar container */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative h-32 w-32 rounded-full border-4 border-white dark:border-bg-tertiary flex items-center justify-center cursor-pointer transition-all duration-300 shadow-soft ${
                dragActive ? 'border-accent-blue scale-105 bg-accent-blue/10' : 'hover:scale-[1.02]'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-accent-indigo text-white flex items-center justify-center font-bold text-4xl shadow-inner">
                  {profile.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              {/* Overlay with edit icon */}
              <div className="absolute inset-0 bg-black/45 rounded-full opacity-0 hover:opacity-100 flex items-center justify-center transition-all duration-200">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div>
              <h3 className="text-lg font-bold text-text-primary">{profile.name}</h3>
              <p className="text-xs text-text-secondary mt-0.5">{profile.branch} • {profile.semester}</p>
              <p className="text-xs text-text-tertiary mt-2 italic px-4">"{profile.bio}"</p>
            </div>

            {profile.avatarUrl && (
              <Button variant="outline" size="sm" onClick={removeAvatar} className="text-accent-rose hover:bg-accent-rose/10 hover:text-accent-rose gap-1.5 py-1 px-3">
                <Trash2 className="h-3.5 w-3.5" /> Remove Image
              </Button>
            )}

            <div className="w-full border-t border-border-subtle pt-4 flex justify-around">
              <div className="text-center">
                <p className="text-lg font-extrabold text-text-primary">{analytics.currentStreak}</p>
                <p className="text-[9px] uppercase font-bold text-text-tertiary tracking-wider">Day Streak</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-text-primary">{coursesEnrolled}</p>
                <p className="text-[9px] uppercase font-bold text-text-tertiary tracking-wider">Courses</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-text-primary">{completedAssignmentsCount}</p>
                <p className="text-[9px] uppercase font-bold text-text-tertiary tracking-wider">Done Tasks</p>
              </div>
            </div>
          </Card>

          {/* ACADEMIC INFO METADATA */}
          <Card className="rounded-[24px] border-border-subtle bg-bg-primary p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
              <GraduationCap className="h-4.5 w-4.5 text-accent-indigo" />
              Academic Info
            </h3>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">University</span>
                <span className="text-text-primary font-semibold truncate max-w-[180px]">{profile.university}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">Department</span>
                <span className="text-text-primary font-semibold truncate max-w-[180px]">{profile.department}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">Roll Number</span>
                <span className="text-text-primary font-mono font-semibold">{profile.rollNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">Section</span>
                <span className="text-text-primary font-semibold">{profile.section}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">Academic Year</span>
                <span className="text-text-primary font-semibold">{profile.academicYear}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">Expected Graduation</span>
                <span className="text-text-primary font-semibold">{profile.expectedGraduation}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMNS: EDIT PROFILE OR STATISTICS & ACTIVITY */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <Card className="rounded-[24px] border-border-subtle bg-bg-primary p-6 shadow-subtle space-y-6">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
                    <User className="h-4.5 w-4.5 text-accent-blue" />
                    Personal & Course Settings
                  </h3>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary focus:ring-2 focus:ring-accent-blue/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary focus:ring-2 focus:ring-accent-blue/10"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Bio Description</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={2}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary focus:ring-2 focus:ring-accent-blue/10 resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">University</label>
                      <input
                        type="text"
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary focus:ring-2 focus:ring-accent-blue/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary focus:ring-2 focus:ring-accent-blue/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Branch / Program</label>
                      <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary focus:ring-2 focus:ring-accent-blue/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Career Goal</label>
                      <input
                        type="text"
                        value={formData.careerGoal}
                        onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary focus:ring-2 focus:ring-accent-blue/10"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="stats-and-timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* 1. STATS GRID */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="rounded-[20px] border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center gap-4">
                    <div className="rounded-xl bg-accent-blue/10 p-2.5 text-accent-blue">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Courses</p>
                      <h4 className="text-xl font-extrabold text-text-primary mt-0.5">{coursesEnrolled}</h4>
                    </div>
                  </Card>

                  <Card className="rounded-[20px] border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center gap-4">
                    <div className="rounded-xl bg-accent-teal/10 p-2.5 text-accent-teal">
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Lessons Done</p>
                      <h4 className="text-xl font-extrabold text-text-primary mt-0.5">{completedTopicsCount}</h4>
                    </div>
                  </Card>

                  <Card className="rounded-[20px] border-border-subtle bg-bg-primary p-5 shadow-subtle flex items-center gap-4">
                    <div className="rounded-xl bg-accent-indigo/10 p-2.5 text-accent-indigo">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Study Streak</p>
                      <h4 className="text-xl font-extrabold text-text-primary mt-0.5">{analytics.currentStreak} days</h4>
                    </div>
                  </Card>
                </div>

                {/* 2. ACHIEVEMENTS SYSTEM */}
                <Card className="rounded-[24px] border-border-subtle bg-bg-primary p-6 shadow-subtle space-y-4">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
                    <Award className="h-4.5 w-4.5 text-accent-amber" />
                    Academic Achievements & Badges
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.values(BADGES).map((badge) => {
                      const Icon = badge.icon
                      const unlocked = profile.achievements.includes(badge.title)

                      return (
                        <div
                          key={badge.title}
                          className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-300 ${
                            unlocked
                              ? 'border-border-medium bg-bg-secondary/40 opacity-100'
                              : 'border-border-subtle bg-bg-secondary/10 opacity-40'
                          }`}
                        >
                          <div className={`rounded-xl p-2.5 shrink-0 ${unlocked ? badge.color : 'bg-bg-tertiary text-text-tertiary'}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${unlocked ? 'text-text-primary' : 'text-text-secondary'}`}>
                              {badge.title}
                            </h4>
                            <p className="text-[10px] text-text-secondary mt-1">{badge.desc}</p>
                            <span className={`inline-block text-[9px] font-bold uppercase tracking-wider mt-2 ${unlocked ? 'text-accent-blue' : 'text-text-tertiary'}`}>
                              {unlocked ? 'Unlocked' : 'Locked'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* 3. RECENT ACTIVITY TIMELINE */}
                <Card className="rounded-[24px] border-border-subtle bg-bg-primary p-6 shadow-subtle space-y-4">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
                    <Clock className="h-4.5 w-4.5 text-accent-indigo" />
                    Recent Activity Logs
                  </h3>

                  <div className="relative pl-6 border-l border-border-medium space-y-6">
                    {profile.recentActivities.length > 0 ? (
                      profile.recentActivities.map((act) => (
                        <div key={act.id} className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-bg-primary bg-accent-blue" />
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-semibold text-text-primary">{act.content}</p>
                              <p className="text-[10px] text-text-tertiary mt-1 capitalize font-semibold">{act.type}</p>
                            </div>
                            <span className="text-[10px] text-text-tertiary">
                              {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-text-secondary">No recent activity logs.</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
