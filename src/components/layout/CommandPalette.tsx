import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  BarChart2,
  Settings,
  User,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  Folder,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface PaletteItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  category: 'Navigation' | 'Actions' | 'Appearance' | 'Resources'
  action: () => void
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Dynamic courses list from local storage or defaults
  const [courses] = useState(() => {
    return [
      { id: 'course-oop-theory', name: 'Object Oriented Programming', code: 'OOP' },
      { id: 'course-ds-theory', name: 'Data Structures & Algorithms', code: 'DSA' },
      { id: 'course-coa-theory', name: 'Computer Organization & Architecture', code: 'COA' },
    ]
  })

  // Define commands list
  const commands = useMemo(() => {
    const list: PaletteItem[] = [
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
        id: 'nav-resources',
        title: 'Go to Knowledge Hub',
        subtitle: 'View study files and notes',
        icon: Folder,
        category: 'Navigation',
        action: () => {
          navigate('/resources')
          onClose()
        },
      },
      {
        id: 'nav-study',
        title: 'Go to Study Workspace',
        subtitle: 'Open offline study and productivity suite',
        icon: GraduationCap,
        category: 'Navigation',
        action: () => {
          navigate('/study')
          onClose()
        },
      },
      {
        id: 'nav-analytics',
        title: 'Go to Analytics & GPA Insights',
        subtitle: 'Study hours and progress analytics',
        icon: BarChart2,
        category: 'Navigation',
        action: () => {
          navigate('/analytics')
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

    // Append dynamic courses search results
    courses.forEach((c) => {
      list.push({
        id: `course-link-${c.id}`,
        title: `Search Course: ${c.name}`,
        subtitle: `Course code: ${c.code}`,
        icon: BookOpen,
        category: 'Resources',
        action: () => {
          navigate(`/courses/${c.id}`)
          onClose()
        },
      })
    })

    return list
  }, [courses, navigate])

  // Filter commands
  const filteredCommands = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return commands.filter((cmd: PaletteItem) => {
      return (
        cmd.title.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query) ||
        (cmd.subtitle && cmd.subtitle.toLowerCase().includes(query))
      )
    })
  }, [commands, searchQuery])

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (filteredCommands.length > 0 ? (prev + 1) % filteredCommands.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          filteredCommands.length > 0 ? (prev - 1 + filteredCommands.length) % filteredCommands.length : 0
        )
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
  const categories = useMemo(() => {
    return Array.from(new Set(filteredCommands.map((c: PaletteItem) => c.category)))
  }, [filteredCommands])

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
            className="absolute inset-0 bg-black/25 backdrop-blur-md"
          />

          {/* Dialog content box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-border-subtle bg-surface/90 shadow-high backdrop-blur-lg flex flex-col max-h-[480px]"
          >
            {/* Input Bar wrapper */}
            <div className="relative flex items-center border-b border-border-subtle/50 px-4 py-3 shrink-0">
              <Search className="h-4.5 w-4.5 text-text-tertiary mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search academic resources..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none border-none focus:ring-0"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border-subtle bg-bg-secondary px-1.5 py-0.5 font-sans text-[9px] font-bold text-text-secondary select-none shadow-soft">
                ESC
              </kbd>
            </div>

            {/* Suggestions panel */}
            <div className="flex-1 overflow-y-auto p-2 min-h-0 space-y-4">
              {categories.map((cat: string) => {
                const catCommands = filteredCommands.filter((c: PaletteItem) => c.category === cat)
                return (
                  <div key={cat} className="space-y-1 text-left">
                    <span className="px-3 text-[9px] font-bold uppercase tracking-wider text-text-tertiary block mb-1">
                      {cat}
                    </span>
                    <div className="space-y-0.5">
                      {catCommands.map((cmd: PaletteItem) => {
                        const Icon = cmd.icon
                        const currentIndex = absoluteIndex++
                        const isActive = currentIndex === selectedIndex

                        return (
                          <button
                            key={cmd.id}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            className={cn(
                              'w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition-colors cursor-pointer',
                              isActive ? 'bg-primary text-white shadow-soft font-bold' : 'text-text-secondary hover:bg-bg-secondary/40'
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-text-tertiary')} />
                              <div className="min-w-0">
                                <p className={cn('text-xs', isActive ? 'text-white font-bold' : 'text-text-primary')}>{cmd.title}</p>
                                {cmd.subtitle && (
                                  <p className={cn('text-[10px] truncate', isActive ? 'text-white/80' : 'text-text-secondary')}>{cmd.subtitle}</p>
                                )}
                              </div>
                            </div>
                            {isActive && <ArrowRight className="h-3.5 w-3.5 text-white shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {filteredCommands.length === 0 && (
                <div className="py-12 text-center text-xs text-text-secondary">
                  No commands or resources matching &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
