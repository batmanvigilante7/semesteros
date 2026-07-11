import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Calendar,
  BarChart2,
  Settings,
  GraduationCap,
  X,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/planner', label: 'Planner', icon: CheckSquare },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/timeline', label: 'Timeline', icon: Calendar },
  { path: '/insights', label: 'Insights', icon: BarChart2 },
  { path: '/preferences', label: 'Preferences', icon: Settings },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-subtle bg-bg-primary transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header/Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-blue text-white shadow-soft">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold tracking-tight text-text-primary text-lg">SemesterOS</span>
              <p className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.035, duration: 0.25 }}
              >
                <NavLink
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose()
                  }}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-accent-blue bg-bg-secondary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`h-5 w-5 ${isActive ? 'text-accent-blue' : 'text-text-secondary'}`} />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-accent-blue"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            )
          })}
        </nav>

        {/* User Workspace Profile Footer */}
        <div className="border-t border-border-subtle p-4">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-bg-secondary/50 transition-colors duration-200">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-accent-indigo text-white flex items-center justify-center font-bold text-sm shadow-subtle">
              HS
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-text-primary">Hemanth</p>
              <p className="truncate text-[10px] text-text-secondary">hemanth@semesteros.dev</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
