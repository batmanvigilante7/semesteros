import { Bell, Menu } from 'lucide-react'
import Breadcrumb from './Breadcrumb'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  onMenuOpen: () => void
}

export default function Header({ onMenuOpen }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-bg-primary px-6 shadow-subtle z-30 select-none">
      {/* Mobile Toggle & Breadcrumb Navigation */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuOpen}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary lg:hidden cursor-pointer shrink-0"
          aria-label="Open navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Dynamic Breadcrumbs */}
        <Breadcrumb />
      </div>

      {/* Global Controls & Primitives */}
      <div className="flex items-center gap-3.5">
        {/* Clickable Search input bar */}
        <SearchBar />

        {/* Theme Toggler (Sun/Moon animations) */}
        <ThemeToggle />

        {/* Notifications Icon (Mock indicator badge) */}
        <button
          className="relative rounded-xl p-2 text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all duration-200 cursor-pointer"
          aria-label="View notifications center"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-rose animate-pulse" />
        </button>
      </div>
    </header>
  )
}
