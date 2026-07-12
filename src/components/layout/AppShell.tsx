import { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, BookOpen, Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'
import CommandPalette from './CommandPalette'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true'
  })
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  // Key listeners for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
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
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-secondary text-text-primary">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Header onMenuOpen={() => setSidebarOpen(true)} />

        {/* Scrollable Page Container */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="flex h-16 w-full items-center justify-around border-t border-border-subtle bg-bg-primary px-4 py-2 lg:hidden shadow-soft z-20">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors duration-200 ${
                isActive ? 'text-accent-blue' : 'text-text-secondary'
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors duration-200 ${
                isActive ? 'text-accent-blue' : 'text-text-secondary'
              }`
            }
          >
            <BookOpen className="h-5 w-5" />
            <span>Courses</span>
          </NavLink>

          <NavLink
            to="/planner"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors duration-200 ${
                isActive ? 'text-accent-blue' : 'text-text-secondary'
              }`
            }
          >
            <CheckSquare className="h-5 w-5" />
            <span>Planner</span>
          </NavLink>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-text-secondary transition-colors duration-200 active:text-text-primary cursor-pointer"
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </button>
        </nav>
      </div>

      {/* Command Palette Overlay */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  )
}
