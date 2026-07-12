import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  GraduationCap,
  BookOpen,
  CheckSquare,
  Award,
  Clock,
  Upload,
  Save,
  Edit,
  Download,
  Flame,
  Plus,
  X,
  Palette,
  Briefcase,
} from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useCourseStore } from '@/stores/AcademicEngine'
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

const BADGES = {
  Consistency: {
    title: 'Consistency',
    desc: 'Unlocks by active daily study streaks.',
    icon: Flame,
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
}

export default function Profile() {
  const {
    profile,
    updateProfile,
    uploadAvatar,
    completionPercentage,
    analytics,
  } = useProfile()

  const { courses } = useCourseStore()

  // Form states
  const [isEditing, setIsEditing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Edit states for lists
  const [newSkill, setNewSkill] = useState('')
  const [skills, setSkills] = useState<string[]>(['Java', 'C', 'TypeScript', 'DSA', 'Git', 'React'])
  
  const [newGoal, setNewGoal] = useState('')
  const [goals, setGoals] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: 'g-1', text: 'Revise OOP Unit 1', completed: true },
    { id: 'g-2', text: 'Maintain 75%+ attendance', completed: false },
    { id: 'g-3', text: 'Learn React State Management', completed: false },
  ])

  // Custom Personalization settings
  const [accentColor, setAccentColor] = useState('#2563EB')
  const [showQuote, setShowQuote] = useState(true)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

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

  // Cover photo mock upload
  const handleCoverUpload = () => {
    const mockCovers = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    ]
    const nextCover = mockCovers[Math.floor(Math.random() * mockCovers.length)]
    setCoverUrl(nextCover)
  }

  // Skills tag action handlers
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return
    setSkills([...skills, newSkill.trim()])
    setNewSkill('')
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  // Goals checklist action handlers
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.trim()) return
    setGoals([...goals, { id: `g-${crypto.randomUUID()}`, text: newGoal.trim(), completed: false }])
    setNewGoal('')
  }

  const handleToggleGoal = (goalId: string) => {
    setGoals(goals.map((g) => (g.id === goalId ? { ...g, completed: !g.completed } : g)))
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12 text-left"
    >
      {/* 1. COVER BANNER & HERO SECTION */}
      <Card className="overflow-hidden border border-border-subtle bg-surface shadow-subtle p-0 rounded-[24px]">
        {/* Cover image block */}
        <div
          className="h-32 w-full transition-all duration-300 relative group flex items-center justify-center"
          style={{ background: coverUrl || 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)' }}
        >
          <button
            onClick={handleCoverUpload}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-xl px-3 py-1.5 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/20"
          >
            Change Cover
          </button>
        </div>

        {/* Profile Details header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 -mt-16">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
            {/* Circle Avatar */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative h-28 w-28 rounded-full border-4 border-surface flex items-center justify-center cursor-pointer transition-all duration-300 shadow-soft bg-surface ${
                dragActive ? 'border-primary scale-105' : 'hover:scale-[1.01]'
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
                <div className="h-full w-full rounded-full bg-accent-indigo text-white flex items-center justify-center font-bold text-3xl shadow-inner">
                  {profile.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="h-5 w-5 text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-text-primary">{profile.name}</h3>
              <p className="text-xs text-text-secondary mt-0.5">{profile.branch} • {profile.semester}</p>
              <p className="text-[10px] text-text-tertiary mt-1 max-w-sm italic">"{profile.bio}"</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0 self-center md:self-end">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 rounded-xl">
              <Download className="h-4 w-4" /> Export Profile
            </Button>
            {!isEditing ? (
              <Button variant="primary" size="sm" onClick={() => setIsEditing(true)} className="gap-2 rounded-xl">
                <Edit className="h-4 w-4" /> Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave} className="gap-2 rounded-xl">
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 2. DUAL COLUMN CONTENT */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: COMPLETION & ACADEMIC HIGHLIGHT */}
        <div className="space-y-6">
          {/* Profile Completion Circle */}
          <Card className="rounded-[24px] border-border-subtle bg-surface p-6 shadow-subtle flex flex-col items-center text-center space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Profile Strength</h3>
            
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="absolute transform -rotate-90 w-full h-full">
                <circle cx="56" cy="56" r="46" stroke="var(--border-subtle)" strokeWidth="6" fill="transparent" />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="var(--primary)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={2 * Math.PI * 46 * (1 - completionPercentage / 100)}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="text-lg font-extrabold text-text-primary font-mono">{completionPercentage}%</span>
            </div>
            
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Fill in your department details, skills array, and goals checklist to reach 100% completion.
            </p>
          </Card>

          {/* Academic Info metadata card */}
          <Card className="rounded-[24px] border-border-subtle bg-surface p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
              <GraduationCap className="h-4.5 w-4.5 text-primary" />
              Academic Identity
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
                <span className="text-text-secondary font-medium">Expected Graduation</span>
                <span className="text-text-primary font-semibold">{profile.expectedGraduation}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMNS: EDIT PROFILE OR GOALS & TIMELINES */}
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
                <Card className="rounded-[24px] border-border-subtle bg-surface p-6 shadow-subtle space-y-6">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
                    <User className="h-4.5 w-4.5 text-primary" />
                    Personal & Department Details
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Bio Description</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={2}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/10 resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">University</label>
                      <input
                        type="text"
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-primary focus:bg-surface"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-primary focus:bg-surface"
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
                  <Card className="rounded-[20px] border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
                    <div className="rounded-xl bg-accent-blue/10 p-2.5 text-accent-blue">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Courses</p>
                      <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{coursesEnrolled}</h4>
                    </div>
                  </Card>

                  <Card className="rounded-[20px] border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
                    <div className="rounded-xl bg-accent-teal/10 p-2.5 text-accent-teal">
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Lessons Done</p>
                      <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{completedTopicsCount}</h4>
                    </div>
                  </Card>

                  <Card className="rounded-[20px] border-border-subtle bg-surface p-5 shadow-subtle flex items-center gap-4">
                    <div className="rounded-xl bg-accent-rose/10 p-2.5 text-accent-rose">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Streak</p>
                      <h4 className="text-xl font-extrabold text-text-primary mt-0.5 font-mono">{analytics.currentStreak} d</h4>
                    </div>
                  </Card>
                </div>

                {/* 2. SKILLS TAG EDITOR */}
                <Card className="rounded-[24px] border-border-subtle bg-surface p-6 shadow-subtle space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-2 border-b border-border-subtle pb-3">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Technical Skills & Tools
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-bg-secondary px-2.5 py-1 text-xs font-bold text-text-primary border border-border-subtle"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-text-tertiary hover:text-accent-rose cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddSkill} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add custom skill (e.g. Node.js)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary"
                    />
                    <Button type="submit" size="sm" className="rounded-xl text-xs gap-1">
                      <Plus className="h-3.5 w-3.5" /> Add
                    </Button>
                  </form>
                </Card>

                {/* 3. GOALS CHECKLIST PANEL */}
                <Card className="rounded-[24px] border-border-subtle bg-surface p-6 shadow-subtle space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-2 border-b border-border-subtle pb-3">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    Active Learning Goals
                  </h3>

                  <div className="space-y-2">
                    {goals.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => handleToggleGoal(g.id)}
                        className="flex items-center gap-3 p-3 border border-border-subtle bg-bg-secondary/20 hover:bg-bg-secondary/40 rounded-xl cursor-pointer"
                      >
                        <div
                          className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            g.completed ? 'bg-accent-teal border-accent-teal text-white' : 'border-border-medium'
                          }`}
                        >
                          {g.completed && <CheckSquare className="h-3.5 w-3.5" />}
                        </div>
                        <span className={`text-xs font-semibold ${g.completed ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
                          {g.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddGoal} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add learning goal..."
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      className="flex-1 rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary"
                    />
                    <Button type="submit" size="sm" className="rounded-xl text-xs gap-1">
                      <Plus className="h-3.5 w-3.5" /> Add
                    </Button>
                  </form>
                </Card>

                {/* 4. PERSONALIZATION CONTROLS PANEL */}
                <Card className="rounded-[24px] border-border-subtle bg-surface p-6 shadow-subtle space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-2 border-b border-border-subtle pb-3">
                    <Palette className="h-4 w-4 text-primary" />
                    Interface Personalization
                  </h3>

                  <div className="space-y-4">
                    {/* Accent Color picker */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-secondary">Workspace Accent Color</span>
                      <div className="flex gap-2">
                        {['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setAccentColor(color)}
                            className={`h-6 w-6 rounded-full border-2 transition-all cursor-pointer ${
                              accentColor === color ? 'border-primary scale-110 shadow-soft' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quote Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-secondary">Daily Greetings Quote</span>
                      <button
                        onClick={() => setShowQuote(!showQuote)}
                        className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative flex items-center ${
                          showQuote ? 'bg-accent-teal justify-end' : 'bg-bg-tertiary justify-start'
                        }`}
                      >
                        <span className="h-4 w-4 rounded-full bg-white mx-0.5 shadow-soft" />
                      </button>
                    </div>
                  </div>
                </Card>

                {/* 5. ACHIEVEMENTS GALLERY */}
                <Card className="rounded-[24px] border-border-subtle bg-surface p-6 shadow-subtle space-y-4">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-3">
                    <Award className="h-4.5 w-4.5 text-accent-amber" />
                    Unlocked Academic Achievements
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
                              ? 'border-border-medium bg-bg-secondary/40'
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
                            <span className={`inline-block text-[9px] font-bold uppercase tracking-wider mt-2 ${unlocked ? 'text-primary' : 'text-text-tertiary'}`}>
                              {unlocked ? 'Unlocked' : 'Locked'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
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
