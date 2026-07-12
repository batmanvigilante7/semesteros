import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)

    // Dispatch event so other components know the theme changed
    window.dispatchEvent(new Event('theme-change'))
  }, [theme])

  // Listen to external theme changes (e.g. from Command Palette)
  useEffect(() => {
    const handleThemeChange = () => {
      const activeTheme = localStorage.getItem('theme') || 'light'
      setTheme(activeTheme)
    }
    window.addEventListener('theme-change', handleThemeChange)
    return () => window.removeEventListener('theme-change', handleThemeChange)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-xl p-2 text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all duration-200 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  )
}
