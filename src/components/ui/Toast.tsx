import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/utils/cn'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toast: (title: string, description?: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (title: string, description?: string, type: ToastType = 'success', duration = 3000) => {
      const id = crypto.randomUUID()
      const newToast: ToastMessage = { id, title, description, type, duration }
      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration)
      }
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const toastStyles: Record<ToastType, string> = {
  success: 'border-success bg-surface text-text-primary',
  error: 'border-danger bg-surface text-text-primary',
  warning: 'border-warning bg-surface text-text-primary',
  info: 'border-info bg-surface text-text-primary',
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-success shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-danger shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning shrink-0" />,
  info: <Info className="h-5 w-5 text-info shrink-0" />,
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      className={cn(
        'flex gap-3 w-full rounded-2xl border border-l-4 p-4 shadow-premium pointer-events-auto items-start justify-between border-l-primary',
        toastStyles[toast.type]
      )}
      style={{ borderLeftColor: `var(--${toast.type})` }}
    >
      <div className="flex gap-3 min-w-0">
        {toastIcons[toast.type]}
        <div className="text-left min-w-0">
          <h5 className="text-xs font-bold text-text-primary truncate">{toast.title}</h5>
          {toast.description && (
            <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
              {toast.description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1 text-text-muted hover:bg-bg-secondary hover:text-text-primary transition-all shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}
