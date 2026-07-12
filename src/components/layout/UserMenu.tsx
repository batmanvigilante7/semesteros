import { NavLink } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'

interface UserMenuProps {
  isCollapsed: boolean
}

export default function UserMenu({ isCollapsed }: UserMenuProps) {
  const { profile } = useProfile()

  return (
    <NavLink
      to="/profile"
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl p-2 transition-colors duration-200 cursor-pointer ${
          isCollapsed ? 'justify-center' : ''
        } ${isActive ? 'bg-bg-secondary text-accent-blue' : 'hover:bg-bg-secondary/50'}`
      }
      aria-label="View Student Profile"
    >
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-accent-indigo text-white flex items-center justify-center font-bold text-xs shadow-subtle">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
        ) : (
          profile.name.substring(0, 2).toUpperCase()
        )}
      </div>
      {!isCollapsed && (
        <div className="flex-1 min-w-0 text-left">
          <p className="truncate text-xs font-semibold text-text-primary">{profile.name}</p>
          <p className="truncate text-[10px] text-text-secondary">{profile.email}</p>
        </div>
      )}
    </NavLink>
  )
}
