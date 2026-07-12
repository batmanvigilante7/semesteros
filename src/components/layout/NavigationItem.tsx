import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

interface NavigationItemProps {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  isCollapsed: boolean
  onClick?: () => void
}

export default function NavigationItem({ path, label, icon: Icon, isCollapsed, onClick }: NavigationItemProps) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center rounded-xl py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
          isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : 'px-4 gap-3.5'
        } ${
          isActive
            ? 'text-accent-blue bg-bg-secondary/80 shadow-subtle'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40'
        }`
      }
      title={isCollapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon className={`h-5 w-5 shrink-0 transition-colors duration-200 ${isActive ? 'text-accent-blue' : 'text-text-secondary'}`} />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="truncate"
            >
              {label}
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
  )
}
