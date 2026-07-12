import { useLocation, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const routeLabels: Record<string, string> = {
  '': 'Home',
  planner: 'Planner',
  courses: 'Courses',
  timeline: 'Timeline',
  insights: 'Insights',
  preferences: 'Preferences',
  profile: 'Profile',
}

export default function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <nav className="flex items-center gap-1.5 text-xs text-text-secondary select-none" aria-label="Breadcrumb">
      <Link
        to="/"
        className="hover:text-text-primary transition-colors font-medium"
      >
        SemesterOS
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const label = routeLabels[value] || value.charAt(0).toUpperCase() + value.slice(1)

        return (
          <div key={to} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-text-tertiary shrink-0" />
            {isLast ? (
              <span className="font-semibold text-text-primary truncate max-w-[120px] sm:max-w-none" aria-current="page">
                {label}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-text-primary transition-colors font-medium truncate max-w-[120px] sm:max-w-none"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
