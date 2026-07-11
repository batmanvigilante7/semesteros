import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Save, GraduationCap } from 'lucide-react'

export default function Preferences() {
  const [university, setUniversity] = useState('Stanford University')
  const [major, setMajor] = useState('Computer Science')
  const [gradYear, setGradYear] = useState('2027')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [pushAlerts, setPushAlerts] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-accent-blue uppercase tracking-wider">Configuration</p>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Workspace Preferences</h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-accent-blue px-4 py-2 text-xs font-semibold text-white shadow-soft hover:bg-accent-blue/90 transition-colors">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left pane - Section links */}
        <div className="lg:col-span-1 space-y-2">
          <div className="rounded-2xl border border-border-subtle bg-bg-primary p-4 shadow-subtle space-y-1">
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-accent-blue bg-bg-secondary text-left">
              <User className="h-4 w-4" /> Academic Profile
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40 text-left">
              <Bell className="h-4 w-4" /> Notifications
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40 text-left">
              <Palette className="h-4 w-4" /> Appearance
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40 text-left">
              <Shield className="h-4 w-4" /> Security
            </button>
          </div>
        </div>

        {/* Right pane - Preferences panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="rounded-2xl border border-border-subtle bg-bg-primary p-6 shadow-subtle space-y-6">
            <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-4 flex items-center gap-2">
              <GraduationCap className="h-4.5 w-4.5 text-accent-blue" />
              Academic Info
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">University</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary focus:ring-2 focus:ring-accent-blue/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Major / Program</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary focus:ring-2 focus:ring-accent-blue/10"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Graduation Year</label>
                <input
                  type="text"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2 text-xs text-text-primary outline-none focus:border-accent-blue/30 focus:bg-bg-primary focus:ring-2 focus:ring-accent-blue/10"
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="rounded-2xl border border-border-subtle bg-bg-primary p-6 shadow-subtle space-y-6">
            <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-4 flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-accent-indigo" />
              Alert Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-text-primary text-xs">Email Bulletins</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">Receive weekly reports and outstanding assignment updates.</p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative h-6 w-11 rounded-full p-1 transition-colors duration-200 ${
                    emailAlerts ? 'bg-accent-blue' : 'bg-border-medium'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                      emailAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                <div>
                  <h4 className="font-semibold text-text-primary text-xs">Push Notifications</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">Alerts when assignment deadlines are under 24 hours.</p>
                </div>
                <button
                  onClick={() => setPushAlerts(!pushAlerts)}
                  className={`relative h-6 w-11 rounded-full p-1 transition-colors duration-200 ${
                    pushAlerts ? 'bg-accent-blue' : 'bg-border-medium'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                      pushAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
