import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

// 1. Dialog (Modal Overlay)
export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Dialog({ isOpen, onClose, title, children, footer, className }: DialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0B0F19]/30 dark:bg-[#020617]/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className={cn(
              'relative z-10 w-full max-w-lg rounded-[24px] border border-border-subtle bg-surface p-6 shadow-premium text-left overflow-hidden',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
              {title ? (
                <h3 className="text-base font-bold text-text-primary">{title}</h3>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-border-subtle pt-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// 2. Drawer Component (Slide-in Panel)
export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: 'right' | 'left'
  className?: string
}

export function Drawer({ isOpen, onClose, title, children, position = 'right', className }: DrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0B0F19]/25 dark:bg-[#020617]/45 backdrop-blur-xs"
          />

          {/* Drawer container */}
          <div className={cn('absolute inset-y-0 flex max-w-full', position === 'right' ? 'right-0' : 'left-0')}>
            <motion.div
              initial={{ x: position === 'right' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: position === 'right' ? '100%' : '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 35 }}
              className={cn(
                'w-screen max-w-md border-l border-border-subtle bg-surface p-6 shadow-premium flex flex-col text-left',
                className
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
                {title ? (
                  <h3 className="text-base font-bold text-text-primary">{title}</h3>
                ) : (
                  <div />
                )}
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto pr-1">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

// 3. Dropdown Menu
export interface DropdownItem {
  label: string
  onClick: () => void
  icon?: any
  danger?: boolean
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
}

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-30 mt-2 w-48 rounded-2xl border border-border-subtle bg-surface p-2 shadow-premium',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {items.map((item, idx) => {
              const Icon = item.icon
              return (
                <button
                  key={idx}
                  onClick={() => {
                    item.onClick()
                    setIsOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors',
                    item.danger
                      ? 'text-danger hover:bg-danger/10'
                      : 'text-text-primary hover:bg-bg-secondary'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  {item.label}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
