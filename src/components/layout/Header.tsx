import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Sun, Moon, Bell, Search, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuOpen: () => void
}

const pageTitles: Record<string, string> = {
  '/': 'SemesterOS Home',
  '/planner': 'Academic Planner',
  '/courses': 'Courses & Syllabus',
  '/timeline': 'Academic Timeline',
  '/insights': 'Academic Insights',
  '/preferences': 'Workspace Preferences',
}

export default function Header({ onMenuOpen }: HeaderProps) {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'SemesterOS'

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-bg-primary px-6 shadow-subtle z-30">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuOpen}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight text-text-primary">
          {title}
        </h1>
      </div>

      {/* Global Controls */}
      <div className="flex items-center gap-4">
        {/* Search Input Button (Triggers Command Palette) */}
        <div
          onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
          className="relative hidden sm:block w-64 cursor-pointer select-none"
        >
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <div className="w-full rounded-xl border border-border-subtle bg-bg-secondary py-1.5 pl-10 pr-12 text-xs text-text-tertiary text-left">
            Search pages, actions...
          </div>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded bg-border-medium px-1.5 py-0.5 text-[9px] font-medium text-text-secondary tracking-widest font-mono">
            ⌘K
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {/* Notifications Icon (Mock) */}
        <button
          className="relative rounded-xl p-2 text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all duration-200"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-rose" />
        </button>
      </div>
    </header>
  )
}
