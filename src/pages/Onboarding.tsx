import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Palette,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useProfile } from '@/hooks/useProfile'

export default function Onboarding() {
  const navigate = useNavigate()
  const { updateProfile } = useProfile()

  // Stepper state
  const [step, setStep] = useState(1)

  // Onboarding parameters data
  const [university, setUniversity] = useState('Global Institute of Technology')
  const [department, setDepartment] = useState('Computer Science')
  const [branch, setBranch] = useState('CS & Engineering')
  const [semester, setSemester] = useState('Semester III')

  // Registered courses selection
  const [selectedCourses, setSelectedCourses] = useState<string[]>([
    'Object Oriented Programming',
    'Data Structures & Algorithms',
    'Computer Organization & Architecture',
  ])

  const coursesList = [
    'Object Oriented Programming',
    'Data Structures & Algorithms',
    'Computer Organization & Architecture',
    'Probability & Statistics',
    'Environmental Studies',
    'Additive Manufacturing',
  ]

  // Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Improve GPA', 'Stay Organized'])
  const goalsList = ['Improve GPA', 'Crack Placements', 'Stay Organized', 'Study Daily', 'Prepare for Exams']

  // Study preferences
  const [studyTime, setStudyTime] = useState<'morning' | 'afternoon' | 'night'>('night')
  const [duration, setDuration] = useState('3.0 hours')
  const [pomoLength, setPomoLength] = useState(25)

  // AI model choice
  const [aiPreference, setAiPreference] = useState<'local' | 'cloud' | 'none'>('local')

  const handleToggleCourse = (course: string) => {
    setSelectedCourses((prev) =>
      prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]
    )
  }

  const handleToggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    )
  }

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1)
    } else {
      // Save profile metadata
      updateProfile({
        university,
        department,
        branch,
        semester,
      })
      navigate('/')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen w-screen bg-bg-secondary flex flex-col justify-between p-6 select-none overflow-hidden relative text-left">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-accent-teal/5 blur-[120px]" />

      {/* Header bar stepper indicator */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-soft">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <span className="font-extrabold text-xs text-text-primary tracking-tight">Onboarding Stepper</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-bold font-mono">
          <span>Step {step} of 7</span>
        </div>
      </header>

      {/* Main stepper body */}
      <main className="flex-1 max-w-2xl w-full mx-auto flex items-center justify-center z-10 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            <Card className="rounded-[28px] border border-border-subtle bg-surface p-6 md:p-8 shadow-high space-y-6">
              
              {/* STEP 1: WELCOME OVERVIEW */}
              {step === 1 && (
                <div className="space-y-4 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-subtle">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                      Let&apos;s build your academic space
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed max-w-[42ch] mx-auto">
                      Welcome to SemesterOS! Take 1 minute to configure your university courses, study preferences, and goal analytics.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: UNIVERSITY INFO */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-primary">University Details</h3>
                    <p className="text-[10px] text-text-secondary">Input your registered university parameters.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">University Name</label>
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Branch / Program</label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Current Semester</label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                      >
                        <option>Semester I</option>
                        <option>Semester II</option>
                        <option>Semester III</option>
                        <option>Semester IV</option>
                        <option>Semester V</option>
                        <option>Semester VI</option>
                        <option>Semester VII</option>
                        <option>Semester VIII</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: COURSE SELECTOR */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                      <BookOpen className="h-4.5 w-4.5 text-primary" />
                      Syllabus Enrolled Courses
                    </h3>
                    <p className="text-[10px] text-text-secondary">Select registered course cards to generate your study pages.</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {coursesList.map((c) => {
                      const selected = selectedCourses.includes(c)
                      return (
                        <button
                          key={c}
                          onClick={() => handleToggleCourse(c)}
                          className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                            selected
                              ? 'border-primary bg-primary/5 shadow-soft'
                              : 'border-border-subtle bg-surface hover:border-border-medium'
                          }`}
                        >
                          <span className="text-xs font-semibold text-text-primary">{c}</span>
                          <div
                            className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 ${
                              selected ? 'bg-primary border-primary text-white' : 'border-border-medium'
                            }`}
                          >
                            {selected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: GOALS SELECTOR */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                      <Award className="h-4.5 w-4.5 text-accent-amber" />
                      Academic Term Goals
                    </h3>
                    <p className="text-[10px] text-text-secondary">What do you want to achieve this semester?</p>
                  </div>

                  <div className="space-y-2">
                    {goalsList.map((g) => {
                      const selected = selectedGoals.includes(g)
                      return (
                        <button
                          key={g}
                          onClick={() => handleToggleGoal(g)}
                          className={`w-full p-3 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                            selected
                              ? 'border-primary bg-primary/5'
                              : 'border-border-subtle bg-surface hover:border-border-medium'
                          }`}
                        >
                          <span className="text-xs font-semibold text-text-primary">{g}</span>
                          <div
                            className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 ${
                              selected ? 'bg-primary border-primary text-white' : 'border-border-medium'
                            }`}
                          >
                            {selected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: PREFERENCES */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                      <Palette className="h-4.5 w-4.5 text-accent-indigo" />
                      Study Window & Time Preferences
                    </h3>
                    <p className="text-[10px] text-text-secondary">Tailor focus clocks and greeting quotes to your routine.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Preferred Window</label>
                      <select
                        value={studyTime}
                        onChange={(e) => setStudyTime(e.target.value as any)}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                      >
                        <option value="morning">Morning Study (8 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon Study (1 PM - 5 PM)</option>
                        <option value="night">Night Study (8 PM - 12 AM)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Daily focus hours goal</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                      >
                        <option>1.0 hours</option>
                        <option>2.0 hours</option>
                        <option>3.0 hours</option>
                        <option>4.0 hours</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Pomodoro interval length</label>
                      <div className="flex gap-2">
                        {[25, 45, 50].map((len) => (
                          <button
                            key={len}
                            type="button"
                            onClick={() => setPomoLength(len)}
                            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all border cursor-pointer ${
                              pomoLength === len
                                ? 'bg-primary text-white border-primary shadow-soft'
                                : 'border-border-subtle bg-bg-secondary/40 text-text-secondary'
                            }`}
                          >
                            {len} Minutes
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: AI ENGINE SETTINGS */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                      🤖 Academic AI Setup
                    </h3>
                    <p className="text-[10px] text-text-secondary">Configure intelligence workspace engines. You can modify these settings later.</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { id: 'local', title: 'Local AI', desc: 'Plug in Ollama / LM Studio models locally.', icon: '💻' },
                      { id: 'cloud', title: 'Cloud AI', desc: 'Sync API keys for Gemini Pro / OpenAI GPT.', icon: '☁️' },
                      { id: 'none', title: 'Disable AI', desc: 'Keep app offline without AI workspace features.', icon: '🔒' },
                    ].map((provider) => {
                      const selected = aiPreference === provider.id
                      return (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => setAiPreference(provider.id as any)}
                          className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-36 group cursor-pointer ${
                            selected
                              ? 'border-primary bg-primary/5 shadow-soft'
                              : 'border-border-subtle bg-surface hover:border-border-medium'
                          }`}
                        >
                          <span className="text-2xl">{provider.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-text-primary">{provider.title}</h4>
                            <p className="text-[9px] text-text-secondary mt-1 leading-normal">{provider.desc}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 7: SETUP COMPLETE */}
              {step === 7 && (
                <div className="space-y-4 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center mx-auto shadow-subtle">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                      All Setup Completed!
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed max-w-[42ch] mx-auto">
                      Your courses have been cataloged, streak dashboards initialized, and study preferences synced. Redirect to your academic hub below.
                    </p>
                  </div>
                </div>
              )}

              {/* Stepper Navigation buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-border-subtle/50 select-none">
                {step > 1 ? (
                  <Button variant="outline" size="sm" onClick={handleBack} className="gap-1.5 rounded-xl text-xs py-2">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button size="sm" onClick={handleNext} className="gap-1.5 rounded-xl text-xs py-2">
                  {step === 7 ? 'Enter Workspace' : 'Next Step'} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

            </Card>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer page indicators */}
      <footer className="max-w-3xl w-full mx-auto text-center py-2">
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: 7 }).map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === idx + 1 ? 'w-6 bg-primary' : 'w-1.5 bg-border-medium'
              }`}
            />
          ))}
        </div>
      </footer>

    </div>
  )
}
