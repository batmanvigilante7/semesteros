import { useEffect, useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import Breadcrumb from './Breadcrumb'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  onMenuOpen: () => void
  onNotificationOpen: () => void
}

export default function Header({ onMenuOpen, onNotificationOpen }: HeaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const mainElement = document.querySelector('main')
    if (!mainElement) return

    const handleScroll = () => {
      const scrollTop = mainElement.scrollTop
      const scrollHeight = mainElement.scrollHeight - mainElement.clientHeight
      if (scrollHeight > 0) {
        setScrollProgress((scrollTop / scrollHeight) * 100)
      } else {
        setScrollProgress(0)
      }
      setIsScrolled(scrollTop > 25)
    }

    mainElement.addEventListener('scroll', handleScroll)
    // Run initially
    handleScroll()

    return () => mainElement.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`relative z-30 flex items-center justify-between border-b border-border-subtle px-6 select-none transition-all duration-300 ${
        isScrolled 
          ? 'h-13 bg-bg-primary/95 backdrop-blur-xl shadow-soft' 
          : 'h-16 bg-bg-primary/75 backdrop-blur-md shadow-subtle'
      }`}
    >
      {/* Moon Blue progress line */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-out z-40"
        style={{ width: `${scrollProgress}%`, opacity: scrollProgress > 0 ? 1 : 0 }}
      />

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
          onClick={onNotificationOpen}
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
