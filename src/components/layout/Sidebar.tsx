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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const menuItems = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/planner', label: 'Planner', icon: CheckSquare },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/timeline', label: 'Timeline', icon: Calendar },
  { path: '/insights', label: 'Insights', icon: BarChart2 },
  { path: '/preferences', label: 'Preferences', icon: Settings },
]

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { profile } = useProfile()
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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border-subtle bg-bg-primary transition-all duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-64 w-64'}`}
      >
        {/* Header/Logo */}
        <div className={`flex h-16 items-center justify-between border-b border-border-subtle ${isCollapsed ? 'px-4 justify-center' : 'px-6'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-blue text-white shadow-soft">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.2 }}
                className="truncate"
              >
                <span className="font-semibold tracking-tight text-text-primary text-sm block">SemesterOS</span>
                <p className="text-[9px] text-text-tertiary font-medium uppercase tracking-wider">Workspace</p>
              </motion.div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 space-y-2 py-6 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
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
                    `relative flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                      isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : 'px-4 gap-3.5'
                    } ${
                      isActive
                        ? 'text-accent-blue bg-bg-secondary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/50'
                    }`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-accent-blue' : 'text-text-secondary'}`} />
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
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

        {/* Desktop Toggle Button */}
        <div className="px-4 py-2 border-t border-border-subtle/50 hidden lg:flex justify-end">
          <button
            onClick={onToggleCollapse}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User Workspace Profile Footer */}
        <div className="border-t border-border-subtle p-4">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl p-2 transition-colors duration-200 cursor-pointer ${
                isCollapsed ? 'justify-center' : ''
              } ${isActive ? 'bg-bg-secondary text-accent-blue' : 'hover:bg-bg-secondary/50'}`
            }
          >
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-accent-indigo text-white flex items-center justify-center font-bold text-xs shadow-subtle">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                profile.name.substring(0, 2).toUpperCase()
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-text-primary">{profile.name}</p>
                <p className="truncate text-[10px] text-text-secondary">{profile.email}</p>
              </div>
            )}
          </NavLink>
        </div>
      </motion.aside>
    </>
  )
}
