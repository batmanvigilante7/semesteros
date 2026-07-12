import { useNavigate } from 'react-router-dom'
import { GraduationCap, ArrowRight, ShieldCheck, Flame, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-screen bg-bg-secondary flex flex-col justify-between p-6 select-none overflow-hidden relative text-left">
      
      {/* Background abstract gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-accent-teal/5 blur-[120px]" />

      {/* Top Navbar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-sm text-text-primary tracking-tight font-sans">
            SemesterOS
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="text-xs rounded-xl">
          Sign In
        </Button>
      </header>

      {/* Main hero body */}
      <main className="max-w-7xl w-full mx-auto grid gap-12 lg:grid-cols-2 items-center z-10 py-12">
        <div className="space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-primary px-3 py-1 text-[10px] font-bold text-primary shadow-subtle uppercase tracking-wider">
            🚀 v1.0 Production Ready
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.1]">
            Your Personal Academic <br />
            <span className="text-primary bg-clip-text">Operating System.</span>
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-[45ch]">
            Organize lectures, schedule study blocks, upload note libraries, and interact with syllabus AI tutors. Built for modern computer science undergrads.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={() => navigate('/onboarding')} className="gap-2 rounded-xl text-xs py-3.5 px-6 shadow-soft">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl text-xs py-3.5 px-6">
              Continue as Guest
            </Button>
          </div>
        </div>

        {/* Feature badges panel */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-3">
            <div className="h-9 w-9 bg-accent-blue/10 text-accent-blue rounded-xl flex items-center justify-center">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-xs font-bold text-text-primary">Syllabus Library</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Consolidate slides, reference files, and revision sheets inside course folder hubs.
            </p>
          </Card>

          <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-3">
            <div className="h-9 w-9 bg-accent-amber/10 text-accent-amber rounded-xl flex items-center justify-center">
              <Flame className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-xs font-bold text-text-primary">Focus Planner</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Track pending assignments and review timelines alongside a Pomodoro study timer clock.
            </p>
          </Card>

          <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-3">
            <div className="h-9 w-9 bg-accent-indigo/10 text-accent-indigo rounded-xl flex items-center justify-center">
              💡
            </div>
            <h4 className="text-xs font-bold text-text-primary">Academic AI</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Generate interactive quizzes, revision flashcards, and step-by-step study plans.
            </p>
          </Card>

          <Card className="rounded-[24px] border border-border-subtle bg-surface p-5 shadow-subtle space-y-3">
            <div className="h-9 w-9 bg-accent-teal/10 text-accent-teal rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-xs font-bold text-text-primary">Branch Analytics</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Forecast attendance requirements and monitor term GPA performance statistics.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="max-w-7xl w-full mx-auto border-t border-border-subtle/50 pt-4 flex flex-col sm:flex-row justify-between text-[10px] text-text-tertiary font-medium gap-2">
        <span>&copy; 2026 SemesterOS. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </footer>

    </div>
  )
}
