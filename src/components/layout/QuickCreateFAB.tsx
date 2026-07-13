import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, BookOpen, CheckSquare, FileText, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SPRING_SHIFT } from '@/components/ui/MotionSystem'

export default function QuickCreateFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen((prev) => !prev)

  const handleAction = (path: string, eventName: string) => {
    setIsOpen(false)
    navigate(path)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(eventName))
    }, 150)
  }

  const actions = [
    {
      label: 'New Task',
      icon: CheckSquare,
      onClick: () => handleAction('/planner', 'open-create-task'),
      color: 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
    },
    {
      label: 'Add Course',
      icon: BookOpen,
      onClick: () => handleAction('/resources', 'open-create-course'),
      color: 'bg-accent-indigo/15 text-accent-indigo border-accent-indigo/20',
    },
    {
      label: 'New Note',
      icon: FileText,
      onClick: () => {
        setIsOpen(false)
        navigate('/study')
      },
      color: 'bg-accent-teal/15 text-accent-teal border-accent-teal/20',
    },
    {
      label: 'Upload File',
      icon: Upload,
      onClick: () => handleAction('/resources', 'open-upload-file'),
      color: 'bg-accent-rose/15 text-accent-rose border-accent-rose/20',
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* Floating Actions Submenu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={SPRING_SHIFT}
            className="flex flex-col items-end gap-2.5 mb-2"
          >
            {actions.map((act, idx) => (
              <motion.button
                key={idx}
                onClick={act.onClick}
                whileHover={{ scale: 1.04, x: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border bg-surface/90 backdrop-blur-md text-xs font-bold shadow-premium transition-colors cursor-pointer ${act.color}`}
              >
                <act.icon className="h-4 w-4" />
                <span>{act.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger FAB */}
      <motion.button
        onClick={toggleMenu}
        whileHover={{ scale: 1.08, rotate: isOpen ? 135 : 0 }}
        whileTap={{ scale: 0.92 }}
        animate={{ rotate: isOpen ? 135 : 0 }}
        transition={SPRING_SHIFT}
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-premium cursor-pointer outline-none hover:bg-primary-hover focus:ring-4 focus:ring-primary/20 z-10"
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </motion.button>
    </div>
  )
}
