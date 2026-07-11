import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Calendar,
  BarChart2,
  Settings,
  User,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface PaletteItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  category: 'Navigation' | 'Actions' | 'Appearance'
  action: () => void
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Define commands list
  const commands: PaletteItem[] = [
    {
      id: 'nav-home',
      title: 'Go to Dashboard',
      subtitle: 'View your academic command center',
      icon: LayoutDashboard,
      category: 'Navigation',
      action: () => {
        navigate('/')
        onClose()
      },
    },
    {
      id: 'nav-planner',
      title: 'Go to Planner',
      subtitle: 'Manage tasks and studies',
      icon: CheckSquare,
      category: 'Navigation',
      action: () => {
        navigate('/planner')
        onClose()
      },
    },
    {
      id: 'nav-courses',
      title: 'Go to Courses',
      subtitle: 'Manage subjects and curriculum',
      icon: BookOpen,
      category: 'Navigation',
      action: () => {
        navigate('/courses')
        onClose()
      },
    },
    {
      id: 'nav-timeline',
      title: 'Go to Timeline',
      subtitle: 'View calendar schedule',
      icon: Calendar,
      category: 'Navigation',
      action: () => {
        navigate('/timeline')
        onClose()
      },
    },
    {
      id: 'nav-insights',
      title: 'Go to Insights & GPA Analytics',
      subtitle: 'Study hours and progress analytics',
      icon: BarChart2,
      category: 'Navigation',
      action: () => {
        navigate('/insights')
        onClose()
      },
    },
    {
      id: 'nav-preferences',
      title: 'Go to Workspace Preferences',
      subtitle: 'Modify app configuration',
      icon: Settings,
      category: 'Navigation',
      action: () => {
        navigate('/preferences')
        onClose()
      },
    },
    {
      id: 'nav-profile',
      title: 'Go to Student Profile',
      subtitle: 'View your badges and achievements',
      icon: User,
      category: 'Navigation',
      action: () => {
        navigate('/profile')
        onClose()
      },
    },
    {
      id: 'action-light',
      title: 'Set Theme: Light Mode',
      subtitle: 'Switch application to light colors',
      icon: Sun,
      category: 'Appearance',
      action: () => {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
        window.dispatchEvent(new Event('theme-change'))
        onClose()
      },
    },
    {
      id: 'action-dark',
      title: 'Set Theme: Dark Mode',
      subtitle: 'Switch application to dark navy colors',
      icon: Moon,
      category: 'Appearance',
      action: () => {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
        window.dispatchEvent(new Event('theme-change'))
        onClose()
      },
    },
    {
      id: 'action-reset',
      title: 'Clear Cache & Reset Data',
      subtitle: 'Wipes all local study sessions and tasks',
      icon: Sparkles,
      category: 'Actions',
      action: () => {
        if (window.confirm('Erase all local storage data? This action is irreversible.')) {
          localStorage.clear()
          window.location.reload()
        }
      },
    },
  ]

  // Filter commands
  const filteredCommands = commands.filter((cmd) => {
    const query = searchQuery.toLowerCase()
    return (
      cmd.title.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(query))
    )
  })

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Group commands by category for display
  const categories = Array.from(new Set(filteredCommands.map((c) => c.category)))

  let absoluteIndex = 0

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Modal Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/35 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border-medium bg-bg-primary/95 shadow-premium backdrop-blur-md flex flex-col max-h-[450px]"
          >
            {/* Search Input Bar */}
            <div className="flex h-12 items-center gap-3 border-b border-border-subtle px-4">
              <Search className="h-4 w-4 text-text-tertiary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                placeholder="Type a command or search page..."
                className="w-full bg-transparent text-xs text-text-primary outline-none placeholder:text-text-tertiary"
              />
              <kbd className="rounded border border-border-subtle bg-bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-text-tertiary shadow-subtle shrink-0">
                ESC
              </kbd>
            </div>

            {/* Commands List Container */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3">
              {filteredCommands.length > 0 ? (
                categories.map((category) => (
                  <div key={category} className="space-y-1">
                    <h5 className="px-3 text-[9px] font-bold uppercase tracking-wider text-text-tertiary">
                      {category}
                    </h5>
                    {filteredCommands
                      .filter((c) => c.category === category)
                      .map((cmd) => {
                        const Icon = cmd.icon
                        const isSelected = absoluteIndex === selectedIndex
                        const currentIndex = absoluteIndex
                        absoluteIndex++

                        return (
                          <div
                            key={cmd.id}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            className={`flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
                              isSelected
                                ? 'bg-accent-blue/10 text-accent-blue'
                                : 'text-text-secondary hover:bg-bg-secondary/40 hover:text-text-primary'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Icon className={`h-4.5 w-4.5 shrink-0 ${isSelected ? 'text-accent-blue' : 'text-text-secondary'}`} />
                              <div className="truncate">
                                <p className={`text-xs font-semibold ${isSelected ? 'text-accent-blue' : 'text-text-primary'}`}>
                                  {cmd.title}
                                </p>
                                {cmd.subtitle && (
                                  <p className="text-[10px] text-text-secondary mt-0.5 truncate">{cmd.subtitle}</p>
                                )}
                              </div>
                            </div>
                            {isSelected && <ArrowRight className="h-3.5 w-3.5 text-accent-blue shrink-0 animate-pulse" />}
                          </div>
                        )
                      })}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-text-secondary">
                  No matching commands found.
                </div>
              )}
            </div>

            {/* Bottom Keyboard Controls Hint Bar */}
            <div className="flex h-10 items-center justify-between border-t border-border-subtle bg-bg-secondary/40 px-4 text-[10px] text-text-tertiary font-medium">
              <div className="flex items-center gap-1.5">
                <span>Use</span>
                <span className="rounded bg-bg-secondary border border-border-subtle px-1 py-0.5 text-[9px]">↑</span>
                <span className="rounded bg-bg-secondary border border-border-subtle px-1 py-0.5 text-[9px]">↓</span>
                <span>to navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Press</span>
                <kbd className="rounded bg-bg-secondary border border-border-subtle px-1.5 py-0.5 text-[9px] font-bold">↵ Enter</kbd>
                <span>to run</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
