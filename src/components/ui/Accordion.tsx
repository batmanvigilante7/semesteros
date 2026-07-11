import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface AccordionItem {
  id: string
  title: string
  subtitle?: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  defaultExpanded?: string[]
  className?: string
}

export function Accordion({ items, defaultExpanded = [], className }: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpanded)

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id)
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-border-subtle bg-surface overflow-hidden shadow-subtle"
          >
            <button
              onClick={() => toggleExpand(item.id)}
              className="w-full flex items-center justify-between p-4 bg-bg-secondary/20 hover:bg-bg-secondary/45 transition-colors text-left outline-none cursor-pointer"
            >
              <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                <h4 className="text-sm font-bold text-text-primary truncate">{item.title}</h4>
                {item.subtitle && (
                  <p className="text-[10px] font-semibold text-text-secondary leading-none">{item.subtitle}</p>
                )}
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="text-text-tertiary"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                >
                  <div className="p-4 border-t border-border-subtle bg-surface text-xs leading-relaxed text-text-secondary">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
