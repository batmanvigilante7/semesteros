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
        `relative flex items-center rounded-xl py-2.5 text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
          isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : 'px-4 gap-3.5'
        } ${
          isActive
            ? 'text-primary font-bold'
            : 'text-text-secondary hover:text-text-primary'
        }`
      }
      title={isCollapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active-pill"
              className="absolute inset-0 rounded-xl bg-primary/10 dark:bg-primary/15 z-0"
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            />
          )}

          <motion.div
            className="flex items-center gap-3.5 w-full relative z-10"
            whileHover={isActive ? {} : { x: 3 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          >
            <Icon className={`h-4.5 w-4.5 shrink-0 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-text-secondary'}`} />
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
          </motion.div>
        </>
      )}
    </NavLink>
  )
}
