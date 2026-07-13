import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, BookOpen, Folder, User } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'
import CommandPalette from './CommandPalette'
import NotificationCenter from './NotificationCenter'
import QuickCreateFAB from './QuickCreateFAB'
import InteractiveBackground from '@/components/dashboard/InteractiveBackground'
import Lenis from 'lenis'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true'
  })
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Reset scroll position on page navigation
  useEffect(() => {
    const scrollContainer = document.querySelector('main')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }
  }, [pathname])

  // Butter-smooth momentum scrolling via Lenis
  useEffect(() => {
    const scrollContainer = document.querySelector('main')
    if (!scrollContainer) return

    const lenis = new Lenis({
      wrapper: scrollContainer,
      content: scrollContainer.firstElementChild as HTMLElement,
      duration: 0.75,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -12 * t)), // snappier curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  // Key listeners for Command Palette & Global Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        navigate('/study')
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault()
        navigate('/planner')
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open-create-task'))
        }, 150)
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        navigate('/resources')
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open-create-course'))
        }, 150)
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault()
        navigate('/resources')
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open-upload-file'))
        }, 150)
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
        setNotificationsOpen(false)
      }
    }

    const handleOpenPalette = () => {
      setCommandPaletteOpen(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette', handleOpenPalette)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleOpenPalette)
    }
  }, [navigate])

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-bg-secondary text-text-primary">
      {/* Procedural Interactive Background */}
      <InteractiveBackground />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Header
          onMenuOpen={() => setSidebarOpen(true)}
          onNotificationOpen={() => setNotificationsOpen(true)}
        />

        {/* Scrollable Page Container */}
        <main className="flex-1 overflow-y-auto px-6 pt-8 pb-28 md:px-8 md:pb-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar (Floating & Frosted Glassmorphism with Safe Area support) */}
        <nav className="fixed bottom-4 left-4 right-4 z-40 flex h-16 items-center justify-around rounded-2xl border border-border-subtle bg-surface/75 backdrop-blur-xl px-4 py-2 lg:hidden shadow-premium pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-1 h-12 flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all duration-200 ${
                isActive ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `flex flex-1 h-12 flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all duration-200 ${
                isActive ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            <BookOpen className="h-5 w-5" />
            <span>Courses</span>
          </NavLink>

          <NavLink
            to="/planner"
            className={({ isActive }) =>
              `flex flex-1 h-12 flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all duration-200 ${
                isActive ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            <CheckSquare className="h-5 w-5" />
            <span>Planner</span>
          </NavLink>

          <NavLink
            to="/resources"
            className={({ isActive }) =>
              `flex flex-1 h-12 flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all duration-200 ${
                isActive ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            <Folder className="h-5 w-5" />
            <span>Knowledge</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-1 h-12 flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all duration-200 ${
                isActive ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>

      {/* Command Palette Overlay */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Notification Center slide-over drawer */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Global Quick Action Floating Action Button (raised slightly to avoid floating nav overlap on mobile) */}
      <div className="lg:static fixed bottom-22 right-6 z-50 lg:bottom-auto lg:right-auto">
        <QuickCreateFAB />
      </div>
    </div>
  )
}
