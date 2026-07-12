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
  User,
  Folder,
  Bot,
} from 'lucide-react'
import NavigationItem from './NavigationItem'
import UserMenu from './UserMenu'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/planner', label: 'Planner', icon: CheckSquare },
  { path: '/resources', label: 'Resources', icon: Folder },
  { path: '/ai', label: 'AI Assistant', icon: Bot },
  { path: '/timeline', label: 'Timeline', icon: Calendar },
  { path: '/insights', label: 'Analytics', icon: BarChart2 },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/preferences', label: 'Settings', icon: Settings },
]

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
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
        } ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-[280px] w-64'}`}
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
                className="truncate text-left"
              >
                <span className="font-semibold tracking-tight text-text-primary text-sm block">SemesterOS</span>
                <p className="text-[9px] text-text-tertiary font-semibold uppercase tracking-wider">Workspace</p>
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
          {menuItems.map((item) => (
            <NavigationItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              isCollapsed={isCollapsed}
              onClick={() => {
                if (window.innerWidth < 1024) onClose()
              }}
            />
          ))}
        </nav>

        {/* Desktop Toggle Button */}
        <div className="px-4 py-2 border-t border-border-subtle/50 hidden lg:flex justify-end">
          <button
            onClick={onToggleCollapse}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary cursor-pointer"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User Workspace Profile Footer */}
        <div className="border-t border-border-subtle p-4">
          <UserMenu isCollapsed={isCollapsed} />
        </div>
      </motion.aside>
    </>
  )
}
