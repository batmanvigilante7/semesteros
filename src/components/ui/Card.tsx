import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noHover?: boolean
  variant?: 'default' | 'course' | 'task' | 'pdf' | 'analytics' | 'empty'
  accentColor?: string // for course card border-t-3
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, noHover = false, variant = 'default', accentColor, children, ...props }, ref) => {
    const disableHover = noHover || variant === 'empty'
    const hoverProps = disableHover
      ? {}
      : {
          whileHover: {
            y: -6,
            rotate: variant === 'course' ? 0.4 : 0.2,
            scale: 1.006,
            boxShadow: 'var(--shadow-premium)',
          },
          whileTap: { scale: 0.99 },
          transition: { type: 'spring' as const, stiffness: 350, damping: 25 }
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
Card.displayName = 'Card'
