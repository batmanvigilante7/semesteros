import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

// ==========================================
// CENTRAL MOTION CONFIGURATION
// ==========================================
export const SPRING_SHIFT = { type: 'spring' as const, stiffness: 550, damping: 30, mass: 0.8 }
export const SPRING_CARD = { type: 'spring' as const, stiffness: 450, damping: 26, mass: 0.8 }
export const SPRING_MODAL = { type: 'spring' as const, stiffness: 500, damping: 28, mass: 0.9 }

// ==========================================
// 1. ANIMATED COUNTER
// ==========================================
interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, duration = 800, className }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setDisplayValue(Math.floor(progress * value))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    };
    window.requestAnimationFrame(step)
  }, [value, duration])

  return <span className={cn('font-mono tabular-nums', className)}>{displayValue}</span>
}

// ==========================================
// 2. ANIMATED PROGRESS RING
// ==========================================
interface AnimatedProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  colorClass?: string
  className?: string
}

export function AnimatedProgressRing({
  percentage,
  size = 36,
  strokeWidth = 3.5,
  colorClass = 'stroke-primary',
  className,
}: AnimatedProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0', className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track circle */}
        <circle
          className="stroke-border-subtle/50 fill-transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated fill circle */}
        <motion.circle
          className={cn('fill-transparent transition-all duration-700 ease-out', colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[8px] font-bold font-mono">{percentage}%</span>
    </div>
  )
}

// ==========================================
// 3. ANIMATED BUTTON
// ==========================================
interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  isSuccess?: boolean
  children?: React.ReactNode
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, isSuccess = false, disabled, children, ...props }, ref) => {
    const baseStyle =
      'inline-flex items-center justify-center rounded-xl font-semibold tracking-tight transition-all duration-200 outline-none cursor-pointer focus-ring'

    const variants = {
      primary: 'bg-primary text-white shadow-soft hover:bg-primary-hover active:bg-primary-hover/90 disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'bg-secondary text-text-primary hover:bg-bg-tertiary border border-border-subtle shadow-subtle disabled:opacity-50 disabled:cursor-not-allowed',
      outline: 'border border-border-medium bg-transparent text-text-primary hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed',
      ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed',
      danger: 'bg-danger text-white shadow-soft hover:bg-danger/90 active:bg-danger/85 disabled:opacity-50 disabled:cursor-not-allowed',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-xs',
      lg: 'px-5 py-2.5 text-sm',
    }

    const hoverProps = disabled || isLoading || isSuccess
      ? {}
      : {
          whileHover: { y: -1.5, scale: 1.012, filter: 'brightness(1.03)', boxShadow: 'var(--shadow-premium)' },
          whileTap: { scale: 0.97, y: 0 }
        }

    return (
      <motion.button
        ref={ref as any}
        {...hoverProps}
        transition={SPRING_SHIFT}
        disabled={disabled || isLoading}
        className={cn(baseStyle, variants[variant], sizes[size], className)}
        {...(props as any)}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loader"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading...
            </motion.span>
          ) : isSuccess ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 text-white"
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              Done
            </motion.span>
          ) : (
            <motion.span
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    )
  }
)
AnimatedButton.displayName = 'AnimatedButton'

// ==========================================
// 4. ANIMATED CARD
// ==========================================
interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  noHover?: boolean
  variant?: 'default' | 'course' | 'task' | 'pdf' | 'analytics' | 'empty'
  accentColor?: string
  children?: React.ReactNode
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, noHover = false, variant = 'default', accentColor, children, ...props }, ref) => {
    const disableHover = noHover || variant === 'empty'
    const hoverProps = disableHover
      ? {}
      : {
          whileHover: {
            y: -4,
            rotate: variant === 'course' ? 0.2 : 0.1,
            scale: 1.004,
            boxShadow: 'var(--shadow-premium)',
          },
          whileTap: { scale: 0.992 },
          transition: SPRING_CARD
        }

    const variantClasses = {
      default: 'border-border-subtle bg-surface/65 backdrop-blur-[14px] p-6 shadow-subtle hover:border-border-medium/80',
      course: 'border-border-subtle/85 bg-surface/70 backdrop-blur-[16px] p-6 shadow-soft border-t-3',
      task: 'border-border-subtle bg-surface/55 backdrop-blur-[12px] p-4 shadow-subtle hover:border-border-medium/70',
      pdf: 'border-border-subtle/90 bg-surface/60 backdrop-blur-[14px] p-5 shadow-subtle hover:border-accent-rose/30',
      analytics: 'border-border-subtle/60 bg-surface/75 backdrop-blur-[14px] p-5 shadow-subtle',
      empty: 'border-dashed border-border-medium bg-bg-secondary/15 py-12 px-6 text-center flex flex-col items-center justify-center rounded-[24px]',
    }

    return (
      <motion.div
        ref={ref as any}
        {...hoverProps}
        className={cn(
          'group relative rounded-2xl border transition-colors duration-300 overflow-hidden',
          variantClasses[variant],
          className
        )}
        style={{
          borderTopColor: variant === 'course' && accentColor ? accentColor : undefined,
          ...props.style
        }}
        {...(props as any)}
      >
        {/* Border glow overlay */}
        {!disableHover && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-2xl border border-primary/10 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" 
            style={{
              background: variant === 'course' && accentColor 
                ? `linear-gradient(to top right, ${accentColor}10, transparent, ${accentColor}05)` 
                : undefined
            }}
          />
        )}
        <div className="relative z-10 w-full h-full flex flex-col justify-between">
          {children}
        </div>
      </motion.div>
    )
  }
)
AnimatedCard.displayName = 'AnimatedCard'

// ==========================================
// 5. ANIMATED INPUT
// ==========================================
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-1.5 text-left w-full">
        {label && (
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-tertiary">
            {label}
          </span>
        )}
        <motion.input
          ref={ref as any}
          whileFocus={{ scale: 1.002, borderColor: 'var(--color-primary)' }}
          transition={{ duration: 0.15 }}
          className={cn(
            'w-full rounded-xl border border-border-subtle bg-bg-secondary/40 px-3.5 py-2 text-xs text-text-primary outline-none transition-all placeholder:text-text-muted focus:bg-surface focus:ring-2 focus:ring-primary/10',
            className
          )}
          {...(props as any)}
        />
      </div>
    )
  }
)
AnimatedInput.displayName = 'AnimatedInput'

// ==========================================
// 6. ANIMATED SIDEBAR ITEM
// ==========================================
interface AnimatedSidebarItemProps {
  isActive: boolean
  label: string
  icon: React.ComponentType<any>
  onClick: () => void
  isCollapsed?: boolean
}

export function AnimatedSidebarItem({
  isActive,
  label,
  icon: Icon,
  onClick,
  isCollapsed = false,
}: AnimatedSidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold cursor-pointer relative overflow-hidden transition-all duration-200 select-none group',
        isActive 
          ? 'text-primary font-bold shadow-subtle' 
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/30'
      )}
    >
      {/* Sliding Active Pill Background Indicator */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-pill"
          transition={SPRING_SHIFT}
          className="absolute inset-0 bg-surface border border-border-subtle rounded-xl -z-10"
        />
      )}

      {/* Floating item slide right effect on hover */}
      <motion.div 
        className="flex items-center gap-3 w-full"
        whileHover={isActive ? {} : { x: 3 }}
        transition={SPRING_SHIFT}
      >
        <span className={cn('p-1 rounded-lg border border-transparent transition-all', isActive ? 'bg-primary/5 border-primary/10 text-primary' : 'text-text-secondary group-hover:text-text-primary')}>
          <Icon className="h-4 w-4 shrink-0" />
        </span>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="truncate"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </button>
  )
}

// ==========================================
// 7. ANIMATED LIST (STAGGER CONTAINER)
// ==========================================
interface AnimatedListProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedListItem({ children, className }: { children: React.ReactNode, className?: string }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring' as const, stiffness: 400, damping: 26 } 
    },
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

// ==========================================
// 8. SCROLL-DRIVEN REVEAL SYSTEM
// ==========================================
export function ScrollReveal({ 
  children, 
  className,
  delay = 0,
  duration = 0.6,
  y = 20,
  x = 0,
  scale = 0.98,
  blur = 4
}: { 
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  x?: number
  scale?: number
  blur?: number
}) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y, 
        x, 
        scale, 
        filter: `blur(${blur}px)` 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0, 
        scale: 1, 
        filter: 'blur(0px)' 
      }}
      viewport={{ once: true, margin: '-6%' }}
      transition={{ 
        type: 'spring', 
        stiffness: 280, 
        damping: 24, 
        delay,
        duration
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScrollStaggerContainer({ 
  children, 
  className, 
  stagger = 0.06,
  margin = '-6%'
}: { 
  children: React.ReactNode
  className?: string
  stagger?: number
  margin?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScrollStaggerItem({ 
  children, 
  className,
  y = 16,
  scale = 0.98,
  blur = 3
}: { 
  children: React.ReactNode
  className?: string
  y?: number
  scale?: number
  blur?: number
}) {
  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          y, 
          scale,
          filter: `blur(${blur}px)`
        },
        show: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          filter: 'blur(0px)',
          transition: { 
            type: 'spring', 
            stiffness: 300, 
            damping: 25 
          } 
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
