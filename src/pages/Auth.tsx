import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, ArrowRight, Mail, Key } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type AuthMode = 'login' | 'signup' | 'forgot-password'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')

  // Form inputs
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [forgotSubmitted, setForgotSubmitted] = useState(false)

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', color: 'bg-bg-tertiary', width: 'w-0' }
    if (password.length < 6) return { label: 'Weak', color: 'bg-accent-rose', width: 'w-1/3' }
    if (password.length < 10) return { label: 'Good', color: 'bg-accent-amber', width: 'w-2/3' }
    return { label: 'Strong', color: 'bg-accent-teal', width: 'w-full' }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      navigate('/onboarding')
    } else if (mode === 'signup') {
      if (password !== confirmPassword) {
        alert("Passwords do not match.")
        return
      }
      navigate('/onboarding')
    } else if (mode === 'forgot-password') {
      setForgotSubmitted(true)
    }
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen w-screen bg-bg-secondary flex items-center justify-center p-6 select-none overflow-hidden relative text-left">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-accent-teal/5 blur-[120px]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md z-10"
        >
          {/* Card Wrapper */}
          <Card className="rounded-[28px] border border-border-subtle bg-surface p-6 md:p-8 shadow-high space-y-6">
            
            {/* Branding Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-soft">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>
              <span className="font-extrabold text-xs text-text-primary tracking-tight font-sans">
                SemesterOS
              </span>
            </div>

            {/* Mode headers */}
            {mode === 'login' && (
              <div>
                <h3 className="text-lg font-bold text-text-primary">Welcome back</h3>
                <p className="text-[10px] text-text-secondary mt-0.5">Sign in to your academic space.</p>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <h3 className="text-lg font-bold text-text-primary">Create your account</h3>
                <p className="text-[10px] text-text-secondary mt-0.5">Start organizing your syllabus journey.</p>
              </div>
            )}

            {mode === 'forgot-password' && (
              <div>
                <h3 className="text-lg font-bold text-text-primary">Reset password</h3>
                <p className="text-[10px] text-text-secondary mt-0.5">We will send you instructions to reset your password.</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hemanth"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3.5 py-2 text-xs text-text-primary outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              )}

              {(!forgotSubmitted || mode !== 'forgot-password') && (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                    <input
                      type="email"
                      required
                      placeholder="you@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 pl-9 pr-4 py-2 text-xs text-text-primary outline-none focus:border-primary focus:bg-surface"
                    />
                  </div>
                </div>
              )}

              {mode !== 'forgot-password' && (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 pl-9 pr-4 py-2 text-xs text-text-primary outline-none focus:border-primary focus:bg-surface"
                    />
                  </div>

                  {/* Password strength meter */}
                  {mode === 'signup' && password && (
                    <div className="space-y-1 pt-1">
                      <div className="h-1.5 w-full rounded bg-bg-secondary overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                      </div>
                      <span className="text-[8px] font-bold uppercase text-text-tertiary tracking-wider">
                        Strength: {strength.label}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3.5 py-2 text-xs text-text-primary outline-none focus:border-primary focus:bg-surface"
                  />
                </div>
              )}

              {/* Forgot password success block */}
              {mode === 'forgot-password' && forgotSubmitted && (
                <div className="p-4 bg-accent-teal/10 border border-accent-teal/20 rounded-xl text-center space-y-1">
                  <span className="text-2xl">📧</span>
                  <h4 className="text-xs font-bold text-text-primary">Check your inbox</h4>
                  <p className="text-[10px] text-text-secondary leading-relaxed">
                    We sent a password reset link to <strong className="text-text-primary">{email}</strong>.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              {mode === 'login' && (
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <label className="flex items-center gap-1.5 text-text-secondary cursor-pointer">
                    <input type="checkbox" className="rounded border-border-subtle text-primary focus:ring-0" />
                    Remember Me
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot-password')}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {mode === 'signup' && (
                <label className="flex items-start gap-2 text-[10px] font-semibold text-text-secondary cursor-pointer leading-tight">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-border-subtle text-primary focus:ring-0 mt-0.5"
                  />
                  <span>I agree to the Terms of Service and Privacy Policy.</span>
                </label>
              )}

              {(!forgotSubmitted || mode !== 'forgot-password') && (
                <Button type="submit" className="w-full gap-2 rounded-xl text-xs py-2.5 shadow-soft">
                  {mode === 'login' ? 'Continue' : mode === 'signup' ? 'Create Account' : 'Send Instructions'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </form>

            {/* Social logins */}
            {mode !== 'forgot-password' && (
              <div className="space-y-3.5 pt-4 border-t border-border-subtle/50">
                <p className="text-center text-[8px] font-extrabold uppercase tracking-wider text-text-tertiary">
                  Or continue with
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" type="button" className="gap-2 text-[10px] font-bold rounded-xl py-2 cursor-pointer">
                    😺 GitHub
                  </Button>
                  <Button variant="outline" type="button" className="gap-2 text-[10px] font-bold rounded-xl py-2 cursor-pointer">
                    🌐 Google
                  </Button>
                </div>
              </div>
            )}

            {/* Bottom switcher link */}
            <div className="text-center text-[10px] font-bold pt-2">
              {mode === 'login' ? (
                <p className="text-text-secondary">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-primary hover:underline cursor-pointer">
                    Sign Up
                  </button>
                </p>
              ) : (
                <p className="text-text-secondary">
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-primary hover:underline cursor-pointer">
                    Sign In
                  </button>
                </p>
              )}
            </div>

          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
